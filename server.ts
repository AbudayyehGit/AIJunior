import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'juniorroles-super-secure-jwt-token-signing-key-2026';

app.use(express.json());
app.set('trust proxy', 1);

// Security & Domain Routing Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Domain Health & Routing Telemetry Endpoint (junior.ai.roles & juniorroles.ai.studio)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    canonicalDomain: 'juniorroles.ai.studio',
    routedDomain: req.headers.host || 'unknown',
    supportedAliases: ['junior.ai.roles', 'juniorroles.ai.studio', 'juniorroles.ai'],
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// SECURITY & CRYPTOGRAPHIC UTILITIES
// ==========================================

function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
}

function generateToken(payload: { id: string; email: string; role: string; name: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSig) return null;
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

// Authentication Middleware
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No Bearer token provided.' });
  }
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Session token expired or invalid.' });
  }
  (req as any).user = decoded;
  next();
}

function adminMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  authMiddleware(req, res, () => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access Denied: Superadmin privileges required.' });
    }
    next();
  });
}

// ==========================================
// IN-MEMORY PERSISTENT STORES
// ==========================================

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  membershipTier: 'Free' | 'Pro Candidate' | 'Enterprise Recruiter' | 'Superadmin';
  status: 'Active' | 'Suspended' | 'Pending Verification';
  attestedBadgesCount: number;
  createdAt: string;
  lastLogin: string;
}

// Initial Seed Users with Real Hashed Passwords
const alexHashed = hashPassword('CandidatePass123!');
const sarahHashed = hashPassword('RecruiterPass123!');
const adminHashed = hashPassword('AdminSecure2026!');
const mayaHashed = hashPassword('CandidatePass123!');

let usersDatabase: UserRecord[] = [
  {
    id: 'usr-1',
    name: 'Alex Vance',
    email: 'alex.vance@example.com',
    passwordHash: alexHashed.hash,
    salt: alexHashed.salt,
    role: 'job_seeker',
    membershipTier: 'Pro Candidate',
    status: 'Active',
    attestedBadgesCount: 2,
    createdAt: '2026-08-01 10:00:00 UTC',
    lastLogin: 'Just now'
  },
  {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 'sarah@neuralflow.ai',
    passwordHash: sarahHashed.hash,
    salt: sarahHashed.salt,
    role: 'recruiter',
    membershipTier: 'Enterprise Recruiter',
    status: 'Active',
    attestedBadgesCount: 0,
    createdAt: '2026-08-05 14:30:00 UTC',
    lastLogin: '1 hour ago'
  },
  {
    id: 'usr-3',
    name: 'Platform Superadmin',
    email: 'admin@juniorroles.ai',
    passwordHash: adminHashed.hash,
    salt: adminHashed.salt,
    role: 'admin',
    membershipTier: 'Superadmin',
    status: 'Active',
    attestedBadgesCount: 0,
    createdAt: '2026-07-15 08:00:00 UTC',
    lastLogin: 'Just now'
  },
  {
    id: 'usr-4',
    name: 'Maya Lin',
    email: 'maya.lin@example.com',
    passwordHash: mayaHashed.hash,
    salt: mayaHashed.salt,
    role: 'job_seeker',
    membershipTier: 'Free',
    status: 'Active',
    attestedBadgesCount: 1,
    createdAt: '2026-08-10 11:20:00 UTC',
    lastLogin: '4 hours ago'
  }
];

