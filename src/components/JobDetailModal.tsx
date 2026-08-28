import React from 'react';
import { Job } from '../types';
import { 
  X, 
  ShieldCheck, 
  DollarSign, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  Cpu, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onLaunchSimulator: (simId: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  isSaved,
  onToggleSave,
  onLaunchSimulator,
}) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 md:p-8 bg-gradient-to-b from-blue-50/70 to-white border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#2563EB]/10 text-[#2563EB] border border-blue-200">
                Source: {job.source}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{job.experienceDisplay} (Verified)</span>
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {job.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 font-medium pt-1">
              <span className="text-slate-900 font-bold flex items-center gap-1">
                <Building2 className="w-4 h-4 text-slate-500" /> {job.company}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-500" /> {job.location} ({job.remoteType})
              </span>
            </div>
          </div>

          {/* Close & Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(job.id)}
              className={`p-2.5 rounded-2xl border transition-colors ${
                isSaved ? 'bg-blue-50 border-blue-200 text-[#2563EB]' : 'border-slate-200 text-slate-400 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Saved' : 'Save'}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Scroll */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Strict Verification Checklist Card */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Automated Ingestion Quality Seal (ISO/IEC 25010 Standards)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-950 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Experience Ceiling: ≤2 Years</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-950 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Upfront Salary Disclosed</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-950 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Origin Tagged: {job.source}</span>
              </div>
            </div>
          </div>

          {/* Salary Highlight */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Guaranteed Compensation</div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}{' '}
                <span className="text-sm font-normal text-slate-500">USD / {job.salaryPeriod}</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Verified without hidden equity traps or zero-base commission structures.
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900">Role Overview</h4>
            <p className="text-slate-700 leading-relaxed text-sm md:text-base">
              {job.description}
            </p>
          </div>

          {/* Core Requirements */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900">Verified Requirements</h4>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Simulator Banner */}
          {job.simulatorsRecommended && job.simulatorsRecommended.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase">
                  <Cpu className="w-4 h-4 text-emerald-600" /> Stand Out with a Verified Simulator Badge
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  Prove your skills in our interactive sandbox before submitting your application.
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onLaunchSimulator(job.simulatorsRecommended![0]);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-xs flex items-center gap-2 whitespace-nowrap transition-all"
              >
                <span>Launch Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Technology Tags */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Tech Stack & Tags</h4>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Direct-apply routing takes you directly to the original posting on <strong className="text-slate-700">{job.source}</strong>.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md transition-all"
            >
              <span>Apply on {job.source}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
