import React, { useState } from 'react';
import { Candidate, Job, SkillBadge, RemoteType } from '../../../types';
import { 
  Briefcase, 
  Users, 
  PlusCircle, 
  Search, 
  Filter, 
  ShieldCheck, 
  Award, 
  Github, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Zap, 
  MapPin, 
  Send, 
  Bookmark, 
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

interface RecruiterDashboardProps {
  candidates?: Candidate[];
  jobs?: Job[];
  onAddNewJob?: (job: Job) => void;
  onBookmarkCandidate?: (candidateId: string) => void;
  savedCandidateIds?: string[];
}

export default function RecruiterDashboard({
  candidates = [],
  jobs = [],
  onAddNewJob = () => {},
  onBookmarkCandidate = () => {},
  savedCandidateIds = []
}: RecruiterDashboardProps) {
  const [activeTab, setActiveTab] = useState<'candidates' | 'post_job' | 'active_jobs'>('candidates');

  // Candidate Search & Badge Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>('ALL');
  const [maxExpFilter, setMaxExpFilter] = useState<number>(2);
  const [remotePreference, setRemotePreference] = useState<string>('ALL');
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState<Candidate | null>(null);
  const [interviewInvitedIds, setInterviewInvitedIds] = useState<string[]>([]);

  // Post New Job Form State with strict validation
  const [formData, setFormData] = useState({
    title: '',
    company: 'NeuralFlow Labs',
    experienceYears: 1.0,
    salaryMin: 90000,
    salaryMax: 120000,
    currency: '$',
    location: 'San Francisco, CA',
    remoteType: 'Hybrid' as RemoteType,
    summary: '',
    description: '',
    requirements: 'Proficiency in Python and LLM API calls\nUnderstanding of tokenization & latency budgets\nMaximum 2 years of professional experience',
    tags: 'Python, Prompt Engineering, Gemini, LangChain'
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [postSuccessMessage, setPostSuccessMessage] = useState<string | null>(null);

  // Validate Job Posting Form
  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.title.trim()) errors.push('Job title is mandatory.');
    if (formData.experienceYears > 2.0) {
      errors.push(`Strict Policy Violation: Required experience (${formData.experienceYears} yrs) exceeds entry-level ceiling of 2.0 years.`);
    }
    if (!formData.salaryMin || formData.salaryMin <= 0) {
      errors.push('Salary Transparency Mandate: Minimum salary must be a positive number.');
    }
    if (!formData.salaryMax || formData.salaryMax < formData.salaryMin) {
      errors.push('Salary range invalid: Maximum salary must be greater than or equal to minimum salary.');
    }
    if (!formData.summary.trim()) errors.push('Short summary is required.');
    return errors;
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    const newJob: Job = {
      id: `job-direct-${Date.now()}`,
      title: formData.title,
      company: formData.company,
      source: 'Direct',
      sourceUrl: 'https://platform.dev/jobs/direct',
      experienceYears: formData.experienceYears,
      experienceDisplay: `0 - ${formData.experienceYears} Yrs Exp`,
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
      currency: formData.currency,
      salaryPeriod: 'yr',
      location: formData.location,
      remoteType: formData.remoteType,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      summary: formData.summary,
      description: formData.description || formData.summary,
      requirements: formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      postedDate: 'Just now',
      applicantCount: 0,
      isVerifiedEntry: true,
      isSalaryGuaranteed: true,
      isNew: true
    };

    onAddNewJob(newJob);
    setPostSuccessMessage('Job successfully published to Verified Entry Feed!');
    setTimeout(() => {
      setPostSuccessMessage(null);
      setActiveTab('active_jobs');
    }, 1800);
  };

  const handleInviteInterview = (candId: string) => {
    if (!interviewInvitedIds.includes(candId)) {
      setInterviewInvitedIds([...interviewInvitedIds, candId]);
    }
  };

  // Filter Candidates
  const filteredCandidates = candidates.filter((cand) => {
    const matchesSearch = 
      cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExp = cand.experienceYears <= maxExpFilter;
    
    const matchesBadge = selectedBadgeFilter === 'ALL' || cand.badges.some(b => 
      b.id.includes(selectedBadgeFilter) || b.category.toLowerCase().includes(selectedBadgeFilter.toLowerCase())
    );

    const matchesRemote = remotePreference === 'ALL' || cand.remotePreference === remotePreference || cand.remotePreference === 'Any';

    return matchesSearch && matchesExp && matchesBadge && matchesRemote;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md ring-4 ring-purple-100">
              REC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Recruiter Talent Portal</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Verified Employer (NeuralFlow Labs)
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Direct access to candidates with cryptographically attested AI badges and ISO entry-level guarantees.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('post_job')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Post Entry-Level Role
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'candidates'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" />
            Verified Talent Search ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('post_job')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'post_job'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-purple-600" />
            Post Entry Role (Strict &le;2 Yrs)
          </button>
          <button
            onClick={() => setActiveTab('active_jobs')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'active_jobs'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4 text-purple-600" />
            Published Postings ({jobs.filter(j => j.source === 'Direct' || j.company.includes('NeuralFlow')).length})
          </button>
        </div>
      </div>

      {/* CANDIDATES DISCOVERY VIEW */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by skill, prompt optimization, RAG, Python..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <select
                  value={selectedBadgeFilter}
                  onChange={(e) => setSelectedBadgeFilter(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">All Attested Badges</option>
                  <option value="Optimization">Token Optimization Badges</option>
                  <option value="RAG">RAG & Vector Badges</option>
                  <option value="Safety">Safety & Guardrail Badges</option>
                </select>
              </div>

              <div>
                <select
                  value={remotePreference}
                  onChange={(e) => setRemotePreference(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">All Work Modes</option>
                  <option value="Remote">Remote Only</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-purple-300 transition-all shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-100"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900">{cand.name}</h3>
                          {cand.verified && (
                            <ShieldCheck className="w-4 h-4 text-purple-600" title="Verified Attested Junior" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{cand.roleTitle}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onBookmarkCandidate(cand.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        savedCandidateIds.includes(cand.id)
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {cand.bio}
                  </p>

                  {/* Attested Badges */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Attested Skills ({cand.badges.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.badges.map((b) => (
                        <span
                          key={b.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100"
                        >
                          <Award className="w-3 h-3 text-purple-600" />
                          {b.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metadata Bar */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Target Salary:</span>
                      <span className="font-semibold text-slate-800">
                        ${cand.targetSalaryMin.toLocaleString()} - ${cand.targetSalaryMax.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Experience:</span>
                      <span className="font-semibold text-slate-800">{cand.experienceYears} Years</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCandidateDetail(cand)}
                    className="flex-1 py-2 bg-slate-50 hover:bg-purple-50 text-purple-700 text-xs font-bold rounded-xl transition-colors text-center border border-slate-200"
                  >
                    Inspect Profile
                  </button>
                  <button
                    onClick={() => handleInviteInterview(cand.id)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      interviewInvitedIds.includes(cand.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {interviewInvitedIds.includes(cand.id) ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Invited
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Invite
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POST NEW JOB VIEW */}
      {activeTab === 'post_job' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Post an Entry-Level AI Role</h2>
            <p className="text-sm text-slate-600 mt-1">
              Platform rules strictly enforce non-null salary disclosure and a hard ceiling of &le; 2 years experience.
            </p>
          </div>

          {postSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              {postSuccessMessage}
            </div>
          )}

          {formErrors.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5 text-rose-800 text-xs font-semibold">
              <div className="flex items-center gap-2 text-rose-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Validation Warnings:
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {formErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handlePostJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Junior Prompt & Eval Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Company Name *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Strict Constraint Fields: Experience & Mandatory Salary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-purple-900 flex items-center justify-between">
                  <span>Max Experience *</span>
                  <span className="text-[10px] text-purple-700">Strict &le; 2 Yrs</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="2.0"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-sm font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-purple-900">Min Salary (Annual USD) *</label>
                <input
                  type="number"
                  step="5000"
                  min="50000"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-sm font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-purple-900">Max Salary (Annual USD) *</label>
                <input
                  type="number"
                  step="5000"
                  min="50000"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-sm font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Work Policy</label>
                <select
                  value={formData.remoteType}
                  onChange={(e) => setFormData({ ...formData, remoteType: e.target.value as RemoteType })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-Site">On-Site</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Short Role Summary *</label>
              <textarea
                rows={2}
                placeholder="Key focus of this entry-level AI role..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('candidates')}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Publish Role to Feed
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ACTIVE POSTINGS VIEW */}
      {activeTab === 'active_jobs' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Active Direct Postings</h2>
              <p className="text-sm text-slate-600 mt-1">Verified entry-level roles currently live in the community feed.</p>
            </div>
            <button
              onClick={() => setActiveTab('post_job')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl"
            >
              + Create Another Role
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {jobs.filter(j => j.source === 'Direct' || j.company.includes('NeuralFlow')).map((j) => (
              <div
                key={j.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-md">
                      Verified Entry
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{j.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600">{j.location} • {j.remoteType} • {j.experienceDisplay}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-700">
                      ${j.salaryMin.toLocaleString()} - ${j.salaryMax.toLocaleString()} / {j.salaryPeriod}
                    </div>
                    <span className="text-xs text-slate-500">{j.applicantCount} applicants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Detailed Inspection Drawer / Modal */}
      {selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCandidateDetail.avatar}
                  alt={selectedCandidateDetail.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{selectedCandidateDetail.name}</h3>
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs text-slate-500">{selectedCandidateDetail.roleTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Bio</h4>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">{selectedCandidateDetail.bio}</p>
              </div>

              {/* Attested Badges */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attested Competencies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCandidateDetail.badges.map((b) => (
                    <div key={b.id} className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
                      <Award className="w-5 h-5 text-purple-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{b.name}</div>
                        <div className="text-[10px] font-mono text-purple-700">{b.verificationCode}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open-Source Projects */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Featured Repositories</h4>
                <div className="space-y-2">
                  {selectedCandidateDetail.topProjects.map((p) => (
                    <div key={p.title} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 font-mono">{p.title}</span>
                        <span className="text-[10px] font-bold text-slate-500">★ {p.stars || 0}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleInviteInterview(selectedCandidateDetail.id);
                  setSelectedCandidateDetail(null);
                }}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Invite Candidate to Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
