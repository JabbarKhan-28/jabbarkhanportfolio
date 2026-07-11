"use client";
import { useEffect, useState } from "react";
import { Save, Eye, EyeOff, Settings, ShieldAlert, Cpu, Mail } from "lucide-react";

interface SiteSettings {
  websiteName: string;
  logo: string;
  favicon: string;
  footerText: string;
  copyright: string;
  resumeFile: string;
  maintenanceMode: boolean;
  analyticsId: string;
  googleSearchConsole: string;
  smtpHost: string;
  smtpPort: string | number;
  smtpUser: string;
  smtpPass: string;
}

const DEFAULTS: SiteSettings = {
  websiteName: "Jabbar Khan",
  logo: "",
  favicon: "",
  footerText: "",
  copyright: "",
  resumeFile: "",
  maintenanceMode: false,
  analyticsId: "",
  googleSearchConsole: "",
  smtpHost: "",
  smtpPort: "",
  smtpUser: "",
  smtpPass: ""
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/config?type=settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setSettings({
            websiteName: data.websiteName || "Jabbar Khan",
            logo: data.logo || "",
            favicon: data.favicon || "",
            footerText: data.footerText || "",
            copyright: data.copyright || "",
            resumeFile: data.resumeFile || "",
            maintenanceMode: Boolean(data.maintenanceMode),
            analyticsId: data.analyticsId || "",
            googleSearchConsole: data.googleSearchConsole || "",
            smtpHost: data.smtpHost || "",
            smtpPort: data.smtpPort !== null ? data.smtpPort : "",
            smtpUser: data.smtpUser || "",
            smtpPass: data.smtpPass || ""
          });
        }
      })
      .catch(() => showToast("Failed to load settings", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...settings,
        smtpPort: settings.smtpPort !== "" ? Number(settings.smtpPort) : null
      };
      const r = await fetch("/api/admin/config?type=settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!r.ok) {
        const e = await r.json();
        return showToast(e.error || "Failed to save settings", "error");
      }
      showToast("General site settings saved successfully!");
    } catch {
      showToast("Failed to update general settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-white/30">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl font-sans">
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
          <h1 className="text-xl font-bold text-white">General Settings</h1>
          <p className="text-sm text-white/40">Manage global website assets, SMTP configs, and integrations</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
        >
          <Save size={15} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* General Details */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">General Information</h2>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
              Website Name
            </label>
            <input
              type="text"
              value={settings.websiteName}
              onChange={(e) => setSettings((p) => ({ ...p, websiteName: e.target.value }))}
              placeholder="e.g. Jabbar Khan Portfolio"
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Logo URL
              </label>
              <input
                type="text"
                value={settings.logo}
                onChange={(e) => setSettings((p) => ({ ...p, logo: e.target.value }))}
                placeholder="/logo.svg"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Favicon URL
              </label>
              <input
                type="text"
                value={settings.favicon}
                onChange={(e) => setSettings((p) => ({ ...p, favicon: e.target.value }))}
                placeholder="/favicon.ico"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
              Footer Description
            </label>
            <textarea
              rows={2}
              value={settings.footerText}
              onChange={(e) => setSettings((p) => ({ ...p, footerText: e.target.value }))}
              placeholder="Footer description text..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-y"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
              Copyright Text
            </label>
            <input
              type="text"
              value={settings.copyright}
              onChange={(e) => setSettings((p) => ({ ...p, copyright: e.target.value }))}
              placeholder="e.g. © 2026 Jabbar Khan. All rights reserved."
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
        </div>

        {/* System Settings & Integrations */}
        <div className="space-y-5">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-white">System Controls</h2>
            </div>
            <div>
              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <p className="text-sm text-white/70 font-medium">Maintenance Mode</p>
                  <p className="text-xs text-white/30 mt-0.5">Redirect users to under construction screen</p>
                </div>
                <div
                  onClick={() => setSettings((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                    settings.maintenanceMode ? "bg-red-600" : "bg-white/[0.1]"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.maintenanceMode ? "left-7" : "left-1"
                    }`}
                  />
                </div>
              </label>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Resume File Download Link
              </label>
              <input
                type="text"
                value={settings.resumeFile}
                onChange={(e) => setSettings((p) => ({ ...p, resumeFile: e.target.value }))}
                placeholder="/files/resume.pdf"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={16} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Tracking & Webmasters</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={settings.analyticsId}
                  onChange={(e) => setSettings((p) => ({ ...p, analyticsId: e.target.value }))}
                  placeholder="G-XXXXXX"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Search Console ID
                </label>
                <input
                  type="text"
                  value={settings.googleSearchConsole}
                  onChange={(e) => setSettings((p) => ({ ...p, googleSearchConsole: e.target.value }))}
                  placeholder="google-site-verification..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SMTP Mail details */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-2">
            <Mail size={16} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-white">SMTP Email Configurations (Contact Form forwarding)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                SMTP Host
              </label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => setSettings((p) => ({ ...p, smtpHost: e.target.value }))}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                SMTP Port
              </label>
              <input
                type="text"
                value={settings.smtpPort}
                onChange={(e) => setSettings((p) => ({ ...p, smtpPort: e.target.value }))}
                placeholder="465 or 587"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                SMTP Username
              </label>
              <input
                type="text"
                value={settings.smtpUser}
                onChange={(e) => setSettings((p) => ({ ...p, smtpUser: e.target.value }))}
                placeholder="user@gmail.com"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                SMTP Password
              </label>
              <div className="relative">
                <input
                  type={showSmtpPass ? "text" : "password"}
                  value={settings.smtpPass}
                  onChange={(e) => setSettings((p) => ({ ...p, smtpPass: e.target.value }))}
                  placeholder="App Password"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSmtpPass(!showSmtpPass)}
                  className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showSmtpPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Save General Settings"}
      </button>
    </div>
  );
}
