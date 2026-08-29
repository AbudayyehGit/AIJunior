import { Job, JobSource } from '../../types';
import { runIngestionPipeline, IngestionSyncReport } from './index';

export type IngestionStatus = 'CONNECTED' | 'SYNCING' | 'PAUSED' | 'IDLE';

export interface IngestionTelemetryEvent {
  status: IngestionStatus;
  lastSyncReport: IngestionSyncReport | null;
  nextSyncCountdownSec: number;
  totalHarvestedSession: number;
  totalAdmittedSession: number;
  activeSources: JobSource[];
}

export type AdmittedJobsListener = (newJobs: Job[], report: IngestionSyncReport) => void;
export type TelemetryListener = (event: IngestionTelemetryEvent) => void;

/**
 * RealTimeIngestionEngine
 * Manages live real-time continuous ingestion, auto-polling schedules,
 * worker telemetry, and instant broadcast of newly admitted junior AI roles.
 */
class RealTimeIngestionEngine {
  private activeSources: JobSource[] = ['LinkedIn', 'Indeed', 'Wellfound', 'RemoteOK', 'HackerNews'];
  private isAutoSyncActive: boolean = true;
  private syncIntervalSec: number = 30;
  private countdownSec: number = 30;
  private intervalTimer: NodeJS.Timeout | null = null;
  private countdownTimer: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;
  private status: IngestionStatus = 'CONNECTED';
  private lastReport: IngestionSyncReport | null = null;
  private totalHarvestedSession: number = 0;
  private totalAdmittedSession: number = 0;
  private dynamicIndex: number = 0;

  private admittedListeners: Set<AdmittedJobsListener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();

  constructor() {
    this.startCountdown();
  }

  public getActiveSources(): JobSource[] {
    return [...this.activeSources];
  }

  public setActiveSources(sources: JobSource[]) {
    this.activeSources = sources.length > 0 ? sources : ['LinkedIn'];
    this.broadcastTelemetry();
  }

  public toggleSource(source: JobSource) {
    if (this.activeSources.includes(source)) {
      if (this.activeSources.length > 1) {
        this.activeSources = this.activeSources.filter((s) => s !== source);
      }
    } else {
      this.activeSources = [...this.activeSources, source];
    }
    this.broadcastTelemetry();
  }

  public setAutoSync(active: boolean, intervalSeconds: number = 30) {
    this.isAutoSyncActive = active;
    this.syncIntervalSec = intervalSeconds;
    this.countdownSec = intervalSeconds;
    this.status = active ? 'CONNECTED' : 'PAUSED';

    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }

    if (active) {
      this.intervalTimer = setInterval(() => {
        this.triggerLiveIngest();
      }, this.syncIntervalSec * 1000);
    }

    this.broadcastTelemetry();
  }

  public isAutoSync(): boolean {
    return this.isAutoSyncActive;
  }

  public getSyncInterval(): number {
    return this.syncIntervalSec;
  }

  public getStatus(): IngestionStatus {
    return this.status;
  }

  public subscribeAdmittedJobs(listener: AdmittedJobsListener): () => void {
    this.admittedListeners.add(listener);
    return () => this.admittedListeners.delete(listener);
  }

  public subscribeTelemetry(listener: TelemetryListener): () => void {
    this.telemetryListeners.add(listener);
    // Send immediate initial state
    listener(this.getTelemetrySnapshot());
    return () => this.telemetryListeners.delete(listener);
  }

  public getTelemetrySnapshot(): IngestionTelemetryEvent {
    return {
      status: this.status,
      lastSyncReport: this.lastReport,
      nextSyncCountdownSec: this.countdownSec,
      totalHarvestedSession: this.totalHarvestedSession,
      totalAdmittedSession: this.totalAdmittedSession,
      activeSources: [...this.activeSources]
    };
  }

  /**
   * Trigger an immediate live multi-source ingestion run
   */
  public async triggerLiveIngest(): Promise<IngestionSyncReport> {
    if (this.isSyncing) {
      return this.lastReport || (await this.buildEmptyReport());
    }

    this.isSyncing = true;
    this.status = 'SYNCING';
    this.countdownSec = this.syncIntervalSec;
    this.broadcastTelemetry();

    try {
      const report = await runIngestionPipeline({
        sources: this.activeSources,
        maxExperienceCap: 2.0,
        enforceMandatorySalary: true
      });

      this.lastReport = report;
      this.totalHarvestedSession += report.totalRawHarvested;
      this.totalAdmittedSession += report.totalCleanAdmitted;
      this.status = this.isAutoSyncActive ? 'CONNECTED' : 'IDLE';

      // Notify all subscribers of newly admitted jobs
      if (report.admittedJobs.length > 0) {
        this.admittedListeners.forEach((listener) => {
          try {
            listener(report.admittedJobs, report);
          } catch (e) {
            console.error('Error in admitted listener:', e);
          }
        });
      }

      this.broadcastTelemetry();
      return report;
    } catch (err) {
      console.error('Ingestion pipeline execution failure:', err);
      this.status = 'IDLE';
      this.broadcastTelemetry();
      return await this.buildEmptyReport();
    } finally {
      this.isSyncing = false;
    }
  }

  private startCountdown() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = setInterval(() => {
      if (this.isAutoSyncActive && !this.isSyncing) {
        this.countdownSec = Math.max(0, this.countdownSec - 1);
        if (this.countdownSec === 0) {
          this.countdownSec = this.syncIntervalSec;
          this.triggerLiveIngest();
        } else {
          this.broadcastTelemetry();
        }
      }
    }, 1000);
  }

  private broadcastTelemetry() {
    const snapshot = this.getTelemetrySnapshot();
    this.telemetryListeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (e) {
        console.error('Error in telemetry listener:', e);
      }
    });
  }

  private async buildEmptyReport(): Promise<IngestionSyncReport> {
    return {
      id: `sync-empty-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      executionTimeMs: 0,
      telemetry: {} as any,
      totalRawHarvested: 0,
      rejectedSeniorityOrExp: 0,
      rejectedMissingCompensation: 0,
      rejectedFuzzyDuplicates: 0,
      totalCleanAdmitted: 0,
      admittedJobs: [],
      rejectionSampleLogs: []
    };
  }
}

export const realTimeIngestion = new RealTimeIngestionEngine();
