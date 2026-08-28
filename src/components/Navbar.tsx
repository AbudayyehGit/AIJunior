import React from 'react';
import { SailboatLogo } from './SailboatLogo';
import { UserRole } from '../types';
import { 
  Briefcase, 
  Cpu, 
  Users, 
  Activity, 
  FileCode, 
  Settings, 
  Award, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'jobs' | 'simulators' | 'candidates' | 'ingestion' | 'buildlog';
  setActiveTab: (tab: 'jobs' | 'simulators' | 'candidates' | 'ingestion' | 'buildlog') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  earnedBadgesCount: number;
  openSettings: () => void;
  savedJobsCount: number;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  earnedBadgesCount,
  openSettings,
  savedJobsCount,
  userName = 'Alex Vance'
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shrink-0 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity with Sailboat Logo */}
          <button 
            id="nav-brand-btn"
            onClick={() => setActiveTab('jobs')}
            className="flex items-center gap-3 text-left focus:outline-none rounded-lg group"
          >
            <SailboatLogo size={24} />
          </button>

          {/* Center: Role Switcher Pill Bar with Purple Accent */}
          <div className="hidden sm:flex items-center bg-purple-50/60 p-1 rounded-full border border-purple-100">
            <button
              id="role-toggle-seeker"
              onClick={() => {
                setUserRole('job_seeker');
                if (activeTab === 'candidates') setActiveTab('jobs');
              }}
              className={`px-6 py-1.5 text-sm font-semibold rounded-full transition-all ${
                userRole === 'job_seeker'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              Job Seeker
            </button>
            <button
              id="role-toggle-recruiter"
              onClick={() => {
                setUserRole('recruiter');
                setActiveTab('candidates');
              }}
              className={`px-6 py-1.5 text-sm font-semibold rounded-full transition-all ${
                userRole === 'recruiter'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              Recruiter
            </button>
          </div>

          {/* Right Action Controls: User Profile Chip + Settings */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* User Avatar Chip with Purple ring */}
            <div 
              onClick={openSettings}
              className="flex items-center gap-2 cursor-pointer group"
              title="Click to customize profile & preferences"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-purple-400/30 group-hover:ring-purple-500 transition-all shadow-xs">
                {userRole === 'recruiter' ? 'REC' : 'AV'}
              </div>
              <span className="text-sm font-medium text-slate-800 hidden md:inline group-hover:text-purple-600 transition-colors">
                {userRole === 'recruiter' ? 'Sarah Jenkins' : userName}
              </span>
            </div>

            {/* Settings Icon Button */}
            <button
              id="open-settings-btn"
              onClick={openSettings}
              className="p-2 hover:bg-purple-50 rounded-full text-slate-400 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 relative"
              title="Personalized Settings"
            >
              <Settings className="w-5 h-5" />
              {earnedBadgesCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        {/* Secondary Clean Navigation Tabs with Purple Accents */}
        <div className="flex items-center space-x-2 py-2 border-t border-slate-100 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            id="nav-tab-jobs"
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-purple-600" />
            <span>Curated Feed</span>
            {savedJobsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-full">
                {savedJobsCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-simulators"
            onClick={() => setActiveTab('simulators')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'simulators'
                ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>Skill Simulators</span>
            {earnedBadgesCount > 0 && (
              <span className="ml-1 flex items-center gap-1 px-1.5 py-0.2 text-[10px] font-bold bg-purple-200 text-purple-900 rounded-full">
                <Award className="w-3 h-3" />
                {earnedBadgesCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-candidates"
            onClick={() => setActiveTab('candidates')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'candidates'
                ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>{userRole === 'recruiter' ? 'Talent Pipeline' : 'Verified Talent Pool'}</span>
          </button>

          <button
            id="nav-tab-ingestion"
            onClick={() => setActiveTab('ingestion')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'ingestion'
                ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
            }`}
            title="Live multi-source ingestion and validation telemetry"
          >
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            <span>Data Hygiene Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </button>

          <button
            id="nav-tab-buildlog"
            onClick={() => setActiveTab('buildlog')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'buildlog'
                ? 'bg-slate-100 text-purple-900 font-bold border border-purple-300 shadow-2xs'
                : 'text-slate-500 hover:text-purple-800 hover:bg-purple-50/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">v0.4.0 Specs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