// Active Verified Jobs
let liveJobsDatabase: any[] = [
  {
    id: 'job-real-1',
    title: 'Junior AI Evaluation & Benchmark Systems Engineer',
    company: 'Anthropic Ecosystem / Safety Labs',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    source: 'LinkedIn',
    sourceUrl: 'https://linkedin.com/jobs/view/junior-ai-eval-engineer',
    experienceYears: 1.0,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 110000,
    salaryMax: 140000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'San Francisco, CA (Hybrid)',
    remoteType: 'Hybrid',
    tags: ['Python', 'Model Evals', 'Prompt Guardrails', 'LangChain', 'Gemini API'],
    summary: 'Build automated benchmark suites, prompt regression harnesses, and safety telemetry pipelines for frontier generative models.',
    description: 'Join our evaluation and model reliability engineering team. You will write automated evaluation probes, analyze jailbreak regression vectors, and benchmark token inference latencies across LLM model families.',
    requirements: [
      'Proficiency in Python and REST / SDK APIs',
      'Hands-on projects with modern LLM APIs (Gemini, Claude, or OpenAI)',
      'Understanding of tokenization, prompt latency, and structured outputs',
      'Strictly 0 to 1 year of professional experience or recent graduate'
    ],
    simulatorsRecommended: ['sim-token-cost', 'sim-prompt-guard'],
    postedDate: '1 hour ago',
    applicantCount: 8,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: true
  },
  {
    id: 'job-real-2',
    title: 'Associate RAG & Vector Retrieval Specialist',
    company: 'Pinecone Vector Systems',
    companyLogo: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=120&auto=format&fit=crop&q=80',
    source: 'Wellfound',
    sourceUrl: 'https://wellfound.com/jobs/pinecone-associate-rag-engineer',
    experienceYears: 1.5,
    experienceDisplay: '1 - 2 Yrs Exp',
    salaryMin: 105000,
    salaryMax: 135000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'New York, NY / Remote',
    remoteType: 'Remote',
    tags: ['RAG', 'Vector Indexing', 'Embeddings', 'TypeScript', 'FastAPI'],
    summary: 'Tune document chunking strategies, dense/sparse hybrid search algorithms, and vector embedding topologies.',
    description: 'We are expanding our solutions architecture group. In this role, you will evaluate semantic chunking methods, benchmark cosine vs dot-product similarity metrics, and build low-latency RAG retrieval endpoints.',
    requirements: [
      'Experience constructing embeddings and chunking large text corpora',
      'Familiarity with vector databases (Pinecone, Qdrant, Chroma, or pgvector)',
      'Solid TypeScript or Python scripting abilities',
      'Demonstrated portfolio project or verified RAG badge'
    ],
    simulatorsRecommended: ['sim-rag-config'],
    postedDate: '3 hours ago',
    applicantCount: 15,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: true
  },
  {
    id: 'job-real-3',
    title: 'Junior Agent Tooling & ReAct Function Developer',
    company: 'LangChain AI',
    companyLogo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80',
    source: 'HackerNews',
    sourceUrl: 'https://news.ycombinator.com/item?id=43901102',
    experienceYears: 0.5,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 98000,
    salaryMax: 125000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'San Francisco, CA / Remote',
    remoteType: 'Remote',
    tags: ['TypeScript', 'ReAct', 'Tool Calling', 'JSON Schema', 'Python'],
    summary: 'Design typed tool bindings, structured output schemas, and deterministic agent execution loops.',
    description: 'Join the agent tooling core team. You will build deterministic tool wrappers, parameter schema validators, and replay harnesses for multi-step autonomous agent workflows.',
    requirements: [
      'Strong TypeScript or Python programming fundamentals',
      'Understanding of ReAct loops, structured JSON outputs, and tool calling',
      'Enthusiasm for autonomous developer agents and LLM orchestration',
      'Fresh graduate or <= 1 year prior professional experience'
    ],
    simulatorsRecommended: ['sim-token-cost', 'sim-prompt-guard'],
    postedDate: '4 hours ago',
    applicantCount: 19,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: true
  },
  {
    id: 'job-real-4',
    title: 'Junior LLM Inference & Token Optimization Specialist',
    company: 'Modal Labs / Cloud Inference',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    source: 'RemoteOK',
    sourceUrl: 'https://remoteok.com/remote-jobs/modal-junior-inference-opt',
    experienceYears: 1.0,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 112000,
    salaryMax: 138000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'Worldwide Remote',
    remoteType: 'Remote',
    tags: ['Inference Ops', 'Token Economy', 'vLLM', 'FastAPI', 'Python'],
    summary: 'Profile Time-to-First-Token (TTFT), optimize KV-cache memory footprints, and prune unnecessary prompt context.',
    description: 'Help our cloud platform team optimize GPU worker latency and cost efficiency. You will write automated token budget analyzers, benchmark context compression rates, and monitor real-time inference telemetry.',
    requirements: [
      'Understanding of token budget estimation and context window economics',
      'Python, Linux, and Docker containerization fundamentals',
      'Interest in serverless GPU scaling and model serving',
      'Entry-level role (0 - 1.5 yrs experience)'
    ],
    simulatorsRecommended: ['sim-token-cost'],
    postedDate: '5 hours ago',
    applicantCount: 23,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: false
  },
  {
    id: 'job-real-5',
    title: 'Junior Developer Tooling & AI Prompting Engineer',
    company: 'Cursor (Anysphere)',
    companyLogo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    source: 'Indeed',
    sourceUrl: 'https://indeed.com/viewjob?jk=cursor-junior-ai-devtool',
    experienceYears: 1.0,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 115000,
    salaryMax: 145000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'San Francisco, CA',
    remoteType: 'Hybrid',
    tags: ['TypeScript', 'VSCode Extensions', 'Prompting', 'AST Parsing', 'C++'],
    summary: 'Craft AI code editing prompts, diff generation harnesses, and AST-aware context summarizers.',
    description: 'We are seeking early-career software engineers passionate about the future of AI-assisted software development. You will build prompt templates for codebase indexing, multi-file diff generation, and test suites.',
    requirements: [
      'Strong proficiency in TypeScript or modern JavaScript',
      'Interest in code ASTs, LSP protocols, or IDE extensions',
      'Hands-on experience building apps or tools with LLM APIs',
      'Max 1 year of professional experience or personal open-source projects'
    ],
    simulatorsRecommended: ['sim-token-cost', 'sim-rag-config'],
    postedDate: '7 hours ago',
    applicantCount: 31,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: false
  },
  {
    id: 'job-real-6',
    title: 'Associate AI Red Teaming & Prompt Guard Specialist',
    company: 'Cohere Security & Alignment',
    companyLogo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80',
    source: 'LinkedIn',
    sourceUrl: 'https://linkedin.com/jobs/view/cohere-associate-red-teamer',
    experienceYears: 0.5,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 95000,
    salaryMax: 120000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'Toronto, ON / Remote',
    remoteType: 'Hybrid',
    tags: ['Red Teaming', 'Safety Evals', 'Prompt Injection', 'Python', 'PII Scrubbing'],
    summary: 'Conduct automated adversarial prompt injection testing, PII exfiltration defense, and boundary audits.',
    description: 'Join our trust and safety group. You will design synthetic red-teaming vectors, test boundary demarcation against delimiter breakouts, and audit automated PII scrubbing pipelines.',
    requirements: [
      'Curiosity for AI security, jailbreaking, and prompt injection vulnerabilities',
      'Python scripting for creating automated test benches',
      'Understanding of regex, PII redaction patterns, and XML demarcations',
      '0 to 1 year prior experience required'
    ],
    simulatorsRecommended: ['sim-prompt-guard'],
    postedDate: '9 hours ago',
    applicantCount: 28,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: false
  }
];

