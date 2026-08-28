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

  const getCompanyMonogram = (company: string) => {
    return company ? company.charAt(0).toUpperCase() : 'A';
  };

  return (
    <div
      id={`job-card-${job.id}`}
      className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-[#8B5CF6] hover:shadow-md transition-all relative flex flex-col justify-between space-y-4 group"
    >
      {/* Top right badges & bookmark */}
      <div className="absolute top-5 right-5 flex items-center gap-2">
        {job.isNew && (
          <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full uppercase shadow-tabernacle-gold border border-amber-300">
            New
          </span>
        )}
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSourceBadgeStyle(
            job.source
          )}`}
        >
          {job.source}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job.id);
          }}
          className={`p-1.5 rounded-xl border transition-colors ${
            isSaved
              ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-xs'
              : 'border-slate-200 text-slate-400 hover:text-[#8B5CF6] hover:bg-purple-50/50'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Header with Monogram */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-3.5 pr-24">
          <div className="w-12 h-12 bg-blue-50 text-[#1D4ED8] rounded-2xl flex items-center justify-center font-black text-lg border border-blue-200 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            {getCompanyMonogram(job.company)}
          </div>
          <div className="min-w-0">
            <h4
              onClick={() => onSelectJob(job)}
              className="font-black text-base md:text-lg text-slate-900 group-hover:text-[#1D4ED8] transition-colors cursor-pointer leading-snug line-clamp-1"
            >
              {job.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium truncate">
              {job.company} • <span className="text-slate-400">{job.location} ({job.remoteType})</span>
            </p>
          </div>
        </div>

        {/* 2-Column Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-slate-200/80">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Salary (Guaranteed)</p>
            <p className="text-sm font-black text-emerald-600 font-mono truncate">
              ${Math.round(job.salaryMin / 1000)}k - ${Math.round(job.salaryMax / 1000)}k
            </p>
          </div>

          <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-200/60">
            <p className="text-[10px] text-[#1D4ED8] uppercase font-bold">Max Experience</p>
            <p className="text-sm font-black text-slate-900 truncate">
              {job.experienceYears === 0.5 ? '0-6 Mos' : job.experienceYears === 1 ? '0-1 Yr' : '≤ 2 Yrs Exp'}
            </p>
          </div>
        </div>

        {/* Brief summary */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {job.summary}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-lg group-hover:bg-purple-50 group-hover:text-[#8B5CF6] transition-colors"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="px-2 py-1 text-[10px] font-semibold text-slate-400 bg-slate-50 rounded-lg">
              +{job.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 space-y-2.5">
        {/* Recommended Simulator Hook */}
        {job.simulatorsRecommended && job.simulatorsRecommended.length > 0 && (
          <button
            onClick={() => onLaunchSimulator(job.simulatorsRecommended![0])}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 rounded-xl transition-colors border border-[#8B5CF6]/20 shadow-2xs"
          >
            <Cpu className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Test Skills &amp; Earn Sacred Gold Badge</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectJob(job)}
            className="py-2.5 px-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-[#1D4ED8] rounded-xl font-bold text-xs transition-colors"
          >
            Details
          </button>

          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 bg-[#8B5CF6] text-white rounded-xl font-bold text-xs text-center hover:bg-[#7C3AED] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>View on {job.source}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

