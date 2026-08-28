import React, { useState } from 'react';
import { 
  Job, 
  Candidate, 
  SimulatorChallenge, 
  SkillBadge, 
  IngestionLogEntry, 
  UserSettings, 
  JobSource, 
  RemoteType,
  UserRole
} from './types';
import { 
  INITIAL_JOBS, 
  SIMULATOR_CHALLENGES, 
  INITIAL_CANDIDATES, 
  INGESTION_LOGS, 
  BUILD_LOG_ENTRIES 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { GlobalSearchFilter } from './components/GlobalSearchFilter';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { SkillSimulatorsView } from './components/SkillSimulatorsView';
import { SimulatorModal } from './components/SimulatorModal';
import { RecruiterView } from './components/RecruiterView';
import { IngestionMonitor } from './components/IngestionMonitor';
import { BuildLogView } from './components/BuildLogView';
import { SettingsModal } from './components/SettingsModal';
import { RocketLogo } from './components/RocketLogo';
import { 
  ShieldCheck, 
  DollarSign, 
  Cpu, 
  Award, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Info,
  ArrowRight,
  Bookmark
} from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<'jobs' | 'simulators' | 'candidates' | 'ingestion' | 'buildlog'>('jobs');
  const [userRole, setUserRole] = useState<UserRole>('job_seeker');

  // Job Data State
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job-1']);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);

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
      name: 'Token Economist (Verified)',
      category: 'Optimization',
      description: 'Demonstrated mastery in context pruning and token-cost minimization.',
      verificationCode: 'VER-TOK-9921-ISO',
      icon: 'Zap',
      awardedAt: '2026-08-28'
    }
  ]);
  const [activeSimulator, setActiveSimulator] = useState<SimulatorChallenge | null>(null);

  // Recruiter Candidates State
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);

  // Ingestion Logs State
  const [ingestionLogs, setIngestionLogs] = useState<IngestionLogEntry[]>(INGESTION_LOGS);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    role: 'job_seeker',
    seekerProfile: {
      name: 'Alex Vance',
      email: 'alex.vance@example.com',
      title: 'Junior AI / ML Engineer',
      experienceYears: 1,
      minSalaryPreference: 90000,
      githubUrl: 'https://github.com/alexvance-ai',
      huggingfaceUrl: 'https://huggingface.co/alexvance',
      earnedBadgeIds: ['badge-token-economist'],
      savedJobIds: ['job-1'],
      appliedJobIds: []
    },
    recruiterProfile: {
      companyName: 'NeuralFlow Labs',
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

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Save Job
  const handleToggleSaveJob = (jobId: string) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter((id) => id !== jobId));
      showToast('Removed job from saved bookmarks.');
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
      showToast('Job saved to your bookmarks!');
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSource('ALL');
    setMaxExpFilter(2);
    setMinSalaryFilter(70000);
    setRemoteFilter('ALL');
  };

  // Launch simulator from card or detail modal
  const handleLaunchSimulator = (simId: string) => {
    const chal = challenges.find((c) => c.id === simId) || challenges[0];
    setActiveSimulator(chal);
  };

  // Handle Badge Earned from Simulator
  const handleBadgeEarned = (badge: SkillBadge) => {
    if (!earnedBadges.some((b) => b.id === badge.id)) {
      const updated = [...earnedBadges, { ...badge, awardedAt: new Date().toISOString().split('T')[0] }];
      setEarnedBadges(updated);
      showToast(`🎉 Congratulations! You earned the "${badge.name}" badge!`);
    }
  };

  // Direct Job Post Handler (with strict validation)
  const handleDirectPostJob = (jobData: Partial<Job>) => {
    if ((jobData.experienceYears || 0) > 2) {
      return { success: false, error: 'Platform policy strictly rejects roles with >2 years experience.' };
    }
    if (!jobData.salaryMin || !jobData.salaryMax) {
      return { success: false, error: 'Mandatory non-null salary range required.' };
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobData.title || 'Junior AI Engineer',
      company: jobData.company || 'Direct Employer',
      source: 'Direct',
      sourceUrl: '#',
      experienceYears: jobData.experienceYears || 1,
      experienceDisplay: `${jobData.experienceYears || 1} Yr Max Exp`,
      salaryMin: jobData.salaryMin,
      salaryMax: jobData.salaryMax,
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
    };

    setJobs([newJob, ...jobs]);
    showToast('Verified Junior role successfully published to live feed!');
    return { success: true };
  };

  // Simulate Ingest Engine Rule Tester
  const handleSimulateIngest = (rawJob: { title: string; expYears: number; hasSalary: boolean; source: string }) => {
    if (rawJob.expYears > 2) {
      return {
        accepted: false,
        reason: `REJECTED: Demands ${rawJob.expYears} yrs exp (Violates ISO entry ceiling of ≤2 yrs).`
      };
    }
    if (!rawJob.hasSalary) {
      return {
        accepted: false,
        reason: 'REJECTED: Missing non-null compensation data (Violates Salary Transparency mandate).'
      };
    }
    return {
      accepted: true,
      reason: `ACCEPTED: Verified ${rawJob.expYears} yr ceiling & disclosed compensation from ${rawJob.source}.`
    };
  };

  // Filter Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSource = selectedSource === 'ALL' || job.source === selectedSource;
    const matchesExp = job.experienceYears <= maxExpFilter;
    const matchesSalary = job.salaryMax >= minSalaryFilter;
    const matchesRemote = remoteFilter === 'ALL' || job.remoteType === remoteFilter;

    return matchesSearch && matchesSource && matchesExp && matchesSalary && matchesRemote;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        earnedBadgesCount={earnedBadges.length}
        openSettings={() => setIsSettingsOpen(true)}
        savedJobsCount={savedJobIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
        {/* VIEW 1: CURATED NOISE-FREE JOB FEED */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Clean Minimalist Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                    Live Verified Junior Pipeline
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1E293B]">
                  Curated Junior AI Roles
                </h2>
                <p className="text-slate-500 text-sm max-w-2xl">
                  Showing strictly verified roles with ≤ 2 years experience and transparent salaries across LinkedIn, Wellfound, and Indeed.
                </p>
              </div>

              {/* Minimal Metric Badges with Purple Accents */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Max Exp: ≤2 Yrs</span>
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Disclosed Pay</span>
                </div>
              </div>
            </div>

            {/* Pill-Shaped Global Search & Constraint Filter Bar */}
            <GlobalSearchFilter
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
              totalFilteredCount={filteredJobs.length}
              resetFilters={handleResetFilters}
            />

            {/* Job Cards Grid */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
                <Info className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-800">No matching junior roles found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Try adjusting your search terms or salary floor. Every role on this board strictly enforces ≤ 2 years of experience.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.includes(job.id)}
                    onToggleSave={handleToggleSaveJob}
                    onSelectJob={(j) => setSelectedJobForDetail(j)}
                    onLaunchSimulator={handleLaunchSimulator}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: INTERACTIVE SKILL SIMULATORS */}
        {activeTab === 'simulators' && (
          <SkillSimulatorsView
            challenges={challenges}
            earnedBadges={earnedBadges}
            onOpenChallenge={(chal) => setActiveSimulator(chal)}
          />
        )}

        {/* VIEW 3: RECRUITER / CANDIDATE TALENT POOL */}
        {activeTab === 'candidates' && (
          <RecruiterView
            candidates={candidates}
            onDirectPostJob={handleDirectPostJob}
          />
        )}

        {/* VIEW 4: INGESTION PIPELINE & HYGIENE TELEMETRY */}
        {activeTab === 'ingestion' && (
          <IngestionMonitor
            logs={ingestionLogs}
            onSimulateIngest={handleSimulateIngest}
          />
        )}

        {/* VIEW 5: LIVING BUILD LOG (ISO/IEC LEDGER) */}
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
        />
      )}

      {/* Site Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <RocketLogo size={24} showText={false} />
            <div>
              <span className="font-extrabold text-slate-900">JuniorAI Platform</span> — Noise-Free Entry AI Careers &amp; Verified Skill Badges
              <div className="text-[11px] text-slate-400 mt-0.5">
                ISO/IEC/IEEE 29148 Requirements Engineering &amp; ISO/IEC 25010 Product Quality Framework
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <button onClick={() => setActiveTab('jobs')} className="hover:text-blue-600">Curated Jobs</button>
            <button onClick={() => setActiveTab('simulators')} className="hover:text-blue-600">Skill Simulators</button>
            <button onClick={() => setActiveTab('candidates')} className="hover:text-blue-600">Talent Pool</button>
            <button onClick={() => setActiveTab('ingestion')} className="hover:text-blue-600">Data Hygiene</button>
            <button onClick={() => setActiveTab('buildlog')} className="hover:text-blue-600">Living Build Log</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