// Candidates Store
let candidatesDatabase: any[] = [
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
      }
    ],
    simulatorScores: [
      { simulatorId: 'sim-token-cost', simulatorName: 'Token & Cost Optimization', score: 98, maxScore: 100, date: '2026-08-20' }
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
  }
];

// Applications Store
let applicationsDatabase: any[] = [
  {
    id: 'app-1',
    jobId: 'job-real-1',
    jobTitle: 'Junior AI Evaluation & Benchmark Systems Engineer',
    company: 'Anthropic Ecosystem / Safety Labs',
    source: 'LinkedIn',
    location: 'San Francisco, CA (Hybrid)',
    appliedDate: '2026-09-10',
    salaryRange: '$110,000 - $140,000',
    status: 'Recruiter Screen',
    requiredBadges: ['badge-token-economist', 'badge-safety-practitioner'],
    matchScore: 96,
    notes: 'Recruiter screen scheduled for automated benchmark evaluation tooling.'
  },
  {
    id: 'app-2',
    jobId: 'job-real-2',
    jobTitle: 'Associate RAG & Vector Retrieval Specialist',
    company: 'Pinecone Vector Systems',
    source: 'Wellfound',
    location: 'New York, NY / Remote',
    appliedDate: '2026-09-08',
    salaryRange: '$105,000 - $135,000',
    status: 'Challenge Passed',
    requiredBadges: ['badge-rag-specialist'],
    matchScore: 92,
    notes: 'Attested RAG Vector Architect badge verified on-chain.'
  }
];

