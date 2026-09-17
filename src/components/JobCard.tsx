import React from 'react';
import { Job } from '../types';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ArrowUpRight,
  Cpu,
  Award
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onLaunchSimulator: (simId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  onToggleSave,
  onSelectJob,
  onLaunchSimulator,
}) => {
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

  const getCompanyMonogram = (company: string = '') => {
    return company ? company.charAt(0).toUpperCase() : 'A';
  };

  const safeTags = job.tags || [];
  const salMinK = Math.round((job.salaryMin || 80000) / 1000);
  const salMaxK = Math.round((job.salaryMax || 120000) / 1000);

  return (
    <div
      id={`job-card-${job.id}`}
      className="bg-[#FBFBFA] p-6 sm:p-7 rounded-3xl border border-[#CCD2D8] shadow-xs hover:border-[#3A7CA5] hover:shadow-md transition-all relative flex flex-col justify-between space-y-4 group select-none"
    >
      {/* Top right badges & bookmark */}
      <div className="absolute top-5 right-5 flex items-center gap-2">
        {job.isNew && (
          <span className="px-2 py-0.5 bg-[#C59B27] text-white text-[10px] font-black rounded-full uppercase shadow-sanctuary-glow border border-[#FAF0D4]/60">
            New
          </span>
        )}
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSourceBadgeStyle(
            job.source
          )}`}
        >
          {job.source || 'Direct'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job.id);
          }}
          className={`p-2 rounded-full border transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
            isSaved
              ? 'bg-[#FAF0D4] border-[#C59B27] text-[#8A6714] shadow-xs'
              : 'border-[#CCD2D8] text-[#6E8193] hover:text-[#C59B27] hover:bg-[#FAF0D4]/40'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#C59B27]" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-3.5 pr-16 sm:pr-20">
        {/* Company and Monogram Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E0EEF5] text-[#3A7CA5] border border-[#C0DDEB] flex items-center justify-center font-black text-sm shrink-0">
            {getCompanyMonogram(job.company)}
          </div>
          <div>
            <span className="text-xs font-bold text-[#6E8193] uppercase tracking-wider block">
              {job.company || 'Direct Employer'}
            </span>
            <div className="flex items-center gap-2 text-xs text-[#6E8193]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#6E8193]" />
                {job.location || 'Remote'}
              </span>
              <span>•</span>
              <span className="px-1.5 py-0.2 rounded bg-[#E5E8EB] font-semibold text-[#2C3E50]">
                {job.remoteType || 'Remote'}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectJob(job)}
          className="text-base sm:text-lg font-black text-[#2C3E50] group-hover:text-[#3A7CA5] transition-colors cursor-pointer line-clamp-1"
        >
          {job.title}
        </h3>

        {/* Highlight Banner: Guaranteed Salary & Strict Junior Max Experience */}
        <div className="grid grid-cols-2 gap-2 bg-[#F4F4F0] p-3 rounded-2xl border border-[#E0E0D5]">
          <div>
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#6E8193]">
              <DollarSign className="w-3 h-3 text-[#8A6714]" />
              <span>Disclosed Pay</span>
            </div>
            <p className="text-xs sm:text-sm font-black text-[#8A6714] font-mono">
              ${salMinK}k - ${salMaxK}k
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold text-[#3A7CA5]">
              <ShieldCheck className="w-3 h-3 text-[#3A7CA5]" />
              <span>Junior Ceiling</span>
            </div>
            <p className="text-xs sm:text-sm font-black text-[#2C3E50]">
              {job.experienceYears === 0.5 ? '0-6 Mos' : job.experienceYears === 1 ? '0-1 Yr' : '≤ 2 Yrs Exp'}
            </p>
          </div>
        </div>

        {/* Brief summary */}
        <p className="text-xs text-[#4A5D70] line-clamp-2 leading-relaxed">
          {job.summary || 'Verified junior-level AI role with hands-on responsibilities.'}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {safeTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[11px] font-semibold bg-[#F4F4F0] text-[#2C3E50] border border-[#CCD2D8]/60 rounded-lg group-hover:border-[#3A7CA5]/50 group-hover:text-[#3A7CA5] transition-colors"
            >
              {tag}
            </span>
          ))}
          {safeTags.length > 3 && (
            <span className="px-2 py-1 text-[10px] font-semibold text-[#6E8193] bg-[#E5E8EB] rounded-lg">
              +{safeTags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#CCD2D8]/60 space-y-2.5">
        {/* Recommended Simulator Hook */}
        {job.simulatorsRecommended && job.simulatorsRecommended.length > 0 && (
          <button
            onClick={() => onLaunchSimulator(job.simulatorsRecommended![0])}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#8A6714] bg-[#FAF0D4] hover:bg-[#F4E0A9] rounded-xl transition-colors border border-[#C59B27]/40 shadow-xs cursor-pointer min-h-[44px]"
          >
            <Cpu className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Test Skills &amp; Earn Sanctuary Gold Badge</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectJob(job)}
            className="py-2.5 px-4 bg-[#F4F4F0] hover:bg-[#E0EEF5] border border-[#CCD2D8] hover:border-[#94C4DC] text-[#2C3E50] hover:text-[#3A7CA5] rounded-xl font-bold text-xs transition-colors min-h-[44px] cursor-pointer"
          >
            Details
          </button>

          <a
            href={job.sourceUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 bg-[#C59B27] hover:bg-[#AA821C] text-white rounded-xl font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 shadow-sanctuary-glow min-h-[44px] cursor-pointer"
          >
            <span>View on {job.source || 'Direct'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
