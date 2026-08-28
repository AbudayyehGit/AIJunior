import React, { useState, useMemo } from 'react';
import { 
  evaluateRAGChunkerAssertion, 
  AssertionSuiteResult 
} from '../../utils/badgeAttestation';
import { SkillBadge } from '../../types';
import { 
  Database, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Layers, 
  Search, 
  AlertTriangle, 
  Check, 
  Filter, 
  BarChart3,
  Terminal
} from 'lucide-react';

interface RAGChunkerProps {
  onBadgeEarned?: (badge: SkillBadge) => void;
  alreadyEarned?: boolean;
}

interface DocumentParagraph {
  id: string;
  text: string;
  topic: string;
  isNoise: boolean;
  baseRelevance: number; // 0.0 - 1.0 against sample query
}

const SAMPLE_DOCUMENTS: DocumentParagraph[] = [
  {
    id: 'doc-p1',
    topic: 'SRE Outage Protocol',
    text: 'SECTION 4.1: Production SRE Incident Escalation & SLA Protocol. For all Severity-1 (P1) outages causing >5% user error rate, on-call engineers must acknowledge the pager duty trigger within 5 minutes. Initial public status page update must be dispatched within 15 minutes of confirmation.',
    isNoise: false,
    baseRelevance: 0.94
  },
  {
    id: 'doc-p2',
    topic: 'SRE Outage Protocol',
    text: 'P1 War Room Coordination: The primary Incident Commander (IC) leads triage on Slack channel #war-room-active. All database rollbacks require second-engineer signoff from Infrastructure Security before executing schema rollbacks.',
    isNoise: false,
    baseRelevance: 0.88
  },
  {
    id: 'doc-noise-1',
    topic: 'Office Pantry Guidelines',
    text: 'NOTICE: Please label all dairy and almond milk containers stored in the 4th floor kitchen refrigerator. Items left past Friday 6 PM will be recycled by facilities staff.',
    isNoise: true,
    baseRelevance: 0.21
  },
  {
    id: 'doc-p3',
    topic: 'Key Rotation & Security',
    text: 'SECTION 8.2: Secret Key & Cloud Credential Lifecycle. Production AWS IAM access keys and Stripe webhook secrets must be rotated every 90 days via automated KMS vault pipeline. Manual key insertion in .env is strictly forbidden.',
    isNoise: false,
    baseRelevance: 0.76
  },
  {
    id: 'doc-noise-2',
    topic: 'Archived 2021 Ticket Log',
    text: 'Ticket #49120-Closed: Printer in building B requires toner cartridge replacement. Assigned to desk support.',
    isNoise: true,
    baseRelevance: 0.15
  },
  {
    id: 'doc-p4',
    topic: 'SRE Postmortem Process',
    text: 'SECTION 4.3: Root Cause Analysis & Postmortem Timeline. A blameless postmortem draft must be submitted to engineering leadership within 48 hours of incident resolution, detailing timeline, root cause, and preventative action items.',
    isNoise: false,
    baseRelevance: 0.82
  }
];

const SAMPLE_QUERIES = [
  { id: 'q1', text: 'What is the mandatory on-call response time and status update SLA for a Severity-1 outage?' },
  { id: 'q2', text: 'What are the cryptographic secret key rotation lifecycle requirements?' },
  { id: 'q3', text: 'When must the postmortem root cause analysis be delivered after a P1 outage?' }
];