// Moderation Flags Store
let moderationFlagsDatabase: any[] = [
  {
    id: 'flag-1',
    jobId: 'flagged-ext-101',
    jobTitle: 'Senior-Junior AI Researcher (5+ Yrs Required)',
    company: 'ShadowCorp AI',
    source: 'LinkedIn',
    reason: 'Excess Experience (>2 yrs)',
    severity: 'high',
    status: 'pending_review',
    flaggedAt: '2026-09-16 09:12:44',
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
    flaggedAt: '2026-09-15 08:45:10',
    flaggedBy: 'Mandatory Compensation Guard',
    snippet: 'Salary listed as "Competitive DOE / Equity / Unpaid Internship". Violates transparency mandate.'
  }
];

// Security Audit Logs
let securityLogsDatabase: any[] = [
  {
    id: 'sec-log-1',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    eventType: 'ADMIN_AUTH_SUCCESS',
    ipAddress: '127.0.0.1',
    severity: 'INFO',
    endpoint: '/api/auth/login',
    details: 'Authenticated platform session initialized with cryptographic token.',
    userRole: 'admin',
    status: 'AUDITED'
  }
];

// Attestations
let attestationsDatabase: any[] = [
  {
    id: 'attest-1',
    candidateId: 'cand-1',
    candidateName: 'Alex Vance',
    badgeId: 'badge-token-economist',
    badgeName: 'Token & Cost Architect',
    verificationCode: 'VER-TOK-9921-ISO',
    hash: '0x8f2a4c9b1d3e5f7a9c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a',
    signature: 'ed25519:3b9f8a1c6e4b9d0f2a8c3e5a',
    timestamp: '2026-09-12 09:30:15',
    score: 98.5,
    verifiedBy: 'Evaluator Engine v2.4'
  }
];

let ingestionRunHistory: any[] = [];
let totalScannedAllTime = 1420;
let totalRejectedSeniorAllTime = 840;
let totalRejectedNoSalaryAllTime = 490;
let totalAdmittedAllTime = 90;

// SSE Client Connections for Live Stream
const sseClients: express.Response[] = [];

function broadcastSSE(eventType: string, data: any) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// Domain and Host Resolution Logging Middleware (Phase 6 Diagnostic)
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host.includes('junior.ai.roles')) {
    // Log routing attempt to the target domain
    console.log(`[Domain Routing] Request received for alias host: ${host}`);
  }
  next();
});

// ==========================================
// AUTHENTICATION ENDPOINTS (PHASE 3)
// ==========================================

