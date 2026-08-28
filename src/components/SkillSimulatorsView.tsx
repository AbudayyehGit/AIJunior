import React from 'react';
import { SimulatorChallenge, SkillBadge } from '../types';
import { 
  Cpu, 
  Award, 
  Zap, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BarChart3,
  Sparkles
} from 'lucide-react';

interface SkillSimulatorsViewProps {
  challenges: SimulatorChallenge[];
  earnedBadges: SkillBadge[];
  onOpenChallenge: (challenge: SimulatorChallenge) => void;
}

export const SkillSimulatorsView: React.FC<SkillSimulatorsViewProps> = ({
  challenges,
  earnedBadges,
  onOpenChallenge,
}) => {
  const isBadgeEarned = (badgeId: string) =>
    earnedBadges.some((b) => b.id === badgeId);

  return (
    <div id="skill-simulators-view" className="space-y-8 animate-fadeIn">
      {/* Hero Header for Simulators with Purple Accent */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden border border-purple-900/40">
        {/* Subtle backdrop pattern */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Technical Sandboxes</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Prove Practical AI Competency. Skip the Traditional Gatekeeping.
          </h1>

          <p className="text-purple-200/90 text-sm md:text-base leading-relaxed">
            Recruiters prioritize candidates with verified simulator badges over traditional bullet-point resumes.
            Complete these browser-based sandboxes in under 10 minutes to attach cryptographic proof to your profile.
          </p>

          {/* User Earned Badges Showcase */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Your Verified Badges:
            </div>
            {earnedBadges.length === 0 ? (
              <span className="text-xs text-purple-200/60 italic bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                No badges earned yet. Complete a sandbox below!
              </span>
            ) : (
              earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/50 text-xs font-bold shadow-xs"
                >
                  <Award className="w-3.5 h-3.5 text-purple-300" />
                  <span>{badge.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Simulators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {challenges.map((chal) => {
          const earned = isBadgeEarned(chal.badgeReward.id);

          const getCategoryIcon = () => {
            switch (chal.type) {
              case 'token_cost':
                return <Zap className="w-6 h-6 text-amber-500" />;
              case 'rag_config':
                return <Database className="w-6 h-6 text-blue-500" />;
              case 'prompt_guard':
                return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
              default:
                return <Cpu className="w-6 h-6 text-indigo-500" />;
            }
          };

          return (
            <div
              key={chal.id}
              id={`challenge-card-${chal.id}`}
              className={`relative bg-white rounded-3xl border transition-all duration-200 p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md ${
                earned ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header Icon + Difficulty */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200/80">
                    {getCategoryIcon()}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{chal.estimatedMinutes} mins
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      {chal.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title & Category */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    {chal.category}
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug">
                    {chal.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {chal.description}
                </p>

                {/* Reward Badge Preview */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Badge Unlocked</div>
                    <div className="font-bold text-slate-800">{chal.badgeReward.name}</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                {earned ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Badge Earned & Verified</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    Not yet verified
                  </span>
                )}

                <button
                  onClick={() => onOpenChallenge(chal)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    earned
                      ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                      : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-xs'
                  }`}
                >
                  <span>{earned ? 'Retake Sandbox' : 'Start Sandbox'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
