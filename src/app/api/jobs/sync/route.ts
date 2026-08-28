import { runIngestionPipeline, RunPipelineOptions } from '../../../../services/ingestion';
import { JobSource } from '../../../../types';

/**
 * Server-Side API Endpoint: /api/jobs/sync
 * Handles automated cron sync or on-demand trigger to pull, validate, deduplicate,
 * and persist fresh multi-source job postings.
 */
export async function POST(request?: Request | { json?: () => Promise<any> }) {
  try {
    let body: any = {};
    if (request && typeof request.json === 'function') {
      body = await request.json().catch(() => ({}));
    }

    const sources: JobSource[] = body.sources || ['LinkedIn', 'Indeed', 'Wellfound'];
    const maxExperienceCap = typeof body.maxExperienceCap === 'number' ? body.maxExperienceCap : 2.0;
    const enforceMandatorySalary = body.enforceMandatorySalary !== false;

    const pipelineOptions: RunPipelineOptions = {
      sources,
      maxExperienceCap,
      enforceMandatorySalary
    };

    // Execute multi-source scraping, sanitization, validation, and deduplication
    const syncReport = await runIngestionPipeline(pipelineOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully synchronized ${syncReport.totalCleanAdmitted} clean entry-level roles`,
        report: syncReport
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Ingestion pipeline execution failed',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function GET(request?: Request) {
  // Support quick GET requests for health check or automated cron runners
  return POST(request);
}
