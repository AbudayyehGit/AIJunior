import React, { useState } from 'react';
import { Candidate, SkillBadge, Job } from '../types';
import { 
  Users, 
  Search, 
  Award, 
  Github, 
  ExternalLink, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  PlusCircle, 
  Star, 
  Code2, 
  Sparkles,
  MapPin,
  X,
  AlertCircle
} from 'lucide-react';

interface RecruiterViewProps {
  candidates: Candidate[];
  onDirectPostJob: (job: Partial<Job>) => { success: boolean; error?: string };
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({
  candidates,
  onDirectPostJob,
}) => {
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.roleTitle.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.topProjects.some((p) => p.stack.some((s) => s.toLowerCase().includes(candidateSearch.toLowerCase())));

    const matchesBadge =
      selectedBadgeFilter === 'ALL' ||
      c.badges.some((b) => b.name.includes(selectedBadgeFilter));

    return matchesSearch && matchesBadge;
  });

  return (
    <div id="recruiter-talent-pool-view" className="space-y-8 animate-fadeIn">
      {/* Recruiter Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Spam-Reduction Verified Junior Talent</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Pre-Vetted Junior AI Pipeline
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Every candidate below has proven their technical ability through practical simulator sandboxes and verified code repositories. Zero resume keyword fluff.
          </p>
        </div>

        <button
          onClick={() => setIsPostingModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-sm shadow-md transition-all whitespace-nowrap"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post Verified Junior Job</span>
        </button>
      </div>

      {/* Search & Badge Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-5 h-5 text-blue-600 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={candidateSearch}
              onChange={(e) => setCandidateSearch(e.target.value)}
              placeholder="Search by candidate name, skill (RAG, Python, LangChain, Token Ops)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Badge Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Badge:</span>
            {['ALL', 'Token Economist', 'RAG Architect', 'Safety'].map((badgeKey) => (
              <button
                key={badgeKey}
                onClick={() => setSelectedBadgeFilter(badgeKey)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedBadgeFilter === badgeKey
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {badgeKey === 'ALL' ? 'All Badges' : badgeKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCandidates.map((cand) => (
          <div
            key={cand.id}
            id={`candidate-card-${cand.id}`}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 space-y-6"
          >
            <div className="space-y-4">
              {/* Header: Avatar, Name, Verified Badge */}
              <div className="flex items-start gap-4">
                <img
                  src={cand.avatar}
                  alt={cand.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                      {cand.name}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xs font-semibold text-blue-600">
                    {cand.roleTitle}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {cand.location} • <span className="text-emerald-700 font-bold">{cand.experienceYears} yr exp</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {cand.bio}
              </p>

              {/* Verified Badges */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verified Technical Badges ({cand.badges.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cand.badges.map((b) => (
                    <span
                      key={b.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      <Award className="w-3 h-3 text-emerald-600" />
                      {b.name.replace('(Verified)', '').trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Projects */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Portfolio Highlights
                </div>
                {cand.topProjects.map((p, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-blue-600" /> {p.title}
                      </span>
                      {p.stars && (
                        <span className="flex items-center gap-1 text-[11px] text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {p.stars}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="text-xs font-mono font-bold text-slate-700">
                ${(cand.targetSalaryMin / 1000).toFixed(0)}k - ${(cand.targetSalaryMax / 1000).toFixed(0)}k
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={cand.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  title="View GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setSelectedCandidate(cand)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Profile Drawer / Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                />
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{selectedCandidate.name}</h3>
                  <p className="text-sm font-semibold text-blue-600">{selectedCandidate.roleTitle}</p>
                  <p className="text-xs text-slate-500">{selectedCandidate.location} • {selectedCandidate.experienceYears} Years Exp</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scorecard */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Verified Simulator Evaluation Scorecard
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedCandidate.simulatorScores.map((score, i) => (
                  <div key={i} className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                    <div className="text-xs font-bold text-slate-800">{score.simulatorName}</div>
                    <div className="text-xl font-black text-emerald-700 font-mono mt-1">
                      {score.score}/{score.maxScore} <span className="text-xs text-emerald-600 font-normal">Passed</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Evaluated on {score.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Projects */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                GitHub & Open Source Repositories
              </h4>
              {selectedCandidate.topProjects.map((p, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{p.title}</span>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      <span>Repository</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-600">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.stack.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-white text-slate-700 rounded-md text-[10px] font-medium border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
              <a
                href={selectedCandidate.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] flex items-center gap-2 shadow-xs"
              >
                <span>Connect on GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal with Strict Entry-Level & Non-Null Salary Rules */}
      {isPostingModalOpen && (
        <PostJobStrictModal
          onClose={() => setIsPostingModalOpen(false)}
          onSubmit={onDirectPostJob}
        />
      )}
    </div>
  );
};

interface PostJobStrictModalProps {
  onClose: () => void;
  onSubmit: (job: Partial<Job>) => { success: boolean; error?: string };
}

const PostJobStrictModal: React.FC<PostJobStrictModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [expYears, setExpYears] = useState<number>(1);
  const [salaryMin, setSalaryMin] = useState<number>(90000);
  const [salaryMax, setSalaryMax] = useState<number>(120000);
  const [location, setLocation] = useState('San Francisco, CA');
  const [remoteType, setRemoteType] = useState<'Remote' | 'Hybrid' | 'On-Site'>('Remote');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('Python, LLM, Prompt Tuning');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Strict validation rules:
    if (expYears > 2) {
      setValidationError('Validation Failed: Platform rules strictly forbid roles requiring >2 years of experience.');
      return;
    }
    if (!salaryMin || !salaryMax || salaryMin <= 0 || salaryMax <= salaryMin) {
      setValidationError('Validation Failed: Transparent, valid salary range (Min & Max > 0) is mandatory.');
      return;
    }
    if (!title.trim() || !company.trim() || !summary.trim()) {
      setValidationError('Please fill in all mandatory job description fields.');
      return;
    }

    const res = onSubmit({
      title,
      company,
      experienceYears: expYears,
      experienceDisplay: `${expYears} Yr${expYears > 1 ? 's' : ''} Max Exp`,
      salaryMin,
      salaryMax,
      currency: '$',
      salaryPeriod: 'yr',
      location,
      remoteType,
      summary,
      description: summary,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      source: 'Direct',
      sourceUrl: '#',
      requirements: [
        `Strictly ≤${expYears} year(s) prior experience required`,
        'Demonstrated competence in modern AI and LLM APIs'
      ],
      isVerifiedEntry: true,
      isSalaryGuaranteed: true,
      isNew: true,
      postedDate: 'Just now',
      applicantCount: 0
    });

    if (res.success) {
      setSuccessMessage(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setValidationError(res.error || 'Failed to post job');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Entry-Level Quality Gateway
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">Post a Verified Junior AI Role</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-bold text-slate-900">Job Ingested Successfully!</h4>
            <p className="text-xs text-slate-500">Verified against entry-level parameters and published to live feed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Junior AI Evaluation Specialist"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Intelligence"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* Experience Constraint with strict validation */}
            <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Maximum Experience Ceiling:</span>
                <span className={`font-bold ${expYears > 2 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {expYears} Years ({expYears <= 2 ? 'Compliant' : 'Invalid - Exceeds 2 Yrs'})
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={0.5}
                value={expYears}
                onChange={(e) => setExpYears(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="text-[11px] text-slate-500">
                Platform rule: Roles requiring &gt;2 years are automatically rejected by the ingestion engine.
              </div>
            </div>

            {/* Mandatory Non-Null Salary */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Min Salary (USD/yr)</label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(Number(e.target.value))}
                  step={5000}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Max Salary (USD/yr)</label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(Number(e.target.value))}
                  step={5000}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Workplace</label>
                <select
                  value={remoteType}
                  onChange={(e) => setRemoteType(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-Site">On-Site</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Summary Description</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                placeholder="Brief summary of duties and learning opportunities..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Tags (Comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-md transition-all"
              >
                Validate & Publish Role
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
