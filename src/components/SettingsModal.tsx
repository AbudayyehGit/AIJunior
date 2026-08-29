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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#17202A]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#FBFBFA] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#CCD2D8] p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#3A7CA5]">
              <Settings className="w-4 h-4 text-[#3A7CA5]" /> Preferences & Sync
            </div>
            <h3 className="text-2xl font-black text-[#2C3E50]">Personalized Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-[#CCD2D8] text-[#6E8193] hover:text-[#2C3E50] hover:bg-[#E5E8EB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSavedNotice ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#C59B27] mx-auto" />
            <h4 className="text-xl font-bold text-[#2C3E50]">Preferences Synchronized</h4>
            <p className="text-xs text-[#6E8193]">Your profile and search filters have been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Seeker Profile Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E8193] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#3A7CA5]" /> Candidate Profile
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#2C3E50] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.seekerProfile.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seekerProfile: { ...formData.seekerProfile, name: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-[#CCD2D8] bg-[#F4F4F0] text-sm text-[#2C3E50] focus:bg-[#FBFBFA] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2C3E50] block mb-1">Target Role Title</label>
                  <input
                    type="text"
                    value={formData.seekerProfile.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seekerProfile: { ...formData.seekerProfile, title: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-[#CCD2D8] bg-[#F4F4F0] text-sm text-[#2C3E50] focus:bg-[#FBFBFA] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                  />
                </div>
              </div>

              {/* GitHub & HuggingFace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#2C3E50] block mb-1 flex items-center gap-1">
                    <Github className="w-3.5 h-3.5 text-[#3A7CA5]" /> GitHub Profile URL
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
                    className="w-full p-3 rounded-xl border border-[#CCD2D8] bg-[#F4F4F0] text-sm text-[#2C3E50] focus:bg-[#FBFBFA] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2C3E50] block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Hugging Face Space URL
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
                    className="w-full p-3 rounded-xl border border-[#CCD2D8] bg-[#F4F4F0] text-sm text-[#2C3E50] focus:bg-[#FBFBFA] focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]"
                  />
                </div>
              </div>

              {/* Minimum Salary Floor */}
              <div className="p-4 bg-[#F4F4F0] rounded-2xl border border-[#CCD2D8] space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#2C3E50]">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#3A7CA5]" /> Desired Minimum Salary Floor
                  </span>
                  <span className="font-mono text-[#8A6714] font-black">
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
                  className="w-full accent-[#C59B27]"
                />
              </div>
            </div>

            {/* Earned Badges Box */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E8193] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#C59B27]" /> Earned & Synchronized Badges ({earnedBadges.length})
              </h4>
              {earnedBadges.length === 0 ? (
                <div className="p-4 bg-[#F4F4F0] rounded-2xl border border-[#CCD2D8] text-xs text-[#6E8193] text-center">
                  Take a skill simulator sandbox to attach Sanctuary Gold badges to your profile.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {earnedBadges.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-[#FAF0D4] rounded-xl border border-[#C59B27]/40 flex items-center gap-3 text-xs"
                    >
                      <div className="p-2 bg-[#C59B27] rounded-lg text-white shadow-xs">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-black text-[#2C3E50]">{b.name}</div>
                        <div className="text-[10px] font-mono text-[#8A6714]">{b.verificationCode}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E8193] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#3A7CA5]" /> Notification Preferences
              </h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3.5 bg-[#F4F4F0] rounded-2xl border border-[#CCD2D8] cursor-pointer">
                  <span className="text-xs font-bold text-[#2C3E50]">
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
                    className="w-4 h-4 text-[#C59B27] rounded accent-[#C59B27]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-[#F4F4F0] rounded-2xl border border-[#CCD2D8] cursor-pointer">
                  <span className="text-xs font-bold text-[#2C3E50]">
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
                    className="w-4 h-4 text-[#C59B27] rounded accent-[#C59B27]"
                  />
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#CCD2D8] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#8A6714] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#C59B27]" /> Client-State Persisted
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-[#CCD2D8] text-xs font-bold text-[#2C3E50] hover:bg-[#E5E8EB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#AA821C] text-white text-xs font-bold shadow-sanctuary-glow transition-all"
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