// 1. Register User
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = usersDatabase.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const assignedRole: 'job_seeker' | 'recruiter' = role === 'recruiter' ? 'recruiter' : 'job_seeker';
  const { hash, salt } = hashPassword(password);

  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hash,
    salt: salt,
    role: assignedRole,
    membershipTier: assignedRole === 'recruiter' ? 'Enterprise Recruiter' : 'Pro Candidate',
    status: 'Active',
    attestedBadgesCount: 0,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    lastLogin: 'Just now'
  };

  usersDatabase.push(newUser);

  // Issue Token
  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name
  });

  const { passwordHash: _, salt: __, ...sanitized } = newUser;

  securityLogsDatabase.unshift({
    id: `sec-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    eventType: 'ADMIN_AUTH_SUCCESS',
    ipAddress: req.ip || '127.0.0.1',
    severity: 'INFO',
    endpoint: '/api/auth/register',
    details: `New account registered for ${sanitized.email} (${sanitized.role}).`,
    userRole: sanitized.role,
    status: 'AUDITED'
  });

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: sanitized
  });
});

// 2. Login User
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = usersDatabase.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.status === 'Suspended') {
    return res.status(403).json({
      error: 'Account Suspended: Access has been disabled by platform administrator.'
    });
  }

  const isMatch = verifyPassword(password, user.passwordHash, user.salt);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  user.lastLogin = 'Just now';

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  const { passwordHash: _, salt: __, ...sanitized } = user;

  res.json({
    message: 'Authenticated successfully',
    token,
    user: sanitized
  });
});

// 3. Current Session
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const tokenUser = (req as any).user;
  const user = usersDatabase.find((u) => u.id === tokenUser.id);
  if (!user) {
    return res.status(404).json({ error: 'User record not found.' });
  }
  const { passwordHash: _, salt: __, ...sanitized } = user;
  res.json({ user: sanitized });
});

// 4. Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Session terminated successfully.' });
});

// ==========================================
// ADMIN USER & MEMBERSHIP MANAGEMENT (PHASE 4)
// ==========================================

// 1. Get All Users
app.get('/api/admin/users', adminMiddleware, (req, res) => {
  const sanitized = usersDatabase.map(({ passwordHash, salt, ...rest }) => rest);
  res.json({ users: sanitized });
});

// 2. Update User Role
app.patch('/api/admin/users/:id/role', adminMiddleware, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = usersDatabase.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!['job_seeker', 'recruiter', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  user.role = role;
  const { passwordHash: _, salt: __, ...sanitized } = user;

  securityLogsDatabase.unshift({
    id: `sec-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    eventType: 'ADMIN_AUTH_SUCCESS',
    ipAddress: req.ip || '127.0.0.1',
    severity: 'INFO',
    endpoint: `/api/admin/users/${id}/role`,
    details: `Role for ${user.email} updated to ${role} by administrator.`,
    userRole: 'admin',
    status: 'AUDITED'
  });

  res.json({ message: 'Role updated successfully', user: sanitized });
});

// 3. Update User Membership Tier
app.patch('/api/admin/users/:id/tier', adminMiddleware, (req, res) => {
  const { id } = req.params;
  const { tier } = req.body;
  const user = usersDatabase.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!['Free', 'Pro Candidate', 'Enterprise Recruiter', 'Superadmin'].includes(tier)) {
    return res.status(400).json({ error: 'Invalid membership tier.' });
  }

  user.membershipTier = tier;
  const { passwordHash: _, salt: __, ...sanitized } = user;
  res.json({ message: 'Membership tier updated', user: sanitized });
});

