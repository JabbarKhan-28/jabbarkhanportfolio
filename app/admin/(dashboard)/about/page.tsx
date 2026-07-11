"use client";
import { useEffect, useState } from "react";
import { Save, Plus, Trash2, User, Target, Compass, BookOpen } from "lucide-react";

interface StatItem {
  number: string;
  label: string;
}

interface AboutSettings {
  profilePic: string;
  heroImage: string;
  biography: string;
  journey: string;
  mission: string;
  vision: string;
  goals: string[];
  stats: StatItem[];
  resumeUrl: string;
}

const DEFAULTS: AboutSettings = {
  profilePic: "",
  heroImage: "",
  biography: "",
  journey: "",
  mission: "",
  vision: "",
  goals: [],
  stats: [],
  resumeUrl: ""
};

export default function AboutPage() {
  const [settings, setSettings] = useState<AboutSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/config?type=about")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setSettings({
            profilePic: data.profilePic || "",
            heroImage: data.heroImage || "",
            biography: data.biography || "",
            journey: data.journey || "",
            mission: data.mission || "",
            vision: data.vision || "",
            goals: Array.isArray(data.goals) ? data.goals : [],
            stats: Array.isArray(data.stats) ? data.stats : [],
            resumeUrl: data.resumeUrl || ""
          });
        }
      })
      .catch(() => showToast("Failed to load about settings", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/config?type=about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (!r.ok) {
        const e = await r.json();
        return showToast(e.error || "Failed to save", "error");
      }
      showToast("About section settings saved successfully!");
    } catch {
      showToast("Error updating settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = () => {
    setSettings((prev) => ({ ...prev, goals: [...prev.goals, ""] }));
  };

  const handleGoalChange = (index: number, val: string) => {
    const updated = [...settings.goals];
    updated[index] = val;
    setSettings((prev) => ({ ...prev, goals: updated }));
  };

  const handleRemoveGoal = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const handleAddStat = () => {
    setSettings((prev) => ({
      ...prev,
      stats: [...prev.stats, { number: "", label: "" }]
    }));
  };

  const handleStatChange = (index: number, key: keyof StatItem, val: string) => {
    const updated = [...settings.stats];
    updated[index] = { ...updated[index], [key]: val };
    setSettings((prev) => ({ ...prev, stats: updated }));
  };

  const handleRemoveStat = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div className="text-center py-12 text-white/30">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${
            toast.type === "success"
              ? "bg-emerald-500/25 border border-emerald-500/35 text-emerald-300"
              : "bg-red-500/25 border border-red-500/35 text-red-300"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">About Section</h1>
          <p className="text-sm text-white/40">Manage your biography, journey, goals, and experience stats</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
        >
          <Save size={15} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Core Info */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">General Information</h2>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Biography</label>
            <textarea
              rows={4}
              value={settings.biography}
              onChange={(e) => setSettings((p) => ({ ...p, biography: e.target.value }))}
              placeholder="Tell your professional story..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-y"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Professional Journey</label>
            <textarea
              rows={4}
              value={settings.journey}
              onChange={(e) => setSettings((p) => ({ ...p, journey: e.target.value }))}
              placeholder="Describe your career path..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-y"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Resume File URL</label>
            <input
              type="text"
              value={settings.resumeUrl}
              onChange={(e) => setSettings((p) => ({ ...p, resumeUrl: e.target.value }))}
              placeholder="e.g. /files/resume.pdf or Google Drive link"
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
        </div>

        {/* Media & Vision */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={16} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Visuals & Mission</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Profile Picture URL</label>
              <input
                type="text"
                value={settings.profilePic}
                onChange={(e) => setSettings((p) => ({ ...p, profilePic: e.target.value }))}
                placeholder="/avatar.png"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Hero Image URL</label>
              <input
                type="text"
                value={settings.heroImage}
                onChange={(e) => setSettings((p) => ({ ...p, heroImage: e.target.value }))}
                placeholder="/hero.jpg"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Mission Statement</label>
            <textarea
              rows={2}
              value={settings.mission}
              onChange={(e) => setSettings((p) => ({ ...p, mission: e.target.value }))}
              placeholder="What drives you?"
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-y"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Vision Statement</label>
            <textarea
              rows={2}
              value={settings.vision}
              onChange={(e) => setSettings((p) => ({ ...p, vision: e.target.value }))}
              placeholder="Your long-term target..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-y"
            />
          </div>
        </div>

        {/* Goals List */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Professional Goals</h2>
            </div>
            <button
              onClick={handleAddGoal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-white hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <Plus size={13} />
              Add Goal
            </button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {settings.goals.length === 0 ? (
              <p className="text-xs text-white/25 py-4 text-center">No goals added yet. Click Add Goal to start.</p>
            ) : (
              settings.goals.map((goal, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => handleGoalChange(idx, e.target.value)}
                    placeholder="e.g. Master system designs"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                  <button
                    onClick={() => handleRemoveGoal(idx)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/20 transition-all shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Experience Statistics</h2>
            </div>
            <button
              onClick={handleAddStat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-white hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <Plus size={13} />
              Add Stat
            </button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {settings.stats.length === 0 ? (
              <p className="text-xs text-white/25 py-4 text-center">No stats added yet. Click Add Stat to start.</p>
            ) : (
              settings.stats.map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => handleStatChange(idx, "number", e.target.value)}
                    placeholder="e.g. 5+"
                    className="w-24 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-blue-500/40 transition-all shrink-0"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    placeholder="e.g. Years Experience"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                  <button
                    onClick={() => handleRemoveStat(idx)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/20 transition-all shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Save About Section Settings"}
      </button>
    </div>
  );
}
