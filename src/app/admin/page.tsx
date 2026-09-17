import React, { useState, useEffect } from 'react';
import { 
  IngestionLogEntry, 
  ModerationJobFlag, 
  SecurityAuditLog, 
  AttestationAuditEntry, 
  UserRole,
  Job,
  AuthUser
} from '../../types';
import { AuthService } from '../../services/auth';
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
  Check,
  LogOut,
  UserX,
  UserCheck,
  ShieldAlert,
  Loader2,
  Plus,
  LogIn
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser?: AuthUser | null;
  ingestionLogs?: IngestionLogEntry[];
  moderationFlags?: ModerationJobFlag[];
  securityLogs?: SecurityAuditLog[];
  attestationAudits?: AttestationAuditEntry[];
  jobs?: Job[];
  onApproveFlag?: (flagId: string) => void;
  onQuarantineFlag?: (flagId: string) => void;
  onPurgeJob?: (flagId: string, jobId: string) => void;
  onTriggerSync?: () => Promise<void>;
  onLogout?: () => void;
  onLogin?: () => void;
}

export default function AdminDashboard({
  currentUser,
  ingestionLogs = [],
  moderationFlags = [],
  securityLogs = [],
  attestationAudits = [],
  jobs = [],
  onApproveFlag = () => {},
  onQuarantineFlag = () => {},
  onPurgeJob = () => {},
  onTriggerSync,
  onLogout,
  onLogin
}: AdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<'users' | 'moderation' | 'ingestion' | 'security' | 'attestations'>('users');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Users Directory State
  const [managedUsers, setManagedUsers] = useState<AuthUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [userActionMsg, setUserActionMsg] = useState<string | null>(null);

  // Steady-State Operational State
  const [isMaintaining, setIsMaintaining] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState<string | null>(null);

  const handleTriggerSteadyState = async () => {
    setIsMaintaining(true);
    setMaintenanceMsg(null);
    try {
      const res = await fetch('/api/maintenance/steady-state', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setMaintenanceMsg(
          `Equilibrium verified: ${data.mockPurged} mock records purged, ${data.expiredFlagged} stale listings flagged expired. Active count: ${data.remainingActive}`
        );
        if (onTriggerSync) {
          await onTriggerSync();
        }
      } else {
        setMaintenanceMsg('Failed to run steady-state cycle');
      }
    } catch {
      setMaintenanceMsg('Error connecting to maintenance service');
    } finally {
      setIsMaintaining(false);
    }
  };

  // Load Real Users from Backend
  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const token = AuthService.getToken();
      const res = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setManagedUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to load users directory', err);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  // Update Role Action
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const token = AuthService.getToken();
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        const data = await res.json();
        setManagedUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setUserActionMsg(`User role updated to ${newRole}`);
        setTimeout(() => setUserActionMsg(null), 3000);
      }
    } catch (e) {
      console.error('Failed to update role', e);
    }
  };

  // Update Membership Tier Action
  const handleTierChange = async (userId: string, newTier: AuthUser['membershipTier']) => {
    try {
      const token = AuthService.getToken();
      const res = await fetch(`/api/admin/users/${userId}/tier`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tier: newTier })
      });
      if (res.ok) {
        setManagedUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, membershipTier: newTier } : u))
        );
        setUserActionMsg(`Membership tier updated to ${newTier}`);
        setTimeout(() => setUserActionMsg(null), 3000);
      }
    } catch (e) {
      console.error('Failed to update tier', e);
    }
  };

  // Toggle Account Status Action (Activate / Suspend)
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      const token = AuthService.getToken();
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setManagedUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: nextStatus as any } : u))
        );
        setUserActionMsg(`User status updated to ${nextStatus}`);
        setTimeout(() => setUserActionMsg(null), 3000);
      }
    } catch (e) {
      console.error('Failed to toggle status', e);
    }
  };

  // Delete User Action
  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete account ${email}?`)) return;
    try {
      const token = AuthService.getToken();
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setManagedUsers((prev) => prev.filter((u) => u.id !== userId));
        setUserActionMsg(`User ${email} permanently deleted.`);
        setTimeout(() => setUserActionMsg(null), 3000);
      }
    } catch (e) {
      console.error('Failed to delete user', e);
    }
  };

  const handleManualSync = async () => {
    if (onTriggerSync) {
      setIsSyncing(true);
      setSyncStatusMsg('Dispatching ingestion sweep across all workers...');
      try {
        await onTriggerSync();
        setSyncStatusMsg('Ingestion cycle complete: All compliant roles synchronized.');
      } catch {
        setSyncStatusMsg('Sync finished.');
      } finally {
        setIsSyncing(false);
        setTimeout(() => setSyncStatusMsg(null), 4000);
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered Users
  const filteredUsers = managedUsers.filter((u) => {
    const matchesQuery =
      u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesQuery && matchesRole;
  });

  // Guard: If not superadmin, render access control protection screen
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Superadmin Privilege Required</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              The Administrative Control Center enforces strict Role-Based Access Control (RBAC). 
              Your active session ({currentUser ? currentUser.email : 'Guest'}) does not hold superadmin authority.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            {onLogin && (
              <button
                onClick={onLogin}
                className="px-6 py-2.5 bg-[#C59B27] hover:bg-[#AA821C] text-white rounded-xl font-bold text-sm transition-all shadow-sanctuary-glow flex items-center gap-2 min-h-[44px] cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Authenticate as Superadmin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-control-center" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Top Banner with Clean Minimalist Tabernacle Design */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#2C3E50] p-6 sm:p-8 rounded-3xl border border-[#C59B27]/40 text-white shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C59B27] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#F4E0A9]">
              Live RBAC & Platform Ops Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>Administrative Backend Control</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C59B27] text-white">
              Superadmin
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Live membership management, ISO verification audits, ingestion telemetry, and cryptographic ledger verification.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="admin-manual-sync-btn"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-[#C59B27] hover:bg-[#AA821C] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sanctuary-glow min-h-[44px] cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : 'Run Ingestion Sweep'}</span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-[#C0392B] hover:bg-[#A93226] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {syncStatusMsg && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {userActionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{userActionMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none text-xs font-bold">
        <button
          id="admin-subtab-users"
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap min-h-[44px] cursor-pointer ${
            adminTab === 'users'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Users className="w-4 h-4 text-purple-600" />
          <span>User Directory &amp; RBAC ({managedUsers.length})</span>
        </button>

        <button
          id="admin-subtab-moderation"
          onClick={() => setAdminTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap min-h-[44px] cursor-pointer ${
            adminTab === 'moderation'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Compliance Queue ({moderationFlags.length})</span>
        </button>

        <button
          id="admin-subtab-ingestion"
          onClick={() => setAdminTab('ingestion')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap min-h-[44px] cursor-pointer ${
            adminTab === 'ingestion'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Activity className="w-4 h-4 text-[#3A7CA5]" />
          <span>Ingestion Workers</span>
        </button>

        <button
          id="admin-subtab-security"
          onClick={() => setAdminTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap min-h-[44px] cursor-pointer ${
            adminTab === 'security'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>AppSec Audit Ledger</span>
        </button>

        <button
          id="admin-subtab-attestations"
          onClick={() => setAdminTab('attestations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap min-h-[44px] cursor-pointer ${
            adminTab === 'attestations'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Key className="w-4 h-4 text-[#C59B27]" />
          <span>Attestation Ledger</span>
        </button>
      </div>

      {/* 1. USER ROLES & MEMBERSHIP MANAGEMENT (PHASE 4) */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">User Membership &amp; RBAC Control</h2>
                <p className="text-xs text-slate-500">
                  Manage user roles, assign membership tiers, and toggle account activation in real time.
                </p>
              </div>
              <button
                onClick={fetchUsers}
                className="self-start sm:self-auto px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 min-h-[40px] cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUsersLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Directory</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Filter users by name or email..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3A7CA5] min-h-[44px]"
                />
              </div>
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                {(['ALL', 'job_seeker', 'recruiter', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[36px] whitespace-nowrap cursor-pointer ${
                      userRoleFilter === r
                        ? 'bg-[#3A7CA5] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r === 'ALL' ? 'All Roles' : r === 'job_seeker' ? 'Candidates' : r === 'recruiter' ? 'Recruiters' : 'Superadmins'}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3">User</th>
                    <th className="py-3 px-3">Role Assignment</th>
                    <th className="py-3 px-3">Membership Tier</th>
                    <th className="py-3 px-3">Account Status</th>
                    <th className="py-3 px-3">Badges</th>
                    <th className="py-3 px-3">Last Login</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No user accounts match your active search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="font-mono text-[11px] text-slate-500">{u.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3A7CA5] min-h-[36px] cursor-pointer"
                          >
                            <option value="job_seeker">Job Seeker</option>
                            <option value="recruiter">Recruiter</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={u.membershipTier || 'Free'}
                            onChange={(e) => handleTierChange(u.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[36px] cursor-pointer"
                          >
                            <option value="Free">Free</option>
                            <option value="Pro Candidate">Pro Candidate</option>
                            <option value="Enterprise Recruiter">Enterprise Recruiter</option>
                            <option value="Superadmin">Superadmin</option>
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            u.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{u.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-700">
                          {u.attestedBadgesCount || 0} Attested
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {u.lastLogin || 'Recent'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(u.id, u.status)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors min-h-[36px] cursor-pointer ${
                                u.status === 'Active'
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                              title={u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                            >
                              {u.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODERATION & FLAGGING CONSOLE */}
      {adminTab === 'moderation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Job Moderation &amp; Non-Compliance Queue</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review listings flagged by automated rule engines or community reports for experience/salary violations.
              </p>
            </div>

            {moderationFlags.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Compliance Queue Empty</h4>
                <p className="text-xs text-slate-500">All published jobs strictly comply with ISO experience and salary transparency mandates.</p>
              </div>
            ) : (
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

                    <div className="flex items-center gap-2 w-full lg:w-auto justify-start lg:justify-end flex-wrap">
                      <button
                        onClick={() => onApproveFlag(flag.id)}
                        className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[44px]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Listing</span>
                      </button>
                      <button
                        onClick={() => onQuarantineFlag(flag.id)}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[44px]"
                      >
                        <Slash className="w-3.5 h-3.5" />
                        <span>Quarantine</span>
                      </button>
                      <button
                        onClick={() => onPurgeJob(flag.id, flag.jobId)}
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap min-h-[44px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Purge &amp; Blacklist</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. INGESTION PIPELINE HISTORY */}
      {adminTab === 'ingestion' && (
        <div className="space-y-6">
          {/* Steady-State Operational Equilibrium Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-sm border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-base font-bold text-white tracking-wide">Steady-State Operational Equilibrium</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  AUTO-LOOP ACTIVE (1H)
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl">
                Background maintenance automatically purges mock/test artifacts, flags stale listings older than 7 days as expired, and permanently purges legacy expired records (&gt;30d).
              </p>
              {maintenanceMsg && (
                <p className="text-xs text-emerald-400 font-mono pt-1">
                  {maintenanceMsg}
                </p>
              )}
            </div>
            <button
              onClick={handleTriggerSteadyState}
              disabled={isMaintaining}
              className="px-4 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              {isMaintaining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enforcing Steady-State...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Execute Maintenance Sweep</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Scanned</span>
              <div className="mt-2 text-2xl font-bold text-slate-900">4,820</div>
              <p className="text-xs text-slate-500 mt-1">LinkedIn, Wellfound, Indeed, RemoteOK</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Purged (&gt;2 Yrs Exp)</span>
              <div className="mt-2 text-2xl font-bold text-rose-600">3,490</div>
              <p className="text-xs text-slate-500 mt-1">Strict ISO Filter Purged (72.4%)</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Purged (Null Salary)</span>
              <div className="mt-2 text-2xl font-bold text-amber-600">1,085</div>
              <p className="text-xs text-slate-500 mt-1">Transparency Guard Purged (22.5%)</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Clean Admitted</span>
              <div className="mt-2 text-2xl font-bold text-emerald-600">245</div>
              <p className="text-xs text-slate-500 mt-1">Verified Entry Level (5.1% yield)</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
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
                      <td className="py-3 px-4 font-bold text-[#3A7CA5]">{log.source}</td>
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

      {/* 4. APPSEC AUDIT LOGS */}
      {adminTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Application Security (AppSec) Audit Ledger</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time security telemetry: Rate limit events, PBKDF2 authentication, CSRF protections, and RBAC guards.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Endpoint</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {securityLogs.map((sec) => (
                    <tr key={sec.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-600">{sec.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{sec.eventType}</td>
                      <td className="py-3 px-4 text-[#3A7CA5]">{sec.endpoint}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          sec.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : sec.severity === 'WARN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {sec.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-sans">{sec.details}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {sec.status}
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

      {/* 5. ATTESTATION AUDIT LEDGER */}
      {adminTab === 'attestations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cryptographic Attestation &amp; Competency Proofs</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every skill attestation and competency benchmark is hashed with sha256 and signed via ed25519 to eliminate resume exaggeration.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Attested Competency</th>
                    <th className="py-3 px-4">Verification Code</th>
                    <th className="py-3 px-4">Cryptographic Hash</th>
                    <th className="py-3 px-4">Evaluator</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attestationAudits.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{att.candidateName}</td>
                      <td className="py-3 px-4 text-purple-700 font-semibold">{att.badgeName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{att.verificationCode}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <span>{att.hash.substring(0, 16)}...</span>
                          <button
                            onClick={() => copyToClipboard(att.hash, att.id)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600"
                            title="Copy full hash"
                          >
                            {copiedKey === att.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{att.verifiedBy}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{att.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
