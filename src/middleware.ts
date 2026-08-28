import { UserRole } from './types';
import { 
  getSecurityHeaders, 
  checkRateLimit, 
  validateCsrfToken, 
  assertRoleAuthorized,
  maskPiiForLogging
} from './utils/security';

export interface MiddlewareSessionContext {
  userId?: string;
  role: UserRole;
  ipAddress: string;
  csrfToken?: string;
  authToken?: string;
}

export interface MiddlewareResponse {
  allowed: boolean;
  status: number;
  headers: Record<string, string>;
  error?: string;
  redirectUrl?: string;
}

/**
 * Route Permission Definitions
 */
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/dashboard/seeker': ['job_seeker', 'admin'],
  '/dashboard/recruiter': ['recruiter', 'admin'],
  '/admin': ['admin'],
  '/api/admin': ['admin'],
  '/api/jobs/sync': ['admin'],
  '/api/jobs/post': ['recruiter', 'admin'],
  '/api/simulators/submit': ['job_seeker', 'recruiter', 'admin']
};

/**
 * Core Global Middleware Function
 * Handles security headers, CSRF checks on mutating requests (POST/PUT/DELETE),
 * rate-limiting on sensitive endpoints, and RBAC authorization.
 */
export function appMiddleware(
  pathname: string,
  method: string = 'GET',
  session: MiddlewareSessionContext,
  headers: Record<string, string> = {}
): MiddlewareResponse {
  const securityHeaders = getSecurityHeaders() as unknown as Record<string, string>;
  const clientIp = session.ipAddress || '127.0.0.1';

  // 1. Rate Limiting Check on Sensitive Endpoints
  const isSyncEndpoint = pathname.startsWith('/api/jobs/sync');
  const isSimulatorSubmit = pathname.startsWith('/api/simulators/submit');

  if (isSyncEndpoint) {
    const rateLimit = checkRateLimit(`rate_sync_${clientIp}`, 10, 60000); // 10 syncs per minute
    if (!rateLimit.allowed) {
      return {
        allowed: false,
        status: 429,
        headers: {
          ...securityHeaders,
          'Retry-After': rateLimit.resetSeconds.toString()
        },
        error: `Rate Limit Exceeded: Max 10 sync calls per minute. Retry in ${rateLimit.resetSeconds}s.`
      };
    }
  }

  if (isSimulatorSubmit) {
    const rateLimit = checkRateLimit(`rate_sim_${clientIp}`, 20, 60000); // 20 submissions per minute
    if (!rateLimit.allowed) {
      return {
        allowed: false,
        status: 429,
        headers: {
          ...securityHeaders,
          'Retry-After': rateLimit.resetSeconds.toString()
        },
        error: 'Too many simulator submissions. Please wait 60 seconds.'
      };
    }
  }

  // 2. CSRF Token Validation on Mutation Requests
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase());
  if (isMutation && !pathname.startsWith('/api/public/')) {
    const submittedCsrf = headers['x-csrf-token'] || session.csrfToken;
    const sessionCsrf = session.csrfToken;
    
    // In dev simulation, validate token format
    if (submittedCsrf && !validateCsrfToken(submittedCsrf, sessionCsrf)) {
      return {
        allowed: false,
        status: 403,
        headers: securityHeaders,
        error: 'Invalid or missing CSRF token. Cross-site mutation blocked.'
      };
    }
  }

  // 3. RBAC Route Protection
  for (const [routePrefix, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(routePrefix)) {
      const authCheck = assertRoleAuthorized(session.role, allowedRoles);
      if (!authCheck.authorized) {
        return {
          allowed: false,
          status: 403,
          headers: securityHeaders,
          error: authCheck.error || 'Access Denied: Insufficient Role Privileges',
          redirectUrl: session.role === 'job_seeker' ? '/dashboard/seeker' : '/dashboard/recruiter'
        };
      }
    }
  }

  // 4. Return permitted response with enterprise security headers
  return {
    allowed: true,
    status: 200,
    headers: securityHeaders
  };
}
