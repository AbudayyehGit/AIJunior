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
  const getCompanyMonogram = (name: string = '') => {
    return (name || 'AI').substring(0, 2).toUpperCase();
  };

  const getSourceBadgeStyle = (source: string = '') => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-[#E0EEF5] text-[#245170] border-[#94C4DC]';
      case 'Wellfound':
        return 'bg-[#FAF0D4] text-[#8A6714] border-[#F4E0A9]';
      case 'Indeed':
        return 'bg-[#E0EEF5] text-[#3A7CA5] border-[#C0DDEB]';
      case 'RemoteOK':
        return 'bg-[#FAF0D4] text-[#694E0F] border-[#ECCC78]';
      case 'HackerNews':
        return 'bg-[#FDF2F1] text-[#C0392B] border-[#F6CAC5]';
      default:
        return 'bg-[#F4F4F0] text-[#2C3E50] border-[#CCD2D8]';
    }
  };

  const salMinK = Math.round((job.salaryMin || 80000) / 1000);
  const salMaxK = Math.round((job.salaryMax || 120000) / 1000);

  return (
    <div
      id={`job-card-mobile-${job.id}`}
      className="bg-[#FBFBFA] px-4 py-3.5 rounded-2xl border border-[#CCD2D8] shadow-xs hover:border-[#3A7CA5] transition-all flex flex-col justify-between space-y-3 active:scale-[0.99] group select-none"
    >
      {/* ROW 1: Clean Top Row (Company Monogram, Title, Company Name, Source Badge & Bookmark Action) */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 bg-[#E0EEF5] text-[#3A7CA5] rounded-xl flex items-center justify-center font-black text-sm border border-[#C0DDEB] shrink-0">
            {getCompanyMonogram(job.company)}
          </div>
          <div className="min-w-0">
            <h4
              onClick={() => onSelectJob(job)}
              className="font-black text-sm text-[#2C3E50] line-clamp-1 cursor-pointer hover:text-[#3A7CA5] transition-colors"
            >
              {job.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-[#6E8193] font-medium">
              <span className="truncate max-w-[120px]">{job.company || 'Direct Employer'}</span>
              <span>•</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${getSourceBadgeStyle(job.source)}`}>
                {job.source || 'Direct'}
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
          className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border transition-colors shrink-0 flex items-center justify-center cursor-pointer ${
            isSaved
              ? 'bg-[#FAF0D4] border-[#C59B27] text-[#8A6714] shadow-xs'
              : 'border-[#CCD2D8] text-[#6E8193] hover:text-[#C59B27] hover:bg-[#FAF0D4]/40'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#C59B27]" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* ROW 2: Compact Salary Transparency & Location / Max Experience */}
      <div className="grid grid-cols-2 gap-2 bg-[#F4F4F0] p-2.5 rounded-xl border border-[#E0E0D5]">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold text-[#6E8193]">Guaranteed Pay</span>
          <span className="text-xs font-black text-[#8A6714] font-mono">
            ${salMinK}k - ${salMaxK}k
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] uppercase font-bold text-[#3A7CA5]">Max Experience</span>
          <span className="text-xs font-black text-[#2C3E50]">
            {job.experienceYears === 0.5 ? '0-6 Mos' : job.experienceYears === 1 ? '0-1 Yr' : '≤ 2 Yrs'}
          </span>
        </div>
      </div>

      {/* Location & Tags Pill Strip */}
      <div className="flex items-center justify-between text-xs text-[#6E8193]">
        <div className="flex items-center gap-1 text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-[#6E8193] shrink-0" />
          <span className="truncate max-w-[130px]">{job.location || 'Remote'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E5E8EB] font-semibold text-[#2C3E50]">
            {job.remoteType || 'Remote'}
          </span>
        </div>
        
        {/* Verification Pill */}
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#245170] bg-[#E0EEF5] px-2 py-0.5 rounded-full border border-[#C0DDEB]">
          <ShieldCheck className="w-3 h-3 text-[#3A7CA5]" />
          <span>ISO Verified</span>
        </span>
      </div>

      {/* Simulator Hook (if available) */}
      {job.simulatorsRecommended && job.simulatorsRecommended.length > 0 && onLaunchSimulator && (
        <button
          onClick={() => onLaunchSimulator(job.simulatorsRecommended![0])}
          className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#8A6714] bg-[#FAF0D4] hover:bg-[#F4E0A9] rounded-xl transition-colors border border-[#C59B27]/40 cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>Earn Sanctuary Competency Badge</span>
        </button>
      )}

      {/* ROW 3: Bottom Actions (Details + Quick Apply with Sanctuary Gold #C59B27) */}
      <div className="flex items-center gap-2 pt-0.5">
        <button
          id={`view-details-mobile-${job.id}`}
          onClick={() => onSelectJob(job)}
          className="py-2.5 px-4 bg-[#F4F4F0] hover:bg-[#E0EEF5] border border-[#CCD2D8] text-[#2C3E50] hover:text-[#3A7CA5] rounded-xl font-bold text-xs transition-colors min-h-[44px] flex items-center justify-center cursor-pointer"
        >
          Details
        </button>
        <a
          id={`quick-apply-mobile-${job.id}`}
          href={job.sourceUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-4 bg-[#C59B27] hover:bg-[#AA821C] active:bg-[#8F6D17] text-white rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow-sanctuary-glow min-h-[44px] cursor-pointer"
        >
          <span>Apply on {job.source || 'Direct'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
