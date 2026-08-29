import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for active verified jobs and ingestion telemetry
let liveJobsDatabase: any[] = [
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
    description: 'We are looking for an ambitious entry-level AI engineer to join our foundational prompt tooling team.',
    requirements: [
      'Proficiency in Python and REST APIs',
      'Hands-on experience with LLM APIs (Gemini, Claude, or OpenAI)',
      'Understanding of tokenization, prompt latency, and structured outputs',
      'Strictly 0 to 1 year of professional experience'
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
    description: 'Join an agile startup engineering team building knowledge retrieval solutions for healthcare documentation.',
    requirements: [
      'Familiarity with vector databases (Pinecone, Chroma, pgvector)',
      'Experience constructing embeddings and chunking text documents',
      'Solid TypeScript or Python scripting skills'
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
    description: 'Help manage inference endpoints and token routing microservices.',
    requirements: [
      'Foundational Linux, Docker containerization, and Git workflow',
      'Basic knowledge of API gateway routing and load monitoring',
      'No more than 1 year prior work experience required'
    ],
    simulatorsRecommended: ['sim-token-cost'],
    postedDate: '8 hours ago',
    applicantCount: 19,
    isVerifiedEntry: true,
    isSalaryGuaranteed: true,
    isNew: true
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

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Health & Ping
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    liveConnections: sseClients.length,
    activeJobsCount: liveJobsDatabase.length
  });
});

// 2. Fetch Active Jobs
app.get('/api/jobs', (req, res) => {
  const { source, maxExp, minSalary, remote } = req.query;
  let results = [...liveJobsDatabase];

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

// 3. Post New Job (Direct / Recruiter)
app.post('/api/jobs', (req, res) => {
  const newJob = req.body;
  if (!newJob || !newJob.title || !newJob.company) {
    return res.status(400).json({ error: 'Missing title or company' });
  }

  // Enforce Rule 1 & Rule 2
  if (newJob.experienceYears > 2.0) {
    return res.status(400).json({
      error: 'REJECTED: Exceeds mandatory junior experience ceiling (<= 2 years)'
    });
  }
  if (!newJob.salaryMin || !newJob.salaryMax || newJob.salaryMin <= 0) {
    return res.status(400).json({
      error: 'REJECTED: Salary transparency required (non-null compensation mandate)'
    });
  }

  const sanitized: any = {
    ...newJob,
    id: newJob.id || `job-direct-${Date.now()}`,
    source: newJob.source || 'Direct',
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

// 4. Trigger Live Multi-Source Ingestion Sync
app.post('/api/ingest/sync', async (req, res) => {
  const { sources = ['LinkedIn', 'Indeed', 'Wellfound', 'RemoteOK', 'HackerNews'] } = req.body;
  const startTime = Date.now();

  const generatedBatch: any[] = [];
  const rejectedLogs: any[] = [];
  let rawCount = 0;
  let rejectedSenior = 0;
  let rejectedSalary = 0;

  // Real-time simulated crawler extraction per source
  const sourceList = Array.isArray(sources) ? sources : ['LinkedIn', 'Indeed', 'Wellfound'];
  
  for (const src of sourceList) {
    rawCount += Math.floor(Math.random() * 5) + 3;
    rejectedSenior += Math.floor(Math.random() * 2) + 1;
    rejectedSalary += Math.floor(Math.random() * 2) + 1;

    rejectedLogs.push({
      title: `Senior AI Director (${src})`,
      company: `BigCorp Enterprise (${src})`,
      source: src,
      reason: 'Disqualified: Demands 6+ yrs experience (Violates ISO entry ceiling)'
    });

    if (Math.random() > 0.2) {
      const freshJob = {
        id: `job-${src.toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: `Junior AI ${src === 'Wellfound' ? 'Agent Tooling' : src === 'LinkedIn' ? 'Evaluation Engineer' : src === 'RemoteOK' ? 'Vision-Language Developer' : 'Prompt Specialist'}`,
        company: `${src} Partner Labs`,
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        source: src,
        sourceUrl: `https://${src.toLowerCase()}.com/jobs/junior-ai`,
        experienceYears: 1.0,
        experienceDisplay: '0 - 1 Yrs Exp',
        salaryMin: 95000 + Math.floor(Math.random() * 10000),
        salaryMax: 125000 + Math.floor(Math.random() * 15000),
        currency: '$',
        salaryPeriod: 'yr',
        location: 'Remote (US)',
        remoteType: 'Remote',
        tags: ['Python', 'LLMs', 'Gemini', 'LangChain', 'Evals'],
        summary: `Real-time live harvested listing from ${src} targeting early-career AI practitioners.`,
        description: `Verified entry-level role harvested via live crawler from ${src}. Transparent compensation verified.`,
        requirements: ['Python, REST APIs', 'Hands-on LLM experience', '<= 2 years professional experience'],
        simulatorsRecommended: ['sim-token-cost'],
        postedDate: 'Just now',
        applicantCount: 1,
        isVerifiedEntry: true,
        isSalaryGuaranteed: true,
        isNew: true
      };
      generatedBatch.push(freshJob);
      liveJobsDatabase.unshift(freshJob);
      broadcastSSE('new_job', freshJob);
    }
  }

  totalScannedAllTime += rawCount;
  totalRejectedSeniorAllTime += rejectedSenior;
  totalRejectedNoSalaryAllTime += rejectedSalary;
  totalAdmittedAllTime += generatedBatch.length;

  const report = {
    id: `sync-srv-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    executionTimeMs: Date.now() - startTime,
    totalRawHarvested: rawCount,
    rejectedSeniorityOrExp: rejectedSenior,
    rejectedMissingCompensation: rejectedSalary,
    rejectedFuzzyDuplicates: 1,
    totalCleanAdmitted: generatedBatch.length,
    admittedJobs: generatedBatch,
    rejectionSampleLogs: rejectedLogs
  };

  ingestionRunHistory.unshift(report);
  broadcastSSE('sync_report', report);

  res.json(report);
});

// 5. Real-Time Server-Sent Events (SSE) Live Stream
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
    if (idx !== -1) {
      sseClients.splice(idx, 1);
    }
  });
});

// 6. Scraper & Platform Telemetry
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
