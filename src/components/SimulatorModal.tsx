import React from 'react';
import { SimulatorChallenge, SkillBadge } from '../types';
import { TokenOptimizer } from './simulators/TokenOptimizer';
import { RAGChunker } from './simulators/RAGChunker';
import { GuardrailTester } from './simulators/GuardrailTester';
import { 
  X, 
  Cpu, 
  Zap, 
  Database, 
  ShieldCheck, 
  Terminal,
  Award,
  Clock
} from 'lucide-react';

interface SimulatorModalProps {
  challenge: SimulatorChallenge | null;
  onClose: () => void;
  onBadgeEarned: (badge: SkillBadge) => void;
  alreadyEarned: boolean;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  challenge,
  onClose,
  onBadgeEarned,
  alreadyEarned,
}) => {
  if (!challenge) return null;

  const getHeaderIcon = () => {
    switch (challenge.type) {
      case 'token_cost':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'rag_config':
        return <Database className="w-5 h-5 text-blue-500" />;
      case 'prompt_guard':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      default:
        return <Cpu className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div 
      id="simulator-evaluation-modal" 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                {getHeaderIcon()}
                <span>{challenge.category}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {challenge.difficulty} Difficulty
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ~{challenge.estimatedMinutes} mins
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {challenge.title}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {challenge.description}
            </p>
          </div>

          <button
            id="close-simulator-modal-btn"
            onClick={onClose}
            className="p-2.5 rounded-2xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-50/50">
          {/* Instructions Box */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-purple-600" /> Challenge Objectives & Assertion Gates
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-700">
              {challenge.instructions.map((ins, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{ins}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SIMULATOR COMPONENT SWITCHER */}
          {challenge.type === 'token_cost' && (
            <TokenOptimizer 
              onBadgeEarned={onBadgeEarned}
              alreadyEarned={alreadyEarned}
            />
          )}

          {challenge.type === 'rag_config' && (
            <RAGChunker 
              onBadgeEarned={onBadgeEarned}
              alreadyEarned={alreadyEarned}
            />
          )}

          {challenge.type === 'prompt_guard' && (
            <GuardrailTester 
              onBadgeEarned={onBadgeEarned}
              alreadyEarned={alreadyEarned}
            />
          )}
        </div>
      </div>
    </div>
  );
};