// 4. Update User Account Status (Activate / Suspend)
app.patch('/api/admin/users/:id/status', adminMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = usersDatabase.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!['Active', 'Suspended', 'Pending Verification'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  user.status = status;
  const { passwordHash: _, salt: __, ...sanitized } = user;

  securityLogsDatabase.unshift({
    id: `sec-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    eventType: 'ADMIN_AUTH_SUCCESS',
    ipAddress: req.ip || '127.0.0.1',
    severity: 'WARN',
    endpoint: `/api/admin/users/${id}/status`,
    details: `Account status for ${user.email} toggled to ${status}.`,
    userRole: 'admin',
    status: 'AUDITED'
  });

  res.json({ message: `Account status set to ${status}`, user: sanitized });
});

// 5. Delete User Account
app.delete('/api/admin/users/:id', adminMiddleware, (req, res) => {
  const { id } = req.params;
  const index = usersDatabase.findIndex((u) => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const deleted = usersDatabase.splice(index, 1)[0];
  res.json({ message: `User ${deleted.email} deleted successfully.` });
});

// ==========================================
// JOBS API (PHASE 2 & PHASE 5)
// ==========================================

// 1. Fetch Active Jobs with Dynamic Filter Queries
app.get('/api/jobs', (req, res) => {
  const { source, maxExp, minSalary, remote, q } = req.query;
  let results = [...liveJobsDatabase];

  if (q) {
    const query = (q as string).toLowerCase();
    results = results.filter(
      (j) =>
        j.title?.toLowerCase().includes(query) ||
        j.company?.toLowerCase().includes(query) ||
        j.tags?.some((t: string) => t.toLowerCase().includes(query))
    );
  }

  if (source && source !== 'ALL') {
    results = results.filter((j) => j.source === source);
  }
  if (maxExp) {
    const cap = parseFloat(maxExp as string);
    if (!isNaN(cap)) {
      results = results.filter((j) => j.experienceYears <= cap);
    }
  }
  if (minSalary) {
    const min = parseFloat(minSalary as string);
    if (!isNaN(min)) {
      results = results.filter((j) => j.salaryMax >= min);
    }
  }
  if (remote && remote !== 'ALL') {
    results = results.filter((j) => j.remoteType === remote);
  }

  res.json({
    count: results.length,
    jobs: results
  });
});

// 2. Post New Job (Direct / Recruiter)
app.post('/api/jobs', (req, res) => {
  const newJob = req.body;
  if (!newJob || !newJob.title || !newJob.company) {
    return res.status(400).json({ error: 'Missing required title or company.' });
  }

  // Strictly enforce junior experience limit (<= 2 years)
  if (newJob.experienceYears > 2.0) {
    return res.status(400).json({
      error: 'REJECTED: Exceeds mandatory junior experience ceiling (<= 2 years)'
    });
  }

  // Strictly enforce salary transparency
  if (!newJob.salaryMin || !newJob.salaryMax || newJob.salaryMin <= 0) {
    return res.status(400).json({
      error: 'REJECTED: Salary transparency required (non-null compensation mandate)'
    });
  }

  const sanitized: any = {
    ...newJob,
    id: newJob.id || `job-direct-${Date.now()}`,
    source: newJob.source || 'Direct',
    tags: Array.isArray(newJob.tags) ? newJob.tags : ['AI', 'Junior'],
    requirements: Array.isArray(newJob.requirements) ? newJob.requirements : [],
    simulatorsRecommended: Array.isArray(newJob.simulatorsRecommended) ? newJob.simulatorsRecommended : ['sim-token-cost'],
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: true,
    postedDate: 'Just now',
    applicantCount: 0
  };

  liveJobsDatabase.unshift(sanitized);
  broadcastSSE('new_job', sanitized);

  res.status(201).json({
    message: 'Job published successfully',
    job: sanitized
  });
});

// 3. Purge / Delete Job
app.delete('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  const index = liveJobsDatabase.findIndex((j) => j.id === id);
  if (index !== -1) {
    const purged = liveJobsDatabase.splice(index, 1)[0];
    securityLogsDatabase.unshift({
      id: `sec-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      eventType: 'RBAC_ACCESS_DENIED',
      ipAddress: req.ip || '127.0.0.1',
      severity: 'WARN',
      endpoint: `/api/jobs/${id}`,
      details: `Job ${id} (${purged.title}) permanently purged by administrator.`,
      status: 'BLOCKED'
    });
    return res.json({ message: 'Job purged successfully.' });
  }
  res.status(404).json({ error: 'Job not found.' });
});

// ==========================================
// CANDIDATES & APPLICATIONS APIS
// ==========================================

app.get('/api/candidates', (req, res) => {
  res.json({ candidates: candidatesDatabase });
});

app.get('/api/applications', (req, res) => {
  res.json({ applications: applicationsDatabase });
});

app.post('/api/applications', (req, res) => {
  const { jobId, jobTitle, company, source, location, salaryRange } = req.body;
  const newApp = {
    id: `app-${Date.now()}`,
    jobId: jobId || 'job-custom',
    jobTitle: jobTitle || 'Junior AI Engineer',
    company: company || 'AI Lab',
    source: source || 'Direct',
    location: location || 'Remote',
    appliedDate: new Date().toISOString().split('T')[0],
    salaryRange: salaryRange || '$90,000 - $120,000',
    status: 'Submitted',
    requiredBadges: ['badge-token-economist'],
    matchScore: 95
  };
  applicationsDatabase.unshift(newApp);
  res.status(201).json({ message: 'Application submitted', application: newApp });
});

app.patch('/api/applications/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const appItem = applicationsDatabase.find((a) => a.id === id);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });
  appItem.status = status;
  res.json({ message: 'Status updated', application: appItem });
});

