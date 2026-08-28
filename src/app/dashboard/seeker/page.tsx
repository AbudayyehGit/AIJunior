import React, { useState } from 'react';
import { SkillBadge, JobApplication, CandidateProject } from '../../../types';
import { 
  ShieldCheck, 
  Award, 
  Github, 
  ExternalLink, 
  CheckCircle2, 
  Briefcase, 
  Clock, 
  FileText, 
  Layers, 
  Lock, 
  Key, 
  ArrowUpRight, 
  Zap, 
  Database, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Share2,
  Copy,
  Check
} from 'lucide-react';

interface SeekerDashboardProps {
  onLaunchSimulator?: (simId: string) => void;
  earnedBadges?: SkillBadge[];
  applications?: JobApplication[];
  onUpdateStatus?: (appId: string, newStatus: JobApplication['status']) => void;
}

export default function SeekerDashboard({
  onLaunchSimulator = () => {},
  earnedBadges = [],
  applications = [],
  onUpdateStatus = () => {}
}: SeekerDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'badges' | 'portfolio' | 'applications'>('overview');
  const [selectedBadgeProof, setSelectedBadgeProof] = useState<SkillBadge | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [appFilter, setAppFilter] = useState<string>('ALL');

  // Candidate Portfolio State
  const [projects] = useState<CandidateProject[]>([
    {
      title: 'ContextPruner-LLM',
      desc: 'High-throughput AST and prompt token optimizer achieving 42% token reduction on Llama 3 context windows.',
      url: 'https://github.com/alexvance-ai/ContextPruner-LLM',
      stars: 128,
      stack: ['Python', 'tiktoken', 'FastAPI', 'Gemini Flash']
    },
    {
      title: 'Medical-Hybrid-RAG',
      desc: 'Dual-dense & BM25 hybrid retrieval engine indexing PubMed articles with Cohere re-ranking and sub-50ms latency.',
      url: 'https://github.com/alexvance-ai/Medical-Hybrid-RAG',
      stars: 84,
      stack: ['TypeScript', 'Pinecone', 'LangChain', 'Next.js']
    },
    {
      title: 'PromptShield-Guardrail',
      desc: 'Deterministic regex & semantic defense layer blocking prompt injection, system leak, and PII exfiltration.',
      url: 'https://github.com/alexvance-ai/PromptShield-Guardrail',
      stars: 215,
      stack: ['Python', 'Transformers', 'Ollama', 'Regex']
    }
  ]);

  const [huggingFaceModels] = useState([
    {
      name: 'alexvance/mini-prompt-eval-7b',
      downloads: '1.4k',
      likes: 42,
      task: 'Text Generation / Evaluation',
      updated: '3 days ago'
    },
    {
      name: 'alexvance/rag-chunk-optimizer-embed',
      downloads: '850',
      likes: 19,
      task: 'Feature Extraction / Embeddings',
      updated: '1 week ago'
    }
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const filteredApps = applications.filter((app) => {
    if (appFilter === 'ALL') return true;
    return app.status === appFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Top Banner / Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md ring-4 ring-purple-100">
              AV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Alex Vance</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Verified Entry Candidate
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Junior AI Systems & Prompt Engineer • 1 Year Exp • Target: $95,000 - $125,000 • Open to Remote & Hybrid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onLaunchSimulator('sim-token-cost')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <Zap className="w-4 h-4" />
              Take New Simulator
            </button>
            <a
              href="https://github.com/alexvance-ai"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl border border-slate-200 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Dashboard Sub-navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100 text-sm font-semibold">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'overview'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveSubTab('badges')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'badges'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4 text-purple-600" />
            Attested Badges ({earnedBadges.length})
          </button>
          <button
            onClick={() => setActiveSubTab('portfolio')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'portfolio'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
            }`}
          >
            <Github className="w-4 h-4 text-purple-600" />
            Portfolio & Code Repos
          </button>
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'applications'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4 text-purple-600" />
            Tracked Applications ({applications.length})
          </button>
        </div>
      </div>

      {/* OVERVIEW SUB-TAB */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Earned Badges</span>
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{earnedBadges.length}</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Top 5% Entry</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Cryptographically attested on-chain</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Applications</span>
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{applications.length}</span>
                <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">1 In Screen</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">100% verified entry salary tags</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">GitHub Stargazers</span>
                <Github className="w-5 h-5 text-purple-600" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">427</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+38 this mo</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Across 3 open-source AI tooling repos</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recruiter Inquiries</span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">12</span>
                <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">Direct Inbounds</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Filtered by badge verification</p>
            </div>
          </div>

          {/* Dual Panel: Attested Badges Quick Showcase + Active Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Badges Panel */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Attested Competencies</h2>
                  <p className="text-xs text-slate-500">Tamper-proof verifiable skills badges</p>
                </div>
                <button
                  onClick={() => setActiveSubTab('badges')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  View All ({earnedBadges.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-xs">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{badge.name}</h3>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-md">
                            {badge.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{badge.description}</p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-purple-700">
                          <span>Code: {badge.verificationCode}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBadgeProof(badge)}
                      className="px-3 py-1.5 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold rounded-lg transition-colors shadow-2xs whitespace-nowrap"
                    >
                      Audit Proof
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Pipeline Quick Tracker */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Application Pipeline</h2>
                  <p className="text-xs text-slate-500">Active status across vetted entry positions</p>
                </div>
                <button
                  onClick={() => setActiveSubTab('applications')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  Manage All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-slate-700 border border-slate-200 rounded-md">
                          {app.source}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{app.jobTitle}</h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{app.company} • {app.location}</p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        app.status === 'Recruiter Screen'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : app.status === 'Challenge Passed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {app.status}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1">{app.salaryRange}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BADGES SUB-TAB */}
      {activeSubTab === 'badges' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Cryptographically Attested Skill Badges</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Each badge is minted via assertion test suites, signed with an Ed25519 key, and anchored to an ISO compliance hash.
                </p>
              </div>
              <button
                onClick={() => onLaunchSimulator('sim-token-cost')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-all"
              >
                + Earn Additional Badge
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-white rounded-2xl p-5 border-2 border-purple-200 hover:border-purple-400 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-sm">
                        <Award className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg">
                        {badge.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{badge.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{badge.description}</p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono text-[11px] space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ver Code:</span>
                        <span className="font-bold text-purple-700">{badge.verificationCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Minted:</span>
                        <span>{badge.awardedAt || '2026-08-28'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedBadgeProof(badge)}
                      className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition-colors text-center"
                    >
                      Audit Proof & Signatures
                    </button>
                    <button
                      onClick={() => handleCopy(badge.verificationCode, badge.id)}
                      className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors"
                      title="Copy Verification Code"
                    >
                      {copiedHash === badge.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO SUB-TAB */}
      {activeSubTab === 'portfolio' && (
        <div className="space-y-6">
          {/* GitHub Repositories Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Github className="w-6 h-6 text-slate-900" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Featured Open-Source AI Repositories</h2>
                  <p className="text-xs text-slate-500">Live projects showcasing token optimization, RAG, and guardrails</p>
                </div>
              </div>
              <a
                href="https://github.com/alexvance-ai"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                GitHub Profile <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {projects.map((proj) => (
                <div
                  key={proj.title}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 font-mono">{proj.title}</h3>
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        ★ {proj.stars}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.stack.map((s) => (
                        <span key={s} className="px-2 py-0.5 text-[10px] font-semibold bg-purple-50 text-purple-700 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 pt-3 border-t border-slate-200 text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center justify-between"
                  >
                    <span>Inspect Codebase</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Hugging Face Models & Spaces */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-yellow-500" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Hugging Face Models & Dataset Artifacts</h2>
                  <p className="text-xs text-slate-500">Published checkpoints, evaluation datasets, and space demos</p>
                </div>
              </div>
              <a
                href="https://huggingface.co/alexvance"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-yellow-200"
              >
                Hugging Face Profile <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {huggingFaceModels.map((model) => (
                <div
                  key={model.name}
                  className="p-4 rounded-2xl bg-yellow-50/30 border border-yellow-100 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 font-mono">{model.name}</h3>
                    <p className="text-xs text-slate-500">{model.task} • Updated {model.updated}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-200">
                      ↓ {model.downloads} downloads
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* APPLICATIONS TRACKER SUB-TAB */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Tracked Multi-Source Applications</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Manage applications originating from LinkedIn, Indeed, Wellfound, or Direct Platform drops.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {['ALL', 'Submitted', 'Under Review', 'Recruiter Screen', 'Challenge Passed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setAppFilter(st)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      appFilter === st
                        ? 'bg-white text-purple-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications Table / Cards */}
            <div className="space-y-3 pt-2">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-200 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                        app.source === 'LinkedIn'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : app.source === 'Indeed'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {app.source}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{app.jobTitle}</h3>
                    </div>
                    <p className="text-xs text-slate-600">{app.company} • {app.location} • Applied on {app.appliedDate}</p>
                    {app.notes && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{app.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-bold text-purple-700">{app.salaryRange}</div>
                      <span className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full ${
                        app.status === 'Recruiter Screen'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : app.status === 'Challenge Passed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as any)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Recruiter Screen">Recruiter Screen</option>
                        <option value="Challenge Passed">Challenge Passed</option>
                        <option value="Offer Extended">Offer Extended</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Audit Proof Modal */}
      {selectedBadgeProof && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-600 text-white rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Cryptographic Attestation Proof</h3>
                  <p className="text-xs text-slate-500">{selectedBadgeProof.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBadgeProof(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-bold">Verification ID Code</span>
                <span className="font-bold text-purple-700 text-sm">{selectedBadgeProof.verificationCode}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-bold">Assertion SHA-256 Hash</span>
                <span className="break-all text-slate-800 text-[11px]">
                  0x8f2a4c9b1d3e5f7a9c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-bold">Ed25519 Digital Signature</span>
                <span className="break-all text-purple-800 text-[11px]">
                  ed25519:3b9f8a1c6e4d2a0f8b7c5e3d1a9f7b5c3e1a9f7d5b3c1a9f7d5b3c1a9f7e7d2
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Assertion Standards:</span>
                  <span className="font-semibold text-slate-800">ISO/IEC 29148 Verified</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block">Evaluator Engine:</span>
                  <span className="font-semibold text-slate-800">v2.4 Auto-Runner</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://verify.platform.dev/proof/${selectedBadgeProof.verificationCode}`);
                  handleCopy(selectedBadgeProof.verificationCode, 'modal');
                }}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {copiedHash === 'modal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedHash === 'modal' ? 'Copied Public Proof Link' : 'Copy Public Proof URL'}
              </button>
              <button
                onClick={() => setSelectedBadgeProof(null)}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
