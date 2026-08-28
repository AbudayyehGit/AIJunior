import { Job } from '../../types';
import { FilterViolation } from './types';

export interface ValidationRuleResult {
  isValid: boolean;
  violations: FilterViolation[];
  sanitizedJob?: Job;
}

// Explicit senior/lead keywords that immediately disqualify a listing
const SENIORITY_DISQUALIFIERS = [
  /\bsenior\b/i,
  /\bsr\.?\b/i,
  /\blead\b/i,
  /\bprincipal\b/i,
  /\bstaff\b/i,
  /\barchitect\b/i,
  /\bdirector\b/i,
  /\bvp\b/i,
  /\bhead\s+of\b/i,
  /\bmanager\b/i,
  /\bteam\s+lead\b/i,
  /\bfounder\b/i,
  /\bdistinguished\b/i,
  /\bexpert\b/i
];

// Experience pattern matchers looking for >2 years required
const EXCESS_EXPERIENCE_PATTERNS = [
  /(\d+)\s*\+?\s*years?/i,
  /(\d+)\s*-\s*(\d+)\s*years?/i,
  /minimum\s*(?:of)?\s*(\d+)\s*years?/i,
  /at\s*least\s*(\d+)\s*years?/i,
  /(\d+)\s*yrs?/i
];

/**
 * Strict Entry-Level & Salary Validation Guard
 * Enforces Rule 1 (Experience Cap <= 2 Years) and Rule 2 (Compensation Mandate)
 */
export class IngestionValidator {
  /**
   * Rule 1: Scans job metadata, title, and body for forbidden senior keywords or experience requirements > 2.0 yrs
   */
  public static validateExperienceCeiling(job: Partial<Job>): { passed: boolean; violation?: FilterViolation } {
    const title = job.title || '';
    const desc = (job.description || '') + ' ' + (job.summary || '') + ' ' + (job.requirements || []).join(' ');

    // 1. Check Title for forbidden seniority markers
    for (const pattern of SENIORITY_DISQUALIFIERS) {
      if (pattern.test(title)) {
        return {
          passed: false,
          violation: {
            rule: 'TITLE_SENIORITY_FLAG',
            message: `Title "${title}" contains senior/leadership identifier matching ${pattern.toString()}`,
            field: 'title'
          }
        };
      }
    }

    // 2. Check explicit numeric experience property
    if (typeof job.experienceYears === 'number' && job.experienceYears > 2.0) {
      return {
        passed: false,
        violation: {
          rule: 'EXPERIENCE_CEILING_EXCEEDED',
          message: `Explicit experienceYears (${job.experienceYears} yrs) exceeds hard platform ceiling of ≤ 2.0 yrs`,
          detectedExp: job.experienceYears,
          field: 'experienceYears'
        }
      };
    }

    // 3. Scan description text for explicit year requirements > 2
    for (const pattern of EXCESS_EXPERIENCE_PATTERNS) {
      const match = desc.match(pattern);
      if (match) {
        const firstNum = parseInt(match[1], 10);
        // If range like "3-5 years" or "3+ years" or "4 years"
        if (!isNaN(firstNum) && firstNum > 2) {
          // Verify it's not a negated pattern (e.g. "no more than 2 years")
          const contextSlice = desc.substring(Math.max(0, match.index! - 20), Math.min(desc.length, match.index! + 30));
          if (!/no\s*more\s*than|maximum|less\s*than|not\s*exceed/i.test(contextSlice)) {
            return {
              passed: false,
              violation: {
                rule: 'EXPERIENCE_CEILING_EXCEEDED',
                message: `Requirement text snippet "${match[0]}" in description demands > 2 years experience (${firstNum}+ yrs)`,
                detectedExp: firstNum,
                field: 'description'
              }
            };
          }
        }
      }
    }

    return { passed: true };
  }

  /**
   * Rule 2: Compensation Mandate
   * Inspects salaryMin and salaryMax. If missing, unparseable, <= 0, or null, rejects immediately.
   */
  public static validateCompensationMandate(job: Partial<Job>): { passed: boolean; violation?: FilterViolation } {
    const min = job.salaryMin;
    const max = job.salaryMax;

    if (min === undefined || min === null || isNaN(min) || min <= 0) {
      return {
        passed: false,
        violation: {
          rule: 'COMPENSATION_MISSING_OR_NULL',
          message: 'Mandatory minimum compensation (salaryMin) is missing, zero, or null. Obfuscated pay is prohibited.',
          field: 'salaryMin'
        }
      };
    }

    if (max === undefined || max === null || isNaN(max) || max <= 0) {
      return {
        passed: false,
        violation: {
          rule: 'COMPENSATION_MISSING_OR_NULL',
          message: 'Mandatory maximum compensation (salaryMax) is missing, zero, or null. Obfuscated pay is prohibited.',
          field: 'salaryMax'
        }
      };
    }

    if (min > max) {
      return {
        passed: false,
        violation: {
          rule: 'COMPENSATION_MISSING_OR_NULL',
          message: `Inverted compensation range: salaryMin ($${min}) is greater than salaryMax ($${max})`,
          field: 'salaryRange'
        }
      };
    }

    return { passed: true };
  }

  /**
   * Evaluates a full job candidate through all filter gates and sanitizes fields.
   */
  public static validateAndSanitize(job: Job): ValidationRuleResult {
    const violations: FilterViolation[] = [];

    // Gate 1: Experience & Seniority
    const expResult = this.validateExperienceCeiling(job);
    if (!expResult.passed && expResult.violation) {
      violations.push(expResult.violation);
    }

    // Gate 2: Salary Mandate
    const salaryResult = this.validateCompensationMandate(job);
    if (!salaryResult.passed && salaryResult.violation) {
      violations.push(salaryResult.violation);
    }

    if (violations.length > 0) {
      return {
        isValid: false,
        violations
      };
    }

    // Sanitize and assign simulator recommendations based on tags & title
    const sanitizedJob: Job = {
      ...job,
      title: job.title.trim(),
      company: job.company.trim(),
      summary: this.stripHtml(job.summary).trim(),
      description: this.stripHtml(job.description).trim(),
      isVerifiedEntry: true,
      isSalaryGuaranteed: true,
      simulatorsRecommended: this.inferRecommendedSimulators(job)
    };

    return {
      isValid: true,
      violations: [],
      sanitizedJob
    };
  }

  /**
   * Helper to strip HTML tags and encode clean text
   */
  private static stripHtml(input: string): string {
    if (!input) return '';
    return input.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Auto-assign relevant skill sandboxes based on tech tags & title keywords
   */
  private static inferRecommendedSimulators(job: Partial<Job>): string[] {
    const recs: string[] = [];
    const text = ((job.title || '') + ' ' + (job.tags || []).join(' ') + ' ' + (job.description || '')).toLowerCase();

    if (/rag|vector|retrieval|embedding|chunk|pinecone|qdrant|chroma/i.test(text)) {
      recs.push('sim-rag-config');
    }
    if (/token|cost|budget|latency|inference|ops|eval|benchmark|optimiz/i.test(text)) {
      recs.push('sim-token-cost');
    }
    if (/prompt|guard|safety|jailbreak|align|red\s*team|security/i.test(text)) {
      recs.push('sim-prompt-guard');
    }

    // Default to at least one simulator if none inferred
    if (recs.length === 0) {
      recs.push('sim-token-cost');
    }

    return Array.from(new Set(recs));
  }
}
