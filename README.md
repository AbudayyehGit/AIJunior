# JuniorAI Platform

> Production-Grade Job Curation Engine & Interactive Skill Verification System for Entry-Level AI Roles ($\le 2$ Years Experience).

---

## 🧭 System Architecture & Design Philosophy

The JuniorAI platform eliminates the "3–5 years experience for an entry-level job" paradox. By deploying aggressive multi-source ingestion scrapers combined with a strict validation firewall, we ensure that every single job listed on the platform is genuinely junior ($\le 2.0$ years experience) with 100% transparent compensation.

### Core Modules

1. **Automated Multi-Source Scrapers (`src/services/ingestion/scrapers/`)**:
   - **LinkedIn Connector (`linkedin.ts`)**: Ingests junior AI, prompt engineering, and evaluation roles with user-agent and proxy rotation.
   - **Indeed Connector (`indeed.ts`)**: Ingests broad entry-level tech and ML assistant postings with token-based compensation parsing.
   - **Wellfound Connector (`wellfound.ts`)**: Ingests high-growth AI startup listings prioritizing upfront salary transparency and portfolio-based hiring.

2. **Strict Validation Firewall (`src/services/ingestion/validator.ts`)**:
   - **Rule 1 (Experience Ceiling)**: Disqualifies any role with senior/lead keywords (`senior`, `sr`, `lead`, `principal`, `staff`, `architect`, `director`, `head of`) or textual requirements demanding $>2$ years experience.
   - **Rule 2 (Compensation Mandate)**: Disqualifies any listing with null, zero, or obfuscated compensation ranges.
   - **Sanitizer & Simulator Matcher**: Strips HTML tags and auto-assigns matching interactive skill challenges.

3. **Normalization & Fuzzy Deduplication Engine (`src/services/ingestion/normalizer.ts`)**:
   - Canonicalizes company names and tokenizes job titles to compute Jaccard similarity.
   - Merges cross-posted listings across platforms while preserving enriched metadata.

4. **Platform Security & AppSec Framework (`src/middleware.ts`, `src/utils/security.ts`)**:
   - **Global Route Protection & RBAC**: Enforces least-privilege role boundaries separating Job Seeker, Recruiter, and Superadmin roles.
   - **HTTPS Security Headers**: Injects strict CSP, HSTS (`max-age=63072000`), X-Frame-Options (`SAMEORIGIN`), and Referrer-Policy.
   - **Sliding-Window Rate Limiting**: In-memory sliding-window token bucket throttles ingestion sync and authentication endpoints.
   - **Data Privacy & Sanitization**: PII masking, cryptographic simulation at rest, XSS sanitization, and SQL parameterization validation.

5. **Role Workflows & Portals (`src/app/dashboard/seeker/`, `src/app/dashboard/recruiter/`, `src/app/admin/`)**:
   - **Job Seeker Portal**: Profile management, GitHub/Hugging Face repository portfolio showcases, cryptographically attested badge displays with public verification links, and source-tagged application tracking.
   - **Recruiter Portal**: Job posting creation engine enforcing strict entry constraints ($\le 2$ yrs exp, non-null salary), candidate discovery with multi-badge filtering, and direct interview invitation workflow.
   - **Administrator Backend**: Multi-source scraping pipeline telemetry (LinkedIn, Indeed, Wellfound), non-compliance moderation/quarantine queue, user role management, and cryptographic attestation audit ledger.

6. **Interactive Skill Simulators & Verified Badges**:
   - **RAG Chunking & Hybrid Search Configurator**: Practical tuning of vector chunk size, overlap, and dense/sparse balance.
   - **LLM Token Budget & Cost Optimizer**: Calculating inference costs, KV caching, and SLA limits.
   - **Prompt Guardrail & Jailbreak Sandbox**: Hardening system prompts against prompt injection.

---

## 📋 Living Build Log (ISO/IEC Ledger)

| Version | Build Date | Milestone | Deliverables / Changelog | Status |
| :--- | :--- | :--- | :--- | :--- |
| **v0.1.0** | 2026-08-28 | Scaffolding & Requirements Definition | Initial SRS formulation, ISO/IEC 29148 standards alignment, brand identity, color token setup. | `Completed` |
| **v0.2.0** | 2026-08-28 | Ingestion Architecture & Sourcing | Added specs for automated multi-source ingestion pipelines (LinkedIn, Indeed, Wellfound) with strict entry-level filtering. | `Completed` |
| **v0.3.0** | 2026-08-28 | User Feature Matrix Definition | Formalized core functionality specs for Job Seekers and Recruiters, verified badge mechanics, and sandbox simulator guidelines. | `Completed` |
| **v0.3.1** | 2026-08-28 | Domain Occlusion Protocol | Scrubbed brand name and domain from public logs pending final registrar acquisition. | `Completed` |
| **v0.4.0** | 2026-08-28 | Frontend Layout & Design System | Implementation of Tailwind CSS layout, multi-source job feed with `p-6` spacing, interactive simulators, recruiter views, and personalized settings. | `Completed` |
| **v0.5.0** | 2026-08-28 | Clean Minimalism UI & Sailboat Rebrand | Applied Clean Minimalism design system with purple accents and custom Sailboat brand icon. | `Completed` |
| **v0.6.0** | 2026-08-28 | Automated Ingestion & Scraping Pipeline | Built scrapers (LinkedIn, Indeed, Wellfound), strict ISO $\le 2$ yrs experience filter, salary mandate guard, fuzzy deduplication normalizer, and `/api/jobs/sync` endpoint. | `Completed` |
| **v0.7.0** | 2026-08-28 | Skill Simulator Suite & Cryptographic Attestation | Created modular sandboxes (`TokenOptimizer`, `RAGChunker`, `GuardrailTester`), multi-vector assertion test runner (`badgeAttestation.ts`), real-time metric tracking (tokens, latency, accuracy), and cryptographic profile badge minting. | `Completed` |
| **v0.8.0** | 2026-08-28 | Platform Security Architecture, Role Workflows & Admin Backend | Implemented AppSec middleware (`src/middleware.ts`, `src/utils/security.ts`), CSRF protection, sliding-window rate limiting, Job Seeker portfolio portal (`dashboard/seeker`), Recruiter posting engine (`dashboard/recruiter`), and Superadmin moderation & audit console (`admin`). | `Completed` |
| **v0.9.0** | 2026-08-28 | Tabernacle Theme & Aesthetic Integration | Refactored visual architecture to the sacred Tabernacle Palette (Tekhelet Blue `#1D4ED8`, Royal Argaman Purple `#7C3AED`, Vibrant Scarlet `#DC2626`, Fine Linen `#F8FAFC`, Sacred Gold `#F59E0B`), implemented the 45-degree left-angled rocket brand logo, updated navigation & simulator sandboxes with gold attestation badging, and enforced generous `p-6`+ whitespace. | `Completed` |

