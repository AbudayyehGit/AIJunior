import React from 'react';
import { Search, SlidersHorizontal, X, DollarSign, Clock, Building, Sparkles } from 'lucide-react';
import { JobSource, RemoteType } from '../types';

interface GlobalSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSource: JobSource | 'ALL';
  setSelectedSource: (s: JobSource | 'ALL') => void;
  maxExpFilter: number;
  setMaxExpFilter: (exp: number) => void;
  minSalaryFilter: number;
  setMinSalaryFilter: (sal: number) => void;
  remoteFilter: RemoteType | 'ALL';
  setRemoteFilter: (r: RemoteType | 'ALL') => void;
  totalFilteredCount: number;
  resetFilters: () => void;
}

export const GlobalSearchFilter: React.FC<GlobalSearchFilterProps> = ({
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
  totalFilteredCount,
  resetFilters
}) => {
  const isFiltered =
    searchQuery !== '' ||
    selectedSource !== 'ALL' ||
    maxExpFilter < 2 ||
    minSalaryFilter > 70000 ||
    remoteFilter !== 'ALL';

  return (
    <div id="global-search-filter-card" className="w-full space-y-4">
      {/* Pill-Shaped Global Search Input & Channels with Celestial & Sanctuary Accent */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Main Search Pill */}
        <div className="relative w-full max-w-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A7CA5] pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="job-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI Engineer roles, RAG specialists, Python, Junior ML..."
            className="w-full pl-12 pr-10 py-3.5 bg-[#FBFBFA] border border-[#C0DDEB] rounded-full shadow-xs focus:ring-2 focus:ring-[#3A7CA5] focus:border-[#3A7CA5] focus:outline-none text-sm md:text-base text-[#2C3E50] placeholder:text-[#6E8193] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E8193] hover:text-[#C0392B]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Channels Switcher with Sanctuary Gold active selection */}
        <div className="flex items-center gap-1.5 bg-[#F4F4F0] p-1 rounded-full border border-[#E0E0D5] overflow-x-auto w-full md:w-auto">
          {(['ALL', 'LinkedIn', 'Wellfound', 'Indeed', 'RemoteOK', 'HackerNews'] as const).map((source) => {
            const isSelected = selectedSource === source;
            return (
              <button
                key={source}
                id={`filter-source-${source.toLowerCase()}`}
                onClick={() => setSelectedSource(source)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#C59B27] text-white shadow-xs'
                    : 'text-[#2C3E50] hover:text-[#3A7CA5]'
                }`}
              >
                {source === 'ALL' ? 'All Channels' : source}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Constraint Filter Badges */}
      <div className="flex flex-wrap gap-2 items-center text-xs font-semibold text-[#4A5D70]">
        <button
          onClick={() => setMaxExpFilter(maxExpFilter === 1 ? 2 : 1)}
          className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
            maxExpFilter <= 1
              ? 'bg-[#FAF0D4] text-[#8A6714] border-[#C59B27]/40 font-bold'
              : 'bg-[#FBFBFA] border-[#CCD2D8] text-[#2C3E50] hover:border-[#3A7CA5]/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>Verified Entry-Level ({maxExpFilter <= 1 ? '≤1 yr' : '≤2 yrs'})</span>
        </button>

        <button
          onClick={() => setMinSalaryFilter(minSalaryFilter === 70000 ? 90000 : minSalaryFilter === 90000 ? 110000 : 70000)}
          className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
            minSalaryFilter > 70000
              ? 'bg-[#FAF0D4] text-[#8A6714] border-[#C59B27]/40 font-bold'
              : 'bg-[#FBFBFA] border-[#CCD2D8] text-[#2C3E50] hover:border-[#3A7CA5]/60'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>Salary: ${Math.round(minSalaryFilter / 1000)}k+</span>
        </button>

        <button
          onClick={() => setRemoteFilter(remoteFilter === 'Remote' ? 'ALL' : 'Remote')}
          className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
            remoteFilter === 'Remote'
              ? 'bg-[#E0EEF5] text-[#1C3E56] border-[#3A7CA5]/40 font-bold'
              : 'bg-[#FBFBFA] border-[#CCD2D8] text-[#2C3E50] hover:border-[#3A7CA5]/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#3A7CA5]" />
          <span>{remoteFilter === 'Remote' ? 'Remote Only' : 'Full Remote / Hybrid'}</span>
        </button>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 text-xs text-[#C0392B] hover:underline flex items-center gap-1 font-bold"
          >
            <X className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}

        <span className="ml-auto text-xs text-[#4A5D70] font-semibold">
          {totalFilteredCount} Verified Junior Roles
        </span>
      </div>
    </div>
  );
};

