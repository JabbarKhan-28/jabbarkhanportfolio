"use client";
import { useEffect, useState } from "react";
import { Save, Globe, Search, FileText, Link, Image } from "lucide-react";

interface SeoSettings {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  twitterCard: string;
  canonicalUrl: string;
  robots: string;
  favicon: string;
  structuredData: string;
}

const DEFAULTS: SeoSettings = {
  pageTitle: "Jabbar Khan | App and Web Developer",
  metaDescription: "Premium portfolio website for Jabbar Khan, a modern App and Web Developer focused on high-converting digital experiences.",
  keywords: "portfolio, App Developer, Web Developer, next.js, typescript",
  ogImage: "",
  twitterCard: "summary_large_image",
  canonicalUrl: "",
  robots: "index, follow",
  favicon: "/favicon.ico",
  structuredData: ""
};

export default function SeoPage() {
  const [settings, setSettings] = useState<SeoSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    fetch("/api/admin/config?type=seo")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSettings({ ...DEFAULTS, ...data }); })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/config?type=seo", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (!r.ok) { const e = await r.json(); return showToast(e.error, "error"); }
      showToast("SEO settings saved!");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-12 text-white/30">Loading SEO settings...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${toast.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border border-red-500/30 text-red-300"}`}>{toast.msg}</div>}

      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">SEO Settings</h1><p className="text-sm text-white/40">Manage page titles, descriptions and metadata</p></div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
          <Save size={15} />{saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Basic Meta */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2"><Globe size={15} className="text-blue-400" /><h2 className="text-sm font-semibold text-white">Basic Meta Tags</h2></div>
        {[
          { label: "Page Title", key: "pageTitle", placeholder: "Jabbar Khan | App and Web Developer", help: "Shown in browser tab and search results" },
          { label: "Meta Description", key: "metaDescription", placeholder: "Premium portfolio website...", textarea: true },
          { label: "Keywords (comma separated)", key: "keywords", placeholder: "portfolio, developer, next.js" },
          { label: "Canonical URL", key: "canonicalUrl", placeholder: "https://yoursite.com" },
          { label: "Robots", key: "robots", placeholder: "index, follow" },
        ].map(({ label, key, placeholder, textarea, help }) => (
          <div key={key}>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
            {textarea ? (
              <textarea rows={3} value={(settings as any)[key]} onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))} placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-none" />
            ) : (
              <input value={(settings as any)[key]} onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))} placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all" />
            )}
            {help && <p className="text-xs text-white/25 mt-1">{help}</p>}
          </div>
        ))}
      </div>

      {/* Social Media */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2"><Image size={15} className="text-violet-400" /><h2 className="text-sm font-semibold text-white">Social Media (Open Graph)</h2></div>
        {[
          { label: "OG Image URL", key: "ogImage", placeholder: "/uploads/og-image.jpg" },
          { label: "Twitter Card Type", key: "twitterCard", placeholder: "summary_large_image" },
          { label: "Favicon URL", key: "favicon", placeholder: "/favicon.ico" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
            <input value={(settings as any)[key]} onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))} placeholder={placeholder}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all" />
          </div>
        ))}
      </div>

      {/* Structured Data */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4"><FileText size={15} className="text-cyan-400" /><h2 className="text-sm font-semibold text-white">Structured Data (JSON-LD)</h2></div>
        <textarea rows={8} value={settings.structuredData} onChange={e => setSettings(prev => ({ ...prev, structuredData: e.target.value }))}
          placeholder='{"@context":"https://schema.org", "@type":"Person", ...}'
          className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-xs font-mono focus:outline-none focus:border-blue-500/40 transition-all resize-none" />
      </div>

      <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
        <Save size={16} />{saving ? "Saving..." : "Save All SEO Settings"}
      </button>
    </div>
  );
}
