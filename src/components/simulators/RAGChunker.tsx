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
      <div className="bg-[#245170] rounded-3xl p-6 text-white border border-[#64A7CC]/40 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#1C3E56] text-[#FAF0D4] border border-[#64A7CC]/40">
              <Database className="w-5 h-5 text-[#C59B27]" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">RAG Context Window &amp; Noise-Filtering Challenge</h2>
              <p className="text-xs text-[#E0EEF5]">Tune chunking bounds, sliding overlap, and cosine threshold to filter noise and prevent hallucinations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#E0EEF5] font-semibold">Retrieval Strategy:</span>
            <select
              value={retrievalStrategy}
              onChange={(e) => setRetrievalStrategy(e.target.value as any)}
              className="bg-[#1C3E56] text-[#FAF0D4] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#64A7CC]/40 focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
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
          <div className="p-3.5 rounded-2xl bg-[#1C3E56]/90 border border-[#64A7CC]/30 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#E0EEF5]">Retrieval Precision</div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black font-mono ${metrics.precisionPct >= 85 ? 'text-[#FAF0D4]' : 'text-[#E0EEF5]'}`}>
                {metrics.precisionPct}%
              </span>
              <span className="text-xs text-[#CCD2D8]">signal-to-noise</span>
            </div>
          </div>

          {/* Hallucination Risk Indicator */}
          <div className="p-3.5 rounded-2xl bg-[#1C3E56]/90 border border-[#64A7CC]/30 space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#E0EEF5]">
              <span>Hallucination Risk</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                metrics.hallucinationRiskPct <= 15 ? 'bg-[#FAF0D4] text-[#8A6714] border border-[#C59B27]/40' : 'bg-[#FCECEB] text-[#C0392B] border border-[#C0392B]/40'
              }`}>
                {metrics.hallucinationRiskPct <= 15 ? 'LOW' : 'ELEVATED'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black font-mono ${metrics.hallucinationRiskPct <= 15 ? 'text-[#FAF0D4]' : 'text-[#E57373]'}`}>
                {metrics.hallucinationRiskPct}%
              </span>
              <span className="text-xs text-[#CCD2D8]">risk index</span>
            </div>
          </div>

          {/* Context Tokens */}
          <div className="p-3.5 rounded-2xl bg-[#1C3E56]/90 border border-[#64A7CC]/30 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#E0EEF5]">Retrieved Context</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-[#FAF0D4]">
                {metrics.contextWindowTokens}
              </span>
              <span className="text-xs text-[#CCD2D8]">tokens ({metrics.retrievedCount} chunks)</span>
            </div>
          </div>

          {/* Query Latency */}
          <div className="p-3.5 rounded-2xl bg-[#1C3E56]/90 border border-[#64A7CC]/30 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#E0EEF5]">Vector Search Latency</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-[#C59B27]">
                {metrics.meanLatencyMs}ms
              </span>
              <span className="text-xs text-[#CCD2D8]">kNN lookup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Document Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Hyperparameter Sliders */}
        <div className="bg-[#FBFBFA] rounded-3xl border border-[#CCD2D8] p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#2C3E50] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#3A7CA5]" />
              <span>RAG Hyperparameters</span>
            </h3>
            <button
              onClick={handleResetDefaults}
              className="text-xs text-[#6E8193] hover:text-[#2C3E50] font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Slider 1: Chunk Size */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-[#2C3E50]">
              <span>Chunk Size (tokens)</span>
              <span className="font-mono text-[#3A7CA5] font-black">{chunkSize} tokens</span>
            </div>
            <input
              type="range"
              min={64}
              max={1024}
              step={32}
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="w-full accent-[#C59B27]"
            />
            <div className="flex justify-between text-[10px] text-[#6E8193]">
              <span>64 (Fragmented)</span>
              <span className="text-[#8A6714] font-bold">256-512 Optimal</span>
              <span>1024 (Diluted)</span>
            </div>
          </div>

          {/* Slider 2: Chunk Overlap */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-[#2C3E50]">
              <span>Sliding Window Overlap (%)</span>
              <span className="font-mono text-[#3A7CA5] font-black">{chunkOverlap}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
              className="w-full accent-[#C59B27]"
            />
            <div className="flex justify-between text-[10px] text-[#6E8193]">
              <span>0% (No boundary)</span>
              <span className="text-[#8A6714] font-bold">10-25% Optimal</span>
              <span>40% (Redundant)</span>
            </div>
          </div>

          {/* Slider 3: Cosine Similarity Threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-[#2C3E50]">
              <span>Similarity Cutoff Threshold</span>
              <span className="font-mono text-[#3A7CA5] font-black">{similarityThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.50}
              max={0.95}
              step={0.02}
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
              className="w-full accent-[#C59B27]"
            />
            <div className="flex justify-between text-[10px] text-[#6E8193]">
              <span>0.50 (Permissive)</span>
              <span className="text-[#8A6714] font-bold">0.70-0.88 Optimal</span>
              <span>0.95 (Strict)</span>
            </div>
          </div>

          {/* Slider 4: Top-K Retained */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-[#2C3E50]">
              <span>Top-K Context Chunks</span>
              <span className="font-mono text-[#3A7CA5] font-black">Top {topK}</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-[#C59B27]"
            />
            <div className="flex justify-between text-[10px] text-[#6E8193]">
              <span>1</span>
              <span className="text-[#8A6714] font-bold">2-4 Optimal</span>
              <span>6</span>
            </div>
          </div>

          {/* Query Selector */}
          <div className="pt-2 space-y-1.5 border-t border-[#CCD2D8]">
            <label className="text-xs font-bold uppercase text-[#6E8193]">Benchmark Probe Query</label>
            <select
              value={selectedQueryId}
              onChange={(e) => setSelectedQueryId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#CCD2D8] bg-[#F4F4F0] text-xs font-semibold text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
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
        <div className="lg:col-span-2 bg-[#FBFBFA] rounded-3xl border border-[#CCD2D8] p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#2C3E50] flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-[#3A7CA5]" />
                  <span>Unstructured Document Chunks &amp; Cosine Scores</span>
                </h3>
                <p className="text-xs text-[#6E8193]">Luminous Alabaster = Admitted to LLM context | Muted = Filtered by cosine cutoff</p>
              </div>
            </div>

            {/* Chunks List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {simulatedChunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1.5 ${
                    chunk.retained
                      ? 'bg-[#FAF0D4]/70 border-[#C59B27]/50'
                      : 'bg-[#F4F4F0] border-[#CCD2D8] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2C3E50]">{chunk.sourceTopic}</span>
                      {chunk.isNoise && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FCECEB] text-[#C0392B] border border-[#C0392B]/30">
                          Irrelevant Noise
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#4A5D70]">
                        Cosine Sim: <strong>{chunk.score}</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        chunk.retained ? 'bg-[#C59B27] text-white' : 'bg-[#CCD2D8] text-[#2C3E50]'
                      }`}>
                        {chunk.retained ? 'RETAINED' : 'FILTERED'}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#4A5D70] text-[11px] leading-relaxed font-sans">{chunk.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmark Action Bar */}
          <div className="pt-4 border-t border-[#CCD2D8] flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#6E8193]">
              Evaluates chunk boundaries, sliding overlap continuity, and cosine precision.
            </div>

            <button
              id="execute-rag-assertions-btn"
              onClick={handleRunSuite}
              disabled={isRunningSuite}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#C59B27] hover:bg-[#AA821C] text-white font-bold text-xs shadow-sanctuary-glow transition-all disabled:opacity-50"
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
          suiteResult.allPassed ? 'bg-[#FAF0D4]/70 border-[#C59B27]/50 shadow-sanctuary-gold' : 'bg-[#FCECEB]/70 border-[#C0392B]/40'
        } space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {suiteResult.allPassed ? (
                <div className="p-2 bg-[#C59B27] text-white rounded-xl shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 bg-[#FCECEB] text-[#C0392B] rounded-xl border border-[#C0392B]/30">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-base font-black text-[#2C3E50]">
                  {suiteResult.allPassed 
                    ? 'RAG Verification Test Suite Passed!' 
                    : `${suiteResult.passedCount} of ${suiteResult.totalCount} Test Vectors Passed`}
                </h3>
                <p className="text-xs text-[#4A5D70]">
                  Benchmark latency: {suiteResult.executionTimeMs}ms • Overall Precision Score: {suiteResult.totalScore}%
                </p>
              </div>
            </div>

            {suiteResult.allPassed && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C59B27] text-white text-xs font-bold shadow-sanctuary-glow">
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
                className={`p-3.5 rounded-2xl bg-[#FBFBFA] border text-xs space-y-1.5 shadow-xs ${
                  vec.passed ? 'border-[#C59B27]/40' : 'border-[#C0392B]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2C3E50]">{vec.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    vec.passed ? 'bg-[#FAF0D4] text-[#8A6714] border border-[#C59B27]/40' : 'bg-[#FCECEB] text-[#C0392B] border border-[#C0392B]/30'
                  }`}>
                    {vec.passed ? 'PASSED' : 'FAILED'} ({vec.score}%)
                  </span>
                </div>
                <p className="text-[#6E8193] text-[11px]">{vec.description}</p>
                <div className="pt-1 font-mono text-[11px] text-[#2C3E50] bg-[#F4F4F0] p-1.5 rounded-lg border border-[#CCD2D8]">
                  {vec.outputSummary}
                </div>
              </div>
            ))}
          </div>

          {/* Cryptographic Attestation Footer */}
          {suiteResult.allPassed && (
            <div className="p-3.5 bg-[#17202A] text-[#E0EEF5] rounded-2xl font-mono text-[11px] space-y-1 border border-[#C59B27]/40">
              <div className="text-[#FAF0D4] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>ATTESTATION SIGNATURE: {suiteResult.attestationRecord.signature}</span>
              </div>
              <div className="text-[#CCD2D8]">
                Verification Hash: {suiteResult.attestationRecord.hash} • Code: {suiteResult.issuedBadge?.verificationCode}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

