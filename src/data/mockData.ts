import { 
  Job, 
  Candidate, 
  SimulatorChallenge, 
  IngestionLogEntry, 
  BuildLogEntry,
  JobApplication,
  ModerationJobFlag,
  SecurityAuditLog,
  AttestationAuditEntry
} from '../types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Junior AI Engineer (Prompt & Eval Systems)',
    company: 'NeuralFlow Labs',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    source: 'LinkedIn',
    sourceUrl: 'https://linkedin.com/jobs/view/junior-ai-engineer-eval',
    experienceYears: 1,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 95000,
    salaryMax: 125000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'San Francisco, CA',
    remoteType: 'Hybrid',
    tags: ['Python', 'LangChain', 'Prompt Tuning', 'Evals', 'Gemini'],
    summary: 'Build rigorous unit tests and automated benchmark suites for generative AI prompt pipelines.',
    description: 'We are looking for an ambitious entry-level AI engineer to join our foundational prompt tooling team. You will write synthetic test datasets, run benchmark evaluations across model variants, and optimize inference token budgets.',
    requirements: [
      'Proficiency in Python and REST APIs',
      'Hands-on experience with LLM APIs (Gemini, Claude, or OpenAI)',
      'Understanding of tokenization, prompt latency, and structured outputs',
      'Strictly 0 to 1 year of professional experience or fresh graduate'
    ],
    simulatorsRecommended: ['sim-token-cost', 'sim-prompt-guard'],
    postedDate: '2 hours ago',
    applicantCount: 14,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: true
  },
  {
    id: 'job-2',
    title: 'Associate RAG & Vector Data Specialist',
    company: 'CognitiveScale AI',
    companyLogo: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=120&auto=format&fit=crop&q=80',
    source: 'Wellfound',
    sourceUrl: 'https://wellfound.com/jobs/cognitive-rag-associate',
    experienceYears: 1.5,
    experienceDisplay: '1 - 2 Yrs Exp',
    salaryMin: 100000,
    salaryMax: 130000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'Remote (US/Canada)',
    remoteType: 'Remote',
    tags: ['RAG', 'Pinecone', 'Embeddings', 'TypeScript', 'Next.js'],
    summary: 'Design chunking strategies, vector embeddings pipelines, and semantic search retrieval quality.',
    description: 'Join an agile startup engineering team building knowledge retrieval solutions for healthcare documentation. You will assist in tuning chunk overlap, vector indexing, and hybrid BM25 + dense embedding queries.',
    requirements: [
      'Familiarity with vector databases (Pinecone, Chroma, pgvector)',
      'Experience constructing embeddings and chunking text documents',
      'Solid TypeScript or Python scripting skills',
      'Portfolio project or simulator badge in RAG architecture'
    ],
    simulatorsRecommended: ['sim-rag-config'],
    postedDate: '5 hours ago',
    applicantCount: 22,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: true
  },
  {
    id: 'job-3',
    title: 'Junior AI Model Operations Associate',
    company: 'Hyperion AI Cloud',
    companyLogo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80',
    source: 'Indeed',
    sourceUrl: 'https://indeed.com/viewjob?jk=ai-ops-junior-hyperion',
    experienceYears: 0.5,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 88000,
    salaryMax: 110000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'Austin, TX',
    remoteType: 'Hybrid',
    tags: ['Docker', 'FastAPI', 'MLflow', 'Linux', 'Inference Ops'],
    summary: 'Monitor model latencies, token consumption telemetry, and continuous container deployment.',
    description: 'Help manage inference endpoints and token routing microservices. Great entry-level role for a computer science or engineering graduate eager to master modern MLOps tools.',
    requirements: [
      'Foundational Linux, Docker containerization, and Git workflow',
      'Basic knowledge of API gateway routing and load monitoring',
      'Keen interest in telemetry, Prometheus/Grafana, and cost tracking',
      'No more than 1 year prior work experience required'
    ],
    simulatorsRecommended: ['sim-token-cost'],
    postedDate: '1 day ago',
    applicantCount: 31,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: false
  },
  {
    id: 'job-4',
    title: 'Junior Agentic Workflow & Tooling Developer',
    company: 'Synergy Agents',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    source: 'Wellfound',
    sourceUrl: 'https://wellfound.com/jobs/synergy-agentic-junior',
    experienceYears: 2,
    experienceDisplay: '1 - 2 Yrs Exp',
    salaryMin: 110000,
    salaryMax: 140000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'New York, NY',
    remoteType: 'Remote',
    tags: ['Function Calling', 'TypeScript', 'ReAct Agents', 'Node.js', 'Postgres'],
    summary: 'Construct tool definitions, schema validators, and multi-step agent execution graphs.',
    description: 'We are pioneering autonomous CRM enrichment agents. As a junior engineer, you will write JSON schema tools, handle agent state machines, and write regression tests against hallucinations.',
    requirements: [
      'Strong TypeScript skills and async JavaScript patterns',
      'Experience with tool calling / function calling in LLMs',
      'Understanding of JSON Schema specifications and validation',
      'Active GitHub profile or completed Agent challenge'
    ],
    simulatorsRecommended: ['sim-prompt-guard', 'sim-token-cost'],
    postedDate: '1 day ago',
    applicantCount: 19,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: false
  },
  {
    id: 'job-5',
    title: 'AI Data Curator & Fine-Tuning Assistant',
    company: 'Apex Intelligence',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    source: 'LinkedIn',
    sourceUrl: 'https://linkedin.com/jobs/view/ai-data-curator-apex',
    experienceYears: 0,
    experienceDisplay: '0 Yrs / Entry',
    salaryMin: 80000,
    salaryMax: 105000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'Seattle, WA',
    remoteType: 'Remote',
    tags: ['JSONL', 'Data Hygiene', 'Hugging Face', 'Python', 'RLHF'],
    summary: 'Prepare high-quality supervised instruction datasets and synthetic reasoning trajectories.',
    description: 'Ideal for graduates with passion for LLM data quality. You will clean, deduplicate, format JSONL datasets, and test fine-tuning runs using open weights on Hugging Face.',
    requirements: [
      'High attention to detail and qualitative prompt comprehension',
      'Experience with Python data manipulation (pandas, datasets library)',
      'Basic familiarity with Hugging Face Hub workflows',
      'Entry level — students, bootcamp graduates, or self-taught welcome'
    ],
    simulatorsRecommended: ['sim-prompt-guard'],
    postedDate: '2 days ago',
    applicantCount: 45,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: false
  },
  {
    id: 'job-6',
    title: 'Junior Full-Stack AI Interface Engineer',
    company: 'VectorCraft',
    companyLogo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=120&auto=format&fit=crop&q=80',
    source: 'Indeed',
    sourceUrl: 'https://indeed.com/viewjob?jk=vectorcraft-fullstack-ai',
    experienceYears: 1,
    experienceDisplay: '1 Yr Max Exp',
    salaryMin: 90000,
    salaryMax: 120000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'Boston, MA',
    remoteType: 'Hybrid',
    tags: ['React', 'Tailwind CSS', 'Streaming UI', 'Server-Sent Events', 'AI UX'],
    summary: 'Create snappy conversational interfaces, artifact panels, and real-time streaming AI visualizations.',
    description: 'We are re-imagining how enterprise analysts interact with multi-modal AI models. You will implement responsive React components with streaming markdown, diff visualizers, and state caching.',
    requirements: [
      'Proficiency in modern React 18+, TypeScript, and Tailwind CSS',
      'Understanding of Server-Sent Events (SSE) and token streaming',
      'Eye for micro-interactions and accessible web UI design',
      '$\le 2$ years professional experience'
    ],
    simulatorsRecommended: ['sim-token-cost'],
    postedDate: '3 days ago',
    applicantCount: 28,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: false
  }
];

