import React from 'react';
import { Job } from '../types';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Bookmark, 
  BookmarkCheck, 
  ArrowUpRight,
  Cpu,
  Sparkles,
  Zap
} from 'lucide-react';

interface JobCardMobileProps {
  job: Job;
  isSaved?: boolean;
  onToggleSave: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onLaunchSimulator?: (simulatorId: string) => void;
}

export const JobCardMobile: React.FC<JobCardMobileProps> = ({
  job,
  isSaved = false,
  onToggleSave,
  onSelectJob,
  onLaunchSimulator
}) => {
  const getCompanyMonogram = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getSourceBadgeStyle = (source: string) => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-blue-50 text-[#1D4ED8] border-blue-200';
      case 'Wellfound':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Indeed':
        return 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      id={`job-card-mobile-${job.id}`}
      className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#8B5CF6] transition-all flex flex-col justify-between space-y-3.5 active:scale-[0.99] group select-none"
    >
      {/* ROW 1: Clean Top Row (Company Monogram, Title, Company Name, Source Badge & Bookmark Action) */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 bg-blue-50 text-[#1D4ED8] rounded-xl flex items-center justify-center font-black text-sm border border-blue-200/70 shrink-0">
            {getCompanyMonogram(job.company)}
          </div>
          <div className="min-w-0">
            <h4
              onClick={() => onSelectJob(job)}
              className="font-black text-sm text-slate-900 line-clamp-1 cursor-pointer hover:text-[#8B5CF6] transition-colors"
            >
              {job.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="truncate max-w-[120px]">{job.company}</span>
              <span>•</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${getSourceBadgeStyle(job.source)}`}>
                {job.source}
              </span>
            </div>
          </div>
        </div>

        <button
          id={`bookmark-btn-mobile-${job.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job.id);
          }}
          className={`p-2 rounded-xl border transition-colors shrink-0 ${
            isSaved
              ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-2xs'
              : 'border-slate-200 text-slate-400 hover:text-[#8B5CF6] hover:bg-purple-50/40'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* ROW 2: Compact Salary Transparency & Location / Max Experience */}
      <div className="grid grid-cols-2 gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold text-slate-400">Guaranteed Pay</span>
          <span className="text-xs font-black text-emerald-600 font-mono">
            ${Math.round(job.salaryMin / 1000)}k - ${Math.round(job.salaryMax / 1000)}k
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] uppercase font-bold text-[#1D4ED8]">Max Experience</span>
          <span className="text-xs font-black text-slate-900">
            {job.experienceYears === 0.5 ? '0-6 Mos' : job.experienceYears === 1 ? '0-1 Yr' : '≤ 2 Yrs'}
          </span>
        </div>
      </div>

      {/* Location & Tags Pill Strip */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1 text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-[130px]">{job.location}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-600">
            {job.remoteType}
          </span>
        </div>
        
        {/* Verification Pill */}
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
          <ShieldCheck className="w-3 h-3 text-[#1D4ED8]" />
          <span>ISO Verified</span>
        </span>
      </div>

      {/* Simulator Hook (if available) */}
      {job.simulatorsRecommended && job.simulatorsRecommended.length > 0 && onLaunchSimulator && (
        <button
          onClick={() => onLaunchSimulator(job.simulatorsRecommended![0])}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 rounded-xl transition-colors border border-[#8B5CF6]/20"
        >
          <Cpu className="w-3 h-3 text-[#8B5CF6]" />
          <span>Earn Simulator Badge</span>
        </button>
      )}

      {/* ROW 3: Bottom Actions (Details + Quick Apply with Lightened Purple #8B5CF6) */}
      <div className="flex items-center gap-2 pt-1">
        <button
          id={`view-details-mobile-${job.id}`}
          onClick={() => onSelectJob(job)}
          className="py-2 px-3.5 bg-slate-50 hover:bg-purple-50/50 border border-slate-200 text-slate-700 hover:text-[#8B5CF6] rounded-xl font-bold text-xs transition-colors min-h-[40px] flex items-center justify-center"
        >
          Details
        </button>
        <a
          id={`quick-apply-mobile-${job.id}`}
          href={job.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow-sm min-h-[40px]"
        >
          <span>Apply on {job.source}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
