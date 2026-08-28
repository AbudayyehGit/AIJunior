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
      {/* Top Banner with Structural Tekhelet Blue & Sacred Gold Highlights */}
      <div className="bg-[#1D4ED8] rounded-3xl p-6 sm:p-8 text-white border border-blue-600 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-tabernacle-gold">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Tabernacle Technical Sandbox
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold">
                  v0.9.0
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">Token &amp; Cost Optimization Sandbox</h2>
              <p className="text-xs text-blue-100 mt-0.5">Target: Compress bloated prompt by $\ge 35\%$ to $\le 500$ tokens while preserving strict JSON schema</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-blue-900/60 px-3 py-1.5 rounded-2xl border border-blue-500/40">
            <span className="text-xs text-blue-200 font-semibold">Inference Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-blue-950 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {Object.entries(modelRates).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name} (${val.costPer1M}/1M)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Token Gauge & Metric Cards with Fine Linen contrast */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {/* Current Tokens */}
          <div className="p-4 rounded-2xl bg-blue-900/80 border border-blue-700/80 space-y-1 shadow-sm">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-blue-200">
              <span>Token Count</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${isWithinBudget ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'}`}>
                {isWithinBudget ? '≤ 500 Cap' : 'Exceeded'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black font-mono ${isWithinBudget ? 'text-amber-300' : 'text-rose-400'}`}>
                {currentTokens}
              </span>
              <span className="text-xs text-blue-300">/ 500 max</span>
            </div>
          </div>

          {/* Reduction Rate */}
          <div className="p-4 rounded-2xl bg-blue-900/80 border border-blue-700/80 space-y-1 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-blue-200">Compression Delta</div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black font-mono ${reductionPercentage >= 35 ? 'text-emerald-300' : 'text-amber-300'}`}>
                {reductionPercentage > 0 ? `-${reductionPercentage}%` : '0%'}
              </span>
              <span className="text-xs text-blue-300">({tokenDelta > 0 ? `-${tokenDelta}` : '0'} tokens)</span>
            </div>
          </div>

          {/* Cost Per 10k Invocations */}
          <div className="p-4 rounded-2xl bg-blue-900/80 border border-blue-700/80 space-y-1 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-blue-200">Cost / 10k Calls</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-purple-200">
                ${costPer10kCurrent.toFixed(4)}
              </span>
              <span className="text-xs text-blue-300 line-through">${costPer10kOriginal.toFixed(4)}</span>
            </div>
          </div>

          {/* Projected Enterprise Savings */}
          <div className="p-4 rounded-2xl bg-blue-900/80 border border-blue-700/80 space-y-1 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-blue-200">Est. 10M Annual Savings</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-amber-300">
                +${Math.max(0, annualSavings10mCalls).toFixed(2)}
              </span>
              <span className="text-xs text-blue-300">/ yr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor & Action Container (Fine Linen Card #FFFFFF / #F8FAFC with generous p-6 to p-8 whitespace) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Navigation Tabs + Quick Prune Bar */}
        <div className="p-5 bg-[#F8FAFC] border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'editor'
                  ? 'bg-[#1D4ED8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 inline mr-1" />
              Prompt Editor
            </button>
            <button
              onClick={() => setActiveTab('diff')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'diff'
                  ? 'bg-[#1D4ED8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 inline mr-1" />
              Diff Viewer
            </button>
            <button
              onClick={() => setActiveTab('cost')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cost'
                  ? 'bg-[#1D4ED8] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 inline mr-1" />
              Cost Breakdown
            </button>
          </div>

          {/* Quick Pruning Tools in Royal Argaman & Tekhelet */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStripLogs}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-[#7C3AED] hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1"
            >
              <span>✂️ Strip Server Logs</span>
            </button>
            <button
              onClick={handleApplyPrunedTemplate}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-[#1D4ED8] hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1"
            >
              <span>⚡ Apply Ideal Schema</span>
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              title="Reset to Bloated Original"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Prompt Editor */}
        {activeTab === 'editor' && (
          <div className="p-6 sm:p-8 space-y-4 bg-white">
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
              <span className="font-semibold">SYSTEM PROMPT BUFFER ({promptText.length} characters)</span>
              <span>Lines: {promptText.split('\n').length}</span>
            </div>
            <textarea
              id="prompt-editor-textarea"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={12}
              className="w-full font-mono text-xs p-5 rounded-2xl bg-slate-950 text-emerald-300 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] leading-relaxed shadow-inner"
              placeholder="Enter your condensed system prompt here..."
            />
          </div>
        )}

        {/* Tab 2: Diff Viewer */}
        {activeTab === 'diff' && (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white">
            <div className="space-y-2">
              <div className="text-xs font-bold text-rose-700 uppercase flex items-center justify-between">
                <span>Original (Bloated: {originalTokens} Tokens)</span>
                <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">High Inefficiency</span>
              </div>
              <pre className="p-4 bg-rose-50/60 text-rose-950 rounded-2xl border border-rose-200 text-[11px] font-mono whitespace-pre-wrap overflow-y-auto max-h-80 leading-relaxed">
                {DEFAULT_BLOATED_PROMPT}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-700 uppercase flex items-center justify-between">
                <span>Optimized Buffer ({currentTokens} Tokens)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {reductionPercentage >= 35 ? 'Target Met (≥35%)' : 'In Progress'}
                </span>
              </div>
              <pre className="p-4 bg-emerald-50/60 text-emerald-950 rounded-2xl border border-emerald-200 text-[11px] font-mono whitespace-pre-wrap overflow-y-auto max-h-80 leading-relaxed">
                {promptText}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Cost Matrix */}
        {activeTab === 'cost' && (
          <div className="p-6 sm:p-8 space-y-4 bg-white">
            <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Multi-Model Unit Economics Comparison</div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-slate-700 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Model</th>
                    <th className="p-3.5">Cost / 1M Tokens</th>
                    <th className="p-3.5">Original Prompt (10k Calls)</th>
                    <th className="p-3.5">Optimized Prompt (10k Calls)</th>
                    <th className="p-3.5 text-emerald-700 font-black">Projected Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {Object.entries(modelRates).map(([key, val]) => {
                    const origCost = ((originalTokens * 10000) / 1000000) * val.costPer1M;
                    const optCost = ((currentTokens * 10000) / 1000000) * val.costPer1M;
                    const savings = origCost - optCost;
                    return (
                      <tr key={key} className={selectedModel === key ? 'bg-amber-50/80 font-bold' : 'hover:bg-slate-50/80'}>
                        <td className="p-3.5 font-sans font-semibold text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
                          <span>{val.name}</span>
                        </td>
                        <td className="p-3.5">${val.costPer1M.toFixed(3)}</td>
                        <td className="p-3.5 text-slate-500">${origCost.toFixed(4)}</td>
                        <td className="p-3.5 text-[#7C3AED] font-bold">${optCost.toFixed(4)}</td>
                        <td className="p-3.5 text-emerald-600 font-bold">
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

        {/* Assertion Benchmark Trigger with Royal Argaman CTA */}
        <div className="p-6 bg-[#F8FAFC] border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
            <span>Clicking execute runs a 4-vector automated assertion test suite against your prompt buffer.</span>
          </div>

          <button
            id="execute-token-assertions-btn"
            onClick={handleRunAssertions}
            disabled={isRunningSuite}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-tabernacle-argaman transition-all disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isRunningSuite ? 'animate-spin' : ''}`} />
            <span>{isRunningSuite ? 'Evaluating Test Vectors...' : 'Execute Benchmark & Assertions'}</span>
          </button>
        </div>
      </div>

      {/* Assertion Test Suite Results (Fine Linen Container with Sacred Gold Badges) */}
      {suiteResult && (
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          suiteResult.allPassed 
            ? 'bg-amber-50/50 border-amber-300 shadow-tabernacle-gold' 
            : 'bg-rose-50/50 border-rose-300'
        } space-y-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {suiteResult.allPassed ? (
                <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shadow-tabernacle-gold">
                  <Award className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {suiteResult.allPassed 
                    ? 'All Test Assertions Passed! Cryptographic Proof Generated' 
                    : `${suiteResult.passedCount} of ${suiteResult.totalCount} Test Vectors Passed`}
                </h3>
                <p className="text-xs text-slate-600">
                  Benchmark execution time: {suiteResult.executionTimeMs}ms • Overall Score: {suiteResult.totalScore}%
                </p>
              </div>
            </div>

            {/* Shimmering Sacred Gold Attested Badge Pill */}
            {suiteResult.allPassed && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gold-shimmer-badge text-slate-950 text-xs font-black shadow-tabernacle-gold border border-amber-400">
                <Award className="w-4 h-4 text-slate-950" />
                <span>Verified Badge Minted: {suiteResult.issuedBadge?.name}</span>
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
              </div>
            )}
          </div>

          {/* Test Vector Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {suiteResult.testVectors.map((vec) => (
              <div
                key={vec.id}
                className={`p-4 rounded-2xl bg-white border text-xs space-y-2 shadow-2xs ${
                  vec.passed ? 'border-amber-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${vec.passed ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    {vec.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${
                    vec.passed ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {vec.passed ? 'PASSED' : 'FAILED'} ({vec.score}%)
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">{vec.description}</p>
                <div className="pt-1 font-mono text-[11px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  {vec.outputSummary}
                </div>
              </div>
            ))}
          </div>

          {/* Cryptographic Attestation Ledger Footer */}
          {suiteResult.allPassed && (
            <div className="p-4 bg-slate-950 text-slate-300 rounded-2xl font-mono text-[11px] space-y-1.5 border border-amber-500/40 shadow-sm">
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>CRYPTO ATTESTATION PROOF: {suiteResult.attestationRecord.signature}</span>
              </div>
              <div className="text-slate-400 text-[10px]">
                SHA-256 Hash: {suiteResult.attestationRecord.hash} • Verification Token: {suiteResult.issuedBadge?.verificationCode}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

