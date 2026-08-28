import { UserRole, SecurityAuditLog } from '../types';

/**
 * Enterprise Web Application Security & AppSec Framework (v0.8.0)
 * Provides CSRF mitigation, HTTPS header enforcement, rate-limiting,
 * PII masking, token hashing, and SQL injection sanitizers.
 */

// ==========================================
// 1. CSRF Mitigation & Session Protection
// ==========================================

export function generateCsrfToken(): string {
  const rand = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  const timestamp = Date.now().toString(36);
  return `csrf_${timestamp}_${rand}`;
}

export function validateCsrfToken(submittedToken?: string | null, sessionToken?: string | null): boolean {
  if (!submittedToken || !sessionToken) return false;
  return submittedToken === sessionToken && submittedToken.startsWith('csrf_');
}

// ==========================================
// 2. HTTPS & AppSec Security Headers
// ==========================================

export interface SecurityHeadersConfig {
  'Content-Security-Policy': string;
  'Strict-Transport-Security': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'X-Permitted-Cross-Domain-Policies': string;
}

export function getSecurityHeaders(): SecurityHeadersConfig {
  return {
    'Content-Security-Policy': 
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';",
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'X-Permitted-Cross-Domain-Policies': 'none'
  };
}

// ==========================================
// 3. Sliding-Window Rate Limiter
// ==========================================

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  currentCount: number;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * In-memory sliding window rate limiter
 * @param key Identifier (e.g. IP address + route)
 * @param limit Max requests allowed in window
 * @param windowMs Window duration in milliseconds (default: 60s)
 */
export function checkRateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter out timestamps outside the current sliding window
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  const currentCount = record.timestamps.length;
  const allowed = currentCount < limit;

  if (allowed) {
    record.timestamps.push(now);
  }
  rateLimitStore.set(key, record);

  const oldestTimestamp = record.timestamps[0] || now;
  const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

  return {
    allowed,
    currentCount: record.timestamps.length,
    limit,
    remaining: Math.max(0, limit - record.timestamps.length),
    resetSeconds
  };
}

// ==========================================
// 4. Data Privacy, PII Encryption & Masking
// ==========================================

/**
 * Masks PII data (emails, phone numbers, auth secrets) for transit logs and audit trails
 */
export function maskPiiForLogging(text: string): string {
  if (!text) return '';

  return text
    // Mask API Keys (e.g. sk_live_..., ghp_...)
    .replace(/\b(sk_live_[a-zA-Z0-9]{12,}|ghp_[a-zA-Z0-9]{12,}|AKIA[A-Z0-9]{16})\b/g, '[REDACTED_API_KEY]')
    // Mask Email addresses: j***@domain.com
    .replace(/\b([a-zA-Z0-9_.+-])[a-zA-Z0-9_.+-]*@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)\b/g, '$1***@$2')
    // Mask Phone numbers: (***) ***-1234
    .replace(/\b(\+?\d{1,2}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?(\d{4})\b/g, '***-***-$2')
    // Mask Credit cards: ****-****-****-1234
    .replace(/\b(?:\d{4}[-\s]?){3}(\d{4})\b/g, '****-****-****-$1');
}

/**
 * Simulates AES-256 GCM cryptographic envelope for Supabase DB storage
 */
export function encryptAtRestSimulation(data: string, keyId: string = 'kms-key-v1'): {
  ciphertext: string;
  iv: string;
  tag: string;
  keyId: string;
} {
  const iv = Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const tag = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  // Base64 hex representation
  const ciphertext = `enc_gcm_${btoa(unescape(encodeURIComponent(data)))}`;

  return {
    ciphertext,
    iv,
    tag,
    keyId
  };
}

// ==========================================
// 5. Input Sanitization & SQL Parameterization Check
// ==========================================

/**
 * Sanitizes untrusted user strings against XSS injection
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates queries against SQL injection patterns before execution on Supabase / PostgreSQL
 */
export function validateSafeParameterizedQuery(query: string): {
  isSafe: boolean;
  violationReason?: string;
} {
  const forbiddenPatterns = [
    /;\s*DROP\s+TABLE/i,
    /;\s*DELETE\s+FROM/i,
    /;\s*TRUNCATE/i,
    /UNION\s+SELECT/i,
    /'\s+OR\s+'1'='1/i,
    /--\s*$/m,
    /\/\*[\s\S]*?\*\//
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(query)) {
      return {
        isSafe: false,
        violationReason: `Potentially malicious SQL query pattern detected: ${pattern.source}`
      };
    }
  }

  return { isSafe: true };
}

// ==========================================
// 6. Role-Based Access Control (RBAC)
// ==========================================

export type AppPermission = 
  | 'view_jobs'
  | 'save_jobs'
  | 'take_simulators'
  | 'post_jobs'
  | 'view_candidates'
  | 'export_candidates'
  | 'moderate_jobs'
  | 'purge_jobs'
  | 'manage_roles'
  | 'view_security_logs'
  | 'trigger_ingestion_sync';

export const ROLE_PERMISSIONS: Record<UserRole, AppPermission[]> = {
  job_seeker: [
    'view_jobs',
    'save_jobs',
    'take_simulators'
  ],
  recruiter: [
    'view_jobs',
    'post_jobs',
    'view_candidates',
    'export_candidates',
    'take_simulators'
  ],
  admin: [
    'view_jobs',
    'save_jobs',
    'take_simulators',
    'post_jobs',
    'view_candidates',
    'export_candidates',
    'moderate_jobs',
    'purge_jobs',
    'manage_roles',
    'view_security_logs',
    'trigger_ingestion_sync'
  ]
};

export function hasPermission(role: UserRole, permission: AppPermission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function assertRoleAuthorized(currentRole: UserRole, allowedRoles: UserRole[]): {
  authorized: boolean;
  error?: string;
} {
  if (!allowedRoles.includes(currentRole)) {
    return {
      authorized: false,
      error: `Access Denied: Role '${currentRole}' lacks sufficient privileges. Required: [${allowedRoles.join(', ')}]`
    };
  }
  return { authorized: true };
}
