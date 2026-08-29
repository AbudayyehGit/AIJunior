export type JobSource = 'LinkedIn' | 'Indeed' | 'Wellfound' | 'RemoteOK' | 'HackerNews' | 'Direct';
export type RemoteType = 'Remote' | 'Hybrid' | 'On-Site';
export type UserRole = 'job_seeker' | 'recruiter' | 'admin';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  source: JobSource;
  sourceUrl: string;
  experienceYears: number; // Strictly <= 2
  experienceDisplay: string;
  salaryMin: number; // Mandatory non-null
  salaryMax: number; // Mandatory non-null
  currency: string;
  salaryPeriod: 'yr' | 'hr';
  location: string;
  remoteType: RemoteType;
  tags: string[];
  summary: string;
  description: string;
  requirements: string[];
  simulatorsRecommended?: string[];
  postedDate: string;
  applicantCount: number;
  isVerifiedEntry: boolean;
  isSalaryGuaranteed: boolean;
  isNew?: boolean;
  moderationStatus?: 'approved' | 'flagged' | 'quarantined' | 'purged';
  moderationReason?: string;
}

export interface SkillBadge {
  id: string;
  name: string;
  category: 'Optimization' | 'RAG & Retrieval' | 'Prompt & Safety' | 'Model Fine-tuning';
  description: string;
  awardedAt?: string;
  verificationCode: string;
  icon: string;
}

export interface CandidateProject {
  title: string;
  desc: string;
  url: string;
  stars?: number;
  stack: string[];
}

export interface SimulatorScore {
  simulatorId: string;
  simulatorName: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  source: JobSource;
  location: string;
  appliedDate: string;
  salaryRange: string;
  status: 'Submitted' | 'Under Review' | 'Recruiter Screen' | 'Challenge Passed' | 'Offer Extended' | 'Archived';
  requiredBadges: string[];
  notes?: string;
  matchScore: number;
}

export interface ModerationJobFlag {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  source: JobSource;
  reason: 'Excess Experience (>2 yrs)' | 'Null/Ambiguous Salary' | 'Misleading Junior Tag' | 'Unresponsive Redirect' | 'Suspicious Pay-to-Apply';
  severity: 'high' | 'medium' | 'low';
  status: 'pending_review' | 'resolved_approved' | 'quarantined' | 'purged';
  flaggedAt: string;
  flaggedBy: string;
  snippet: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  eventType: 'RATE_LIMIT_EXCEEDED' | 'CSRF_BLOCKED' | 'RBAC_ACCESS_DENIED' | 'PII_SCRUBBED' | 'ATTESTATION_MINTED' | 'ADMIN_AUTH_SUCCESS';
  ipAddress: string;
  severity: 'CRITICAL' | 'WARN' | 'INFO';
  endpoint: string;
  details: string;
  userRole?: UserRole;
  status: 'BLOCKED' | 'MITIGATED' | 'AUDITED';
}

export interface AttestationAuditEntry {
  id: string;
  candidateId: string;
  candidateName: string;
  badgeId: string;
  badgeName: string;
  verificationCode: string;
  hash: string;
  signature: string;
  timestamp: string;
  score: number;
  verifiedBy: string;
}

export interface Candidate {
  id: string;
  name: string;
  roleTitle: string;
  avatar: string;
  bio: string;
  experienceYears: number;
  targetSalaryMin: number;
  targetSalaryMax: number;
  location: string;
  remotePreference: 'Remote' | 'Hybrid' | 'Any';
  badges: SkillBadge[];
  githubUrl: string;
  huggingfaceUrl: string;
  topProjects: CandidateProject[];
  simulatorScores: SimulatorScore[];
  availability: 'Immediate' | '2 Weeks' | 'Flexible';
  verified: boolean;
  email?: string;
}

export interface SimulatorChallenge {
  id: string;
  title: string;
  category: string;
  badgeName: string;
  badgeIcon: string;
  description: string;
  difficulty: 'Entry' | 'Junior' | 'Foundational';
  estimatedMinutes: number;
  instructions: string[];
  type: 'token_cost' | 'rag_config' | 'prompt_guard';
  badgeReward: SkillBadge;
}

export interface IngestionLogEntry {
  id: string;
  timestamp: string;
  source: JobSource;
  rawJobsScanned: number;
  rejectedExcessExp: number;
  rejectedNullSalary: number;
  acceptedEntryJobs: number;
  status: 'Clean & Ingested' | 'Filtering Active';
}

export interface BuildLogEntry {
  version: string;
  buildDate: string;
  milestone: string;
  deliverables: string;
  status: 'Completed' | 'Pending' | 'Ready for Execution';
}

export interface UserSettings {
  role: UserRole;
  seekerProfile: {
    name: string;
    email: string;
    title: string;
    experienceYears: number;
    minSalaryPreference: number;
    githubUrl: string;
    huggingfaceUrl: string;
    earnedBadgeIds: string[];
    savedJobIds: string[];
    appliedJobIds: string[];
  };
  recruiterProfile: {
    companyName: string;
    recruiterName: string;
    email: string;
    savedCandidateIds: string[];
  };
  notifications: {
    emailAlerts: boolean;
    newEntryLevelDrops: boolean;
    simulatorPassAlerts: boolean;
  };
}
