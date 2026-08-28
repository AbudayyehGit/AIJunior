import React, { useState } from 'react';
import { IngestionLogEntry } from '../types';
import { 
  Activity, 
  ShieldCheck, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight, 
  RefreshCw,
  Building,
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';

interface IngestionMonitorProps {
  logs: IngestionLogEntry[];
  onSimulateIngest: (rawJob: { title: string; expYears: number; hasSalary: boolean; source: string }) => {
    accepted: boolean;
    reason: string;
  };
}

export const IngestionMonitor: React.FC<IngestionMonitorProps> = ({
  logs,
  onSimulateIngest,
}) => {
  const [testTitle, setTestTitle] = useState('Senior Staff Generative AI Lead');
  const [testExp, setTestExp] = useState(5);
  const [testHasSalary, setTestHasSalary] = useState(false);
  const [testSource, setTestSource] = useState('LinkedIn');
  const [testResult, setTestResult] = useState<{ accepted: boolean; reason: string } | null>(null);

  // Compute aggregate stats
  const totalScanned = logs.reduce((acc, l) => acc + l.rawJobsScanned, 0);
  const totalRejectedExp = logs.reduce((acc, l) => acc + l.rejectedExcessExp, 0);
  const totalRejectedSalary = logs.reduce((acc, l) => acc + l.rejectedNullSalary, 0);
  const totalAccepted = logs.reduce((acc, l) => acc + l.acceptedEntryJobs, 0);

  const handleTestIngest = () => {
    const res = onSimulateIngest({
      title: testTitle,
      expYears: testExp,
      hasSalary: testHasSalary,
      source: testSource,
    });
    setTestResult(res);
  };

  return (
    <div id="ingestion-hygiene-monitor" className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-lg space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-Time Multi-Source Pipeline Hygiene</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
          Automated Anti-Seniority & Salary Filter Engine
        </h1>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
          We continuously ingest feeds from <strong>LinkedIn</strong>, <strong>Wellfound</strong>, and <strong>Indeed</strong>, discarding 92%+ of scraped roles that masquerade as entry-level while demanding 3–5+ years or obfuscating pay.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Raw Ingested */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Raw Jobs Scanned</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalScanned}</div>
          <div className="text-xs text-slate-500">Continuous feed stream</div>
        </div>

        {/* Dropped: >2 Yrs Experience */}
        <div className="bg-rose-50/70 p-6 rounded-3xl border border-rose-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-700">
            <span>Dropped: &gt;2 Yrs Exp</span>
            <Trash2 className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-900 font-mono">{totalRejectedExp}</div>
          <div className="text-xs text-rose-700 font-semibold">
            {((totalRejectedExp / totalScanned) * 100).toFixed(1)}% Noise eliminated
          </div>
        </div>

        {/* Dropped: Null Salary */}
        <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-700">
            <span>Dropped: No Salary</span>
            <AlertOctagon className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-900 font-mono">{totalRejectedSalary}</div>
          <div className="text-xs text-amber-700 font-semibold">
            {((totalRejectedSalary / totalScanned) * 100).toFixed(1)}% Obfuscated pay blocked
          </div>
        </div>

        {/* Clean Entry Accepted */}
        <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800">
            <span>100% Verified Entry</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-950 font-mono">{totalAccepted}</div>
          <div className="text-xs text-emerald-700 font-semibold">
            Strict $\le 2$ yrs &amp; salary verified
          </div>
        </div>
      </div>

      {/* Live Pipeline Telemetry Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Recent Ingestion Batches</h3>
            <p className="text-xs text-slate-500">Real-time health of multi-platform scrapers</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Ingestion Engine Active
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
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
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
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" /> Interactive Rule Validator
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
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
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
              className="w-full accent-blue-600 mt-2"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Salary Disclosed</label>
            <select
              value={testHasSalary ? 'yes' : 'no'}
              onChange={(e) => setTestHasSalary(e.target.value === 'yes')}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
            >
              <option value="no">No Salary Specified (Hidden)</option>
              <option value="yes">Transparent Range Disclosed ($95k-$120k)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Source Scraper</label>
            <select
              value={testSource}
              onChange={(e) => setTestSource(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all"
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
