export type JobSource = 'LinkedIn' | 'Indeed' | 'Wellfound' | 'Direct';
export type RemoteType = 'Remote' | 'Hybrid' | 'On-Site';
export type UserRole = 'job_seeker' | 'recruiter';

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
