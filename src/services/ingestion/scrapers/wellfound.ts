import { RawWellfoundJob, ScraperTelemetry } from '../types';

export interface WellfoundScraperConfig {
  stages?: string[];
  roleTags?: string[];
  minSalaryUsd?: number;
  rateLimitDelayMs?: number;
}

/**
 * Wellfound Connector
 * Pulls seed-to-Series-B AI startup listings prioritizing upfront salary transparency
 * and portfolio-based hiring.
 */
export class WellfoundConnector {
  private config: WellfoundScraperConfig;

  constructor(config?: WellfoundScraperConfig) {
    this.config = {
      stages: ['Seed', 'Series A', 'Series B'],
      roleTags: ['Artificial Intelligence', 'Machine Learning', 'LLM', 'Prompt Engineering'],
      rateLimitDelayMs: 200,
      ...config
    };
  }

  public async fetchRawListings(): Promise<{ jobs: RawWellfoundJob[]; telemetry: ScraperTelemetry }> {
    const startTime = Date.now();
    let networkRetries = 0;
    let proxyRotations = 1;

    // Simulate rate-limiting and payload retrieval
    await new Promise((resolve) => setTimeout(resolve, Math.max(100, this.config.rateLimitDelayMs || 150)));

    const rawBatch: RawWellfoundJob[] = [
      {
        listing_id: 'wf-lst-3301',
        role_name: 'Associate RAG & Vector Data Specialist',
        startup_name: 'CognitiveScale AI',
        startup_stage: 'Series A',
        startup_avatar: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=120&auto=format&fit=crop&q=80',
        location_tags: ['Remote', 'San Francisco', 'Toronto'],
        remote_ok: true,
        visa_sponsorship: false,
        salary_min_usd: 100000,
        salary_max_usd: 130000,
        equity_min_pct: 0.1,
        equity_max_pct: 0.35,
        role_overview: 'Design chunking strategies, vector embeddings pipelines, and semantic search retrieval quality.',
        responsibilities: [
          'Tune chunk overlap and vector indexing strategies',
          'Evaluate hybrid BM25 + dense embedding queries',
          'Build precision scoring regression benches'
        ],
        ideal_candidate: [
          'Familiarity with vector databases (Pinecone, Chroma, pgvector)',
          'Experience chunking text documents for LLM contexts',
          '0 - 2 years experience or strong GitHub portfolio'
        ],
        tech_stack: ['RAG', 'Pinecone', 'Embeddings', 'TypeScript', 'Next.js'],
        published_epoch_ms: Date.now() - 1000 * 60 * 60 * 4,
        job_url: 'https://wellfound.com/jobs/cognitive-rag-associate'
      },
      {
        listing_id: 'wf-lst-3302',
        role_name: 'Junior Agentic Workflow & Tooling Developer',
        startup_name: 'Synergy Agents',
        startup_stage: 'Seed',
        startup_avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        location_tags: ['New York, NY', 'Remote'],
        remote_ok: true,
        salary_min_usd: 110000,
        salary_max_usd: 140000,
        equity_min_pct: 0.25,
        equity_max_pct: 0.5,
        role_overview: 'Construct tool definitions, schema validators, and multi-step agent execution graphs.',
        responsibilities: [
          'Build JSON Schema validation tools for ReAct and autonomous agents',
          'Optimize execution latency and multi-step tool calls',
          'Construct guardrails preventing hallucinated parameter inputs'
        ],
        ideal_candidate: [
          'Strong TypeScript and Node.js skills',
          'Experience with function calling and structured outputs',
          '1-2 years experience maximum'
        ],
        tech_stack: ['Function Calling', 'TypeScript', 'ReAct Agents', 'Node.js', 'Postgres'],
        published_epoch_ms: Date.now() - 1000 * 60 * 60 * 14,
        job_url: 'https://wellfound.com/jobs/synergy-agentic-junior'
      },
      {
        listing_id: 'wf-lst-3303',
        role_name: 'Junior LLM Inference & Optimization Specialist',
        startup_name: 'Prism Quant AI',
        startup_stage: 'Seed',
        startup_avatar: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80',
        location_tags: ['Remote', 'Austin, TX'],
        remote_ok: true,
        salary_min_usd: 102000,
        salary_max_usd: 128000,
        equity_min_pct: 0.15,
        equity_max_pct: 0.4,
        role_overview: 'Assist in vLLM / Ollama local deployment benchmarks and quantization profiling.',
        responsibilities: [
          'Quantize open models (AWQ, GGUF, INT4)',
          'Profile TTFT (Time to First Token) and token throughput',
          'Create reproducible Docker images for edge deployment'
        ],
        ideal_candidate: [
          'Familiarity with Python, CUDA basics, and Hugging Face weights',
          '0 to 1.5 years experience or open-source contributor'
        ],
        tech_stack: ['vLLM', 'Ollama', 'Quantization', 'Python', 'Docker'],
        published_epoch_ms: Date.now() - 1000 * 60 * 60 * 10,
        job_url: 'https://wellfound.com/jobs/prism-quant-inference-junior'
      },
      // --- INTENTIONAL NOISE FOR FILTER EVALUATION ---
      {
        listing_id: 'wf-lst-founder-level-violator',
        role_name: 'Founding Principal AI Research Scientist',
        startup_name: 'GenNext Autonomous Inc',
        startup_stage: 'Series B',
        location_tags: ['San Francisco, CA'],
        remote_ok: false,
        salary_min_usd: 250000,
        salary_max_usd: 350000,
        role_overview: 'Lead company AI research division.',
        responsibilities: ['Publish at NeurIPS/ICML', 'Train 70B+ parameter models from scratch'],
        ideal_candidate: ['PhD in CS/ML and 6+ years of post-PhD frontier research'],
        tech_stack: ['PyTorch', 'DeepSpeed', 'Megatron-LM'],
        published_epoch_ms: Date.now() - 1000 * 60 * 60 * 48,
        job_url: 'https://wellfound.com/jobs/gennext-principal'
      },
      {
        listing_id: 'wf-lst-equity-only-no-salary-violator',
        role_name: 'Junior AI Community Evangelist',
        startup_name: 'HackerHaven Labs',
        startup_stage: 'Pre-seed',
        location_tags: ['Remote'],
        remote_ok: true,
        // Zero / null base salary (equity only - violates Rule 2)
        equity_min_pct: 1.0,
        equity_max_pct: 2.5,
        role_overview: 'Help build developer relations for open source AI project.',
        responsibilities: ['Run hackathons', 'Write tutorials'],
        ideal_candidate: ['Enthusiastic beginner'],
        tech_stack: ['Markdown', 'Discord', 'Python'],
        published_epoch_ms: Date.now() - 1000 * 60 * 60 * 2,
        job_url: 'https://wellfound.com/jobs/hackerhaven-equity-only'
      }
    ];

    const duration = Date.now() - startTime;

    const telemetry: ScraperTelemetry = {
      source: 'Wellfound',
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

export const wellfoundConnector = new WellfoundConnector();
