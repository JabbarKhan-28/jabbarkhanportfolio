"use client";
import { useEffect, useState } from "react";
import { Save, Eye, EyeOff, ArrowUp, ArrowDown, Menu, CheckCircle2 } from "lucide-react";

interface NavigationSetting {
  id?: string;
  sectionId: string;
  sectionName: string;
  label: string;
  href: string;
  visible: boolean;
  displayOrder: number;
}

const DEFAULT_SECTIONS = [
  { sectionId: "home", sectionName: "Home", label: "Home", href: "#home", visible: true, displayOrder: 0 },
  { sectionId: "about", sectionName: "About Me", label: "About", href: "#about", visible: true, displayOrder: 1 },
  { sectionId: "projects", sectionName: "Projects", label: "Projects", href: "#projects", visible: true, displayOrder: 2 },
  { sectionId: "skills", sectionName: "Skills", label: "Skills", href: "#skills", visible: true, displayOrder: 3 },
  { sectionId: "experience", sectionName: "Experience", label: "Experience", href: "#experience", visible: true, displayOrder: 4 },
  { sectionId: "services", sectionName: "Services", label: "Services", href: "#services", visible: true, displayOrder: 5 },
  { sectionId: "certifications", sectionName: "Certifications", label: "Certifications", href: "#certifications", visible: true, displayOrder: 6 },
  { sectionId: "testimonials", sectionName: "Testimonials", label: "Testimonials", href: "#testimonials", visible: true, displayOrder: 7 },
  { sectionId: "contact", sectionName: "Contact", label: "Contact", href: "#contact", visible: true, displayOrder: 8 }
];

export default function NavigationPage() {
  const [items, setItems] = useState<NavigationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/config?type=navigation")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Sort by displayOrder
          const sorted = [...data].sort((a, b) => a.displayOrder - b.displayOrder);
          setItems(sorted);
        } else {
          setItems(DEFAULT_SECTIONS);
        }
      })
      .catch(() => showToast("Failed to load navigation settings", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Assign displayOrder based on current index
    const payload = items.map((item, idx) => ({
      ...item,
      displayOrder: idx
    }));

    try {
      const r = await fetch("/api/admin/config?type=navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!r.ok) {
        const e = await r.json();
        return showToast(e.error || "Failed to save", "error");
      }
      showToast("Navigation settings saved successfully!");
    } catch {
      showToast("Failed to update navigation settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisible = (index: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], visible: !updated[index].visible };
    setItems(updated);
  };

  const handleChangeField = (index: number, field: "label" | "href", val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setItems(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setItems(updated);
  };

  if (loading) return <div className="text-center py-12 text-white/30">Loading settings...</div>;

  return (
    <div className="space-y-5 max-w-4xl font-sans">
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
          <h1 className="text-xl font-bold text-white">Navigation Settings</h1>
          <p className="text-sm text-white/40">Toggle section visibility, rename headers, and reorder links</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
        >
          <Save size={15} />
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </div>

      {/* Content Panel */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-2">
          <Menu size={16} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Menu Navigation Sections</h2>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.sectionId}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                item.visible
                  ? "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]"
                  : "bg-white/[0.01] border-white/[0.03] opacity-60"
              }`}
            >
              {/* Order Buttons */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMoveUp(idx)}
                  className="p-1 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white disabled:opacity-20 transition-all"
                  title="Move Up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  disabled={idx === items.length - 1}
                  onClick={() => handleMoveDown(idx)}
                  className="p-1 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white disabled:opacity-20 transition-all"
                  title="Move Down"
                >
                  <ArrowDown size={13} />
                </button>
              </div>

              {/* Name Details */}
              <div className="w-24 md:w-32 shrink-0">
                <p className="text-xs font-semibold text-white truncate">{item.sectionName}</p>
                <p className="text-[9px] text-white/30 font-mono mt-0.5">ID: {item.sectionId}</p>
              </div>

              {/* Label Inputs */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleChangeField(idx, "label", e.target.value)}
                    placeholder="Menu label"
                    className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => handleChangeField(idx, "href", e.target.value)}
                    placeholder="Anchor link, e.g. #about"
                    className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              </div>

              {/* Action Visibility Toggle */}
              <button
                onClick={() => handleToggleVisible(idx)}
                className={`p-2 rounded-lg border transition-all ${
                  item.visible
                    ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/10"
                    : "bg-white/[0.05] hover:bg-white/[0.08] text-white/30 border-white/[0.08]"
                }`}
                title={item.visible ? "Hide Section" : "Show Section"}
              >
                {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Save Navigation Menu Layout"}
      </button>
    </div>
  );
}
