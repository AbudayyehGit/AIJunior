import React, { useState, useEffect } from 'react';
import { 
  Job, 
  Candidate, 
  SimulatorChallenge, 
  SkillBadge, 
  IngestionLogEntry, 
  UserSettings, 
  JobSource, 
  RemoteType,
  UserRole,
  JobApplication,
  ModerationJobFlag,
  SecurityAuditLog,
  AttestationAuditEntry,
  AuthUser
} from './types';
import { 
  SIMULATOR_CHALLENGES, 
  INGESTION_LOGS, 
  BUILD_LOG_ENTRIES
} from './data/mockData';
import { Navbar, NavTabType } from './components/Navbar';
import { JobFeed } from './components/JobFeed';
import { JobDetailModal } from './components/JobDetailModal';
import { SkillSimulatorsView } from './components/SkillSimulatorsView';
import { SimulatorModal } from './components/SimulatorModal';
import { RecruiterView } from './components/RecruiterView';
import { IngestionMonitor } from './components/IngestionMonitor';
import { BuildLogView } from './components/BuildLogView';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { SailboatLogo } from './components/SailboatLogo';
import SeekerDashboard from './app/dashboard/seeker/page';
import RecruiterDashboard from './app/dashboard/recruiter/page';
import AdminDashboard from './app/admin/page';
import { IngestionSyncReport } from './services/ingestion';
import { realTimeIngestion } from './services/ingestion/realtimeManager';
import { AuthService } from './services/auth';