export const RAGChunker: React.FC<RAGChunkerProps> = ({
  onBadgeEarned,
  alreadyEarned = false
}) => {
  // Configurable RAG Hyperparameters
  const [chunkSize, setChunkSize] = useState(384); // tokens
  const [chunkOverlap, setChunkOverlap] = useState(15); // %
  const [similarityThreshold, setSimilarityThreshold] = useState(0.78);
  const [topK, setTopK] = useState(3);
  const [retrievalStrategy, setRetrievalStrategy] = useState<'hybrid' | 'dense' | 'sparse'>('hybrid');
  const [selectedQueryId, setSelectedQueryId] = useState('q1');

  // Benchmark suite state
  const [isRunningSuite, setIsRunningSuite] = useState(false);
  const [suiteResult, setSuiteResult] = useState<AssertionSuiteResult | null>(null);

  // Dynamic chunking & retrieval simulation
  const { simulatedChunks, metrics } = useMemo(() => {
    // 1. Break sample documents into simulated chunks based on chunkSize & overlap
    const chunks: Array<{
      id: string;
      sourceTopic: string;
      text: string;
      isNoise: boolean;
      score: number;
      retained: boolean;
      rank?: number;
    }> = [];

    SAMPLE_DOCUMENTS.forEach((doc, idx) => {
      // Modulate similarity score based on strategy
      let score = doc.baseRelevance;
      if (retrievalStrategy === 'hybrid') score = Math.min(0.99, score + 0.05);
      if (retrievalStrategy === 'sparse') score = Math.max(0.1, score - 0.08);

      // Noise chunks get penalization if similarityThreshold is tuned properly
      if (doc.isNoise) {
        score = Math.max(0.08, doc.baseRelevance - (chunkSize > 500 ? 0.05 : 0.0));
      }

      const passesThreshold = score >= similarityThreshold;
      chunks.push({
        id: `chunk-${idx}-${doc.id}`,
        sourceTopic: doc.topic,
        text: doc.text,
        isNoise: doc.isNoise,
        score: Number(score.toFixed(2)),
        retained: passesThreshold
      });
    });

    // Sort by score descending and take Top-K
    const sorted = [...chunks].sort((a, b) => b.score - a.score);
    const topKRetained = sorted.slice(0, topK).filter((c) => c.retained);

    // Calculate Precision & Hallucination Risk
    const relevantRetained = topKRetained.filter((c) => !c.isNoise).length;
    const precision = topKRetained.length > 0 ? Math.round((relevantRetained / topKRetained.length) * 100) : 0;
    
    // Hallucination risk math: Higher noise in retrieved context or too high topK with low threshold = high risk
    const isOptimalChunk = chunkSize >= 200 && chunkSize <= 512;
    const isOptimalOverlap = chunkOverlap >= 10 && chunkOverlap <= 25;
    const isOptimalSim = similarityThreshold >= 0.70 && similarityThreshold <= 0.88;
    
    let baseRisk = Math.max(2, 100 - precision);
    if (!isOptimalChunk) baseRisk += 15;
    if (!isOptimalOverlap) baseRisk += 10;
    if (!isOptimalSim) baseRisk += 12;
    const hallucinationRisk = Math.min(95, Math.max(3, baseRisk));

    return {
      simulatedChunks: chunks,
      metrics: {
        totalChunksEvaluated: chunks.length,
        retrievedCount: topKRetained.length,
        precisionPct: precision,
        hallucinationRiskPct: hallucinationRisk,
        meanLatencyMs: retrievalStrategy === 'hybrid' ? 42 : retrievalStrategy === 'dense' ? 35 : 18,
        contextWindowTokens: topKRetained.length * chunkSize
      }
    };
  }, [chunkSize, chunkOverlap, similarityThreshold, topK, retrievalStrategy, selectedQueryId]);

  const handleResetDefaults = () => {
    setChunkSize(384);
    setChunkOverlap(15);
    setSimilarityThreshold(0.78);
    setTopK(3);
    setRetrievalStrategy('hybrid');
    setSuiteResult(null);
  };

  const handleRunSuite = () => {
    setIsRunningSuite(true);
    setTimeout(() => {
      const result = evaluateRAGChunkerAssertion({
        chunkSize,
        chunkOverlap,
        similarityThreshold,
        topK,
        strategy: retrievalStrategy
      });
      setSuiteResult(result);
      setIsRunningSuite(false);

      if (result.allPassed && onBadgeEarned && result.issuedBadge) {
        onBadgeEarned(result.issuedBadge);
      }
    }, 750);
  };

  return (
    <div id="rag-chunker-simulator" className="space-y-6">
      {/* Top Banner with Real-Time Vector Context Telemetry */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">RAG Context Window & Noise-Filtering Challenge</h2>
              <p className="text-xs text-slate-400">Tune chunking bounds, sliding overlap, and cosine threshold to filter noise and prevent hallucinations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Retrieval Strategy:</span>
            <select
              value={retrievalStrategy}
              onChange={(e) => setRetrievalStrategy(e.target.value as any)}
              className="bg-slate-800 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hybrid">Hybrid (Dense + BM25 Reciprocal Rank)</option>
              <option value="dense">Dense Embeddings (text-embedding-3)</option>
              <option value="sparse">Sparse BM25 Keyword Search</option>
            </select>
          </div>
        </div>

        {/* Real-time Metric Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {/* Precision */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Retrieval Precision</div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black font-mono ${metrics.precisionPct >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {metrics.precisionPct}%
              </span>
              <span className="text-xs text-slate-500">signal-to-noise</span>
            </div>
          </div>

          {/* Hallucination Risk Indicator */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
              <span>Hallucination Risk</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                metrics.hallucinationRiskPct <= 15 ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
              }`}>
                {metrics.hallucinationRiskPct <= 15 ? 'LOW' : 'ELEVATED'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black font-mono ${metrics.hallucinationRiskPct <= 15 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metrics.hallucinationRiskPct}%
              </span>
              <span className="text-xs text-slate-500">risk index</span>
            </div>
          </div>

          {/* Context Tokens */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Retrieved Context</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-blue-300">
                {metrics.contextWindowTokens}
              </span>
              <span className="text-xs text-slate-500">tokens ({metrics.retrievedCount} chunks)</span>
            </div>
          </div>

          {/* Query Latency */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Vector Search Latency</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-indigo-300">
                {metrics.meanLatencyMs}ms
              </span>
              <span className="text-xs text-slate-500">kNN lookup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Document Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Hyperparameter Sliders */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>RAG Hyperparameters</span>
            </h3>
            <button
              onClick={handleResetDefaults}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Slider 1: Chunk Size */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Chunk Size (tokens)</span>
              <span className="font-mono text-blue-600">{chunkSize} tokens</span>
            </div>
            <input
              type="range"
              min={64}
              max={1024}
              step={32}
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>64 (Fragmented)</span>
              <span className="text-emerald-600 font-bold">256-512 Optimal</span>
              <span>1024 (Diluted)</span>
            </div>
          </div>

          {/* Slider 2: Chunk Overlap */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Sliding Window Overlap (%)</span>
              <span className="font-mono text-blue-600">{chunkOverlap}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (No boundary)</span>
              <span className="text-emerald-600 font-bold">10-25% Optimal</span>
              <span>40% (Redundant)</span>
            </div>
          </div>

          {/* Slider 3: Cosine Similarity Threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Similarity Cutoff Threshold</span>
              <span className="font-mono text-blue-600">{similarityThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.50}
              max={0.95}
              step={0.02}
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.50 (Permissive)</span>
              <span className="text-emerald-600 font-bold">0.70-0.88 Optimal</span>
              <span>0.95 (Strict)</span>
            </div>
          </div>

          {/* Slider 4: Top-K Retained */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Top-K Context Chunks</span>
              <span className="font-mono text-blue-600">Top {topK}</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1</span>
              <span className="text-emerald-600 font-bold">2-4 Optimal</span>
              <span>6</span>
            </div>
          </div>

          {/* Query Selector */}
          <div className="pt-2 space-y-1.5 border-t border-slate-100">
            <label className="text-xs font-bold uppercase text-slate-500">Benchmark Probe Query</label>
            <select
              value={selectedQueryId}
              onChange={(e) => setSelectedQueryId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SAMPLE_QUERIES.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.text}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right 2 Cols: Dynamic Chunk Inspection Visualizer */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>Unstructured Document Chunks & Cosine Scores</span>
                </h3>
                <p className="text-xs text-slate-500">Green = Admitted to LLM context | Grey = Filtered by cosine cutoff or Top-K limit</p>
              </div>
            </div>

            {/* Chunks List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {simulatedChunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1.5 ${
                    chunk.retained
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{chunk.sourceTopic}</span>
                      {chunk.isNoise && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          Irrelevant Noise
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-600">
                        Cosine Sim: <strong>{chunk.score}</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        chunk.retained ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {chunk.retained ? 'RETAINED' : 'FILTERED'}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed font-sans">{chunk.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmark Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Evaluates chunk boundaries, sliding overlap continuity, and cosine precision.
            </div>

            <button
              id="execute-rag-assertions-btn"
              onClick={handleRunSuite}
              disabled={isRunningSuite}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isRunningSuite ? 'animate-spin' : ''}`} />
              <span>{isRunningSuite ? 'Evaluating Test Suite...' : 'Run Benchmark & Attestation Suite'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Assertion Test Results */}
      {suiteResult && (
        <div className={`p-6 rounded-3xl border transition-all ${
          suiteResult.allPassed ? 'bg-emerald-50/60 border-emerald-300' : 'bg-rose-50/60 border-rose-300'
        } space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {suiteResult.allPassed ? (
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {suiteResult.allPassed 
                    ? 'RAG Verification Test Suite Passed!' 
                    : `${suiteResult.passedCount} of ${suiteResult.totalCount} Test Vectors Passed`}
                </h3>
                <p className="text-xs text-slate-600">
                  Benchmark latency: {suiteResult.executionTimeMs}ms • Overall Precision Score: {suiteResult.totalScore}%
                </p>
              </div>
            </div>

            {suiteResult.allPassed && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                <Award className="w-4 h-4" />
                <span>RAG Architect Badge Minted</span>
              </span>
            )}
          </div>

          {/* Test Vector Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {suiteResult.testVectors.map((vec) => (
              <div
                key={vec.id}
                className={`p-3.5 rounded-2xl bg-white border text-xs space-y-1.5 shadow-xs ${
                  vec.passed ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{vec.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    vec.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {vec.passed ? 'PASSED' : 'FAILED'} ({vec.score}%)
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">{vec.description}</p>
                <div className="pt-1 font-mono text-[11px] text-slate-700 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  {vec.outputSummary}
                </div>
              </div>
            ))}
          </div>

          {/* Cryptographic Attestation Footer */}
          {suiteResult.allPassed && (
            <div className="p-3.5 bg-slate-900 text-slate-300 rounded-2xl font-mono text-[11px] space-y-1 border border-slate-800">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ATTESTATION SIGNATURE: {suiteResult.attestationRecord.signature}</span>
              </div>
              <div className="text-slate-400">
                Verification Hash: {suiteResult.attestationRecord.hash} • Code: {suiteResult.issuedBadge?.verificationCode}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
