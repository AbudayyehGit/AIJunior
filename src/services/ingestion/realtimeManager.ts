import { Job, JobSource } from '../../types';
import { runIngestionPipeline, IngestionSyncReport } from './index';

export type IngestionStatus = 'CONNECTED' | 'SYNCING' | 'PAUSED' | 'IDLE';

export interface IngestionTelemetryEvent {
  status: IngestionStatus;
  lastSyncReport: IngestionSyncReport | null;
  nextSyncCountdownSec: number;
  totalHarvestedSession: number;
  totalAdmittedSession: number;
  activeSources: JobSource[];
}

export type AdmittedJobsListener = (newJobs: Job[], report: IngestionSyncReport) => void;
export type TelemetryListener = (event: IngestionTelemetryEvent) => void;

/**
 * Dynamic pool of live emerging junior AI roles for real-time rotating continuous intake
 */
const LIVE_CANDIDATE_AI_ROLES: Partial<Job>[] = [
  {
    title: 'Junior Agent Tooling & Schema Engineer',
    company: 'Nexus Reasoning AI',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    source: 'Wellfound',
    sourceUrl: 'https://wellfound.com/jobs/nexus-agent-tooling',
    experienceYears: 1.0,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 105000,
    salaryMax: 130000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'San Francisco, CA / Remote',
    remoteType: 'Remote',
    tags: ['ReAct', 'TypeScript', 'Tool Calling', 'Gemini API', 'JSON Schema'],
    summary: 'Build typed tool interfaces, schema validators, and autonomous agent loops for customer research.',
    description: 'We are seeking an early-career engineer to write deterministic tool wrappers, parameter schema validators, and replay harnesses for autonomous agent workflows.',
    requirements: ['Solid TypeScript and Python', 'Understanding of ReAct and structured function calls', 'Strictly <= 1 year experience or portfolio'],
    simulatorsRecommended: ['sim-token-cost', 'sim-prompt-guard']
  },
  {
    title: 'Associate Model Evaluation & Red Teaming Specialist',
    company: 'GuardRail Intelligence',
    companyLogo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80',
    source: 'LinkedIn',
    sourceUrl: 'https://linkedin.com/jobs/view/associate-model-eval-guardrail',
    experienceYears: 0.5,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 92000,
    salaryMax: 115000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'New York, NY',
    remoteType: 'Hybrid',
    tags: ['Prompt Injection', 'Safety Guardrails', 'Evals', 'Python', 'Red Teaming'],
    summary: 'Test enterprise LLM pipelines against jailbreaks, extraction vectors, and hallucination loops.',
    description: 'Assist our security team in designing automated regression suites that stress test LLM prompts against prompt leakage, delimiter bypasses, and unauthorized system prompt overrides.',
    requirements: ['Curiosity for AI vulnerabilities & safety', 'Python scripting for automated benchmarks', 'Entry-level or fresh grad'],
    simulatorsRecommended: ['sim-prompt-guard']
  },
  {
    title: 'Junior Vector Index & Semantic Retrieval Engineer',
    company: 'PineScale Data',
    companyLogo: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=120&auto=format&fit=crop&q=80',
    source: 'Indeed',
    sourceUrl: 'https://indeed.com/viewjob?jk=pinescale-vector-junior',
    experienceYears: 1.5,
    experienceDisplay: '1 - 2 Yrs Exp',
    salaryMin: 98000,
    salaryMax: 125000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'Austin, TX',
    remoteType: 'Hybrid',
    tags: ['RAG', 'Pinecone', 'Embeddings', 'Chunking', 'FastAPI'],
    summary: 'Optimize document chunking topologies, hybrid lexical/vector search, and retrieval latencies.',
    description: 'Help benchmark dense vs sparse embeddings on legal and financial corpora. Tune chunk overlap and sliding window contexts for LLM synthesis.',
    requirements: ['Hands-on experience with vector databases', 'Python or Node.js background', '<= 2 years prior experience'],
    simulatorsRecommended: ['sim-rag-config']
  },
  {
    title: 'Junior LLM Inference & Token Optimization Specialist',
    company: 'QuantFast Systems',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    source: 'RemoteOK',
    sourceUrl: 'https://remoteok.com/remote-jobs/quantfast-token-opt',
    experienceYears: 1.0,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 110000,
    salaryMax: 135000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'Remote (US/Canada)',
    remoteType: 'Remote',
    tags: ['vLLM', 'Token Economy', 'Quantization', 'FastAPI', 'Inference Ops'],
    summary: 'Profile Time-to-First-Token (TTFT), optimize KV-cache memory, and prune unnecessary prompt context.',
    description: 'Work with our inference team to minimize enterprise token consumption across Gemini and open-weight models. Build real-time latency monitors.',
    requirements: ['Familiarity with token budget calculation', 'Python & Docker', '0-1.5 years experience'],
    simulatorsRecommended: ['sim-token-cost']
  },
  {
    title: 'Entry-Level Synthetic Data & Fine-Tuning Associate',
    company: 'Synthetix Foundational AI',
    companyLogo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    source: 'HackerNews',
    sourceUrl: 'https://news.ycombinator.com/item?id=43900222',
    experienceYears: 0.5,
    experienceDisplay: '0 - 1 Yrs Exp',
    salaryMin: 96000,
    salaryMax: 120000,
    currency: '$',
    salaryPeriod: 'yr',
    location: 'Remote',
    remoteType: 'Remote',
    tags: ['Synthetic Data', 'JSONL', 'Fine-Tuning', 'HuggingFace', 'PyTorch'],
    summary: 'Generate high-fidelity synthetic task pairs and format instruction datasets for domain fine-tuning.',
    description: 'Join our data generation team. Clean instruction-tuning datasets, filter low-entropy responses, and validate model alignment scores.',
    requirements: ['Python, Pandas, JSONL data wrangling', 'Demonstrated hobby projects with LLMs', 'No minimum prior corporate experience required'],
    simulatorsRecommended: ['sim-token-cost', 'sim-rag-config']
  }
];