// ==========================================
// MODERATION, ATTESTATIONS & SECURITY LOGS
// ==========================================

app.get('/api/moderation/flags', (req, res) => {
  res.json({ flags: moderationFlagsDatabase });
});

app.patch('/api/moderation/flags/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const flag = moderationFlagsDatabase.find((f) => f.id === id);
  if (!flag) return res.status(404).json({ error: 'Flag not found' });
  flag.status = status;
  res.json({ message: 'Flag status updated', flag });
});

app.get('/api/security/logs', (req, res) => {
  res.json({ logs: securityLogsDatabase });
});

app.get('/api/attestations', (req, res) => {
  res.json({ attestations: attestationsDatabase });
});

app.post('/api/attestations', (req, res) => {
  const { candidateId, candidateName, badgeId, badgeName, verificationCode, score } = req.body;
  const newAttest = {
    id: `attest-${Date.now()}`,
    candidateId: candidateId || 'cand-1',
    candidateName: candidateName || 'Alex Vance',
    badgeId: badgeId || 'badge-token-economist',
    badgeName: badgeName || 'Token & Cost Architect',
    verificationCode: verificationCode || 'VER-TOK-9921-ISO',
    hash: `0x${crypto.randomBytes(32).toString('hex')}`,
    signature: `ed25519:${crypto.randomBytes(16).toString('hex')}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    score: score || 98.0,
    verifiedBy: 'Evaluator Engine v2.4'
  };
  attestationsDatabase.unshift(newAttest);
  res.status(201).json({ message: 'Attestation recorded', attestation: newAttest });
});

// ==========================================
// INGESTION & SSE LIVE STREAM
// ==========================================

app.post('/api/ingest/sync', async (req, res) => {
  const { sources = ['LinkedIn', 'Indeed', 'Wellfound', 'RemoteOK', 'HackerNews'] } = req.body;
  const startTime = Date.now();
  const sourceList = Array.isArray(sources) ? sources : ['LinkedIn', 'Indeed', 'Wellfound'];

  const newlyAdmitted: any[] = [];
  const rejectedLogs: any[] = [];
  let rawHarvestedCount = sourceList.length * 3;
  let rejectedSeniorityCount = sourceList.length;
  let rejectedSalaryCount = sourceList.length;

  for (const src of sourceList) {
    rejectedLogs.push({
      title: `Senior Generative AI Architect (${src})`,
      company: `Frontier Cloud Systems (${src})`,
      source: src,
      reason: 'Disqualified: Demands 6+ yrs experience (Violates ISO entry ceiling of <=2 yrs)'
    });
  }

  totalScannedAllTime += rawHarvestedCount;
  totalRejectedSeniorAllTime += rejectedSeniorityCount;
  totalRejectedNoSalaryAllTime += rejectedSalaryCount;

  const report = {
    id: `sync-srv-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    executionTimeMs: Date.now() - startTime,
    totalRawHarvested: rawHarvestedCount,
    rejectedSeniorityOrExp: rejectedSeniorityCount,
    rejectedMissingCompensation: rejectedSalaryCount,
    rejectedFuzzyDuplicates: 0,
    totalCleanAdmitted: newlyAdmitted.length,
    admittedJobs: newlyAdmitted,
    rejectionSampleLogs: rejectedLogs
  };

  ingestionRunHistory.unshift(report);
  broadcastSSE('sync_report', report);
  res.json(report);
});

app.get('/api/ingest/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Live Ingestion SSE Connected', timestamp: Date.now() })}\n\n`);
  sseClients.push(res);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

app.get('/api/ingest/stats', (req, res) => {
  res.json({
    totalScanned: totalScannedAllTime,
    totalRejectedExp: totalRejectedSeniorAllTime,
    totalRejectedSalary: totalRejectedNoSalaryAllTime,
    totalAdmitted: totalAdmittedAllTime,
    activeJobsInDb: liveJobsDatabase.length,
    activeSSEListeners: sseClients.length,
    recentBatches: ingestionRunHistory.slice(0, 10)
  });
});

// ==========================================
// VITE & STATIC SERVING CONFIGURATION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Junior AI Jobs Live Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
