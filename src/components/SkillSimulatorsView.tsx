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
      {/* Hero Header for Simulators with Celestial & Sanctuary Accent */}
      <div className="bg-[#245170] rounded-3xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden border border-[#64A7CC]/40">
        {/* Subtle backdrop pattern */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C3E56] text-[#FAF0D4] border border-[#64A7CC]/40 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Interactive Technical Sandboxes</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Prove Practical AI Competency. Skip Traditional Gatekeeping.
          </h1>

          <p className="text-[#E0EEF5] text-sm md:text-base leading-relaxed">
            Recruiters prioritize candidates with verified simulator badges over traditional bullet-point resumes.
            Complete these browser-based sandboxes in under 10 minutes to attach cryptographic proof to your profile.
          </p>

          {/* User Earned Badges Showcase */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FAF0D4]">
              Your Verified Badges:
            </div>
            {earnedBadges.length === 0 ? (
              <span className="text-xs text-[#C0DDEB] italic bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                No badges earned yet. Complete a sandbox below!
              </span>
            ) : (
              earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C59B27] text-white border border-[#FAF0D4]/40 text-xs font-bold shadow-sanctuary-glow"
                >
                  <Award className="w-3.5 h-3.5 text-[#FAF0D4]" />
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
                return <Zap className="w-6 h-6 text-[#C59B27]" />;
              case 'rag_config':
                return <Database className="w-6 h-6 text-[#3A7CA5]" />;
              case 'prompt_guard':
                return <ShieldCheck className="w-6 h-6 text-[#245170]" />;
              default:
                return <Cpu className="w-6 h-6 text-[#C59B27]" />;
            }
          };

          return (
            <div
              key={chal.id}
              id={`challenge-card-${chal.id}`}
              className={`relative bg-[#FBFBFA] rounded-3xl border transition-all duration-200 p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md ${
                earned ? 'border-[#C59B27]/60 bg-[#FAF0D4]/30' : 'border-[#CCD2D8] hover:border-[#3A7CA5]'
              }`}
            >
              <div className="space-y-4">
                {/* Header Icon + Difficulty */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[#F4F4F0] border border-[#CCD2D8]/80">
                    {getCategoryIcon()}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6E8193] font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{chal.estimatedMinutes} mins
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4F4F0] text-[#2C3E50] border border-[#CCD2D8]/60">
                      {chal.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title & Category */}
                <div className="space-y-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#3A7CA5]">
                    {chal.category}
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-[#2C3E50] leading-snug">
                    {chal.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-[#4A5D70] leading-relaxed">
                  {chal.description}
                </p>

                {/* Reward Badge Preview */}
                <div className="p-3 bg-[#FAF0D4]/50 rounded-2xl border border-[#C59B27]/30 flex items-center gap-3">
                  <div className="p-2 bg-[#C59B27] text-white rounded-xl shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="text-[10px] text-[#8A6714] font-bold uppercase">Badge Unlocked</div>
                    <div className="font-bold text-[#2C3E50]">{chal.badgeReward.name}</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-[#CCD2D8]/60 flex items-center justify-between">
                {earned ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8A6714]">
                    <CheckCircle2 className="w-4 h-4 text-[#C59B27]" />
                    <span>Badge Earned & Verified</span>
                  </div>
                ) : (
                  <span className="text-xs text-[#6E8193] font-medium">
                    Not yet verified
                  </span>
                )}

                <button
                  onClick={() => onOpenChallenge(chal)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    earned
                      ? 'bg-[#FAF0D4] text-[#8A6714] border border-[#C59B27]/40 hover:bg-[#F4E0A9]'
                      : 'bg-[#C59B27] text-white hover:bg-[#AA821C] shadow-sanctuary-glow'
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

