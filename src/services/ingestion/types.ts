import { Job, JobSource, RemoteType } from '../../types';

export interface RawLinkedInJob {
  urn_id: string;
  job_title: string;
  company_name: string;
  company_logo_url?: string;
  workplace_type: string; // 'On-site' | 'Hybrid' | 'Remote'
  formatted_location: string;
  experience_level_code?: string; // '1' = Internship, '2' = Entry, '3' = Associate, '4' = Mid-Senior
  raw_description_html: string;
  compensation_text?: string;
  compensation_min?: number;
  compensation_max?: number;
  compensation_period?: 'YEAR' | 'MONTH' | 'HOUR';
  listed_at_timestamp: number;
  apply_url: string;
  raw_skills: string[];
}

export interface RawIndeedJob {
  job_key: string;
  job_title: string;
  company: string;
  company_rating?: number;
  job_location: string;
  is_remote: boolean;
  snippet_text: string;
  full_description: string;
  estimated_salary?: {
    min: number;
    max: number;
    type: 'yearly' | 'hourly';
    currency: string;
  };
  experience_requirement_text?: string;
  pub_date_timestamp: number;
  view_job_url: string;
  attributes: string[];
}

export interface RawWellfoundJob {
  listing_id: string;
  role_name: string;
  startup_name: string;
  startup_stage?: string; // 'Seed', 'Series A', 'Series B'
  startup_avatar?: string;
  location_tags: string[];
  remote_ok: boolean;
  visa_sponsorship?: boolean;
  salary_min_usd?: number;
  salary_max_usd?: number;
  equity_min_pct?: number;
  equity_max_pct?: number;
  role_overview: string;
  responsibilities: string[];
  ideal_candidate: string[];
  tech_stack: string[];
  published_epoch_ms: number;
  job_url: string;
}

export type RawScrapedJobPayload =
  | { source: 'LinkedIn'; data: RawLinkedInJob }
  | { source: 'Indeed'; data: RawIndeedJob }
  | { source: 'Wellfound'; data: RawWellfoundJob };

export interface FilterViolation {
  rule: 'EXPERIENCE_CEILING_EXCEEDED' | 'COMPENSATION_MISSING_OR_NULL' | 'TITLE_SENIORITY_FLAG' | 'LOW_DATA_QUALITY';
  message: string;
  detectedExp?: number;
  field?: string;
}

export interface ScraperTelemetry {
  source: JobSource;
  fetchDurationMs: number;
  rawFetchedCount: number;
  networkRetries: number;
  proxyRotations: number;
  rateLimitHits: number;
  status: 'SUCCESS' | 'DEGRADED' | 'FAILED';
  error?: string;
}

export interface IngestionSyncReport {
  id: string;
  timestamp: string;
  executionTimeMs: number;
  telemetry: Record<JobSource, ScraperTelemetry>;
  totalRawHarvested: number;
  rejectedSeniorityOrExp: number;
  rejectedMissingCompensation: number;
  rejectedFuzzyDuplicates: number;
  totalCleanAdmitted: number;
  admittedJobs: Job[];
  rejectionSampleLogs: {
    title: string;
    company: string;
    source: JobSource;
    reason: string;
  }[];
}
