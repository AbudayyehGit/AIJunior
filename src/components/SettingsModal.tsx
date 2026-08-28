import React, { useState } from 'react';
import { UserSettings, SkillBadge } from '../types';
import { 
  X, 
  Settings, 
  User, 
  Github, 
  DollarSign, 
  Bell, 
  Award, 
  CheckCircle2, 
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  onClose: () => void;
  onSaveSettings: (newSettings: UserSettings) => void;
  earnedBadges: SkillBadge[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onClose,
  onSaveSettings,
  earnedBadges,
}) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Settings className="w-4 h-4" /> Preferences & Sync
            </div>
            <h3 className="text-2xl font-black text-slate-900">Personalized Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSavedNotice ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-bold text-slate-900">Preferences Synchronized</h4>
            <p className="text-xs text-slate-500">Your profile and search filters have been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Seeker Profile Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Candidate Profile
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.seekerProfile.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seekerProfile: { ...formData.seekerProfile, name: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Role Title</label>
                  <input
                    type="text"
                    value={formData.seekerProfile.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seekerProfile: { ...formData.seekerProfile, title: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* GitHub & HuggingFace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Github className="w-3.5 h-3.5" /> GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.seekerProfile.githubUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seekerProfile: { ...formData.seekerProfile, githubUrl: e.target.value },
                      })
                    }
                    placeholder="https://github.com/username"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Hugging Face Space URL
                  </label>
                  <input
                    type="url"
                    value={formData.seekerProfile.huggingfaceUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seekerProfile: { ...formData.seekerProfile, huggingfaceUrl: e.target.value },
                      })
                    }
                    placeholder="https://huggingface.co/username"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Minimum Salary Floor */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Desired Minimum Salary Floor
                  </span>
                  <span className="font-mono text-emerald-700 font-extrabold">
                    ${formData.seekerProfile.minSalaryPreference.toLocaleString()} USD / yr
                  </span>
                </div>
                <input
                  type="range"
                  min={70000}
                  max={140000}
                  step={5000}
                  value={formData.seekerProfile.minSalaryPreference}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seekerProfile: {
                        ...formData.seekerProfile,
                        minSalaryPreference: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            {/* Earned Badges Box */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Earned & Synchronized Badges ({earnedBadges.length})
              </h4>
              {earnedBadges.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 text-center">
                  Take a skill simulator sandbox to attach cryptographic badges to your profile.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {earnedBadges.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3 text-xs"
                    >
                      <div className="p-2 bg-emerald-200/60 rounded-lg text-emerald-800">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{b.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{b.verificationCode}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Notification Preferences
              </h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-800">
                    Instant alerts for newly ingested roles (≤2 Yrs only)
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.notifications.newEntryLevelDrops}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          newEntryLevelDrops: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                  <span className="text-xs font-semibold text-slate-800">
                    Simulator challenge releases & badge updates
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.notifications.simulatorPassAlerts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          simulatorPassAlerts: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Client-State Persisted
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
