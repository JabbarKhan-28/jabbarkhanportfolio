"use client";
import { useEffect, useState } from "react";
import { Save, RefreshCw, Palette } from "lucide-react";

interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontSans: string;
  fontHeading: string;
  borderRadius: string;
  darkMode: boolean;
  gradientColors: string;
  containerWidth: string;
  sectionSpacing: string;
  shadowStyle: string;
}

const DEFAULTS: AppearanceSettings = {
  primaryColor: "oklch(0.55 0.18 250)",
  secondaryColor: "oklch(0.60 0.18 280)",
  accentColor: "oklch(0.65 0.15 200)",
  fontSans: "Inter",
  fontHeading: "Space Grotesk",
  borderRadius: "1.0rem",
  darkMode: true,
  gradientColors: "linear-gradient(135deg, oklch(0.65 0.18 250) 0%, oklch(0.55 0.18 250) 50%, oklch(0.60 0.18 280) 100%)",
  containerWidth: "max-w-6xl",
  sectionSpacing: "py-24",
  shadowStyle: "shadow-xs"
};

export default function AppearancePage() {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    fetch("/api/admin/config?type=appearance")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSettings({ ...DEFAULTS, ...data }); })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/config?type=appearance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (!r.ok) { const e = await r.json(); return showToast(e.error, "error"); }
      showToast("Appearance settings saved! Refresh the website to see changes.");
    } finally { setSaving(false); }
  };

  const field = (label: string, key: keyof AppearanceSettings, opts?: { type?: string; placeholder?: string; help?: string; options?: string[] }) => (
    <div key={key}>
      <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {opts?.options ? (
        <select value={settings[key] as string} onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all">
          {opts.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={opts?.type || "text"} value={settings[key] as string} placeholder={opts?.placeholder}
          onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all" />
      )}
      {opts?.help && <p className="text-xs text-white/25 mt-1">{opts.help}</p>}
    </div>
  );

  if (loading) return <div className="text-center py-12 text-white/30">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${toast.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border border-red-500/30 text-red-300"}`}>
          {toast.msg}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Appearance</h1>
          <p className="text-sm text-white/40">Customize the visual theme of your portfolio</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
          <Save size={15} />{saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Colors */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} className="text-violet-400" />
          <h2 className="text-sm font-semibold text-white">Color Palette</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {field("Primary Color", "primaryColor", { help: "Main brand color (oklch or hex)" })}
          {field("Secondary Color", "secondaryColor", { help: "Accent secondary color" })}
          {field("Accent Color", "accentColor", { help: "Highlight accent color" })}
        </div>
        {field("Gradient Colors (CSS)", "gradientColors", { help: "CSS gradient string for text and button gradients", placeholder: "linear-gradient(135deg, ...)" })}
      </div>

      {/* Typography */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white mb-4">Typography</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Body Font", "fontSans", { options: ["Inter", "Roboto", "Outfit", "Plus Jakarta Sans", "DM Sans", "Nunito"] })}
          {field("Heading Font", "fontHeading", { options: ["Space Grotesk", "Sora", "Raleway", "Clash Display", "Bricolage Grotesque", "Plus Jakarta Sans"] })}
        </div>
      </div>

      {/* Layout */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white mb-4">Layout & Spacing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Border Radius", "borderRadius", { options: ["0.5rem", "0.75rem", "1.0rem", "1.25rem", "1.5rem"] })}
          {field("Container Width", "containerWidth", { options: ["max-w-5xl", "max-w-6xl", "max-w-7xl", "max-w-screen-xl"] })}
          {field("Section Spacing", "sectionSpacing", { options: ["py-16", "py-20", "py-24", "py-32"] })}
          {field("Shadow Style", "shadowStyle", { options: ["shadow-none", "shadow-xs", "shadow-sm", "shadow-md", "shadow-lg"] })}
        </div>
      </div>

      {/* Mode */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Display Mode</h2>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm text-white/70">Dark Mode</p>
            <p className="text-xs text-white/30 mt-0.5">Toggle between dark and light portfolio theme</p>
          </div>
          <div
            onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${settings.darkMode ? "bg-blue-600" : "bg-white/[0.1]"}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.darkMode ? "left-7" : "left-1"}`} />
          </div>
        </label>
      </div>

      <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
        <Save size={16} />{saving ? "Saving..." : "Save All Appearance Settings"}
      </button>
    </div>
  );
}
