import React from 'react';
import { BuildLogEntry } from '../types';
import { 
  FileCode, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Cpu, 
  Lock,
  GitBranch,
  Terminal
} from 'lucide-react';

interface BuildLogViewProps {
  entries: BuildLogEntry[];
}

export const BuildLogView: React.FC<BuildLogViewProps> = ({ entries }) => {
  return (
    <div id="living-build-log-view" className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-lg space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold font-mono">
          <GitBranch className="w-3.5 h-3.5 text-blue-400" />
          <span>ISO/IEC/IEEE 29148 Requirements Ledger</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
          Living Build Log & Iteration Tracker
        </h1>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
          Architectural record tracking all engineering milestones, ISO 25010 product quality verifications, and multi-source ingestion pipeline deployments.
        </p>
      </div>

      {/* ISO Quality Standards Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#2563EB]">
            <ShieldCheck className="w-4 h-4" /> ISO/IEC 25010 Compliance
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict runtime verification ensuring zero sub-par listings pass through ingestion boundaries.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#10B981]">
            <Cpu className="w-4 h-4" /> ISO/IEC/IEEE 29148
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unambiguous traceability across requirements, simulator test benches, and candidate badge awards.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#F59E0B]">
            <Lock className="w-4 h-4" /> Domain Occlusion Protocol
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Public records sanitized for domain acquisition and IP protection across all public artifacts.
          </p>
        </div>
      </div>

      {/* Build Log Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-slate-700" />
            <span>Master Release Ledger</span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-400">Current Target: v0.4.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Build Date</th>
                <th className="py-3 px-4">Core Milestone</th>
                <th className="py-3 px-4">Key Deliverables & Changes</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {entries.map((entry) => (
                <tr key={entry.version} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-mono font-extrabold text-blue-600 text-sm">
                    {entry.version}
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-mono">
                    {entry.buildDate}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {entry.milestone}
                  </td>
                  <td className="py-4 px-4 text-slate-600 leading-relaxed max-w-md">
                    {entry.deliverables}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
