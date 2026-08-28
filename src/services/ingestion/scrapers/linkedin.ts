import { RawLinkedInJob, ScraperTelemetry } from '../types';

export interface LinkedInScraperConfig {
  searchKeywords?: string[];
  maxPages?: number;
  rateLimitDelayMs?: number;
  useProxyRotation?: boolean;
}

const DEFAULT_KEYWORDS = [
  'Junior AI Engineer',
  'Entry Level Machine Learning',
  'Prompt Engineer',
  'AI Data Annotation',
  'Associate AI Developer',
  'AI Evaluation Specialist'
];

/**
 * LinkedIn Connector
 * Simulates authenticated / ethical scraper worker harvesting junior AI listings
 * with headers, proxy rotation, and retry backoff.
 */
export class LinkedInConnector {
  private config: LinkedInScraperConfig;
  private userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  ];

  constructor(config?: LinkedInScraperConfig) {
    this.config = {
      searchKeywords: DEFAULT_KEYWORDS,
      maxPages: 3,
      rateLimitDelayMs: 250,
      useProxyRotation: true,
      ...config
    };
  }

  public async fetchRawListings(): Promise<{ jobs: RawLinkedInJob[]; telemetry: ScraperTelemetry }> {
    const startTime = Date.now();
    let proxyRotations = 0;
    let networkRetries = 0;

    // Simulate polite network delay with randomized jitter
    await new Promise((resolve) => setTimeout(resolve, Math.max(150, this.config.rateLimitDelayMs || 200)));

    if (this.config.useProxyRotation) {
      proxyRotations += 2;
    }

    // Realistic raw batch representing real-world feeds (contains compliant entry jobs + noisy senior/null-salary jobs to exercise validator)
    const rawBatch: RawLinkedInJob[] = [
      {
        urn_id: 'li-urn-79841',
        job_title: 'Junior AI Engineer (Prompt & Eval Systems)',
        company_name: 'NeuralFlow Labs',
        company_logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        workplace_type: 'Hybrid',
        formatted_location: 'San Francisco, CA',
        experience_level_code: '2', // Entry
        raw_description_html: '<p>Seeking a <strong>Junior AI Engineer</strong> to design prompt evaluation harnesses and regression suites. <br/>Qualifications: 0 to 1 year of software experience, Python, REST APIs, and hands-on experience with LLM API calls.</p>',
        compensation_text: '$95,000/yr - $125,000/yr',
        compensation_min: 95000,
        compensation_max: 125000,
        compensation_period: 'YEAR',
        listed_at_timestamp: Date.now() - 1000 * 60 * 60 * 3,
        apply_url: 'https://linkedin.com/jobs/view/junior-ai-engineer-eval',
        raw_skills: ['Python', 'LangChain', 'Prompt Tuning', 'Evals', 'Gemini']
      },
      {
        urn_id: 'li-urn-79842',
        job_title: 'AI Data Curator & Fine-Tuning Assistant',
        company_name: 'Apex Intelligence',
        company_logo_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
        workplace_type: 'Remote',
        formatted_location: 'Seattle, WA',
        experience_level_code: '1', // Internship / Entry
        raw_description_html: '<p>Join our instruction tuning group. 0 years professional experience required. Must understand JSONL formatting and dataset cleaning in Python.</p>',
        compensation_text: '$80,000/yr - $105,000/yr',
        compensation_min: 80000,
        compensation_max: 105000,
        compensation_period: 'YEAR',
        listed_at_timestamp: Date.now() - 1000 * 60 * 60 * 18,
        apply_url: 'https://linkedin.com/jobs/view/ai-data-curator-apex',
        raw_skills: ['JSONL', 'Data Hygiene', 'Hugging Face', 'Python', 'RLHF']
      },
      {
        urn_id: 'li-urn-79843',
        job_title: 'Junior Model Benchmarking Engineer',
        company_name: 'QuantAlgos Research',
        company_logo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        workplace_type: 'Remote',
        formatted_location: 'New York, NY',
        experience_level_code: '2',
        raw_description_html: '<p>Help build automated synthetic benchmarks for local SLM and LLM models. 0-2 years experience required. Base compensation: $105,000 - $130,000.</p>',
        compensation_text: '$105,000 - $130,000 / year',
        compensation_min: 105000,
        compensation_max: 130000,
        compensation_period: 'YEAR',
        listed_at_timestamp: Date.now() - 1000 * 60 * 60 * 6,
        apply_url: 'https://linkedin.com/jobs/view/benchmarking-quant-79843',
        raw_skills: ['Python', 'PyTorch', 'Benchmarking', 'FastAPI']
      },
      // --- INTENTIONAL NOISE FOR SCRAPER SANITATION TESTS ---
      {
        urn_id: 'li-urn-senior-violator-1',
        job_title: 'Senior Staff Generative AI Architect',
        company_name: 'OmniGlobal Enterprise',
        workplace_type: 'Remote',
        formatted_location: 'San Jose, CA',
        experience_level_code: '4', // Mid-Senior
        raw_description_html: '<p>Requires 8+ years of distributed systems and 4+ years of deep transformer architecture experience.</p>',
        compensation_min: 220000,
        compensation_max: 310000,
        compensation_period: 'YEAR',
        listed_at_timestamp: Date.now() - 1000 * 60 * 60 * 24,
        apply_url: 'https://linkedin.com/jobs/view/senior-staff-omni',
        raw_skills: ['Kubernetes', 'Distributed Training', 'C++']
      },
      {
        urn_id: 'li-urn-null-salary-violator-2',
        job_title: 'Junior Machine Learning Engineer',
        company_name: 'Stealth Stealth AI',
        workplace_type: 'On-site',
        formatted_location: 'Boston, MA',
        experience_level_code: '2',
        raw_description_html: '<p>Exciting junior opportunity for new grads. Competitive salary DOE.</p>',
        // No compensation provided (violates Rule 2)
        listed_at_timestamp: Date.now() - 1000 * 60 * 60 * 12,
        apply_url: 'https://linkedin.com/jobs/view/stealth-junior-no-salary',
        raw_skills: ['Python', 'PyTorch']
      }
    ];

    const duration = Date.now() - startTime;

    const telemetry: ScraperTelemetry = {
      source: 'LinkedIn',
      fetchDurationMs: duration,
      rawFetchedCount: rawBatch.length,
      networkRetries,
      proxyRotations,
      rateLimitHits: 0,
      status: 'SUCCESS'
    };

    return {
      jobs: rawBatch,
      telemetry
    };
  }
}

export const linkedInConnector = new LinkedInConnector();
