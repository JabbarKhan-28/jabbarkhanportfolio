"use client";
import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Home, Sparkles, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

interface HeroSettings {
  headline: string;
  subheading: string;
  typingText: string[];
  buttonText: string;
  buttonLink: string;
  availabilityBadge: boolean;
  currentPosition: string;
  currentCompany: string;
  profileImage: string;
  backgroundImage: string;
}

const DEFAULTS: HeroSettings = {
  headline: "",
  subheading: "",
  typingText: [],
  buttonText: "View Featured Work",
  buttonLink: "#projects",
  availabilityBadge: true,
  currentPosition: "",
  currentCompany: "",
  profileImage: "",
  backgroundImage: ""
};

export default function HeroPage() {
  const [settings, setSettings] = useState<HeroSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/config?type=hero")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setSettings({
            headline: data.headline || "",
            subheading: data.subheading || "",
            typingText: Array.isArray(data.typingText) ? data.typingText : [],
            buttonText: data.buttonText || "View Featured Work",
            buttonLink: data.buttonLink || "#projects",
            availabilityBadge: data.availabilityBadge !== false,
            currentPosition: data.currentPosition || "",
            currentCompany: data.currentCompany || "",
            profileImage: data.profileImage || "",
            backgroundImage: data.backgroundImage || ""
          });
        }
      })
      .catch(() => showToast("Failed to load hero settings", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/config?type=hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (!r.ok) {
        const e = await r.json();
        return showToast(e.error || "Failed to save", "error");
      }
      showToast("Hero section settings saved successfully!");
    } catch {
      showToast("Error updating settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTypingText = () => {
    setSettings((prev) => ({ ...prev, typingText: [...prev.typingText, ""] }));
  };

  const handleTypingTextChange = (index: number, val: string) => {
    const updated = [...settings.typingText];
    updated[index] = val;
    setSettings((prev) => ({ ...prev, typingText: updated }));
  };

  const handleRemoveTypingText = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      typingText: prev.typingText.filter((_, i) => i !== index)
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
          <h1 className="text-xl font-bold text-white">Hero Section</h1>
          <p className="text-sm text-white/40">Manage your main banner content, typing texts, and positions</p>
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
        {/* Texts */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Home size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Hero Headline & Subtext</h2>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Headline</label>
            <input
              type="text"
              value={settings.headline}
              onChange={(e) => setSettings((p) => ({ ...p, headline: e.target.value }))}
              placeholder="e.g. Hi, I'm Jabbar Khan"
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Subheading</label>
            <textarea
              rows={4}
              value={settings.subheading}
              onChange={(e) => setSettings((p) => ({ ...p, subheading: e.target.value }))}
              placeholder="A brief tagline or summary that goes under the headline..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Current Position</label>
              <input
                type="text"
                value={settings.currentPosition}
                onChange={(e) => setSettings((p) => ({ ...p, currentPosition: e.target.value }))}
                placeholder="e.g. Lead Mobile Developer"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Current Company</label>
              <input
                type="text"
                value={settings.currentCompany}
                onChange={(e) => setSettings((p) => ({ ...p, currentCompany: e.target.value }))}
                placeholder="e.g. Google"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Buttons & Status */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Call to Action & Badges</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Button Text</label>
              <input
                type="text"
                value={settings.buttonText}
                onChange={(e) => setSettings((p) => ({ ...p, buttonText: e.target.value }))}
                placeholder="View Work"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Button Link</label>
              <input
                type="text"
                value={settings.buttonLink}
                onChange={(e) => setSettings((p) => ({ ...p, buttonLink: e.target.value }))}
                placeholder="#projects"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center justify-between cursor-pointer py-2">
              <div>
                <p className="text-sm text-white/70 font-medium">Availability Badge</p>
                <p className="text-xs text-white/30 mt-0.5">Show "Available for new projects" status dot</p>
              </div>
              <div
                onClick={() => setSettings((prev) => ({ ...prev, availabilityBadge: !prev.availabilityBadge }))}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                  settings.availabilityBadge ? "bg-blue-600" : "bg-white/[0.1]"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.availabilityBadge ? "left-7" : "left-1"
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="border-t border-white/[0.06] pt-4 flex items-center gap-2">
            <ImageIcon size={16} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Media Paths</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Profile Image URL</label>
              <input
                type="text"
                value={settings.profileImage}
                onChange={(e) => setSettings((p) => ({ ...p, profileImage: e.target.value }))}
                placeholder="/me.png"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Background Image URL</label>
              <input
                type="text"
                value={settings.backgroundImage}
                onChange={(e) => setSettings((p) => ({ ...p, backgroundImage: e.target.value }))}
                placeholder="/bg.jpg"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Typing Texts */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkIcon size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Typing Animation Words</h2>
            </div>
            <button
              onClick={handleAddTypingText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-white hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <Plus size={13} />
              Add Word
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {settings.typingText.length === 0 ? (
              <p className="text-xs text-white/25 py-4 text-center col-span-full">No typing texts configured yet.</p>
            ) : (
              settings.typingText.map((text, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => handleTypingTextChange(idx, e.target.value)}
                    placeholder="e.g. Mobile Developer"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                  <button
                    onClick={() => handleRemoveTypingText(idx)}
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
        {saving ? "Saving..." : "Save Hero Section Settings"}
      </button>
    </div>
  );
}
