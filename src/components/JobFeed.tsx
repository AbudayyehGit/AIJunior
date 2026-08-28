import React from 'react';
import { Job, JobSource, RemoteType } from '../types';
import { JobCard } from './JobCard';
import { JobCardMobile } from './JobCardMobile';
import { GlobalSearchFilter } from './GlobalSearchFilter';
import { ShieldCheck, DollarSign, Info } from 'lucide-react';

interface JobFeedProps {
  jobs: Job[];
  savedJobIds: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSource: JobSource | 'ALL';
  setSelectedSource: (source: JobSource | 'ALL') => void;
  maxExpFilter: number;
  setMaxExpFilter: (exp: number) => void;
  minSalaryFilter: number;
  setMinSalaryFilter: (sal: number) => void;
  remoteFilter: RemoteType | 'ALL';
  setRemoteFilter: (rem: RemoteType | 'ALL') => void;
  onToggleSaveJob: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onLaunchSimulator: (simulatorId: string) => void;
  onResetFilters: () => void;
}

export const JobFeed: React.FC<JobFeedProps> = ({
  jobs,
  savedJobIds,
  searchQuery,
  setSearchQuery,
  selectedSource,
  setSelectedSource,
  maxExpFilter,
  setMaxExpFilter,
  minSalaryFilter,
  setMinSalaryFilter,
  remoteFilter,
  setRemoteFilter,
  onToggleSaveJob,
  onSelectJob,
  onLaunchSimulator,
  onResetFilters
}) => {
  return (
    <div id="job-feed-view" className="space-y-6 animate-in fade-in duration-150">
      {/* Clean Minimalist Header with Generous Padding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6]">
              Live Verified Junior Pipeline
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Curated Junior AI Roles
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl">
            Showing strictly verified roles with ≤ 2 years experience and transparent salaries across LinkedIn, Wellfound, and Indeed.
          </p>
        </div>

        {/* Minimal Metric Badges with Lightened Purple & Emerald */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-1.5 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Max Exp: ≤2 Yrs</span>
          </div>
          <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Disclosed Pay</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <GlobalSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        maxExpFilter={maxExpFilter}
        setMaxExpFilter={setMaxExpFilter}
        minSalaryFilter={minSalaryFilter}
        setMinSalaryFilter={setMinSalaryFilter}
        remoteFilter={remoteFilter}
        setRemoteFilter={setRemoteFilter}
        totalFilteredCount={jobs.length}
        resetFilters={onResetFilters}
      />

      {/* Empty State */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-2xs">
          <Info className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800">No matching junior roles found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms or salary floor. Every role on this board strictly enforces ≤ 2 years of experience.
          </p>
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold hover:bg-[#7C3AED] transition-colors shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Card Feed (< 768px): Compact, Decluttered, Zero-Overflow */}
          <div id="mobile-jobs-feed" className="grid grid-cols-1 gap-3.5 md:hidden">
            {jobs.map((job) => (
              <JobCardMobile
                key={`mobile-${job.id}`}
                job={job}
                isSaved={savedJobIds.includes(job.id)}
                onToggleSave={onToggleSaveJob}
                onSelectJob={onSelectJob}
                onLaunchSimulator={onLaunchSimulator}
              />
            ))}
          </div>

          {/* Desktop Grid Card Feed (>= 768px): Spacious Bento Grid */}
          <div id="desktop-jobs-feed" className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={`desktop-${job.id}`}
                job={job}
                isSaved={savedJobIds.includes(job.id)}
                onToggleSave={onToggleSaveJob}
                onSelectJob={onSelectJob}
                onLaunchSimulator={onLaunchSimulator}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