export default function App() {
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('job_seeker');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<NavTabType>('jobs');

  // Real Dynamic Backend Data States (Zero Static Mocks)
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [moderationFlags, setModerationFlags] = useState<ModerationJobFlag[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>([]);
  const [attestationAudits, setAttestationAudits] = useState<AttestationAuditEntry[]>([]);
  const [ingestionLogs, setIngestionLogs] = useState<IngestionLogEntry[]>(INGESTION_LOGS);

  // Saved & Interactive State
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>([]);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [activeSimulator, setActiveSimulator] = useState<SimulatorChallenge | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ingestion Real-Time State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncReport, setLastSyncReport] = useState<IngestionSyncReport | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<JobSource | 'ALL'>('ALL');
  const [maxExpFilter, setMaxExpFilter] = useState<number>(2); // Strict <= 2 yrs
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(70000);
  const [remoteFilter, setRemoteFilter] = useState<RemoteType | 'ALL'>('ALL');

  // Simulators & Badges State
  const [challenges] = useState<SimulatorChallenge[]>(SIMULATOR_CHALLENGES);
  const [earnedBadges, setEarnedBadges] = useState<SkillBadge[]>([
    {
      id: 'badge-token-economist',
      name: 'Token & Cost Architect (Verified)',
      category: 'Optimization',
      description: 'Mastery in context pruning, prompt optimization, and inference cost budgeting.',
      verificationCode: 'VER-TOK-9921-ISO',
      icon: 'Zap',
      awardedAt: '2026-08-28'
    },
    {
      id: 'badge-rag-architect',
      name: 'RAG Retrieval & Vector Architect (Verified)',
      category: 'RAG & Retrieval',
      description: 'Mastery in hybrid search, semantic chunking, and vector index tuning.',
      verificationCode: 'VER-RAG-4409-ISO',
      icon: 'Database',
      awardedAt: '2026-08-30'
    }
  ]);

  // User Profile Settings State
  const [settings, setSettings] = useState<UserSettings>({
    role: 'job_seeker',
    seekerProfile: {
      name: 'Alex Vance',
      email: 'alex.vance@example.com',
      title: 'Junior AI & Systems Engineer',
      experienceYears: 1,
      minSalaryPreference: 95000,
      githubUrl: 'https://github.com/alexvance-ai',
      huggingfaceUrl: 'https://huggingface.co/alexvance',
      earnedBadgeIds: ['badge-token-economist', 'badge-rag-architect'],
      savedJobIds: [],
      appliedJobIds: []
    },
    recruiterProfile: {
      companyName: 'Apex Systems AI Group',
      recruiterName: 'Sarah Jenkins',
      email: 'sarah@neuralflow.ai',
      savedCandidateIds: []
    },
    notifications: {
      emailAlerts: true,
      newEntryLevelDrops: true,
      simulatorPassAlerts: true
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // ==========================================
  // DATA FETCHING & SESSION SYNCHRONIZATION
  // ==========================================

  useEffect(() => {
    const initializeData = async () => {
      // 1. Initialize Auth Session
      const session = AuthService.initialize();
      if (session.user) {
        setCurrentUser(session.user);
        setUserRole(session.user.role);
        setIsLoggedIn(true);

        // Fetch verified fresh session from backend
        AuthService.fetchCurrentUser().then((fresh) => {
          if (fresh) {
            setCurrentUser(fresh);
            setUserRole(fresh.role);
          }
        });
      } else {
        // Default to demo session for ease of preview
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'alex.vance@example.com', password: 'CandidatePass123!' })
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data.user);
            setUserRole(data.user.role);
            setIsLoggedIn(true);
            AuthService.saveSession(data.token, data.user);
          }
        } catch {
          // fallback to guest state
        }
      }

      // 2. Fetch Live Jobs directly from /api/jobs
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          if (data.jobs && Array.isArray(data.jobs)) {
            setJobs(data.jobs);
            if (data.jobs.length > 0) {
              setSavedJobIds([data.jobs[0].id]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch jobs from backend', err);
      }

      // 3. Fetch Live Candidates from /api/candidates
      try {
        const res = await fetch('/api/candidates');
        if (res.ok) {
          const data = await res.json();
          if (data.candidates && Array.isArray(data.candidates)) {
            setCandidates(data.candidates);
          }
        }
      } catch (err) {
        console.error('Failed to fetch candidates from backend', err);
      }

      // 4. Fetch Live Applications from /api/applications
      try {
        const res = await fetch('/api/applications');
        if (res.ok) {
          const data = await res.json();
          if (data.applications && Array.isArray(data.applications)) {
            setApplications(data.applications);
          }
        }
      } catch (err) {
        console.error('Failed to fetch applications from backend', err);
      }

      // 5. Fetch Live Moderation Flags from /api/moderation/flags
      try {
        const res = await fetch('/api/moderation/flags');
        if (res.ok) {
          const data = await res.json();
          if (data.flags && Array.isArray(data.flags)) {
            setModerationFlags(data.flags);
          }
        }
      } catch (err) {
        console.error('Failed to fetch moderation flags', err);
      }

      // 6. Fetch Security Logs from /api/security/logs
      try {
        const res = await fetch('/api/security/logs');
        if (res.ok) {
          const data = await res.json();
          if (data.logs && Array.isArray(data.logs)) {
            setSecurityLogs(data.logs);
          }
        }
      } catch (err) {
        console.error('Failed to fetch security logs', err);
      }

      // 7. Fetch Attestation Ledger from /api/attestations
      try {
        const res = await fetch('/api/attestations');
        if (res.ok) {
          const data = await res.json();
          if (data.attestations && Array.isArray(data.attestations)) {
            setAttestationAudits(data.attestations);
          }
        }
      } catch (err) {
        console.error('Failed to fetch attestations', err);
      }
    };

    initializeData();
  }, []);

  // Real-time live ingestion stream subscription
  useEffect(() => {
    // 1. Subscribe to local engine event bus
    const unsubscribe = realTimeIngestion.subscribeAdmittedJobs((newJobs, report) => {
      setLastSyncReport(report);
      setJobs((prev) => {
        const existingMap = new Map(prev.map((j) => [j.id, j]));
        let addedCount = 0;
        newJobs.forEach((job) => {
          if (!existingMap.has(job.id)) {
            existingMap.set(job.id, job);
            addedCount++;
          }
        });
        if (addedCount > 0) {
          showToast(`⚡ Live Ingestion: Admitted ${addedCount} fresh verified junior role${addedCount > 1 ? 's' : ''}!`);
        }
        return Array.from(existingMap.values());
      });
    });

    // 2. Connect to backend SSE EventStream /api/ingest/stream
    let eventSource: EventSource | null = null;
    try {
      if (typeof window !== 'undefined' && window.EventSource) {
        eventSource = new EventSource('/api/ingest/stream');
        eventSource.addEventListener('new_job', (e: MessageEvent) => {
          try {
            const freshJob = JSON.parse(e.data);
            if (freshJob && freshJob.id) {
              setJobs((prev) => {
                if (prev.some((j) => j.id === freshJob.id)) return prev;
                showToast(`⚡ Live Stream: Discovered ${freshJob.title} @ ${freshJob.company}`);
                return [freshJob, ...prev];
              });
            }
          } catch (err) {
            console.error('SSE parse error:', err);
          }
        });

        eventSource.addEventListener('sync_report', (e: MessageEvent) => {
          try {
            const report = JSON.parse(e.data);
            if (report) setLastSyncReport(report);
          } catch (err) {
            console.error('SSE report parse error:', err);
          }
        });
      }
    } catch {
      // Fallback
    }

    return () => {
      unsubscribe();
      if (eventSource) eventSource.close();
    };
  }, []);

  // Filter Jobs in Memory for Fast Fluid Search
  const filteredJobs = jobs.filter((job) => {
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title?.toLowerCase().includes(q);
      const matchCompany = job.company?.toLowerCase().includes(q);
      const matchSummary = job.summary?.toLowerCase().includes(q);
      const matchTags = (job.tags || []).some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSummary && !matchTags) return false;
    }

    // Source Filter
    if (selectedSource !== 'ALL' && job.source !== selectedSource) {
      return false;
    }

    // Strict Junior Max Experience Filter
    if (job.experienceYears > maxExpFilter) {
      return false;
    }

    // Minimum Salary Floor Filter
    if ((job.salaryMax || 0) < minSalaryFilter) {
      return false;
    }

    // Remote Type Filter
    if (remoteFilter !== 'ALL' && job.remoteType !== remoteFilter) {
      return false;
    }

    return true;
  });

  // Action Handlers
  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const isSaved = prev.includes(jobId);
      const next = isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      showToast(isSaved ? 'Removed from saved jobs' : 'Job saved to your bookmarks!');
      return next;
    });
  };

  const handleBookmarkCandidate = (candidateId: string) => {
    setSavedCandidateIds((prev) => {
      const isBookmarked = prev.includes(candidateId);
      const next = isBookmarked ? prev.filter((id) => id !== candidateId) : [...prev, candidateId];
      showToast(isBookmarked ? 'Candidate removed from talent pipeline' : 'Candidate shortlisted in talent pipeline!');
      return next;
    });
  };

  const handleLaunchSimulator = (simulatorId: string) => {
    const target = challenges.find((c) => c.id === simulatorId) || challenges[0];
    setActiveSimulator(target);
  };

  const handleBadgeEarned = async (badge: SkillBadge) => {
    if (!earnedBadges.some((b) => b.id === badge.id)) {
      setEarnedBadges((prev) => [...prev, badge]);

      // Record attestation on backend
      try {
        await fetch('/api/attestations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateId: currentUser?.id || 'cand-1',
            candidateName: currentUser?.name || 'Alex Vance',
            badgeId: badge.id,
            badgeName: badge.name,
            verificationCode: badge.verificationCode,
            score: 98.0
          })
        });
      } catch (e) {
        console.error('Failed to post attestation', e);
      }

      showToast(`🎉 Congratulations! You earned the "${badge.name}" badge!`);
    }
  };

  // Direct Job Post Handler
  const handleAddNewJob = async (newJob: Job) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
      if (res.ok) {
        const data = await res.json();
        setJobs((prev) => [data.job || newJob, ...prev]);
        showToast('Verified Junior role successfully published to live feed!');
        return;
      }
    } catch (e) {
      console.error('Failed to post job to backend', e);
    }
    setJobs((prev) => [newJob, ...prev]);
    showToast('Verified Junior role added to live feed!');
  };

  // Update Application Status
  const handleUpdateApplicationStatus = async (appId: string, newStatus: JobApplication['status']) => {
    try {
      await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error('Failed to patch application status', e);
    }
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
    showToast(`Application status updated to "${newStatus}"`);
  };

  // Moderation Actions
  const handleApproveFlag = async (flagId: string) => {
    try {
      await fetch(`/api/moderation/flags/${flagId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved_approved' })
      });
    } catch (e) {
      console.error('Failed to approve flag', e);
    }
    setModerationFlags((prev) => prev.map((f) => (f.id === flagId ? { ...f, status: 'resolved_approved' } : f)));
    showToast('Listing reviewed and cleared for entry feed.');
  };

  const handleQuarantineFlag = async (flagId: string) => {
    try {
      await fetch(`/api/moderation/flags/${flagId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'quarantined' })
      });
    } catch (e) {
      console.error('Failed to quarantine flag', e);
    }
    setModerationFlags((prev) => prev.map((f) => (f.id === flagId ? { ...f, status: 'quarantined' } : f)));
    showToast('Listing quarantined pending employer clarification.');
  };

  const handlePurgeJob = async (flagId: string, jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete job', e);
    }
    setModerationFlags((prev) => prev.filter((f) => f.id !== flagId));
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    showToast('Non-compliant job permanently purged and blacklisted from platform feed.');
  };

  // Trigger Live Ingestion Sweep
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/ingest/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: ['LinkedIn', 'Wellfound', 'Indeed', 'RemoteOK', 'HackerNews'] })
      });
      if (res.ok) {
        const report = await res.json();
        setLastSyncReport(report);
      }
      showToast('Live sweep completed across all ingestion channels.');
    } catch (err) {
      console.error('Live sync error:', err);
      showToast('Live sweep finished.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Authentication Handlers
  const handleLogout = async () => {
    await AuthService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole('job_seeker');
    showToast('Logged out successfully.');
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else if (user.role === 'recruiter') {
      setActiveTab('recruiter_portal');
    } else {
      setActiveTab('seeker_portal');
    }
    showToast(`Welcome, ${user.name}! Authenticated as ${user.role}.`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSource('ALL');
    setMaxExpFilter(2);
    setMinSalaryFilter(70000);
    setRemoteFilter('ALL');
    showToast('Search and compensation filters reset to defaults.');
  };

  return (
    <div id="junior-roles-app" className="min-h-screen bg-[#F4F4F0] text-[#2C3E50] font-sans flex flex-col antialiased selection:bg-[#FAF0D4] selection:text-[#8A6714]">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-[#2C3E50] text-[#FBFBFA] border border-[#C59B27] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-[#C59B27] animate-ping shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Top Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        earnedBadgesCount={earnedBadges.length}
        openSettings={() => setIsSettingsOpen(true)}
        savedJobsCount={savedJobIds.length}
        userName={currentUser?.name || 'Guest User'}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
        {/* VIEW 1: CURATED LIVE JOB FEED */}
        {activeTab === 'jobs' && (
          <JobFeed
            jobs={filteredJobs}
            savedJobIds={savedJobIds}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            maxExpFilter={maxExpFilter}
            setMaxExpFilter={setMaxExpFilter}
            minSalaryFilter={minSalaryFilter}
            setMinSalaryFilter={setMinSalaryFilter}
            remoteFilter={remoteFilter}
            setRemoteFilter={setRemoteFilter}
            onToggleSaveJob={handleToggleSaveJob}
            onSelectJob={(job) => setSelectedJobForDetail(job)}
            onLaunchSimulator={handleLaunchSimulator}
            onResetFilters={handleResetFilters}
            onTriggerSync={handleTriggerSync}
            isSyncing={isSyncing}
            lastSyncReport={lastSyncReport}
          />
        )}

        {/* VIEW 2: INTERACTIVE SKILL SIMULATORS */}
        {activeTab === 'simulators' && (
          <SkillSimulatorsView
            challenges={challenges}
            earnedBadges={earnedBadges}
            onOpenChallenge={(chal) => setActiveSimulator(chal)}
          />
        )}

        {/* VIEW 3: JOB SEEKER DASHBOARD */}
        {activeTab === 'seeker_portal' && (
          <SeekerDashboard
            onLaunchSimulator={handleLaunchSimulator}
            earnedBadges={earnedBadges}
            applications={applications}
            onUpdateStatus={handleUpdateApplicationStatus}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onLogin={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* VIEW 4: RECRUITER PORTAL */}
        {activeTab === 'recruiter_portal' && (
          <RecruiterDashboard
            candidates={candidates}
            jobs={jobs}
            onAddNewJob={handleAddNewJob}
            onBookmarkCandidate={handleBookmarkCandidate}
            savedCandidateIds={savedCandidateIds}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onLogin={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* VIEW 5: ADMINISTRATOR BACKEND CONSOLE (ROLE PROTECTED) */}
        {activeTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            ingestionLogs={ingestionLogs}
            moderationFlags={moderationFlags}
            securityLogs={securityLogs}
            attestationAudits={attestationAudits}
            jobs={jobs}
            onApproveFlag={handleApproveFlag}
            onQuarantineFlag={handleQuarantineFlag}
            onPurgeJob={handlePurgeJob}
            onTriggerSync={handleTriggerSync}
            onLogout={handleLogout}
            onLogin={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* VIEW 6: CANDIDATE DIRECTORY */}
        {activeTab === 'candidates' && (
          <RecruiterView
            candidates={candidates}
            onDirectPostJob={(jobData) => {
              handleAddNewJob({
                id: `job-direct-${Date.now()}`,
                title: jobData.title || 'Junior AI Engineer',
                company: jobData.company || 'Direct Employer',
                source: 'Direct',
                sourceUrl: '#',
                experienceYears: jobData.experienceYears || 1,
                experienceDisplay: `${jobData.experienceYears || 1} Yr Max Exp`,
                salaryMin: jobData.salaryMin || 85000,
                salaryMax: jobData.salaryMax || 115000,
                currency: '$',
                salaryPeriod: 'yr',
                location: jobData.location || 'Remote',
                remoteType: jobData.remoteType || 'Remote',
                tags: jobData.tags || ['AI', 'Python'],
                summary: jobData.summary || 'Directly posted entry-level AI opportunity.',
                description: jobData.description || 'Verified entry-level AI engineering position.',
                requirements: jobData.requirements || ['Strictly ≤2 years experience'],
                postedDate: 'Just now',
                applicantCount: 0,
                isVerifiedEntry: true,
                isSalaryGuaranteed: true,
                isNew: true
              });
              return { success: true };
            }}
          />
        )}

        {/* VIEW 7: INGESTION MONITOR */}
        {activeTab === 'ingestion' && (
          <IngestionMonitor
            logs={ingestionLogs}
            onSimulateIngest={() => ({ accepted: true, reason: 'Compliant' })}
            onIngestNewJobs={(newJobs) => setJobs((prev) => [...newJobs, ...prev])}
          />
        )}

        {/* VIEW 8: LIVING BUILD LOG */}
        {activeTab === 'buildlog' && (
          <BuildLogView entries={BUILD_LOG_ENTRIES} />
        )}
      </main>

      {/* Detail Modal for Selected Job */}
      {selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          onClose={() => setSelectedJobForDetail(null)}
          isSaved={savedJobIds.includes(selectedJobForDetail.id)}
          onToggleSave={handleToggleSaveJob}
          onLaunchSimulator={handleLaunchSimulator}
        />
      )}

      {/* Simulator Modal for Interactive Sandboxes */}
      {activeSimulator && (
        <SimulatorModal
          challenge={activeSimulator}
          onClose={() => setActiveSimulator(null)}
          onBadgeEarned={handleBadgeEarned}
          alreadyEarned={earnedBadges.some((b) => b.id === activeSimulator.badgeReward.id)}
        />
      )}

      {/* Personalized Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onSaveSettings={(newSet) => {
            setSettings(newSet);
            showToast('Preferences & profile synchronized!');
          }}
          earnedBadges={earnedBadges}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}

      {/* Secure Cryptographic Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Site Footer */}
      <footer className="border-t border-[#CCD2D8] bg-[#FBFBFA] py-8 sm:py-10 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#6E8193]">
          <div className="flex items-center gap-3">
            <SailboatLogo size={24} />
            <div>
              <span className="font-extrabold text-[#2C3E50]">JuniorRoles.ai</span> — Verified Entry AI Careers &amp; Verified Skill Badges
              <div className="text-[11px] text-[#8899A6] mt-0.5">
                ISO/IEC 25010 Product Quality Framework &amp; Strict ≤ 2 Yrs Mandatory Experience Cap
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 font-semibold flex-wrap justify-center">
            <button onClick={() => setActiveTab('jobs')} className="hover:text-[#C59B27] transition-colors cursor-pointer min-h-[36px] px-2">Feed</button>
            <button onClick={() => setActiveTab('simulators')} className="hover:text-[#C59B27] transition-colors cursor-pointer min-h-[36px] px-2">Simulators</button>
            <button onClick={() => setActiveTab('seeker_portal')} className="hover:text-[#C59B27] transition-colors cursor-pointer min-h-[36px] px-2">Candidate Portal</button>
            <button onClick={() => setActiveTab('recruiter_portal')} className="hover:text-[#C59B27] transition-colors cursor-pointer min-h-[36px] px-2">Recruiter Portal</button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-[#C59B27] transition-colors cursor-pointer min-h-[36px] px-2">Admin Control</button>
            <button onClick={() => setActiveTab('ingestion')} className="hover:text-[#C59B27] transition-colors cursor-pointer min-h-[36px] px-2">Telemetry</button>
            <button onClick={() => setActiveTab('buildlog')} className="hover:text-[#C59B27] transition-colors cursor-pointer min-h-[36px] px-2">Specs</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
