import { Job, JobSource } from '../../types';
import { IngestionSyncReport, ScraperTelemetry } from './types';
import { linkedInConnector } from './scrapers/linkedin';
import { indeedConnector } from './scrapers/indeed';
import { wellfoundConnector } from './scrapers/wellfound';
import { remoteOKConnector } from './scrapers/remoteok';
import { hackerNewsConnector } from './scrapers/hackernews';
import { IngestionNormalizer } from './normalizer';
import { IngestionValidator } from './validator';

export interface RunPipelineOptions {
  sources?: JobSource[];
  maxExperienceCap?: number; // default 2.0
  enforceMandatorySalary?: boolean; // default true
}

/**
 * End-to-end Multi-Source Ingestion Pipeline Orchestrator
 */
export async function runIngestionPipeline(options?: RunPipelineOptions): Promise<IngestionSyncReport> {
  const startTime = Date.now();
  const sourcesToScrape: JobSource[] = options?.sources || ['LinkedIn', 'Indeed', 'Wellfound', 'RemoteOK', 'HackerNews'];
  
  const telemetryMap: Record<JobSource, ScraperTelemetry> = {
    LinkedIn: { source: 'LinkedIn', fetchDurationMs: 0, rawFetchedCount: 0, networkRetries: 0, proxyRotations: 0, rateLimitHits: 0, status: 'SUCCESS' },
    Indeed: { source: 'Indeed', fetchDurationMs: 0, rawFetchedCount: 0, networkRetries: 0, proxyRotations: 0, rateLimitHits: 0, status: 'SUCCESS' },
    Wellfound: { source: 'Wellfound', fetchDurationMs: 0, rawFetchedCount: 0, networkRetries: 0, proxyRotations: 0, rateLimitHits: 0, status: 'SUCCESS' },
    RemoteOK: { source: 'RemoteOK', fetchDurationMs: 0, rawFetchedCount: 0, networkRetries: 0, proxyRotations: 0, rateLimitHits: 0, status: 'SUCCESS' },
    HackerNews: { source: 'HackerNews', fetchDurationMs: 0, rawFetchedCount: 0, networkRetries: 0, proxyRotations: 0, rateLimitHits: 0, status: 'SUCCESS' },
    Direct: { source: 'Direct', fetchDurationMs: 0, rawFetchedCount: 0, networkRetries: 0, proxyRotations: 0, rateLimitHits: 0, status: 'SUCCESS' }
  };

  const rawJobs: Job[] = [];
  let totalRawHarvested = 0;

  // 1. Fetch concurrently across requested multi-source scrapers
  const fetchTasks: Promise<void>[] = [];

  if (sourcesToScrape.includes('LinkedIn')) {
    fetchTasks.push(
      linkedInConnector.fetchRawListings().then((res) => {
        telemetryMap.LinkedIn = res.telemetry;
        totalRawHarvested += res.jobs.length;
        res.jobs.forEach((raw) => rawJobs.push(IngestionNormalizer.normalizeLinkedIn(raw)));
      })
    );
  }

  if (sourcesToScrape.includes('Indeed')) {
    fetchTasks.push(
      indeedConnector.fetchRawListings().then((res) => {
        telemetryMap.Indeed = res.telemetry;
        totalRawHarvested += res.jobs.length;
        res.jobs.forEach((raw) => rawJobs.push(IngestionNormalizer.normalizeIndeed(raw)));
      })
    );
  }

  if (sourcesToScrape.includes('Wellfound')) {
    fetchTasks.push(
      wellfoundConnector.fetchRawListings().then((res) => {
        telemetryMap.Wellfound = res.telemetry;
        totalRawHarvested += res.jobs.length;
        res.jobs.forEach((raw) => rawJobs.push(IngestionNormalizer.normalizeWellfound(raw)));
      })
    );
  }

  if (sourcesToScrape.includes('RemoteOK')) {
    fetchTasks.push(
      remoteOKConnector.fetchRawListings().then((res) => {
        telemetryMap.RemoteOK = res.telemetry;
        totalRawHarvested += res.jobs.length;
        res.jobs.forEach((raw) => rawJobs.push(IngestionNormalizer.normalizeRemoteOK(raw)));
      })
    );
  }

  if (sourcesToScrape.includes('HackerNews')) {
    fetchTasks.push(
      hackerNewsConnector.fetchRawListings().then((res) => {
        telemetryMap.HackerNews = res.telemetry;
        totalRawHarvested += res.jobs.length;
        res.jobs.forEach((raw) => rawJobs.push(IngestionNormalizer.normalizeHackerNews(raw)));
      })
    );
  }

  await Promise.all(fetchTasks);

  // 2. Strict Entry-Level & Salary Validation Guard
  let rejectedSeniorityOrExp = 0;
  let rejectedMissingCompensation = 0;
  const validatedJobs: Job[] = [];
  const rejectionSampleLogs: IngestionSyncReport['rejectionSampleLogs'] = [];

  for (const rawJob of rawJobs) {
    const validation = IngestionValidator.validateAndSanitize(rawJob);
    if (validation.isValid && validation.sanitizedJob) {
      validatedJobs.push(validation.sanitizedJob);
    } else {
      for (const violation of validation.violations) {
        if (violation.rule === 'EXPERIENCE_CEILING_EXCEEDED' || violation.rule === 'TITLE_SENIORITY_FLAG') {
          rejectedSeniorityOrExp++;
        } else if (violation.rule === 'COMPENSATION_MISSING_OR_NULL') {
          rejectedMissingCompensation++;
        }
        rejectionSampleLogs.push({
          title: rawJob.title,
          company: rawJob.company,
          source: rawJob.source,
          reason: violation.message
        });
      }
    }
  }

  // 3. Normalization & Cross-Platform Deduplication
  const { uniqueJobs, duplicateCount } = IngestionNormalizer.deduplicateJobs(validatedJobs);

  const durationMs = Date.now() - startTime;

  return {
    id: `sync-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    executionTimeMs: durationMs,
    telemetry: telemetryMap,
    totalRawHarvested,
    rejectedSeniorityOrExp,
    rejectedMissingCompensation,
    rejectedFuzzyDuplicates: duplicateCount,
    totalCleanAdmitted: uniqueJobs.length,
    admittedJobs: uniqueJobs,
    rejectionSampleLogs
  };
}

export * from './types';
export * from './validator';
export * from './normalizer';
export * from './scrapers/linkedin';
export * from './scrapers/indeed';
export * from './scrapers/wellfound';
export * from './scrapers/remoteok';
export * from './scrapers/hackernews';

