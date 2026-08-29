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
        return <Zap className="w-5 h-5 text-[#C59B27]" />;
      case 'rag_config':
        return <Database className="w-5 h-5 text-[#3A7CA5]" />;
      case 'prompt_guard':
        return <ShieldCheck className="w-5 h-5 text-[#C0392B]" />;
      default:
        return <Cpu className="w-5 h-5 text-[#C59B27]" />;
    }
  };

  return (
    <div 
      id="simulator-evaluation-modal" 
      className="fixed inset-0 z-50 overflow-y-auto bg-[#17202A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#FBFBFA] w-full max-w-5xl rounded-3xl shadow-2xl border border-[#CCD2D8] overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 md:p-8 bg-[#245170] text-white border-b border-[#64A7CC]/40 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1C3E56] text-[#FAF0D4] border border-[#64A7CC]/40 flex items-center gap-1.5">
                {getHeaderIcon()}
                <span>{challenge.category}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1C3E56] text-[#E0EEF5] border border-[#64A7CC]/30">
                {challenge.difficulty} Difficulty
              </span>
              <span className="text-xs text-[#E0EEF5] font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C59B27]" /> ~{challenge.estimatedMinutes} mins
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {challenge.title}
            </h2>
            <p className="text-xs md:text-sm text-[#E0EEF5] max-w-3xl leading-relaxed">
              {challenge.description}
            </p>
          </div>

          <button
            id="close-simulator-modal-btn"
            onClick={onClose}
            className="p-2.5 rounded-2xl border border-[#64A7CC]/40 text-[#E0EEF5] hover:text-white hover:bg-[#1C3E56] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-[#FBFBFA]">
          {/* Instructions Box */}
          <div className="p-4 bg-[#F4F4F0] rounded-2xl border border-[#CCD2D8] shadow-xs space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-[#2C3E50] flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#3A7CA5]" /> Challenge Objectives & Assertion Gates
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-[#4A5D70]">
              {challenge.instructions.map((ins, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FAF0D4] text-[#8A6714] border border-[#C59B27]/40 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
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

