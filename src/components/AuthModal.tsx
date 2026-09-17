import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, UserCheck, Lock, Briefcase, X, LogIn, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAs: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginAs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#17202A]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3A7CA5] flex items-center justify-center text-white shadow-xs">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Sign In to Platform</h2>
              <p className="text-xs text-slate-500">Choose a verified role profile to authenticate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 text-sm font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Job Seeker Profile */}
          <button
            onClick={() => onLoginAs('job_seeker')}
            className="w-full text-left p-4 rounded-2xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-300 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                AV
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Alex Vance</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    Candidate
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Junior AI Systems Engineer • 2 Attested Badges</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Recruiter Profile */}
          <button
            onClick={() => onLoginAs('recruiter')}
            className="w-full text-left p-4 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 hover:border-blue-300 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#2E668B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                SJ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Sarah Jenkins</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    Tech Recruiter
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Apex Systems AI Division • Talent Discovery</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2E668B] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Administrator Profile */}
          <button
            onClick={() => onLoginAs('admin')}
            className="w-full text-left p-4 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 hover:border-amber-300 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#2C3E50] text-[#F4E0A9] flex items-center justify-center font-bold text-sm shadow-xs border border-[#C59B27]/40">
                <Lock className="w-4 h-4 text-[#C59B27]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Platform Superadmin</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    RBAC Admin
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Ingestion pipelines, audit logs, and trust moderation</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="pt-2 text-center text-xs text-slate-400">
          Session state will be preserved locally with verified RBAC credentials.
        </div>
      </div>
    </div>
  );
};
