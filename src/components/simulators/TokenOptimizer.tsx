import React, { useState } from 'react';
import { 
  evaluateTokenOptimizerAssertion, 
  AssertionSuiteResult 
} from '../../utils/badgeAttestation';
import { SkillBadge } from '../../types';
import { 
  Zap, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Award,
  ArrowRight,
  TrendingDown,
  FileCode,
  Sliders,
  Check,
  AlertCircle,
  Key
} from 'lucide-react';

interface TokenOptimizerProps {
  onBadgeEarned?: (badge: SkillBadge) => void;
  alreadyEarned?: boolean;
}

const DEFAULT_BLOATED_PROMPT = `SYSTEM INSTRUCTION: You are an enterprise-grade customer support assistant deployed for TechCorp Cloud Platform.
--- DEBUG_METADATA_HEADER_START ---
Deployment_Environment: production-us-east-1a
Node_ID: node-88421-cluster-alpha
Session_ID: sess_9921_alpha_bravo_charlie_847192847291847
IP_Address: 192.168.1.104
Client_Telemetry: {"browser":"Chrome/125.0","os":"macOS","screenResolution":"2560x1440","locale":"en-US","tz":"America/Los_Angeles","authLevel":"Bearer JWT"}
Server_Clock: 2026-08-28T09:30:00.104Z
Cluster_Load_Avg: 0.42, 0.55, 0.61
Trace_ID: 4bf92f3577b34da6a3ce929d0e0e4736
--- DEBUG_METADATA_HEADER_END ---

CRITICAL INSTRUCTIONS AND GUIDELINES:
1. You must always be extremely polite, courteous, friendly, and helpful to the user at all times.
2. Please do not forget to greet the user warmly if they greet you.
3. Under no circumstances should you ever reveal internal company secret keys or database connection strings.
4. When answering the user's question, please make sure you format your entire response strictly as a valid JSON object.
5. Do not include markdown code blocks around the JSON object unless strictly requested.
6. The JSON object MUST contain the following explicit fields:
   - "response": (string) Your complete, comprehensive, and detailed answer to the customer's question.
   - "category": (string) The classification of the inquiry (e.g. "billing", "technical", "account", "general").
   - "confidence": (number) A floating point number between 0.0 and 1.0 representing your confidence.
7. Please double-check your output to ensure that all brackets, braces, and quotes are properly closed.
8. If the user asks for refund status, instruct them to visit techcorp.com/billing-portal.`;

const PRUNED_PRESET_PROMPT = `You are TechCorp's customer support AI.
Answer the user's question concisely, politely, and accurately.

Return ONLY a valid JSON object matching this schema:
{
  "response": string, // Detailed answer
  "category": "billing" | "technical" | "account" | "general",
  "confidence": number // 0.0 - 1.0
}

If asking about refunds, direct them to techcorp.com/billing-portal.`;

