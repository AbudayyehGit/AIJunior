import React, { useState } from 'react';
import { IngestionLogEntry, Job, JobSource } from '../types';
import { 
  runIngestionPipeline, 
  IngestionSyncReport, 
  ScraperTelemetry 
} from '../services/ingestion';
import { 
  Activity, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  AlertOctagon, 
  RefreshCw,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Radio,
  Server,
  Filter,
  ArrowDownCircle,
  CopyCheck
} from 'lucide-react';

interface IngestionMonitorProps {
  logs: IngestionLogEntry[];
  onSimulateIngest: (rawJob: { title: string; expYears: number; hasSalary: boolean; source: string }) => {
    accepted: boolean;
    reason: string;
  };
  onIngestNewJobs?: (newJobs: Job[]) => void;
}

export const IngestionMonitor: React.FC<IngestionMonitorProps> = ({
  logs,
  onSimulateIngest,
  onIngestNewJobs
}) => {
  const [testTitle, setTestTitle] = useState('Senior Generative AI Research Lead');
  const [testExp, setTestExp] = useState(5);
  const [testHasSalary, setTestHasSalary] = useState(false);
  const [testSource, setTestSource] = useState('LinkedIn');
  const [testResult, setTestResult] = useState<{ accepted: boolean; reason: string } | null>(null);

  // Live Multi-Source Pipeline execution state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncReport, setLastSyncReport] = useState<IngestionSyncReport | null>(null);
  const [activeSources, setActiveSources] = useState<JobSource[]>(['LinkedIn', 'Indeed', 'Wellfound']);

  // Compute aggregate stats
  const totalScanned = logs.reduce((acc, l) => acc + l.rawJobsScanned, 0) + (lastSyncReport?.totalRawHarvested || 0);
  const totalRejectedExp = logs.reduce((acc, l) => acc + l.rejectedExcessExp, 0) + (lastSyncReport?.rejectedSeniorityOrExp || 0);
  const totalRejectedSalary = logs.reduce((acc, l) => acc + l.rejectedNullSalary, 0) + (lastSyncReport?.rejectedMissingCompensation || 0);
  const totalAccepted = logs.reduce((acc, l) => acc + l.acceptedEntryJobs, 0) + (lastSyncReport?.totalCleanAdmitted || 0);
  const totalDeduplicated = lastSyncReport?.rejectedFuzzyDuplicates || 2;

  const handleTestIngest = () => {
    const res = onSimulateIngest({
      title: testTitle,
      expYears: testExp,
      hasSalary: testHasSalary,
      source: testSource,
    });
    setTestResult(res);
  };

  const handleTriggerLiveSync = async () => {
    setIsSyncing(true);
    try {
      const report = await runIngestionPipeline({
        sources: activeSources,
        maxExperienceCap: 2.0,
        enforceMandatorySalary: true
      });
      setLastSyncReport(report);
      if (onIngestNewJobs && report.admittedJobs.length > 0) {
        onIngestNewJobs(report.admittedJobs);
      }
    } catch (err) {
      console.error('Ingestion sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleSource = (source: JobSource) => {
    if (activeSources.includes(source)) {
      if (activeSources.length > 1) {
        setActiveSources(activeSources.filter((s) => s !== source));
      }
    } else {
      setActiveSources([...activeSources, source]);
    }
  };

  return (
    <div id="ingestion-hygiene-monitor" className="space-y-8 animate-fadeIn">
      {/* Header Banner with Sailboat / Purple Accent */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-8 md:p-10 text-white shadow-lg space-y-4 border border-purple-900/30 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>v0.6.0 Automated Ingestion & Scraper Engine</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-200/80 font-semibold hidden sm:inline">Active Scrapers:</span>
              {(['LinkedIn', 'Indeed', 'Wellfound'] as JobSource[]).map((src) => {
                const active = activeSources.includes(src);
                return (
                  <button
                    key={src}
                    onClick={() => toggleSource(src)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      active
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white/10 text-slate-400 hover:bg-white/20'
                    }`}
                  >
                    {src}
                  </button>
                );
              })}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Automated Multi-Source Job Ingestion & Curation Engine
          </h1>
          <p className="text-purple-200/90 text-sm md:text-base leading-relaxed max-w-3xl">
            Continuously harvests, normalizes, and filters feeds from <strong>LinkedIn</strong>, <strong>Wellfound</strong>, and <strong>Indeed</strong>.
            Enforces strict data hygiene by discarding senior titles, &gt;2 yrs requirements, and unlisted compensation before admitting to the candidate feed.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="trigger-live-sync-btn"
              onClick={handleTriggerLiveSync}
              disabled={isSyncing}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-md transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Scraping & Normalizing Feeds...' : 'Trigger Multi-Source Scraper Sync'}</span>
            </button>

            {lastSyncReport && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3.5 py-2.5 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Synchronized {lastSyncReport.totalCleanAdmitted} Clean Roles in {lastSyncReport.executionTimeMs}ms</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Raw Ingested */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Raw Scanned</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalScanned}</div>
          <div className="text-xs text-slate-500">Multi-channel feed stream</div>
        </div>

        {/* Dropped: >2 Yrs Experience */}
        <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-700">
            <span>Dropped: &gt;2 Yrs</span>
            <Trash2 className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-900 font-mono">{totalRejectedExp}</div>
          <div className="text-xs text-rose-700 font-semibold">
            {((totalRejectedExp / Math.max(1, totalScanned)) * 100).toFixed(1)}% Senior noise purged
          </div>
        </div>

        {/* Dropped: Null Salary */}
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-700">
            <span>Dropped: No Salary</span>
            <AlertOctagon className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-900 font-mono">{totalRejectedSalary}</div>
          <div className="text-xs text-amber-700 font-semibold">
            {((totalRejectedSalary / Math.max(1, totalScanned)) * 100).toFixed(1)}% Hidden pay blocked
          </div>
        </div>

        {/* Fuzzy Deduplicated */}
        <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-700">
            <span>Fuzzy Merged</span>
            <CopyCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-indigo-900 font-mono">{totalDeduplicated}</div>
          <div className="text-xs text-indigo-700 font-semibold">Cross-posted deduplication</div>
        </div>

        {/* Clean Entry Accepted */}
        <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800">
            <span>Verified Entry</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-950 font-mono">{totalAccepted}</div>
          <div className="text-xs text-emerald-700 font-semibold">
            Strict $\le 2$ yrs &amp; salary verified
          </div>
        </div>
      </div>

      {/* Live Scraper Connector Telemetry Panel */}
      {lastSyncReport && (
        <div className="bg-white rounded-3xl border border-purple-100 p-6 md:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-600" />
                <span>Active Scraper Telemetry & Proxy Health</span>
              </h3>
              <p className="text-xs text-slate-500">Live network duration, proxy rotation, and status per connector</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
              Pipeline Sync ID: {lastSyncReport.id}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {(['LinkedIn', 'Indeed', 'Wellfound'] as JobSource[]).map((src) => {
              const tel = lastSyncReport.telemetry[src];
              return (
                <div key={src} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">{src} Connector</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      {tel?.status || 'Active'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-mono">
                    <div>Harvested: <strong className="text-slate-900">{tel?.rawFetchedCount || 0}</strong></div>
                    <div>Latency: <strong className="text-slate-900">{tel?.fetchDurationMs || 0}ms</strong></div>
                    <div>Proxy Rotations: <strong className="text-slate-900">{tel?.proxyRotations || 0}</strong></div>
                    <div>Retries: <strong className="text-slate-900">{tel?.networkRetries || 0}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rejection Log Terminal */}
          {lastSyncReport.rejectionSampleLogs.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Sanitization Filter Audit (Dropped Records)</span>
              </div>
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs max-h-48 overflow-y-auto space-y-1.5 border border-slate-800">
                {lastSyncReport.rejectionSampleLogs.map((rej, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">[FILTERED]</span>
                    <span className="text-purple-300 shrink-0">[{rej.source}]</span>
                    <span className="text-slate-300 font-semibold">{rej.title} @ {rej.company}:</span>
                    <span className="text-amber-400/90">{rej.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Pipeline Telemetry Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Ingestion Batch History</h3>
            <p className="text-xs text-slate-500">Historical logs of automated multi-platform runs</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            Workers Online
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Scanned</th>
                <th className="py-3 px-4 text-rose-600">Filtered (&gt;2 Yrs)</th>
                <th className="py-3 px-4 text-amber-600">Filtered (No Salary)</th>
                <th className="py-3 px-4 text-emerald-700">Accepted Entry</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-600 font-sans">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold font-sans">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-100">
                      {log.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-bold">{log.rawJobsScanned}</td>
                  <td className="py-3.5 px-4 text-rose-600 font-bold">-{log.rejectedExcessExp}</td>
                  <td className="py-3.5 px-4 text-amber-600 font-bold">-{log.rejectedNullSalary}</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-extrabold">+{log.acceptedEntryJobs}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Hygiene Validator Playground */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" /> Interactive Rule Validator
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Test Job Intake Against Platform Validation Rules
          </h3>
          <p className="text-xs text-slate-500">
            Simulate how a raw scraper payload is evaluated before being admitted to the candidate feed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Scraped Title</label>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Required Exp: {testExp} Yrs</label>
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={testExp}
              onChange={(e) => setTestExp(Number(e.target.value))}
              className="w-full accent-purple-600 mt-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Salary Disclosed</label>
            <select
              value={testHasSalary ? 'yes' : 'no'}
              onChange={(e) => setTestHasSalary(e.target.value === 'yes')}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
            >
              <option value="no">No Salary Specified (Hidden - Disqualified)</option>
              <option value="yes">Transparent Range Disclosed ($95k-$120k)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Source Scraper</label>
            <select
              value={testSource}
              onChange={(e) => setTestSource(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Wellfound">Wellfound</option>
              <option value="Indeed">Indeed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleTestIngest}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Ingestion Parse</span>
          </button>

          {testResult && (
            <div
              className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                testResult.accepted
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}
            >
              {testResult.accepted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertOctagon className="w-4 h-4 text-rose-600" />
              )}
              <span>{testResult.reason}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