/**
 * RealTimeIngestionEngine
 * Manages live real-time continuous ingestion, auto-polling schedules,
 * worker telemetry, and instant broadcast of newly admitted junior AI roles.
 */
class RealTimeIngestionEngine {
  private activeSources: JobSource[] = ['LinkedIn', 'Indeed', 'Wellfound', 'RemoteOK', 'HackerNews'];
  private isAutoSyncActive: boolean = true;
  private syncIntervalSec: number = 30;
  private countdownSec: number = 30;
  private intervalTimer: NodeJS.Timeout | null = null;
  private countdownTimer: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;
  private status: IngestionStatus = 'CONNECTED';
  private lastReport: IngestionSyncReport | null = null;
  private totalHarvestedSession: number = 0;
  private totalAdmittedSession: number = 0;
  private dynamicIndex: number = 0;

  private admittedListeners: Set<AdmittedJobsListener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();

  constructor() {
    this.startCountdown();
  }

  public getActiveSources(): JobSource[] {
    return [...this.activeSources];
  }

  public setActiveSources(sources: JobSource[]) {
    this.activeSources = sources.length > 0 ? sources : ['LinkedIn'];
    this.broadcastTelemetry();
  }

  public toggleSource(source: JobSource) {
    if (this.activeSources.includes(source)) {
      if (this.activeSources.length > 1) {
        this.activeSources = this.activeSources.filter((s) => s !== source);
      }
    } else {
      this.activeSources = [...this.activeSources, source];
    }
    this.broadcastTelemetry();
  }

  public setAutoSync(active: boolean, intervalSeconds: number = 30) {
    this.isAutoSyncActive = active;
    this.syncIntervalSec = intervalSeconds;
    this.countdownSec = intervalSeconds;
    this.status = active ? 'CONNECTED' : 'PAUSED';

    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }

    if (active) {
      this.intervalTimer = setInterval(() => {
        this.triggerLiveIngest();
      }, this.syncIntervalSec * 1000);
    }