export const SIMULATOR_CHALLENGES: SimulatorChallenge[] = [
  {
    id: 'sim-token-cost',
    title: 'API Token & Cost Optimization Sandbox',
    category: 'Optimization & Economics',
    badgeName: 'Verified Token Economist',
    badgeIcon: 'Coins',
    description: 'Analyze an expensive multi-turn enterprise prompt payload, reduce context bloat by 40%+, and select cost-efficient inference models without sacrificing accuracy.',
    difficulty: 'Entry',
    estimatedMinutes: 5,
    instructions: [
      'Inspect the raw prompt payload containing repetitive logs and unnecessary preamble.',
      'Apply token pruning strategies (schema minification, system compression).',
      'Select the optimal model architecture to achieve target cost under $0.005 / run.',
      'Submit your configuration for automated verification and unlock the badge.'
    ],
    type: 'token_cost',
    badgeReward: {
      id: 'badge-token-economist',
      name: 'Token Economist (Verified)',
      category: 'Optimization',
      description: 'Demonstrated mastery in context pruning, prompt compression, and token-cost minimization.',
      verificationCode: 'VER-TOK-9921-ISO',
      icon: 'Zap'
    }
  },
  {
    id: 'sim-rag-config',
    title: 'RAG Pipeline Retrieval Precision Sandbox',
    category: 'RAG & Semantic Retrieval',
    badgeName: 'RAG Architecture Specialist',
    badgeIcon: 'Layers',
    description: 'Tune chunk size, chunk overlap ratio, vector similarity metric, and top-k retrieval parameters on a sample technical documentation corpus to achieve >85% precision.',
    difficulty: 'Junior',
    estimatedMinutes: 6,
    instructions: [
      'Review document boundary patterns in the technical knowledge corpus.',
      'Adjust chunk size between 128 and 1024 tokens with optimal overlap (10-20%).',
      'Configure similarity thresholds and top-K parameter to eliminate hallucination noise.',
      'Run retrieval benchmark test to achieve pass threshold.'
    ],
    type: 'rag_config',
    badgeReward: {
      id: 'badge-rag-specialist',
      name: 'RAG Architect (Verified)',
      category: 'RAG & Retrieval',
      description: 'Validated ability to architect semantic chunking and precision vector retrieval pipelines.',
      verificationCode: 'VER-RAG-4409-ISO',
      icon: 'Database'
    }
  },
  {
    id: 'sim-prompt-guard',
    title: 'System Prompt & Guardrails Defense Test',
    category: 'Safety & System Alignment',
    badgeName: 'Guardrails & Safety Practitioner',
    badgeIcon: 'ShieldCheck',
    description: 'Harden a customer-support system prompt against 4 common adversarial jailbreaks and indirect prompt injection attempts while retaining conversational helpfulness.',
    difficulty: 'Foundational',
    estimatedMinutes: 5,
    instructions: [
      'Analyze the vulnerable base system prompt.',
      'Inject explicit boundary delimiters and strict output schema constraints.',
      'Run the live attack evaluation suite (Base64 trick, Developer mode exploit, Delimiter override).',
      'Pass all 4 red-team probes to earn the verified safety badge.'
    ],
    type: 'prompt_guard',
    badgeReward: {
      id: 'badge-safety-practitioner',
      name: 'Safety & Guardrails (Verified)',
      category: 'Prompt & Safety',
      description: 'Proven skills in mitigating prompt injection and implementing strict operational boundaries.',
      verificationCode: 'VER-SEC-7812-ISO',
      icon: 'ShieldCheck'
    }
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Maya Lin',
    roleTitle: 'Junior AI & Prompt Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'CS Graduate (Class of 2025) focused on generative AI tooling, synthetic evaluation pipelines, and token-efficient agent architectures.',
    experienceYears: 1,
    targetSalaryMin: 95000,
    targetSalaryMax: 120000,
    location: 'San Francisco, CA',
    remotePreference: 'Hybrid',
    badges: [
      {
        id: 'badge-token-economist',
        name: 'Token Economist (Verified)',
        category: 'Optimization',
        description: 'Demonstrated mastery in context pruning and token-cost minimization.',
        verificationCode: 'VER-TOK-9921-ISO',
        icon: 'Zap',
        awardedAt: '2026-08-20'
      },
      {
        id: 'badge-safety-practitioner',
        name: 'Safety & Guardrails (Verified)',
        category: 'Prompt & Safety',
        description: 'Proven skills in mitigating prompt injection.',
        verificationCode: 'VER-SEC-7812-ISO',
        icon: 'ShieldCheck',
        awardedAt: '2026-08-22'
      }
    ],
    githubUrl: 'https://github.com/mayalin-ai/prompt-eval-kit',
    huggingfaceUrl: 'https://huggingface.co/mayalin',
    topProjects: [
      {
        title: 'PromptEval-Kit',
        desc: 'Lightweight CLI for running automated regression suites against multi-model prompt revisions.',
        url: 'https://github.com/mayalin-ai/prompt-eval-kit',
        stars: 142,
        stack: ['Python', 'Typer', 'Gemini API', 'Rich']
      },
      {
        title: 'TokenSlimmer-TS',
        desc: 'TypeScript utility that strips markdown comments and collapses whitespace for token reductions.',
        url: 'https://github.com/mayalin-ai/tokenslimmer',
        stars: 88,
        stack: ['TypeScript', 'Vite', 'Vitest']
      }
    ],
    simulatorScores: [
      { simulatorId: 'sim-token-cost', simulatorName: 'Token & Cost Optimization', score: 98, maxScore: 100, date: '2026-08-20' },
      { simulatorId: 'sim-prompt-guard', simulatorName: 'Guardrails Defense', score: 100, maxScore: 100, date: '2026-08-22' }
    ],
    availability: 'Immediate',
    verified: true
  },
  {
    id: 'cand-2',
    name: 'Devon Vance',
    roleTitle: 'Junior RAG & Vector Systems Developer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    bio: 'Self-taught AI developer with deep passion for semantic retrieval, hybrid search indexing, and open-source embedding models.',
    experienceYears: 1.5,
    targetSalaryMin: 105000,
    targetSalaryMax: 135000,
    location: 'Toronto, Canada',
    remotePreference: 'Remote',
    badges: [
      {
        id: 'badge-rag-specialist',
        name: 'RAG Architect (Verified)',
        category: 'RAG & Retrieval',
        description: 'Validated ability to architect semantic chunking and precision vector retrieval.',
        verificationCode: 'VER-RAG-4409-ISO',
        icon: 'Database',
        awardedAt: '2026-08-25'
      }
    ],
    githubUrl: 'https://github.com/devonvance/hybrid-doc-rag',
    huggingfaceUrl: 'https://huggingface.co/devonvance',
    topProjects: [
      {
        title: 'HybridDocRAG',
        desc: 'Production-ready RAG microservice with Reciprocal Rank Fusion combining BM25 and dense embeddings.',
        url: 'https://github.com/devonvance/hybrid-doc-rag',
        stars: 215,
        stack: ['Python', 'FastAPI', 'Qdrant', 'SentenceTransformers']
      }
    ],
    simulatorScores: [
      { simulatorId: 'sim-rag-config', simulatorName: 'RAG Retrieval Precision', score: 94, maxScore: 100, date: '2026-08-25' }
    ],
    availability: '2 Weeks',
    verified: true
  },
  {
    id: 'cand-3',
    name: 'Elena Rostova',
    roleTitle: 'Entry-Level AI Operations & Evaluation Engineer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'B.S. in Software Engineering. Experienced in containerizing AI microservices, tracking inference latencies, and building evaluation dashboards.',
    experienceYears: 0.5,
    targetSalaryMin: 90000,
    targetSalaryMax: 115000,
    location: 'Chicago, IL',
    remotePreference: 'Any',
    badges: [
      {
        id: 'badge-token-economist',
        name: 'Token Economist (Verified)',
        category: 'Optimization',
        description: 'Demonstrated mastery in context pruning.',
        verificationCode: 'VER-TOK-8819-ISO',
        icon: 'Zap',
        awardedAt: '2026-08-26'
      },
      {
        id: 'badge-rag-specialist',
        name: 'RAG Architect (Verified)',
        category: 'RAG & Retrieval',
        description: 'Validated ability to architect semantic chunking.',
        verificationCode: 'VER-RAG-5510-ISO',
        icon: 'Database',
        awardedAt: '2026-08-27'
      }
    ],
    githubUrl: 'https://github.com/erostova/ai-telemetry-dashboard',
    huggingfaceUrl: 'https://huggingface.co/erostova',
    topProjects: [
      {
        title: 'AI-Telemetry-Probe',
        desc: 'OpenTelemetry middleware for tracking token burn rates and latency histograms per user tier.',
        url: 'https://github.com/erostova/ai-telemetry-dashboard',
        stars: 94,
        stack: ['TypeScript', 'Express', 'Prometheus', 'Tailwind']
      }
    ],
    simulatorScores: [
      { simulatorId: 'sim-token-cost', simulatorName: 'Token & Cost Optimization', score: 92, maxScore: 100, date: '2026-08-26' },
      { simulatorId: 'sim-rag-config', simulatorName: 'RAG Retrieval Precision', score: 88, maxScore: 100, date: '2026-08-27' }
    ],
    availability: 'Immediate',
    verified: true
  }
];

