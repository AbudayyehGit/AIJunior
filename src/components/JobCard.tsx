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
  Cpu
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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Wellfound':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Indeed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
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
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-500 transition-colors relative flex flex-col justify-between space-y-4 group"
    >
      {/* Top right badges & bookmark */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {job.isNew && (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">
            New
          </span>
        )}
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSourceBadgeStyle(
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
          className={`p-1.5 rounded-lg border transition-colors ${
            isSaved
              ? 'bg-purple-50 border-purple-200 text-purple-600'
              : 'border-slate-200 text-slate-400 hover:text-purple-600 hover:bg-purple-50/50'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Header with Monogram */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-3.5 pr-24">
          <div className="w-12 h-12 bg-purple-50/80 rounded-xl flex items-center justify-center font-bold text-purple-700 text-lg border border-purple-100 shrink-0">
            {getCompanyMonogram(job.company)}
          </div>
          <div className="min-w-0">
            <h4
              onClick={() => onSelectJob(job)}
              className="font-bold text-base md:text-lg text-[#1E293B] group-hover:text-purple-600 transition-colors cursor-pointer leading-snug line-clamp-1"
            >
              {job.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium truncate">
              {job.company} • <span className="text-slate-400">{job.location} ({job.remoteType})</span>
            </p>
          </div>
        </div>

        {/* 2-Column Stats Grid (Clean Minimalism Pattern) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Salary</p>
            <p className="text-sm font-bold text-[#10B981] font-mono truncate">
              ${Math.round(job.salaryMin / 1000)}k - ${Math.round(job.salaryMax / 1000)}k
            </p>
          </div>

          <div className="bg-purple-50/50 p-2.5 rounded-lg border border-purple-100/60">
            <p className="text-[10px] text-purple-600 uppercase font-bold">Experience</p>
            <p className="text-sm font-bold text-purple-950 truncate">
              {job.experienceYears === 0.5 ? '0-6 Mos' : job.experienceYears === 1 ? '0-1 Yr' : '≤ 2 Yrs'}
            </p>
          </div>
        </div>

        {/* Brief summary */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {job.summary}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md group-hover:bg-purple-50 group-hover:text-purple-700 transition-colors"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              +{job.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {/* Recommended Simulator Hook */}
        {job.simulatorsRecommended && job.simulatorsRecommended.length > 0 && (
          <button
            onClick={() => onLaunchSimulator(job.simulatorsRecommended![0])}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
          >
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>Test Skills & Earn Badge</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectJob(job)}
            className="py-2.5 px-4 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-slate-700 hover:text-purple-700 rounded-xl font-bold text-xs transition-colors"
          >
            Details
          </button>

          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 bg-purple-600 text-white rounded-xl font-bold text-xs text-center hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>View on {job.source}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
