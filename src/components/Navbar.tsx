import React from 'react';
import { RocketLogo } from './RocketLogo';
import { UserRole } from '../types';
import { 
  Briefcase, 
  Cpu, 
  Users, 
  Activity, 
  FileCode, 
  Settings, 
  Award, 
  ShieldCheck,
  Lock,
  UserCheck,
  Layers,
  Sparkles,
  LogOut,
  LogIn
} from 'lucide-react';

export type NavTabType = 'jobs' | 'candidates' | 'seeker_portal' | 'recruiter_portal' | 'admin' | 'ingestion' | 'buildlog';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  earnedBadgesCount: number;
  openSettings: () => void;
  savedJobsCount: number;
  userName?: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  earnedBadgesCount,
  openSettings,
  savedJobsCount,
  userName = 'Alex Vance',
  isLoggedIn = true,
  onLogout,
  onLogin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#3A7CA5] text-white border-b border-[#245170] shrink-0 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity with 45-Degree Left-Angled Tabernacle Rocket Logo */}
          <button 
            id="nav-brand-btn"
            onClick={() => setActiveTab('jobs')}
            className="flex items-center gap-3 text-left focus:outline-none rounded-lg group"
          >
            <RocketLogo size={24} variant="celestial" />
          </button>

          {/* Center: 3-Way Role Switcher Pill Bar with Sanctuary Gold Active States */}
          <div className="hidden sm:flex items-center bg-[#1C3E56]/80 p-1 rounded-full border border-[#64A7CC]/40 shadow-inner">
            <button
              id="role-toggle-seeker"
              onClick={() => {
                setUserRole('job_seeker');
                setActiveTab('seeker_portal');
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                userRole === 'job_seeker'
                  ? 'bg-[#C59B27] text-white shadow-xs'
                  : 'text-[#E0EEF5] hover:text-white hover:bg-[#2E668B]/60'
              }`}
            >
              Job Seeker
            </button>
            <button
              id="role-toggle-recruiter"
              onClick={() => {
                setUserRole('recruiter');
                setActiveTab('recruiter_portal');
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                userRole === 'recruiter'
                  ? 'bg-[#C59B27] text-white shadow-xs'
                  : 'text-[#E0EEF5] hover:text-white hover:bg-[#2E668B]/60'
              }`}
            >
              Recruiter
            </button>
            <button
              id="role-toggle-admin"
              onClick={() => {
                setUserRole('admin');
                setActiveTab('admin');
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                userRole === 'admin'
                  ? 'bg-[#2C3E50] text-[#F4E0A9] border border-[#C59B27]/50 shadow-xs'
                  : 'text-[#E0EEF5] hover:text-white hover:bg-[#2E668B]/60'
              }`}
            >
              <Lock className="w-3 h-3 text-[#C59B27]" />
              <span>Admin</span>
            </button>
          </div>

          {/* Right Action Controls: User Profile Chip + Settings + Obvious Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Avatar Chip */}
            <div 
              onClick={openSettings}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group bg-[#1C3E56]/70 hover:bg-[#1C3E56]/95 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#64A7CC]/40 transition-colors"
              title="Click to customize profile & preferences"
            >
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black ring-2 transition-all shadow-xs ${
                !isLoggedIn
                  ? 'bg-slate-700 ring-slate-400 text-slate-200'
                  : userRole === 'admin' 
                  ? 'bg-[#2C3E50] ring-[#C59B27] text-[#F4E0A9]' 
                  : userRole === 'recruiter'
                  ? 'bg-[#2E668B] ring-[#94C4DC] text-white'
                  : 'bg-[#C59B27] ring-[#FAF0D4] text-white font-black'
              }`}>
                {!isLoggedIn ? 'G' : userRole === 'admin' ? 'ADM' : userRole === 'recruiter' ? 'REC' : 'AV'}
              </div>
              <span className="text-xs font-bold text-white hidden md:inline group-hover:text-[#F4E0A9] transition-colors">
                {!isLoggedIn ? 'Guest' : userRole === 'admin' ? 'Superadmin' : userRole === 'recruiter' ? 'Sarah Jenkins' : userName}
              </span>
            </div>

            {/* Settings Icon Button with Covenant Crimson micro-badge */}
            <button
              id="open-settings-btn"
              onClick={openSettings}
              className="p-1.5 sm:p-2 hover:bg-[#2E668B] rounded-full text-[#E0EEF5] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#C59B27] relative shrink-0"
              title="Personalized Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              {earnedBadgesCount > 0 && (
                <span className="absolute top-1 right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#C0392B] rounded-full ring-2 ring-[#3A7CA5] shadow-crimson-subtle" />
              )}
            </button>

            {/* OBVIOUS HIGH-CONTRAST LOGOUT BUTTON */}
            {isLoggedIn ? (
              <button
                id="nav-logout-btn"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C0392B] hover:bg-[#A93226] active:bg-[#922B21] text-white text-xs font-black rounded-full border border-rose-300/40 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-white shrink-0 hover:shadow-md cursor-pointer"
                title="Log out of your current session"
              >
                <LogOut className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                <span className="inline">Log out</span>
              </button>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C59B27] hover:bg-[#AA821C] text-white text-xs font-black rounded-full border border-[#FAF0D4]/40 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-white shrink-0 cursor-pointer"
                title="Sign in to your account"
              >
                <LogIn className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                <span className="inline">Sign in</span>
              </button>
            )}
          </div>
        </div>

        {/* Secondary Navigation Tabs with Luminous Tabernacle Palette */}
        <div className="flex items-center space-x-2 py-2 border-t border-[#245170]/80 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            id="nav-tab-jobs"
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'bg-[#FBFBFA] text-[#2C3E50] font-black shadow-xs border border-[#C0DDEB]'
                : 'text-[#E0EEF5] hover:text-white hover:bg-[#2E668B]/60'
            }`}
          >
            <Briefcase className={`w-3.5 h-3.5 ${activeTab === 'jobs' ? 'text-[#3A7CA5]' : 'text-[#C0DDEB]'}`} />
            <span>Curated Feed</span>
            {savedJobsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-[#FAF0D4] text-[#8A6714] rounded-full">
                {savedJobsCount}
              </span>
            )}
          </button>

          {/* Job Seeker Portal Tab */}
          <button
            id="nav-tab-seeker-portal"
            onClick={() => setActiveTab('seeker_portal')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'seeker_portal'
                ? 'bg-[#FBFBFA] text-[#2C3E50] font-black shadow-xs border border-[#C0DDEB]'
                : 'text-[#E0EEF5] hover:text-white hover:bg-[#2E668B]/60'
            }`}
          >
            <UserCheck className={`w-3.5 h-3.5 ${activeTab === 'seeker_portal' ? 'text-[#3A7CA5]' : 'text-[#C0DDEB]'}`} />
            <span>Candidate Portal</span>
          </button>

          {/* Recruiter Portal Tab */}
          <button
            id="nav-tab-recruiter-portal"
            onClick={() => setActiveTab('recruiter_portal')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'recruiter_portal'
                ? 'bg-[#FBFBFA] text-[#2C3E50] font-black shadow-xs border border-[#C0DDEB]'
                : 'text-[#E0EEF5] hover:text-white hover:bg-[#2E668B]/60'
            }`}
          >
            <Users className={`w-3.5 h-3.5 ${activeTab === 'recruiter_portal' ? 'text-[#3A7CA5]' : 'text-[#C0DDEB]'}`} />
            <span>Recruiter Portal</span>
          </button>

          {/* Admin Backend Tab */}
          <button
            id="nav-tab-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-[#2C3E50] text-[#F4E0A9] font-black border border-[#C59B27]/50 shadow-xs'
                : 'text-[#E0EEF5] hover:text-white hover:bg-[#2E668B]/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Admin Backend</span>
          </button>

          <button
            id="nav-tab-ingestion"
            onClick={() => setActiveTab('ingestion')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'ingestion'
                ? 'bg-[#FBFBFA] text-[#2C3E50] font-black shadow-xs border border-[#C0DDEB]'
                : 'text-[#E0EEF5] hover:text-white hover:bg-[#2E668B]/60'
            }`}
            title="Live multi-source ingestion and validation telemetry"
          >
            <Activity className={`w-3.5 h-3.5 ${activeTab === 'ingestion' ? 'text-[#3A7CA5]' : 'text-[#C0DDEB]'}`} />
            <span>Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-[#C59B27] animate-pulse" />
          </button>

          <button
            id="nav-tab-buildlog"
            onClick={() => setActiveTab('buildlog')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'buildlog'
                ? 'bg-[#FBFBFA] text-[#2C3E50] font-black shadow-xs border border-[#C0DDEB]'
                : 'text-[#E0EEF5] hover:text-white hover:bg-[#2E668B]/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#F4E0A9]" />
            <span className="font-mono">v1.0.0 Specs</span>
          </button>
        </div>
      </div>
    </header>
  );
};