export const INGESTION_LOGS: IngestionLogEntry[] = [
  {
    id: 'ing-1',
    timestamp: '2026-08-28 09:15 UTC',
    source: 'LinkedIn',
    rawJobsScanned: 184,
    rejectedExcessExp: 142, // >2 yrs filtered out
    rejectedNullSalary: 29, // Missing salary filtered out
    acceptedEntryJobs: 13,
    status: 'Clean & Ingested'
  },
  {
    id: 'ing-2',
    timestamp: '2026-08-28 08:30 UTC',
    source: 'Wellfound',
    rawJobsScanned: 96,
    rejectedExcessExp: 68,
    rejectedNullSalary: 11,
    acceptedEntryJobs: 17,
    status: 'Clean & Ingested'
  },
  {
    id: 'ing-3',
    timestamp: '2026-08-28 07:45 UTC',
    source: 'Indeed',
    rawJobsScanned: 210,
    rejectedExcessExp: 165,
    rejectedNullSalary: 37,
    acceptedEntryJobs: 8,
    status: 'Clean & Ingested'
  }
];

export const BUILD_LOG_ENTRIES: BuildLogEntry[] = [
  {
    version: 'v0.1.0',
    buildDate: '2026-08-28',
    milestone: 'Scaffolding & Requirements Definition',
    deliverables: 'Initial SRS formulation, ISO/IEC 29148 standards alignment, brand identity, color token setup.',
    status: 'Completed'
  },
  {
    version: 'v0.2.0',
    buildDate: '2026-08-28',
    milestone: 'Ingestion Architecture & Sourcing',
    deliverables: 'Added specs for automated multi-source ingestion pipelines (LinkedIn, Indeed, Wellfound) with strict entry-level filtering.',
    status: 'Completed'
  },
  {
    version: 'v0.3.0',
    buildDate: '2026-08-28',
    milestone: 'User Feature Matrix Definition',
    deliverables: 'Formalized core functionality specs for Job Seekers and Recruiters, verified badge mechanics, and sandbox simulator guidelines.',
    status: 'Completed'
  },
  {
    version: 'v0.3.1',
    buildDate: '2026-08-28',
    milestone: 'Domain Occlusion Protocol',
    deliverables: 'Scrubbed brand name and domain from public logs pending final registrar acquisition.',
    status: 'Completed'
  },
  {
    version: 'v0.4.0',
    buildDate: '2026-08-28',
    milestone: 'Frontend Layout & Design System',
    deliverables: 'Implementation of Tailwind CSS layout, multi-source job feed with p-6 spacing, interactive simulators, recruiter views, and personalized settings.',
    status: 'Completed'
  },
  {
    version: 'v0.5.0',
    buildDate: '2026-08-28',
    milestone: 'Clean Minimalism UI & Sailboat Rebrand',
    deliverables: 'Refined design system to Clean Minimalism with purple accents and custom Sailboat brand icon.',
    status: 'Completed'
  },
  {
    version: 'v0.6.0',
    buildDate: '2026-08-28',
    milestone: 'Automated Multi-Source Ingestion & Scraping Pipeline',
    deliverables: 'Built scrapers (LinkedIn, Indeed, Wellfound), strict ISO ≤2 yrs experience filter, salary mandate guard, fuzzy deduplication normalizer, and /api/jobs/sync endpoint.',
    status: 'Completed'
  },
  {
    version: 'v0.7.0',
    buildDate: '2026-08-28',
    milestone: 'Skill Simulator Suite & Cryptographic Attestation',
    deliverables: 'Created modular sandboxes (TokenOptimizer, RAGChunker, GuardrailTester), multi-vector assertion test runner (badgeAttestation.ts), real-time metric tracking, and cryptographic profile badge minting.',
    status: 'Completed'
  },
  {
    version: 'v0.8.0',
    buildDate: '2026-08-28',
    milestone: 'Platform Security Architecture & Dual-Role Workflows',
    deliverables: 'Engineered AppSec middleware (CSRF, HSTS, CSP headers), RBAC role protection, Job Seeker portfolio portal with attestation proofs, Recruiter posting constraint engine, and Administrator moderation/ingestion console.',
    status: 'Completed'
  },
  {
    version: 'v0.9.0',
    buildDate: '2026-08-28',
    milestone: 'Tabernacle Theme & Aesthetic Integration',
    deliverables: 'Refactored visual architecture to the sacred Tabernacle Palette (Tekhelet Blue #1D4ED8, Royal Argaman Purple #7C3AED, Vibrant Scarlet #DC2626, Fine Linen #F8FAFC, Sacred Gold #F59E0B), implemented the 45-degree left-angled rocket brand logo, updated navigation & simulator sandboxes with gold attestation badging, and enforced generous p-6+ whitespace.',
    status: 'Completed'
  },
  {
    version: 'v0.9.1',
    buildDate: '2026-08-28',
    milestone: 'Mobile Layout Optimization & Lightened Purple Refinement',
    deliverables: 'Engineered compact, decluttered JobCardMobile component with thumb-friendly touch ergonomics, zero horizontal overflow, and integrated responsive JobFeed view switcher (<768px). Shifted interactive primary purple buttons, active tab indicators, and Indeed source tags to Lightened Purple (#8B5CF6).',
    status: 'Completed'
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Junior AI Engineer (Prompt & Eval Systems)',
    company: 'NeuralFlow Labs',
    source: 'LinkedIn',
    location: 'San Francisco, CA (Hybrid)',
    appliedDate: '2026-08-27',
    salaryRange: '$95,000 - $125,000',
    status: 'Recruiter Screen',
    requiredBadges: ['badge_token_opt_v1', 'badge_llm_safety_v1'],
    matchScore: 96,
    notes: 'Recruiter reached out via platform with interview invite for Prompt Architecture team.'
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    jobTitle: 'Associate RAG & Vector Data Specialist',
    company: 'CognitiveScale AI',
    source: 'Wellfound',
    location: 'Remote (US/Canada)',
    appliedDate: '2026-08-26',
    salaryRange: '$100,000 - $130,000',
    status: 'Challenge Passed',
    requiredBadges: ['badge_rag_arch_v1'],
    matchScore: 92,
    notes: 'Attested RAG Vector Architect badge automatically submitted and verified on-chain hash.'
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    jobTitle: 'Junior LLM Red-Teamer & Safety Analyst',
    company: 'ShieldAI Global',
    source: 'Indeed',
    location: 'Austin, TX (Remote)',
    appliedDate: '2026-08-25',
    salaryRange: '$90,000 - $115,000',
    status: 'Under Review',
    requiredBadges: ['badge_llm_safety_v1'],
    matchScore: 88,
    notes: 'Submitted prompt defense test logs alongside application packet.'
  }
];

