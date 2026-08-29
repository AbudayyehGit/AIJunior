import React, { useState, useEffect } from 'react';
import { JobSource } from '../types';
import { 
  realTimeIngestion, 
  IngestionTelemetryEvent, 
  IngestionStatus 
} from '../services/ingestion/realtimeManager';
import { IngestionSyncReport, ScraperTelemetry } from '../services/ingestion';
import { 
  Radio, 
  RefreshCw, 
  Play, 
  Pause, 
  Terminal, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Layers,
  X,
  Activity,
  Globe,
  Sliders
} from 'lucide-react';

interface LiveIngestionBarProps {
  onManualTrigger: () => Promise<void>;
  isSyncing: boolean;
  lastReport: IngestionSyncReport | null;
}

export const LiveIngestionBar: React.FC<LiveIngestionBarProps> = ({
  onManualTrigger,
  isSyncing,
  lastReport
}) => {
  const [telemetry, setTelemetry] = useState<IngestionTelemetryEvent>(realTimeIngestion.getTelemetrySnapshot());
  const [showTerminal, setShowTerminal] = useState(false);
  const [intervalSetting, setIntervalSetting] = useState<number>(30);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = realTimeIngestion.subscribeTelemetry((event) => {
      setTelemetry(event);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleSource = (source: JobSource) => {
    realTimeIngestion.toggleSource(source);
  };

  const handleToggleAutoSync = () => {
    const nextState = !autoSyncEnabled;
    setAutoSyncEnabled(nextState);
    realTimeIngestion.setAutoSync(nextState, intervalSetting);
  };

  const handleChangeInterval = (secs: number) => {
    setIntervalSetting(secs);
    if (autoSyncEnabled) {
      realTimeIngestion.setAutoSync(true, secs);
    }
  };

  const sourcesList: { id: JobSource; name: string }[] = [
    { id: 'LinkedIn', name: 'LinkedIn' },
    { id: 'Wellfound', name: 'Wellfound' },
    { id: 'Indeed', name: 'Indeed' },
    { id: 'RemoteOK', name: 'RemoteOK' },
    { id: 'HackerNews', name: 'HackerNews' }
  ];

  return (
    <div id="live-ingestion-control-bar" className="space-y-3">
      <div className="bg-[#245170] border border-[#64A7CC]/40 rounded-3xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        {/* Subtle glowing ambient background */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-[#C59B27]/10 blur-2xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left section: Live Status & Source Pills */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Pulsing Status Beacon */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C3E56] border border-[#64A7CC]/50 text-[#FAF0D4] text-xs font-bold font-mono">
                <span className={`w-2 h-2 rounded-full ${autoSyncEnabled ? 'bg-[#C59B27] animate-ping' : 'bg-[#C0392B]'}`} />
                <span className="tracking-wide">
                  {isSyncing ? 'SYNCING LIVE FEEDS...' : autoSyncEnabled ? 'LIVE INGESTION ACTIVE' : 'INGESTION PAUSED'}
                </span>
              </div>

              {/* Countdown Ticker */}
              {autoSyncEnabled && !isSyncing && (
                <span className="text-xs font-mono text-[#E0EEF5] bg-[#1C3E56]/70 px-2.5 py-1 rounded-lg border border-[#64A7CC]/30">
                  Next auto-sweep in: <strong className="text-[#F4E0A9]">{telemetry.nextSyncCountdownSec}s</strong>
                </span>
              )}

              {/* Session admission counter */}
              <span className="text-xs font-mono text-[#E0EEF5] bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 hidden sm:inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F4E0A9]" />
                <span>Harvested Session: <strong className="text-white">{telemetry.totalAdmittedSession}</strong> admitted</span>
              </span>
            </div>

            {/* Active Sources Toggle Switcher */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-[#E0EEF5] font-semibold mr-1">Active Connectors:</span>
              {sourcesList.map((src) => {
                const isActive = telemetry.activeSources.includes(src.id);
                return (
                  <button
                    key={src.id}
                    id={`toggle-source-${src.id.toLowerCase()}`}
                    onClick={() => handleToggleSource(src.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-[#C59B27] text-white shadow-xs'
                        : 'bg-[#1C3E56]/60 text-[#C0DDEB] hover:bg-[#1C3E56]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#FAF0D4]' : 'bg-slate-500'}`} />
                    <span>{src.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right section: Action Buttons & Interval Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {/* Interval Selector */}
            <div className="flex items-center bg-[#1C3E56]/80 p-1 rounded-xl border border-[#64A7CC]/30 text-xs font-bold">
              {[15, 30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => handleChangeInterval(sec)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    intervalSetting === sec && autoSyncEnabled
                      ? 'bg-[#C59B27] text-white'
                      : 'text-[#E0EEF5] hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            {/* Auto-Sync Toggle Pause/Play */}
            <button
              onClick={handleToggleAutoSync}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                autoSyncEnabled
                  ? 'bg-[#C59B27]/20 text-[#F4E0A9] border-[#C59B27]/50 hover:bg-[#C59B27]/30'
                  : 'bg-[#3A7CA5]/30 text-[#E0EEF5] border-[#64A7CC]/40 hover:bg-[#3A7CA5]/50'
              }`}
              title={autoSyncEnabled ? 'Pause automated real-time background sync' : 'Resume real-time background sync'}
            >
              {autoSyncEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoSyncEnabled ? 'Pause' : 'Resume'}</span>
            </button>

            {/* Manual Sync Trigger */}
            <button
              id="trigger-instant-live-sync-btn"
              onClick={onManualTrigger}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#AA821C] text-white text-xs font-bold shadow-sanctuary-glow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Harvesting...' : '⚡ Ingest Live Now'}</span>
            </button>

            {/* Terminal Log Modal Toggle */}
            <button
              onClick={() => setShowTerminal(true)}
              className="p-2.5 rounded-xl bg-[#1C3E56]/70 hover:bg-[#1C3E56] text-[#E0EEF5] hover:text-white border border-[#64A7CC]/30 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Inspect live scraper JSON wire stream & validator logs"
            >
              <Terminal className="w-3.5 h-3.5 text-[#F4E0A9]" />
              <span className="hidden sm:inline">Wire Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Ingestion Wire Terminal Modal */}
      {showTerminal && (
        <div className="fixed inset-0 z-50 bg-[#17202A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#212F3D] border border-[#3A7CA5]/40 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C3E50] bg-[#17202A]">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#C0392B] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#C59B27] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#3A7CA5] inline-block" />
                </div>
                <h3 className="font-mono font-bold text-sm text-[#F4E0A9] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#C59B27]" />
                  <span>Real-Time Ingestion Engine Stream [Telemetry v1.0.0]</span>
                </h3>
              </div>

              <button
                onClick={() => setShowTerminal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#CCD2D8] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-[#E5E8EB]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#17202A] p-3 rounded-xl border border-[#2C3E50]">
                  <div className="text-[#A3AFB9] text-[10px] uppercase">Engine Status</div>
                  <div className="text-[#F4E0A9] font-bold text-sm">{telemetry.status}</div>
                </div>
                <div className="bg-[#17202A] p-3 rounded-xl border border-[#2C3E50]">
                  <div className="text-[#A3AFB9] text-[10px] uppercase">Active Channels</div>
                  <div className="text-[#94C4DC] font-bold text-sm">{telemetry.activeSources.length} Active</div>
                </div>
                <div className="bg-[#17202A] p-3 rounded-xl border border-[#2C3E50]">
                  <div className="text-[#A3AFB9] text-[10px] uppercase">Auto-Sweep Rate</div>
                  <div className="text-[#F4E0A9] font-bold text-sm">Every {intervalSetting}s</div>
                </div>
                <div className="bg-[#17202A] p-3 rounded-xl border border-[#2C3E50]">
                  <div className="text-[#A3AFB9] text-[10px] uppercase">Total Admitted</div>
                  <div className="text-[#FAF0D4] font-bold text-sm">+{telemetry.totalAdmittedSession} Clean Roles</div>
                </div>
              </div>

              {/* Scraper Channel Telemetry */}
              {lastReport && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#94C4DC]">
                    Live Connector Telemetry
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {Object.entries(lastReport.telemetry).map(([src, telData]) => {
                      const tel = telData as ScraperTelemetry;
                      return (
                        <div key={src} className="p-3 bg-[#17202A] rounded-xl border border-[#2C3E50] space-y-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-white">{src}</span>
                            <span className="text-[#F4E0A9]">{tel?.status || 'SUCCESS'}</span>
                          </div>
                          <div className="text-[10px] text-[#A3AFB9]">
                            Harvested: {tel?.rawFetchedCount || 0} | Latency: {tel?.fetchDurationMs || 0}ms
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rejection / Dropped Logs */}
              {lastReport && lastReport.rejectionSampleLogs.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C0392B] flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purged Non-Compliant Payload Stream (ISO Rules Gate)</span>
                  </div>
                  <div className="bg-[#17202A] p-3.5 rounded-xl border border-[#2C3E50] max-h-48 overflow-y-auto space-y-1.5">
                    {lastReport.rejectionSampleLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px]">
                        <span className="text-[#C0392B] shrink-0 font-bold">[DISQUALIFIED]</span>
                        <span className="text-[#94C4DC] shrink-0">[{log.source}]</span>
                        <span className="text-slate-200 font-semibold">{log.title} @ {log.company}:</span>
                        <span className="text-[#F4E0A9]">{log.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admitted Feed Stream */}
              {lastReport && lastReport.admittedJobs.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#FAF0D4] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Admitted Verified Junior Roles</span>
                  </div>
                  <div className="bg-[#17202A] p-3.5 rounded-xl border border-[#2C3E50] max-h-48 overflow-y-auto space-y-1.5">
                    {lastReport.admittedJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between text-[11px] border-b border-[#2C3E50] pb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[#C59B27] font-bold">[ADMITTED]</span>
                          <span className="text-[#94C4DC]">[{job.source}]</span>
                          <span className="text-white font-semibold">{job.title}</span>
                          <span className="text-[#A3AFB9]">({job.company})</span>
                        </div>
                        <span className="text-[#FAF0D4] font-bold">${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="px-6 py-3 border-t border-[#2C3E50] bg-[#17202A] flex items-center justify-between">
              <span className="text-[11px] text-[#A3AFB9] font-mono">
                Listening on SSE EventStream /api/ingest/stream
              </span>
              <button
                onClick={() => setShowTerminal(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
              >
                Close Terminal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

