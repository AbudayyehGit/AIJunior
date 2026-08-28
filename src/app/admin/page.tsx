import React, { useState } from 'react';
import { 
  IngestionLogEntry, 
  ModerationJobFlag, 
  SecurityAuditLog, 
  AttestationAuditEntry, 
  UserRole,
  Job 
} from '../../types';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Users, 
  Lock, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Key, 
  FileCode, 
  Server, 
  Search, 
  Filter,
  Eye,
  Slash,
  Clock,
  Sparkles,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { runIngestionPipeline } from '../../services/ingestion';

interface AdminDashboardProps {
  ingestionLogs?: IngestionLogEntry[];
  moderationFlags?: ModerationJobFlag[];
  securityLogs?: SecurityAuditLog[];
  attestationAudits?: AttestationAuditEntry[];
  jobs?: Job[];
  onApproveFlag?: (flagId: string) => void;
  onQuarantineFlag?: (flagId: string) => void;
  onPurgeJob?: (flagId: string, jobId: string) => void;
  onTriggerSync?: () => Promise<void>;
}

export default function AdminDashboard({
  ingestionLogs = [],
  moderationFlags = [],
  securityLogs = [],
  attestationAudits = [],
  jobs = [],
  onApproveFlag = () => {},
  onQuarantineFlag = () => {},
  onPurgeJob = () => {},
  onTriggerSync
}: AdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<'ingestion' | 'moderation' | 'users' | 'security' | 'attestations'>('ingestion');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // User management mock state
  const [managedUsers, setManagedUsers] = useState([
    {
      id: 'usr-1',
      name: 'Alex Vance',
      email: 'alex.vance@example.com',
      role: 'job_seeker' as UserRole,
      status: 'Active',
      attestedBadges: 2,
      lastLogin: '10 mins ago'
    },
    {
      id: 'usr-2',
      name: 'Sarah Jenkins',
      email: 'sarah@neuralflow.ai',
      role: 'recruiter' as UserRole,
      status: 'Active',
      attestedBadges: 0,
      lastLogin: '1 hour ago'
    },
    {
      id: 'usr-3',
      name: 'Maya Lin',
      email: 'maya.lin@example.com',
      role: 'job_seeker' as UserRole,
      status: 'Active',
      attestedBadges: 1,
      lastLogin: '4 hours ago'
    },
    {
      id: 'usr-4',
      name: 'Admin System User',
      email: 'security-admin@platform.dev',
      role: 'admin' as UserRole,
      status: 'Active (2FA Enforced)',
      attestedBadges: 0,
      lastLogin: 'Just now'
    }
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setManagedUsers(managedUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleTriggerSyncInternal = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Contacting scraping workers (LinkedIn, Indeed, Wellfound)...');

    try {
      if (onTriggerSync) {
        await onTriggerSync();
      } else {
        await runIngestionPipeline({
          sources: ['LinkedIn', 'Indeed', 'Wellfound'],
          maxExperienceCap: 2.0,
          enforceMandatorySalary: true
        });
      }
      setSyncStatusMsg('Ingestion pipeline successfully completed! Filtered non-compliant records.');
    } catch (err: any) {
      setSyncStatusMsg('Sync pipeline failed: ' + (err?.message || 'Rate limit or network error'));
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Administrator Backend Console</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  SUPERADMIN RBAC
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Zero-Trust Governance • Automated Multi-Source Ingestion Pipeline • Moderation & Audit Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerSyncInternal}
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing Workers...' : 'Force Ingestion Pipeline'}
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatusMsg && (
          <div className="mt-4 p-3 rounded-xl bg-purple-950/80 border border-purple-500/40 text-xs font-mono text-purple-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400 shrink-0" />
            {syncStatusMsg}
          </div>
        )}

        {/* Admin Subtabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setAdminTab('ingestion')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              adminTab === 'ingestion'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Ingestion & Scrapers
          </button>
          <button
            onClick={() => setAdminTab('moderation')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              adminTab === 'moderation'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Moderation & Flags ({moderationFlags.filter(f => f.status === 'pending_review').length})
          </button>
          <button
            onClick={() => setAdminTab('users')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              adminTab === 'users'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            User Roles & RBAC ({managedUsers.length})
          </button>
          <button
            onClick={() => setAdminTab('security')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              adminTab === 'security'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            AppSec Audit Logs ({securityLogs.length})
          </button>
          <button
            onClick={() => setAdminTab('attestations')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              adminTab === 'attestations'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Cryptographic Attestations ({attestationAudits.length})
          </button>
        </div>
      </div>

      {/* 1. INGESTION & PIPELINE TELEMETRY */}
      {adminTab === 'ingestion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Raw Scanned</span>
              <div className="mt-2 text-2xl font-bold text-slate-900">4,820</div>
              <p className="text-xs text-slate-500 mt-1">LinkedIn, Indeed & Wellfound</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Purged (&gt;2 Yrs Exp)</span>
              <div className="mt-2 text-2xl font-bold text-rose-600">3,490</div>
              <p className="text-xs text-slate-500 mt-1">Strict ISO Filter Purged (72.4%)</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Purged (Null Salary)</span>
              <div className="mt-2 text-2xl font-bold text-amber-600">1,085</div>
              <p className="text-xs text-slate-500 mt-1">Transparency Guard Purged (22.5%)</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Clean Admitted</span>
              <div className="mt-2 text-2xl font-bold text-emerald-600">245</div>
              <p className="text-xs text-slate-500 mt-1">Verified Entry Level (5.1% yield)</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Multi-Source Ingestion Pipeline History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Source Worker</th>
                    <th className="py-3 px-4">Raw Scanned</th>
                    <th className="py-3 px-4">Rejected Exp</th>
                    <th className="py-3 px-4">Rejected Salary</th>
                    <th className="py-3 px-4">Clean Admitted</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {ingestionLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-600">{log.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-purple-700">{log.source}</td>
                      <td className="py-3 px-4 text-slate-900">{log.rawJobsScanned}</td>
                      <td className="py-3 px-4 text-rose-600">-{log.rejectedExcessExp}</td>
                      <td className="py-3 px-4 text-amber-600">-{log.rejectedNullSalary}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">+{log.acceptedEntryJobs}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODERATION & FLAGGING CONSOLE */}
      {adminTab === 'moderation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Job Moderation & Non-Compliance Queue</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review listings flagged by automated rule engines or community reports for experience/salary violations.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {moderationFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                        flag.severity === 'high'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {flag.severity} Severity
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {flag.source}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{flag.jobTitle}</h3>
                    </div>

                    <p className="text-xs text-slate-600">{flag.company} • Flagged: {flag.flaggedAt} by {flag.flaggedBy}</p>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold text-purple-700">Violation Reason:</span> {flag.reason}
                      <p className="mt-1 text-slate-500 italic">"{flag.snippet}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                    <button
                      onClick={() => onApproveFlag(flag.id)}
                      className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Listing
                    </button>
                    <button
                      onClick={() => onQuarantineFlag(flag.id)}
                      className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Slash className="w-3.5 h-3.5" />
                      Quarantine
                    </button>
                    <button
                      onClick={() => onPurgeJob(flag.id, flag.jobId)}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Purge & Blacklist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. USER ROLES & RBAC MANAGEMENT */}
      {adminTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">User Directory & Role-Based Access Control (RBAC)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit least-privilege permissions, assign roles, and inspect verification records.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role Assignment</th>
                    <th className="py-3 px-4">Attested Badges</th>
                    <th className="py-3 px-4">Session Status</th>
                    <th className="py-3 px-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {managedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="job_seeker">Job Seeker</option>
                          <option value="recruiter">Recruiter</option>
                          <option value="admin">Administrator (Superadmin)</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-purple-600">{u.attestedBadges} Verified</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{u.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. APPSEC AUDIT LOGS */}
      {adminTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Application Security (AppSec) Audit Ledger</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time security telemetry: Rate limit events, CSRF cross-origin blocks, PII sanitization, and HTTPS headers.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Endpoint</th>
                    <th className="py-3 px-4">Client IP</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {securityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-purple-700">{log.eventType}</td>
                      <td className="py-3 px-4 text-slate-700">{log.endpoint}</td>
                      <td className="py-3 px-4 text-slate-500">{log.ipAddress}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">{log.details}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'BLOCKED'
                            ? 'bg-rose-100 text-rose-800'
                            : log.status === 'MITIGATED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. CRYPTOGRAPHIC ATTESTATIONS AUDIT */}
      {adminTab === 'attestations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cryptographic Attestation Verification Proofs</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit the digital signatures, SHA-256 hashes, and ISO test assertions minted for candidate skills.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {attestationAudits.map((att) => (
                <div
                  key={att.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-sans text-sm">{att.candidateName}</span>
                      <span className="text-purple-700 font-bold font-sans">({att.badgeName})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Score: {att.score}%
                      </span>
                      <span className="text-slate-400 text-[10px]">{att.timestamp}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 uppercase text-[10px] font-bold block">Verification Code</span>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-700">{att.verificationCode}</span>
                        <button
                          onClick={() => handleCopy(att.verificationCode, att.id + '-code')}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {copiedKey === att.id + '-code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 uppercase text-[10px] font-bold block">Digital Signature</span>
                      <span className="break-all text-slate-700">{att.signature}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">SHA-256 Assertion Hash</span>
                    <span className="break-all text-purple-800">{att.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