export const INITIAL_MODERATION_FLAGS: ModerationJobFlag[] = [
  {
    id: 'flag-1',
    jobId: 'flagged-ext-101',
    jobTitle: 'Senior-Junior AI Researcher (5+ Yrs Required)',
    company: 'ShadowCorp AI',
    source: 'LinkedIn',
    reason: 'Excess Experience (>2 yrs)',
    severity: 'high',
    status: 'pending_review',
    flaggedAt: '2026-08-28 09:12:44',
    flaggedBy: 'Automated Experience Filter Engine',
    snippet: 'Requirement section demands minimum 5 years in production PyTorch distributed training.'
  },
  {
    id: 'flag-2',
    jobId: 'flagged-ext-102',
    jobTitle: 'Entry-Level AI Prompt Intern (Unpaid / Equity Only)',
    company: 'VaporLLM Inc',
    source: 'Indeed',
    reason: 'Null/Ambiguous Salary',
    severity: 'high',
    status: 'pending_review',
    flaggedAt: '2026-08-28 08:45:10',
    flaggedBy: 'Mandatory Compensation Guard',
    snippet: 'Salary listed as "Competitive DOE / Equity / Unpaid Internship". Violates transparency mandate.'
  },
  {
    id: 'flag-3',
    jobId: 'flagged-ext-103',
    jobTitle: 'Junior Data annotator with 3+ yrs LLM fine-tuning',
    company: 'OmniData Ventures',
    source: 'Wellfound',
    reason: 'Misleading Junior Tag',
    severity: 'medium',
    status: 'quarantined',
    flaggedAt: '2026-08-28 07:30:22',
    flaggedBy: 'User Community Report (AV-991)',
    snippet: 'Title marked entry level but job description asks for Ph.D. and 3 years industry experience.'
  }
];

