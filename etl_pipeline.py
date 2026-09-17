"""
Multi-Source Production ETL Ingestion Pipeline for JuniorRoles.ai.studio
Ingests, normalizes, validates, and upserts raw feeds from:
  - Indeed
  - LinkedIn
  - Hacker News ("Who is hiring?")
  - Wellfound (AngelList)
  - Remote OK

Adheres strictly to the unified Pydantic v2 data contract, strips marketing
tracking parameters, and guarantees idempotent upserts into SQLite.
"""

from datetime import datetime
from enum import Enum
import json
import logging
import re
import sqlite3
from typing import Any, Callable, Dict, List, Optional, Tuple
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse
from pydantic import BaseModel, Field, ValidationError, field_validator
import requests

# ---------------------------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("juniorroles.multisource_etl")


# ---------------------------------------------------------------------------
# 1. Unified Pydantic v2 Data Contracts
# ---------------------------------------------------------------------------
class EmploymentType(str, Enum):
    FULL_TIME = "full-time"
    PART_TIME = "part-time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"


class JobListing(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    company: str = Field(..., min_length=1, max_length=100)
    location: str = Field(..., min_length=2, max_length=100)
    employment_type: EmploymentType = EmploymentType.FULL_TIME
    salary_min: Optional[int] = Field(default=None, ge=0)
    salary_max: Optional[int] = Field(default=None, ge=0)
    source_url: str

    @field_validator("source_url", mode="before")
    @classmethod
    def clean_and_normalize_url(cls, v: str) -> str:
        parsed = urlparse(v)
        if not parsed.scheme or not parsed.netloc:
            raise ValueError(f"Invalid URL endpoint structure: {v}")
        query_params = parse_qs(parsed.query, keep_blank_values=True)
        filtered_params = {
            k: vals
            for k, vals in query_params.items()
            if not k.startswith("utm_")
            and k not in ("ref", "source", "fbclid", "campaign", "trk", "refId", "trackingId")
        }
        cleaned_query = urlencode(filtered_params, doseq=True)
        return urlunparse(parsed._replace(query=cleaned_query))

    @field_validator("salary_max")
    @classmethod
    def validate_salary_bounds(cls, v: Optional[int], info) -> Optional[int]:
        if v is not None and "salary_min" in info.data:
            min_sal = info.data["salary_min"]
            if min_sal is not None and v < min_sal:
                raise ValueError("salary_max cannot be lower than salary_min")
        return v


# ---------------------------------------------------------------------------
# 2. Source-Specific Normalization Adapters
# ---------------------------------------------------------------------------
def _parse_employment_type(raw_val: Optional[str]) -> EmploymentType:
    """Safely maps arbitrary platform employment strings to EmploymentType enum."""
    if not raw_val:
        return EmploymentType.FULL_TIME
    val = raw_val.lower().replace("_", "-").replace(" ", "-")
    if "part" in val:
        return EmploymentType.PART_TIME
    if "contract" in val or "freelance" in val or "temp" in val:
        return EmploymentType.CONTRACT
    if "intern" in val or "co-op" in val:
        return EmploymentType.INTERNSHIP
    return EmploymentType.FULL_TIME


def normalize_indeed(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Adapter for Indeed job search JSON feeds.
    Handles extractedSalary objects, formattedLocation, and job keys.
    """
    salary_min = None
    salary_max = None
    if "extractedSalary" in raw and isinstance(raw["extractedSalary"], dict):
        sal_data = raw["extractedSalary"]
        salary_min = sal_data.get("min")
        salary_max = sal_data.get("max")
    elif "salarySnippet" in raw and isinstance(raw["salarySnippet"], dict):
        salary_min = raw["salarySnippet"].get("amountMin")
        salary_max = raw["salarySnippet"].get("amountMax")

    url = raw.get("jobUrl") or raw.get("viewJobUrl") or ""
    if not url and "jobkey" in raw:
        url = f"https://www.indeed.com/viewjob?jk={raw['jobkey']}"

    return {
        "title": raw.get("jobTitle") or raw.get("title", ""),
        "company": raw.get("companyName") or raw.get("company", ""),
        "location": raw.get("formattedLocation") or raw.get("location", "Remote"),
        "employment_type": _parse_employment_type(raw.get("jobType") or raw.get("employmentType")),
        "salary_min": int(salary_min) if salary_min is not None else None,
        "salary_max": int(salary_max) if salary_max is not None else None,
        "source_url": url,
    }


def normalize_linkedin(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Adapter for LinkedIn job posting payloads.
    Resolves nested company details, compensation intervals, and direct apply links.
    """
    company = ""
    if isinstance(raw.get("companyDetails"), dict):
        company = raw["companyDetails"].get("companyName", "")
    elif isinstance(raw.get("company"), str):
        company = raw.get("company", "")

    salary_min = None
    salary_max = None
    comp = raw.get("compensationInsight") or raw.get("salary") or {}
    if isinstance(comp, dict):
        salary_min = comp.get("minSalary") or comp.get("min")
        salary_max = comp.get("maxSalary") or comp.get("max")

    url = raw.get("applyUrl") or raw.get("jobPostingUrl") or raw.get("url") or ""
    if not url and "jobPostingId" in raw:
        url = f"https://www.linkedin.com/jobs/view/{raw['jobPostingId']}/"

    return {
        "title": raw.get("title") or raw.get("jobTitle", ""),
        "company": company,
        "location": raw.get("formattedLocation") or raw.get("location", "Remote"),
        "employment_type": _parse_employment_type(raw.get("workplaceType") or raw.get("employmentType")),
        "salary_min": int(salary_min) if salary_min is not None else None,
        "salary_max": int(salary_max) if salary_max is not None else None,
        "source_url": url,
    }


def normalize_hackernews(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Adapter for Hacker News 'Who is hiring?' comments/items.
    Parses standard header formats: Company Name | Job Title | Location | Salary Range
    """
    text = raw.get("text", "")
    item_id = raw.get("id") or raw.get("story_id")
    canonical_url = raw.get("url") or (f"https://news.ycombinator.com/item?id={item_id}" if item_id else "")

    company = raw.get("company", "")
    title = raw.get("title", "")
    location = raw.get("location", "Remote")
    salary_min = None
    salary_max = None

    # Parse standard pipe-delimited HN top line if not pre-parsed
    # e.g., "Synthetix | Junior AI Research Engineer | Remote (US/EU) | $90k - $120k"
    first_line = text.split("\n")[0] if text else ""
    if "|" in first_line:
        parts = [p.strip() for p in first_line.split("|")]
        if len(parts) >= 2:
            company = company or parts[0]
            title = title or parts[1]
        if len(parts) >= 3:
            location = parts[2]
        if len(parts) >= 4:
            sal_text = parts[3].lower()
            sal_matches = re.findall(r"\$?(\d{2,3})k?", sal_text)
            if len(sal_matches) >= 2:
                salary_min = int(sal_matches[0]) * (1000 if int(sal_matches[0]) < 1000 else 1)
                salary_max = int(sal_matches[1]) * (1000 if int(sal_matches[1]) < 1000 else 1)
            elif len(sal_matches) == 1:
                salary_min = int(sal_matches[0]) * (1000 if int(sal_matches[0]) < 1000 else 1)

    return {
        "title": title or "Junior AI Engineer",
        "company": company or "Hacker News Startup",
        "location": location or "Remote",
        "employment_type": _parse_employment_type(raw.get("employment_type", "full-time")),
        "salary_min": salary_min,
        "salary_max": salary_max,
        "source_url": canonical_url,
    }


def normalize_wellfound(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Adapter for Wellfound (formerly AngelList Talent) job structures.
    Extracts startup metadata, multi-city lists, and annual salary boundaries.
    """
    company = ""
    if isinstance(raw.get("startup"), dict):
        company = raw["startup"].get("name", "")
    elif isinstance(raw.get("company"), str):
        company = raw["company"]

    location = "Remote"
    loc_data = raw.get("locationNames") or raw.get("locations")
    if isinstance(loc_data, list) and loc_data:
        location = ", ".join(loc_data[:2])
    elif isinstance(loc_data, str):
        location = loc_data

    salary_min = raw.get("annualSalaryMin") or raw.get("minSalary")
    salary_max = raw.get("annualSalaryMax") or raw.get("maxSalary")

    url = raw.get("listingUrl") or raw.get("jobUrl") or raw.get("url") or ""

    return {
        "title": raw.get("role") or raw.get("title", ""),
        "company": company,
        "location": location,
        "employment_type": _parse_employment_type(raw.get("jobType") or raw.get("employmentType")),
        "salary_min": int(salary_min) if salary_min is not None else None,
        "salary_max": int(salary_max) if salary_max is not None else None,
        "source_url": url,
    }


def normalize_remoteok(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Adapter for Remote OK JSON API endpoints.
    Handles position, remote location tags, and direct job link endpoints.
    """
    url = raw.get("url", "")
    if url and not url.startswith("http"):
        url = f"https://remoteok.com{url}"

    salary_min = raw.get("salary_min")
    salary_max = raw.get("salary_max")

    return {
        "title": raw.get("position") or raw.get("title", ""),
        "company": raw.get("company", ""),
        "location": raw.get("location") or "Remote",
        "employment_type": _parse_employment_type(raw.get("employment_type", "full-time")),
        "salary_min": int(salary_min) if salary_min is not None else None,
        "salary_max": int(salary_max) if salary_max is not None else None,
        "source_url": url,
    }


# Map of supported sources to normalizer functions
SOURCE_ADAPTER_REGISTRY: Dict[str, Callable[[Dict[str, Any]], Dict[str, Any]]] = {
    "indeed": normalize_indeed,
    "linkedin": normalize_linkedin,
    "hackernews": normalize_hackernews,
    "wellfound": normalize_wellfound,
    "remoteok": normalize_remoteok,
}


# ---------------------------------------------------------------------------
# 3. SQLite Database Layer with Idempotent UPSERT
# ---------------------------------------------------------------------------
class JobDatabase:
    """
    Thread-safe SQLite database manager enforcing unique cleaned URLs,
    comprehensive index coverage, and atomic idempotent upserts.
    """

    def __init__(self, db_path: str = "junior_roles.db") -> None:
        self.db_path = db_path
        self._initialize_schema()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        conn.execute("PRAGMA foreign_keys=ON;")
        return conn

    def _initialize_schema(self) -> None:
        schema = """
        CREATE TABLE IF NOT EXISTS job_listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT NOT NULL,
            employment_type TEXT NOT NULL,
            salary_min INTEGER,
            salary_max INTEGER,
            source_url TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_job_company ON job_listings(company);
        CREATE INDEX IF NOT EXISTS idx_job_location ON job_listings(location);
        CREATE INDEX IF NOT EXISTS idx_job_employment_type ON job_listings(employment_type);
        CREATE INDEX IF NOT EXISTS idx_job_updated_at ON job_listings(updated_at);
        """
        with self.get_connection() as conn:
            conn.executescript(schema)
            logger.info("SQLite schema initialized at %s", self.db_path)

    def upsert_batch(self, jobs: List[JobListing]) -> Dict[str, int]:
        """
        Atomically upsert a list of validated JobListing records.
        Uses ON CONFLICT(source_url) DO UPDATE to eliminate duplicate insertions.
        """
        if not jobs:
            return {"inserted": 0, "updated": 0, "total": 0}

        upsert_query = """
        INSERT INTO job_listings (
            title, company, location, employment_type, salary_min, salary_max, source_url, updated_at
        ) VALUES (
            :title, :company, :location, :employment_type, :salary_min, :salary_max, :source_url, CURRENT_TIMESTAMP
        )
        ON CONFLICT(source_url) DO UPDATE SET
            title = excluded.title,
            company = excluded.company,
            location = excluded.location,
            employment_type = excluded.employment_type,
            salary_min = excluded.salary_min,
            salary_max = excluded.salary_max,
            updated_at = CURRENT_TIMESTAMP
        RETURNING (created_at = updated_at) AS is_new;
        """

        inserted_count = 0
        updated_count = 0

        with self.get_connection() as conn:
            cursor = conn.cursor()
            for job in jobs:
                params = {
                    "title": job.title,
                    "company": job.company,
                    "location": job.location,
                    "employment_type": job.employment_type.value,
                    "salary_min": job.salary_min,
                    "salary_max": job.salary_max,
                    "source_url": job.source_url,
                }
                cursor.execute(upsert_query, params)
                row = cursor.fetchone()
                if row and row["is_new"]:
                    inserted_count += 1
                else:
                    updated_count += 1

        return {"inserted": inserted_count, "updated": updated_count, "total": len(jobs)}

    def count(self) -> int:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM job_listings")
            return int(cursor.fetchone()[0])

    def fetch_recent(self, limit: int = 10) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM job_listings ORDER BY updated_at DESC LIMIT ?", (limit,)
            )
            return [dict(row) for row in cursor.fetchall()]


# ---------------------------------------------------------------------------
# 4. Multi-Source Pipeline Controller
# ---------------------------------------------------------------------------
class MultiSourceJobETLPipeline:
    """
    Orchestrates ETL operations across Indeed, LinkedIn, Hacker News,
    Wellfound, and Remote OK.
    """

    def __init__(self, db: Optional[JobDatabase] = None) -> None:
        self.db = db or JobDatabase()

    def ingest_source_feed(
        self, source_name: str, raw_records: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Normalizes raw platform records, applies strict Pydantic v2 validation,
        strips tracking parameters, and atomically updates the SQLite store.
        """
        clean_source = source_name.lower().replace(" ", "").replace("-", "")
        normalizer = SOURCE_ADAPTER_REGISTRY.get(clean_source)
        if not normalizer:
            raise ValueError(
                f"Unsupported source '{source_name}'. Registered sources: {list(SOURCE_ADAPTER_REGISTRY.keys())}"
            )

        logger.info("Executing ingestion for source '%s' (%d records)", source_name, len(raw_records))

        valid_jobs: List[JobListing] = []
        validation_failures: List[Dict[str, Any]] = []

        for idx, raw_item in enumerate(raw_records):
            try:
                # 1. Normalize disparate platform shape
                normalized_dict = normalizer(raw_item)
                # 2. Strict Pydantic v2 validation & tracking parameter stripping
                job = JobListing.model_validate(normalized_dict)
                valid_jobs.append(job)
            except ValidationError as val_err:
                validation_failures.append({
                    "record_index": idx,
                    "source": source_name,
                    "raw_title": raw_item.get("title") or raw_item.get("jobTitle") or raw_item.get("position"),
                    "errors": val_err.errors(),
                })
                logger.warning(
                    "[%s] Validation rejected record #%d: %s",
                    source_name,
                    idx,
                    "; ".join([f"{e['loc']}: {e['msg']}" for e in val_err.errors()]),
                )
            except Exception as ex:
                validation_failures.append({
                    "record_index": idx,
                    "source": source_name,
                    "error": str(ex),
                })
                logger.error("[%s] Unexpected exception on record #%d: %s", source_name, idx, str(ex))

        # 3. Atomic upsert into SQLite
        db_results = self.db.upsert_batch(valid_jobs)

        report = {
            "source": source_name,
            "total_raw": len(raw_records),
            "valid_count": len(valid_jobs),
            "rejected_count": len(validation_failures),
            "inserted_new": db_results["inserted"],
            "updated_existing": db_results["updated"],
            "failures": validation_failures,
        }

        logger.info(
            "[%s] Ingestion complete: %d valid (%d new, %d updated), %d rejected",
            source_name,
            report["valid_count"],
            report["inserted_new"],
            report["updated_existing"],
            report["rejected_count"],
        )
        return report

    def ingest_all(self, multi_source_payloads: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
        """Runs the pipeline across a dictionary mapping source_name -> list of raw records."""
        aggregated = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "sources_processed": {},
            "total_raw": 0,
            "total_valid": 0,
            "total_inserted": 0,
            "total_updated": 0,
            "total_rejected": 0,
        }

        for source_name, records in multi_source_payloads.items():
            res = self.ingest_source_feed(source_name, records)
            aggregated["sources_processed"][source_name] = res
            aggregated["total_raw"] += res["total_raw"]
            aggregated["total_valid"] += res["valid_count"]
            aggregated["total_inserted"] += res["inserted_new"]
            aggregated["total_updated"] += res["updated_existing"]
            aggregated["total_rejected"] += res["rejected_count"]

        return aggregated


# ---------------------------------------------------------------------------
# 5. Pipeline Self-Test & Verification Demo
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    db = JobDatabase(":memory:")
    pipeline = MultiSourceJobETLPipeline(db)

    # Multi-source mock payloads demonstrating each adapter & tracking parameters
    mock_feeds = {
        "Indeed": [
            {
                "jobTitle": "Junior AI Evaluation Specialist",
                "companyName": "Scale AI Partner Group",
                "formattedLocation": "San Francisco, CA",
                "jobType": "Full-time",
                "extractedSalary": {"min": 85000, "max": 110000},
                "jobUrl": "https://www.indeed.com/viewjob?jk=abc99812&utm_source=indeed_alert&utm_medium=email&utm_campaign=job_feed&source=job_alert",
            }
        ],
        "LinkedIn": [
            {
                "title": "Associate AI Systems Engineer",
                "companyDetails": {"companyName": "NeuralCore Tech"},
                "formattedLocation": "New York, NY (Hybrid)",
                "workplaceType": "full_time",
                "compensationInsight": {"minSalary": 95000, "maxSalary": 125000},
                "applyUrl": "https://www.linkedin.com/jobs/view/3920192831/?trk=public_jobs_topcard-title&refId=x91023&trackingId=z8812&utm_source=linkedin_digest",
            }
        ],
        "HackerNews": [
            {
                "id": 41298401,
                "text": "LlamaGuard Labs | Junior ML Safety Auditor | Remote (US/Canada) | $90k - $120k\nWe are building automated red-teaming agents.",
            }
        ],
        "Wellfound": [
            {
                "role": "Junior Prompt Engineer",
                "startup": {"name": "CognitiveOps"},
                "locationNames": ["Austin, TX", "Remote"],
                "jobType": "contract",
                "annualSalaryMin": 75000,
                "annualSalaryMax": 95000,
                "listingUrl": "https://wellfound.com/jobs/3019201-junior-prompt-engineer?utm_campaign=wellfound_weekly&ref=talent_feed&fbclid=123098",
            }
        ],
        "RemoteOK": [
            {
                "position": "Junior Python AI Developer",
                "company": "FlowEngine AI",
                "location": "Worldwide (Remote)",
                "employment_type": "full-time",
                "salary_min": 80000,
                "salary_max": 105000,
                "url": "https://remoteok.com/remote-jobs/102941-junior-python-ai-developer?ref=remoteok_newsletter&utm_source=remoteok",
            }
        ],
    }

    print("===================================================================")
    print("Executing JuniorRoles Multi-Source ETL Ingestion Demonstration")
    print("===================================================================\n")

    summary = pipeline.ingest_all(mock_feeds)
    print("Ingestion Summary Metrics:")
    print(json.dumps({k: v for k, v in summary.items() if k != "sources_processed"}, indent=2))

    print("\nVerifying Ingested Database Records (Cleaned URLs & Structured Payloads):")
    recent_jobs = db.fetch_recent(10)
    for j in recent_jobs:
        print(f"-> [{j['company']}] {j['title']} | {j['location']} | ${j['salary_min']:,} - ${j['salary_max']:,}")
        print(f"   Cleaned URL: {j['source_url']}\n")
