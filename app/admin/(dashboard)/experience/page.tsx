"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Briefcase, GraduationCap } from "lucide-react";

interface Experience {
  id: string;
  type: string;
  role: string;
  company: string;
  duration: string;
  icon: string;
  points: string;
  displayOrder: number;
}

const empty = (): Partial<Experience> => ({ type: "work", role: "", company: "", duration: "", icon: "Briefcase", points: "[]", displayOrder: 0 });

export default function ExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Partial<Experience>>(empty());
  const [pointsStr, setPointsStr] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => { setLoading(true); try { const r = await fetch("/api/admin/experiences"); if (r.ok) setItems(await r.json()); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing.role) return showToast("Role is required", "error");
    setSaving(true);
    try {
      const points = pointsStr.split("\n").filter(p => p.trim());
      const isEdit = modal === "edit" && editing.id;
      const url = isEdit ? `/api/admin/experiences?id=${editing.id}` : "/api/admin/experiences";
      const r = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...editing, points }) });
      if (!r.ok) { const e = await r.json(); return showToast(e.error, "error"); }
      showToast(isEdit ? "Updated!" : "Added!"); setModal(null); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    const r = await fetch(`/api/admin/experiences?id=${id}`, { method: "DELETE" });
    if (r.ok) { showToast("Deleted"); load(); } else showToast("Failed", "error");
  };

  const openEdit = (item: Experience) => {
    setEditing({ ...item });
    try { setPointsStr(JSON.parse(item.points).join("\n")); } catch { setPointsStr(""); }
    setModal("edit");
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {toast && <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${toast.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border border-red-500/30 text-red-300"}`}>{toast.msg}</div>}
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Experience</h1><p className="text-sm text-white/40">{items.length} entries</p></div>
        <button onClick={() => { setEditing(empty()); setPointsStr(""); setModal("add"); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"><Plus size={16} />Add Experience</button>
      </div>
      {loading ? <div className="text-center py-12 text-white/30">Loading...</div> : items.length === 0 ? <div className="text-center py-12 text-white/30">No experience entries yet</div> : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === "work" ? "bg-blue-500/15" : "bg-violet-500/15"}`}>
                    {item.type === "work" ? <Briefcase size={18} className="text-blue-400" /> : <GraduationCap size={18} className="text-violet-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.role}</p>
                    <p className="text-xs text-white/50">{item.company}</p>
                    <p className="text-xs text-white/30 mt-0.5">{item.duration}</p>
                    {(() => { try { const pts = JSON.parse(item.points); return Array.isArray(pts) ? <ul className="mt-2 space-y-1">{pts.map((p: string, i: number) => <li key={i} className="text-xs text-white/40 flex gap-2"><span className="text-white/20">•</span>{p}</li>)}</ul> : null; } catch { return null; } })()}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-blue-400 transition-all"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-white/[0.1] rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-bold text-white">{modal === "add" ? "Add Experience" : "Edit Experience"}</h2>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white/80"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Type</label>
                <select value={editing.type || "work"} onChange={e => setEditing(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none">
                  <option value="work">Work</option><option value="education">Education</option>
                </select>
              </div>
              {[{ label: "Role / Degree *", field: "role", placeholder: "App Developer Intern" }, { label: "Company / Institution *", field: "company", placeholder: "Zaryans Consulting" }, { label: "Duration", field: "duration", placeholder: "June 2026 – Present" }, { label: "Icon (Lucide name)", field: "icon", placeholder: "Briefcase" }].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
                  <input value={(editing as any)[field] || ""} onChange={e => setEditing(p => ({ ...p, [field]: e.target.value }))} placeholder={placeholder} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Key Points (one per line)</label>
                <textarea rows={5} value={pointsStr} onChange={e => setPointsStr(e.target.value)} placeholder="One bullet point per line..." className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/[0.08]">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold disabled:opacity-50">{saving ? "Saving..." : modal === "add" ? "Add" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
