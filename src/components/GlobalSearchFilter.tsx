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
      {/* Pill-Shaped Global Search Input & Channels with Purple Accent */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Main Search Pill */}
        <div className="relative w-full max-w-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="job-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI Engineer roles, RAG specialists, Python..."
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-full shadow-xs focus:ring-2 focus:ring-purple-600 focus:border-purple-600 focus:outline-none text-sm md:text-base text-slate-900 placeholder:text-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Channels Switcher */}
        <div className="flex items-center gap-1.5 bg-purple-50/60 p-1 rounded-full border border-purple-100 overflow-x-auto w-full md:w-auto">
          {(['ALL', 'LinkedIn', 'Wellfound', 'Indeed'] as const).map((source) => {
            const isSelected = selectedSource === source;
            return (
              <button
                key={source}
                id={`filter-source-${source.toLowerCase()}`}
                onClick={() => setSelectedSource(source)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                {source === 'ALL' ? 'All Channels' : source}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Constraint Filter Badges */}
      <div className="flex flex-wrap gap-2 items-center text-xs font-medium text-slate-500">
        <button
          onClick={() => setMaxExpFilter(maxExpFilter === 1 ? 2 : 1)}
          className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
            maxExpFilter <= 1
              ? 'bg-purple-50 text-purple-700 border-purple-200 font-bold'
              : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span>Verified Entry-Level ({maxExpFilter <= 1 ? '≤1 yr' : '≤2 yrs'})</span>
        </button>

        <button
          onClick={() => setMinSalaryFilter(minSalaryFilter === 70000 ? 90000 : minSalaryFilter === 90000 ? 110000 : 70000)}
          className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
            minSalaryFilter > 70000
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>Salary: ${Math.round(minSalaryFilter / 1000)}k+</span>
        </button>

        <button
          onClick={() => setRemoteFilter(remoteFilter === 'Remote' ? 'ALL' : 'Remote')}
          className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
            remoteFilter === 'Remote'
              ? 'bg-purple-50 text-purple-800 border-purple-200 font-bold'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>{remoteFilter === 'Remote' ? 'Remote Only' : 'Full Remote / Hybrid'}</span>
        </button>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 text-xs text-purple-600 hover:underline flex items-center gap-1 font-semibold"
          >
            <X className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}

        <span className="ml-auto text-xs text-slate-400 font-semibold">
          {totalFilteredCount} Verified Junior Roles
        </span>
      </div>
    </div>
  );
};