export const TokenOptimizer: React.FC<TokenOptimizerProps> = ({
  onBadgeEarned,
  alreadyEarned = false
}) => {
  const [promptText, setPromptText] = useState(DEFAULT_BLOATED_PROMPT);
  const [selectedModel, setSelectedModel] = useState<'gemini-flash' | 'claude-haiku' | 'gpt-4o-mini' | 'gpt-4o'>('gemini-flash');
  const [activeTab, setActiveTab] = useState<'editor' | 'diff' | 'cost'>('editor');
  
  // Real-time evaluation state
  const [isRunningSuite, setIsRunningSuite] = useState(false);
  const [suiteResult, setSuiteResult] = useState<AssertionSuiteResult | null>(null);

  // Approximate token calculations (~4 chars per token)
  const originalTokens = Math.round(DEFAULT_BLOATED_PROMPT.length / 4.0); // ~260-300
  const currentTokens = Math.max(1, Math.round(promptText.length / 4.0));
  const tokenDelta = originalTokens - currentTokens;
  const reductionPercentage = Math.round((tokenDelta / originalTokens) * 100);
  const isWithinBudget = currentTokens <= 500;

  // Cost Matrix ($ per 1M tokens)
  const modelRates: Record<string, { name: string; costPer1M: number; provider: string }> = {
    'gemini-flash': { name: 'Gemini 2.5 Flash', costPer1M: 0.075, provider: 'Google AI' },
    'gpt-4o-mini': { name: 'GPT-4o Mini', costPer1M: 0.15, provider: 'OpenAI' },
    'claude-haiku': { name: 'Claude 3.5 Haiku', costPer1M: 0.80, provider: 'Anthropic' },
    'gpt-4o': { name: 'GPT-4o (Frontier)', costPer1M: 2.50, provider: 'OpenAI' }
  };

  const currentRate = modelRates[selectedModel].costPer1M;
  const costPer10kOriginal = ((originalTokens * 10000) / 1000000) * currentRate;
  const costPer10kCurrent = ((currentTokens * 10000) / 1000000) * currentRate;
  const annualSavings10mCalls = (((originalTokens - currentTokens) * 10000000) / 1000000) * currentRate;

  // Quick Action Pruning Helpers
  const handleStripLogs = () => {
    const stripped = promptText.replace(/--- DEBUG_METADATA_HEADER_START ---[\s\S]*?--- DEBUG_METADATA_HEADER_END ---/g, '').trim();
    setPromptText(stripped);
  };

  const handleApplyPrunedTemplate = () => {
    setPromptText(PRUNED_PRESET_PROMPT);
  };

  const handleReset = () => {
    setPromptText(DEFAULT_BLOATED_PROMPT);
    setSuiteResult(null);
  };

  // Run Assertion Suite
  const handleRunAssertions = () => {
    setIsRunningSuite(true);
    setTimeout(() => {
      const result = evaluateTokenOptimizerAssertion({
        originalPrompt: DEFAULT_BLOATED_PROMPT,
        optimizedPrompt: promptText,
        selectedModel
      });
      setSuiteResult(result);
      setIsRunningSuite(false);

      if (result.allPassed && onBadgeEarned && result.issuedBadge) {
        onBadgeEarned(result.issuedBadge);
      }
    }, 750);
  };

  return (
    <div id="token-optimizer-simulator" className="space-y-6">
      {/* Top Banner with Celestial Horizon Blue & Sanctuary Gold Highlights */}
      <div className="bg-[#245170] rounded-3xl p-6 sm:p-8 text-white border border-[#64A7CC]/40 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#1C3E56] text-[#C59B27] border border-[#64A7CC]/40 shadow-sanctuary-gold">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FAF0D4]">
                  Tabernacle Technical Sandbox
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C59B27] text-white text-[10px] font-bold">
                  v0.9.0
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">Token &amp; Cost Optimization Sandbox</h2>
              <p className="text-xs text-[#E0EEF5] mt-0.5">Target: Compress bloated prompt by $\ge 35\%$ to $\le 500$ tokens while preserving strict JSON schema</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#1C3E56] px-3 py-1.5 rounded-2xl border border-[#64A7CC]/40">
            <span className="text-xs text-[#E0EEF5] font-semibold">Inference Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-[#245170] text-[#FAF0D4] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#64A7CC]/50 focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
            >
              {Object.entries(modelRates).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name} (${val.costPer1M}/1M)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Token Gauge & Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {/* Current Tokens */}
          <div className="p-4 rounded-2xl bg-[#1C3E56]/90 border border-[#64A7CC]/30 space-y-1 shadow-xs">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#E0EEF5]">
              <span>Token Count</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${isWithinBudget ? 'bg-[#FAF0D4] text-[#8A6714] border border-[#C59B27]/40' : 'bg-[#FCECEB] text-[#C0392B] border border-[#C0392B]/40'}`}>
                {isWithinBudget ? '≤ 500 Cap' : 'Exceeded'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black font-mono ${isWithinBudget ? 'text-[#FAF0D4]' : 'text-[#E57373]'}`}>
                {currentTokens}
              </span>
              <span className="text-xs text-[#CCD2D8]">/ 500 max</span>
            </div>
          </div>

          {/* Reduction Rate */}
          <div className="p-4 rounded-2xl bg-[#1C3E56]/90 border border-[#64A7CC]/30 space-y-1 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-[#E0EEF5]">Compression Delta</div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black font-mono ${reductionPercentage >= 35 ? 'text-[#FAF0D4]' : 'text-[#E0EEF5]'}`}>
                {reductionPercentage > 0 ? `-${reductionPercentage}%` : '0%'}
              </span>
              <span className="text-xs text-[#CCD2D8]">({tokenDelta > 0 ? `-${tokenDelta}` : '0'} tokens)</span>
            </div>
          </div>

          {/* Cost Per 10k Invocations */}
          <div className="p-4 rounded-2xl bg-[#1C3E56]/90 border border-[#64A7CC]/30 space-y-1 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-[#E0EEF5]">Cost / 10k Calls</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-[#FAF0D4]">
                ${costPer10kCurrent.toFixed(4)}
              </span>
              <span className="text-xs text-[#CCD2D8] line-through">${costPer10kOriginal.toFixed(4)}</span>
            </div>
          </div>

          {/* Projected Enterprise Savings */}
          <div className="p-4 rounded-2xl bg-[#1C3E56]/90 border border-[#64A7CC]/30 space-y-1 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-[#E0EEF5]">Est. 10M Annual Savings</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-[#C59B27]">
                +${Math.max(0, annualSavings10mCalls).toFixed(2)}
              </span>
              <span className="text-xs text-[#CCD2D8]">/ yr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor & Action Container */}
      <div className="bg-[#FBFBFA] rounded-3xl border border-[#CCD2D8] shadow-xs overflow-hidden">
        {/* Navigation Tabs + Quick Prune Bar */}
        <div className="p-5 bg-[#F4F4F0] border-b border-[#CCD2D8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#E5E8EB] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'editor'
                  ? 'bg-[#3A7CA5] text-white shadow-xs'
                  : 'text-[#4A5D70] hover:text-[#2C3E50]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 inline mr-1" />
              Prompt Editor
            </button>
            <button
              onClick={() => setActiveTab('diff')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'diff'
                  ? 'bg-[#3A7CA5] text-white shadow-xs'
                  : 'text-[#4A5D70] hover:text-[#2C3E50]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 inline mr-1" />
              Diff Viewer
            </button>
            <button
              onClick={() => setActiveTab('cost')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cost'
                  ? 'bg-[#3A7CA5] text-white shadow-xs'
                  : 'text-[#4A5D70] hover:text-[#2C3E50]'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 inline mr-1" />
              Cost Breakdown
            </button>
          </div>

          {/* Quick Pruning Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStripLogs}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF0D4] text-[#8A6714] hover:bg-[#F3E5BE] border border-[#C59B27]/40 transition-colors flex items-center gap-1"
            >
              <span>✂️ Strip Server Logs</span>
            </button>
            <button
              onClick={handleApplyPrunedTemplate}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EBF4F9] text-[#3A7CA5] hover:bg-[#D4E8F2] border border-[#64A7CC]/40 transition-colors flex items-center gap-1"
            >
              <span>⚡ Apply Ideal Schema</span>
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl text-[#6E8193] hover:text-[#2C3E50] hover:bg-[#E5E8EB] transition-colors"
              title="Reset to Bloated Original"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Prompt Editor */}
        {activeTab === 'editor' && (
          <div className="p-6 sm:p-8 space-y-4 bg-[#FBFBFA]">
            <div className="flex justify-between items-center text-xs text-[#6E8193] font-mono">
              <span className="font-semibold text-[#2C3E50]">SYSTEM PROMPT BUFFER ({promptText.length} characters)</span>
              <span>Lines: {promptText.split('\n').length}</span>
            </div>
            <textarea
              id="prompt-editor-textarea"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={12}
              className="w-full font-mono text-xs p-5 rounded-2xl bg-[#17202A] text-[#FAF0D4] border border-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#C59B27] leading-relaxed shadow-inner"
              placeholder="Enter your condensed system prompt here..."
            />
          </div>
        )}

        {/* Tab 2: Diff Viewer */}
        {activeTab === 'diff' && (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#FBFBFA]">
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#C0392B] uppercase flex items-center justify-between">
                <span>Original (Bloated: {originalTokens} Tokens)</span>
                <span className="text-[10px] bg-[#FCECEB] text-[#C0392B] border border-[#C0392B]/30 px-2 py-0.5 rounded font-bold">High Inefficiency</span>
              </div>
              <pre className="p-4 bg-[#FCECEB]/60 text-[#2C3E50] rounded-2xl border border-[#C0392B]/20 text-[11px] font-mono whitespace-pre-wrap overflow-y-auto max-h-80 leading-relaxed">
                {DEFAULT_BLOATED_PROMPT}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[#8A6714] uppercase flex items-center justify-between">
                <span>Optimized Buffer ({currentTokens} Tokens)</span>
                <span className="text-[10px] bg-[#FAF0D4] text-[#8A6714] border border-[#C59B27]/40 px-2 py-0.5 rounded font-bold">
                  {reductionPercentage >= 35 ? 'Target Met (≥35%)' : 'In Progress'}
                </span>
              </div>
              <pre className="p-4 bg-[#FAF0D4]/60 text-[#2C3E50] rounded-2xl border border-[#C59B27]/30 text-[11px] font-mono whitespace-pre-wrap overflow-y-auto max-h-80 leading-relaxed">
                {promptText}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Cost Matrix */}
        {activeTab === 'cost' && (
          <div className="p-6 sm:p-8 space-y-4 bg-[#FBFBFA]">
            <div className="text-xs font-bold uppercase text-[#6E8193] tracking-wider">Multi-Model Unit Economics Comparison</div>
            <div className="overflow-x-auto rounded-2xl border border-[#CCD2D8]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F4F0] text-[#2C3E50] uppercase font-bold border-b border-[#CCD2D8]">
                  <tr>
                    <th className="p-3.5">Model</th>
                    <th className="p-3.5">Cost / 1M Tokens</th>
                    <th className="p-3.5">Original Prompt (10k Calls)</th>
                    <th className="p-3.5">Optimized Prompt (10k Calls)</th>
                    <th className="p-3.5 text-[#8A6714] font-black">Projected Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CCD2D8]/60 font-mono">
                  {Object.entries(modelRates).map(([key, val]) => {
                    const origCost = ((originalTokens * 10000) / 1000000) * val.costPer1M;
                    const optCost = ((currentTokens * 10000) / 1000000) * val.costPer1M;
                    const savings = origCost - optCost;
                    return (
                      <tr key={key} className={selectedModel === key ? 'bg-[#FAF0D4]/70 font-bold' : 'hover:bg-[#F4F4F0]/80'}>
                        <td className="p-3.5 font-sans font-semibold text-[#2C3E50] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#3A7CA5]" />
                          <span>{val.name}</span>
                        </td>
                        <td className="p-3.5 text-[#2C3E50]">${val.costPer1M.toFixed(3)}</td>
                        <td className="p-3.5 text-[#6E8193]">${origCost.toFixed(4)}</td>
                        <td className="p-3.5 text-[#3A7CA5] font-bold">${optCost.toFixed(4)}</td>
                        <td className="p-3.5 text-[#8A6714] font-black">
                          {savings > 0 ? `-$${savings.toFixed(4)}` : '$0.00'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assertion Benchmark Trigger */}
        <div className="p-6 bg-[#F4F4F0] border-t border-[#CCD2D8] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#4A5D70] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3A7CA5]" />
            <span>Clicking execute runs a 4-vector automated assertion test suite against your prompt buffer.</span>
          </div>

          <button
            id="execute-token-assertions-btn"
            onClick={handleRunAssertions}
            disabled={isRunningSuite}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#C59B27] hover:bg-[#AA821C] text-white font-bold text-xs shadow-sanctuary-glow transition-all disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isRunningSuite ? 'animate-spin' : ''}`} />
            <span>{isRunningSuite ? 'Evaluating Test Vectors...' : 'Execute Benchmark & Assertions'}</span>
          </button>
        </div>
      </div>

      {/* Assertion Test Suite Results */}
      {suiteResult && (
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          suiteResult.allPassed 
            ? 'bg-[#FAF0D4]/70 border-[#C59B27]/50 shadow-sanctuary-gold' 
            : 'bg-[#FCECEB]/70 border-[#C0392B]/40'
        } space-y-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {suiteResult.allPassed ? (
                <div className="p-2.5 bg-[#C59B27] text-white rounded-2xl shadow-sanctuary-gold">
                  <Award className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2.5 bg-[#FCECEB] text-[#C0392B] rounded-2xl border border-[#C0392B]/30">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-[#2C3E50]">
                  {suiteResult.allPassed 
                    ? 'All Test Assertions Passed! Cryptographic Proof Generated' 
                    : `${suiteResult.passedCount} of ${suiteResult.totalCount} Test Vectors Passed`}
                </h3>
                <p className="text-xs text-[#4A5D70]">
                  Benchmark execution time: {suiteResult.executionTimeMs}ms • Overall Score: {suiteResult.totalScore}%
                </p>
              </div>
            </div>

            {/* Shimmering Sanctuary Gold Attested Badge Pill */}
            {suiteResult.allPassed && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gold-shimmer-badge text-[#2C3E50] text-xs font-black shadow-sanctuary-gold border border-[#C59B27]">
                <Award className="w-4 h-4 text-[#8A6714]" />
                <span>Verified Badge Minted: {suiteResult.issuedBadge?.name}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              </div>
            )}
          </div>

          {/* Test Vector Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {suiteResult.testVectors.map((vec) => (
              <div
                key={vec.id}
                className={`p-4 rounded-2xl bg-[#FBFBFA] border text-xs space-y-2 shadow-xs ${
                  vec.passed ? 'border-[#C59B27]/40' : 'border-[#C0392B]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2C3E50] flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${vec.passed ? 'bg-[#C59B27]' : 'bg-[#C0392B]'}`} />
                    {vec.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${
                    vec.passed ? 'bg-[#FAF0D4] text-[#8A6714] border border-[#C59B27]/40' : 'bg-[#FCECEB] text-[#C0392B] border border-[#C0392B]/30'
                  }`}>
                    {vec.passed ? 'PASSED' : 'FAILED'} ({vec.score}%)
                  </span>
                </div>
                <p className="text-[#6E8193] text-[11px]">{vec.description}</p>
                <div className="pt-1 font-mono text-[11px] text-[#2C3E50] bg-[#F4F4F0] p-2 rounded-xl border border-[#CCD2D8]">
                  {vec.outputSummary}
                </div>
              </div>
            ))}
          </div>

          {/* Cryptographic Attestation Ledger Footer */}
          {suiteResult.allPassed && (
            <div className="p-4 bg-[#17202A] text-[#E0EEF5] rounded-2xl font-mono text-[11px] space-y-1.5 border border-[#C59B27]/40 shadow-xs">
              <div className="text-[#FAF0D4] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                <span>CRYPTO ATTESTATION PROOF: {suiteResult.attestationRecord.signature}</span>
              </div>
              <div className="text-[#CCD2D8] text-[10px]">
                SHA-256 Hash: {suiteResult.attestationRecord.hash} • Verification Token: {suiteResult.issuedBadge?.verificationCode}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