export const INITIAL_SECURITY_LOGS: SecurityAuditLog[] = [
  {
    id: 'sec-log-1',
    timestamp: '2026-08-28 09:54:12 UTC',
    eventType: 'CSRF_BLOCKED',
    ipAddress: '198.51.100.24',
    severity: 'WARN',
    endpoint: '/api/jobs/post',
    details: 'Unverified origin POST without valid CSRF header blocked by appMiddleware.',
    status: 'BLOCKED'
  },
  {
    id: 'sec-log-2',
    timestamp: '2026-08-28 09:52:05 UTC',
    eventType: 'RATE_LIMIT_EXCEEDED',
    ipAddress: '203.0.113.88',
    severity: 'WARN',
    endpoint: '/api/jobs/sync',
    details: 'Rapid synchronization requests (12/min) exceeded 10 req/min limit. Throttled 429.',
    status: 'BLOCKED'
  },
  {
    id: 'sec-log-3',
    timestamp: '2026-08-28 09:48:30 UTC',
    eventType: 'PII_SCRUBBED',
    ipAddress: '192.0.2.14',
    severity: 'INFO',
    endpoint: '/api/candidates/portfolio',
    details: 'Raw phone and unmasked access token scrubbed from candidate bio prior to indexing.',
    status: 'MITIGATED'
  },
  {
    id: 'sec-log-4',
    timestamp: '2026-08-28 09:30:15 UTC',
    eventType: 'ATTESTATION_MINTED',
    ipAddress: '192.0.2.45',
    severity: 'INFO',
    endpoint: '/api/simulators/attest',
    details: 'Cryptographic assertion hash sha256:7f4a... generated for user Alex Vance (Token Economist).',
    status: 'AUDITED'
  },
  {
    id: 'sec-log-5',
    timestamp: '2026-08-28 09:00:00 UTC',
    eventType: 'ADMIN_AUTH_SUCCESS',
    ipAddress: '192.0.2.1',
    severity: 'INFO',
    endpoint: '/admin/session',
    details: 'Superadmin RBAC session validated with 2FA cryptographic token.',
    userRole: 'admin',
    status: 'AUDITED'
  }
];