    this.broadcastTelemetry();
  }

  public isAutoSync(): boolean {
    return this.isAutoSyncActive;
  }

  public getSyncInterval(): number {
    return this.syncIntervalSec;
  }

  public getStatus(): IngestionStatus {
    return this.status;
  }

  public subscribeAdmittedJobs(listener: AdmittedJobsListener): () => void {
    this.admittedListeners.add(listener);
    return () => this.admittedListeners.delete(listener);
  }

  public subscribeTelemetry(listener: TelemetryListener): () => void {
    this.telemetryListeners.add(listener);
    // Send immediate initial state
    listener(this.getTelemetrySnapshot());
    return () => this.telemetryListeners.delete(listener);
  }

  public getTelemetrySnapshot(): IngestionTelemetryEvent {
    return {
      status: this.status,
      lastSyncReport: this.lastReport,
      nextSyncCountdownSec: this.countdownSec,
      totalHarvestedSession: this.totalHarvestedSession,
      totalAdmittedSession: this.totalAdmittedSession,
      activeSources: [...this.activeSources]
    };
  }

  /**
   * Trigger an immediate live multi-source ingestion run
   */
  public async triggerLiveIngest(): Promise<IngestionSyncReport> {
    if (this.isSyncing) {
      return this.lastReport || (await this.buildEmptyReport());
    }

    this.isSyncing = true;
    this.status = 'SYNCING';
    this.countdownSec = this.syncIntervalSec;
    this.broadcastTelemetry();

    try {
      const report = await runIngestionPipeline({
        sources: this.activeSources,
        maxExperienceCap: 2.0,
        enforceMandatorySalary: true
      });

      // Inject a rotating live emerging junior role to simulate fresh live stream discoveries
      if (Math.random() > 0.15 && this.activeSources.length > 0) {
        const template = LIVE_CANDIDATE_AI_ROLES[this.dynamicIndex % LIVE_CANDIDATE_AI_ROLES.length];
        this.dynamicIndex++;

        // Only inject if the source is active
        if (template.source && this.activeSources.includes(template.source)) {
          const liveJob: Job = {
            id: `job-live-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title: template.title!,
            company: template.company!,
            companyLogo: template.companyLogo,
            source: template.source!,
            sourceUrl: template.sourceUrl!,
            experienceYears: template.experienceYears || 1.0,
            experienceDisplay: template.experienceDisplay || '0 - 1 Yrs Exp',
            salaryMin: template.salaryMin || 95000,
            salaryMax: template.salaryMax || 125000,
            currency: '$',
            salaryPeriod: 'yr',
            location: template.location || 'Remote',
            remoteType: template.remoteType || 'Remote',
            tags: template.tags || ['AI', 'Python'],
            summary: template.summary!,
            description: template.description!,
            requirements: template.requirements || ['Strictly <= 2 years experience'],
            simulatorsRecommended: template.simulatorsRecommended || ['sim-token-cost'],
            postedDate: 'Just now',
            applicantCount: 1,
            isVerifiedEntry: true,
            isSalaryGuaranteed: true,
            isNew: true
          };

          report.admittedJobs.unshift(liveJob);
          report.totalCleanAdmitted++;
          report.totalRawHarvested++;
        }
      }

      this.lastReport = report;
      this.totalHarvestedSession += report.totalRawHarvested;
      this.totalAdmittedSession += report.totalCleanAdmitted;
      this.status = this.isAutoSyncActive ? 'CONNECTED' : 'IDLE';

      // Notify all subscribers of newly admitted jobs
      if (report.admittedJobs.length > 0) {
        this.admittedListeners.forEach((listener) => {
          try {
            listener(report.admittedJobs, report);
          } catch (e) {
            console.error('Error in admitted listener:', e);
          }
        });
      }

      this.broadcastTelemetry();
      return report;
    } catch (err) {
      console.error('Live ingestion run failed:', err);
      this.status = 'IDLE';
      this.broadcastTelemetry();
      throw err;
    } finally {
      this.isSyncing = false;
    }
  }

  private startCountdown() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = setInterval(() => {
      if (this.isAutoSyncActive && !this.isSyncing) {
        this.countdownSec = Math.max(0, this.countdownSec - 1);
        if (this.countdownSec === 0) {
          this.countdownSec = this.syncIntervalSec;
          this.triggerLiveIngest();
        } else {
          this.broadcastTelemetry();
        }
      }
    }, 1000);
  }

  private broadcastTelemetry() {
    const snapshot = this.getTelemetrySnapshot();
    this.telemetryListeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (e) {
        console.error('Error in telemetry listener:', e);
      }
    });
  }

  private async buildEmptyReport(): Promise<IngestionSyncReport> {
    return {
      id: `sync-empty-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      executionTimeMs: 0,
      telemetry: {} as any,
      totalRawHarvested: 0,
      rejectedSeniorityOrExp: 0,
      rejectedMissingCompensation: 0,
      rejectedFuzzyDuplicates: 0,
      totalCleanAdmitted: 0,
      admittedJobs: [],
      rejectionSampleLogs: []
    };
  }
}

export const realTimeIngestion = new RealTimeIngestionEngine();
