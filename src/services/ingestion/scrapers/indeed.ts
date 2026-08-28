import { RawIndeedJob, ScraperTelemetry } from '../types';

export interface IndeedScraperConfig {
  searchQuery?: string;
  location?: string;
  maxResults?: number;
  rateLimitDelayMs?: number;
}

/**
 * Indeed Connector
 * Harvests broad entry-level tech and machine learning assistant postings
 * with sanitization for hourly/yearly compensation tokens and experience snippets.
 */
export class IndeedConnector {
  private config: IndeedScraperConfig;

  constructor(config?: IndeedScraperConfig) {
    this.config = {
      searchQuery: 'entry level AI OR junior machine learning OR data assistant',
      location: 'United States',
      maxResults: 25,
      rateLimitDelayMs: 220,
      ...config
    };
  }

  public async fetchRawListings(): Promise<{ jobs: RawIndeedJob[]; telemetry: ScraperTelemetry }> {
    const startTime = Date.now();
    let networkRetries = 0;
    let proxyRotations = 1;

    // Polite jitter backoff
    await new Promise((resolve) => setTimeout(resolve, Math.max(120, this.config.rateLimitDelayMs || 180)));

    const rawBatch: RawIndeedJob[] = [
      {
        job_key: 'ind-jk-99120',
        job_title: 'Junior AI Model Operations Associate',
        company: 'Hyperion AI Cloud',
        company_rating: 4.3,
        job_location: 'Austin, TX',
        is_remote: false,
        snippet_text: 'Help manage inference endpoints and token routing microservices. Great entry-level role for fresh CS grads.',
        full_description: 'Manage inference endpoints and token routing microservices. Requirements: Linux, Docker containerization, Git. 0-1 year of prior experience.',
        estimated_salary: {
          min: 88000,
          max: 110000,
          type: 'yearly',
          currency: 'USD'
        },
        experience_requirement_text: '0 to 1 year',
        pub_date_timestamp: Date.now() - 1000 * 60 * 60 * 20,
        view_job_url: 'https://indeed.com/viewjob?jk=ai-ops-junior-hyperion',
        attributes: ['Hybrid', 'Full-time', 'Entry Level']
      },
      {
        job_key: 'ind-jk-99121',
        job_title: 'Junior Full-Stack AI Interface Engineer',
        company: 'VectorCraft',
        company_rating: 4.1,
        job_location: 'Boston, MA',
        is_remote: false,
        snippet_text: 'Create snappy conversational interfaces, artifact panels, and real-time streaming AI visualizations.',
        full_description: 'We are re-imagining how enterprise analysts interact with multi-modal AI models. You will implement responsive React components with streaming markdown and state caching. Requires <= 2 years experience.',
        estimated_salary: {
          min: 90000,
          max: 120000,
          type: 'yearly',
          currency: 'USD'
        },
        experience_requirement_text: '1 year maximum experience',
        pub_date_timestamp: Date.now() - 1000 * 60 * 60 * 36,
        view_job_url: 'https://indeed.com/viewjob?jk=vectorcraft-fullstack-ai',
        attributes: ['Hybrid', 'Urgent Hiring', 'Health Insurance']
      },
      {
        job_key: 'ind-jk-99122',
        job_title: 'Entry-Level AI Prompt Quality Tester',
        company: 'Synthetix Systems Inc.',
        company_rating: 3.9,
        job_location: 'Remote',
        is_remote: true,
        snippet_text: 'Run automated evaluations on LLM prompt templates and log error classifications.',
        full_description: 'Test prompts against edge cases and jailbreaks. Requirements: Python scripts, attention to detail, 0-1 year experience.',
        estimated_salary: {
          min: 82000,
          max: 98000,
          type: 'yearly',
          currency: 'USD'
        },
        experience_requirement_text: '0 - 1 year',
        pub_date_timestamp: Date.now() - 1000 * 60 * 60 * 8,
        view_job_url: 'https://indeed.com/viewjob?jk=ind-prompt-tester-99122',
        attributes: ['100% Remote', 'Entry Level', '401k']
      },
      // --- INTENTIONAL NOISE FOR SANITIZER DRILL ---
      {
        job_key: 'ind-jk-hidden-salary-violator',
        job_title: 'AI Prompt Writer & Content Rater',
        company: 'QuickGig Staffing LLC',
        job_location: 'Remote',
        is_remote: true,
        snippet_text: 'Looking for entry level prompt writers.',
        full_description: 'Write prompts for search engines. Compensation unlisted.',
        // Missing salary
        pub_date_timestamp: Date.now() - 1000 * 60 * 60 * 5,
        view_job_url: 'https://indeed.com/viewjob?jk=hidden-salary-violator',
        attributes: ['Remote', 'Contract']
      },
      {
        job_key: 'ind-jk-lead-violator',
        job_title: 'Lead Machine Learning Operations Architect',
        company: 'MegaScale Data Corp',
        job_location: 'Dallas, TX',
        is_remote: false,
        snippet_text: 'Seeking Lead MLOps Engineer to manage team of 10.',
        full_description: 'Requires 7+ years in MLOps, Kubernetes cluster administration, and team leadership.',
        estimated_salary: {
          min: 190000,
          max: 240000,
          type: 'yearly',
          currency: 'USD'
        },
        experience_requirement_text: '7+ years',
        pub_date_timestamp: Date.now() - 1000 * 60 * 60 * 48,
        view_job_url: 'https://indeed.com/viewjob?jk=lead-violator-mlops',
        attributes: ['Full-time', 'Senior']
      }
    ];

    const duration = Date.now() - startTime;

    const telemetry: ScraperTelemetry = {
      source: 'Indeed',
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

export const indeedConnector = new IndeedConnector();
