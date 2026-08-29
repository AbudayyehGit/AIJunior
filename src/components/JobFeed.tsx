import React from 'react';
import { Job, JobSource, RemoteType } from '../types';
import { IngestionSyncReport } from '../services/ingestion';
import { JobCard } from './JobCard';
import { JobCardMobile } from './JobCardMobile';
import { GlobalSearchFilter } from './GlobalSearchFilter';
import { LiveIngestionBar } from './LiveIngestionBar';
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
  onTriggerSync?: () => Promise<void>;
  isSyncing?: boolean;
  lastSyncReport?: IngestionSyncReport | null;
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
  onResetFilters,
  onTriggerSync,
  isSyncing = false,
  lastSyncReport = null
}) => {
  return (
    <div id="job-feed-view" className="space-y-6 animate-in fade-in duration-150">
      {/* Clean Minimalist Header with Generous Padding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FBFBFA] p-6 sm:p-8 rounded-3xl border border-[#CCD2D8] shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C59B27] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#8A6714]">
              Live Real-Time Ingestion Active
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2C3E50]">
            Live Verified Junior AI Pipeline
          </h2>
          <p className="text-[#6E8193] text-sm max-w-2xl">
            Real-time automated intake from LinkedIn, Wellfound, Indeed, RemoteOK, and HackerNews. Strictly enforces ≤ 2 years experience and mandatory salary transparency.
          </p>
        </div>

        {/* Minimal Metric Badges with Sanctuary Gold & Celestial Blue */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-1.5 bg-[#FAF0D4] text-[#8A6714] border border-[#C59B27]/40 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Max Exp: ≤2 Yrs</span>
          </div>
          <div className="px-3.5 py-1.5 bg-[#E0EEF5] text-[#245170] border border-[#94C4DC] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <DollarSign className="w-3.5 h-3.5 text-[#3A7CA5]" />
            <span>100% Disclosed Pay</span>
          </div>
        </div>
      </div>

      {/* Live Ingestion Real-Time Control & Wire Monitor Bar */}
      <LiveIngestionBar
        onManualTrigger={onTriggerSync || (async () => {})}
        isSyncing={isSyncing}
        lastReport={lastSyncReport}
      />

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
        <div className="bg-[#FBFBFA] rounded-3xl border border-[#CCD2D8] p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <Info className="w-12 h-12 text-[#6E8193] mx-auto" />
          <h3 className="text-xl font-bold text-[#2C3E50]">No matching junior roles found</h3>
          <p className="text-sm text-[#6E8193] max-w-md mx-auto">
            Try adjusting your search terms or salary floor. Every role on this board strictly enforces ≤ 2 years of experience.
          </p>
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#AA821C] text-white text-xs font-bold transition-colors shadow-sanctuary-glow"
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

