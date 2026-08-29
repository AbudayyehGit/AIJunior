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
      <div className="bg-[#245170] rounded-3xl p-8 md:p-10 text-white shadow-lg space-y-4 border border-[#64A7CC]/40">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C3E56] text-[#FAF0D4] border border-[#64A7CC]/40 text-xs font-bold font-mono">
          <GitBranch className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>ISO/IEC/IEEE 29148 Requirements Ledger</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
          Living Build Log & Iteration Tracker
        </h1>
        <p className="text-[#E0EEF5] text-sm md:text-base leading-relaxed max-w-3xl">
          Architectural record tracking all engineering milestones, ISO 25010 product quality verifications, and multi-source ingestion pipeline deployments.
        </p>
      </div>

      {/* ISO Quality Standards Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FBFBFA] p-6 rounded-3xl border border-[#CCD2D8] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#3A7CA5]">
            <ShieldCheck className="w-4 h-4 text-[#3A7CA5]" /> ISO/IEC 25010 Compliance
          </div>
          <p className="text-xs text-[#4A5D70] leading-relaxed">
            Strict runtime verification ensuring zero sub-par listings pass through ingestion boundaries.
          </p>
        </div>

        <div className="bg-[#FBFBFA] p-6 rounded-3xl border border-[#CCD2D8] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#8A6714]">
            <Cpu className="w-4 h-4 text-[#C59B27]" /> ISO/IEC/IEEE 29148
          </div>
          <p className="text-xs text-[#4A5D70] leading-relaxed">
            Unambiguous traceability across requirements, simulator test benches, and candidate badge awards.
          </p>
        </div>

        <div className="bg-[#FBFBFA] p-6 rounded-3xl border border-[#CCD2D8] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#2C3E50]">
            <Lock className="w-4 h-4 text-[#3A7CA5]" /> Domain Occlusion Protocol
          </div>
          <p className="text-xs text-[#4A5D70] leading-relaxed">
            Public records sanitized for domain acquisition and IP protection across all public artifacts.
          </p>
        </div>
      </div>

      {/* Build Log Ledger Table */}
      <div className="bg-[#FBFBFA] rounded-3xl border border-[#CCD2D8] p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-[#2C3E50] flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#3A7CA5]" />
            <span>Master Release Ledger</span>
          </h3>
          <span className="text-xs font-mono font-bold text-[#6E8193]">Current Target: v0.4.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F4F0] text-[#6E8193] uppercase tracking-wider font-bold border-y border-[#CCD2D8]">
              <tr>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Build Date</th>
                <th className="py-3 px-4">Core Milestone</th>
                <th className="py-3 px-4">Key Deliverables & Changes</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CCD2D8]/60 font-sans">
              {entries.map((entry) => (
                <tr key={entry.version} className="hover:bg-[#F4F4F0]/80 transition-colors">
                  <td className="py-4 px-4 font-mono font-black text-[#3A7CA5] text-sm">
                    {entry.version}
                  </td>
                  <td className="py-4 px-4 text-[#6E8193] font-mono">
                    {entry.buildDate}
                  </td>
                  <td className="py-4 px-4 font-bold text-[#2C3E50]">
                    {entry.milestone}
                  </td>
                  <td className="py-4 px-4 text-[#4A5D70] leading-relaxed max-w-md">
                    {entry.deliverables}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF0D4] text-[#8A6714] border border-[#C59B27]/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
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