export const INITIAL_ATTESTATION_AUDITS: AttestationAuditEntry[] = [
  {
    id: 'attest-1',
    candidateId: 'cand-1',
    candidateName: 'Alex Vance',
    badgeId: 'badge_token_opt_v1',
    badgeName: 'Token & Cost Architect',
    verificationCode: 'VER-TOK-9921-ISO',
    hash: '0x8f2a4c9b1d3e5f7a9c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a',
    signature: 'ed25519:3b9f8a1c...e7d2',
    timestamp: '2026-08-28 09:30:15',
    score: 98.5,
    verifiedBy: 'Evaluator Engine v2.4'
  },
  {
    id: 'attest-2',
    candidateId: 'cand-1',
    candidateName: 'Alex Vance',
    badgeId: 'badge_rag_arch_v1',
    badgeName: 'RAG Retrieval & Vector Architect',
    verificationCode: 'VER-RAG-4410-ISO',
    hash: '0x3c7e1a9f5b2d8c0e4a6f8b2d0c4e6a8f0b2d4c6e8a0f2b4d6c8e0a2f4b6d8c0e',
    signature: 'ed25519:7a4c9b2d...1f9e',
    timestamp: '2026-08-27 14:15:00',
    score: 95.0,
    verifiedBy: 'Evaluator Engine v2.4'
  },
  {
    id: 'attest-3',
    candidateId: 'cand-2',
    candidateName: 'Maya Lin',
    badgeId: 'badge_llm_safety_v1',
    badgeName: 'Prompt Defense & LLM Safety Engineer',
    verificationCode: 'VER-SEC-8832-ISO',
    hash: '0x1d3e5f7a9c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8f2a4c9b',
    signature: 'ed25519:9e1f4a7c...3d8b',
    timestamp: '2026-08-26 18:40:22',
    score: 100.0,
    verifiedBy: 'Evaluator Engine v2.4'
  }
];
