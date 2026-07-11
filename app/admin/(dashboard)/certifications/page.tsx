"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Award } from "lucide-react";

interface Cert { id: string; title: string; issuer: string; date: string; description: string; icon: string; credentialUrl: string; image: string; displayOrder: number; published: boolean; }
const empty = (): Partial<Cert> => ({ title: "", issuer: "", date: "", description: "", icon: "Award", credentialUrl: "", image: "", displayOrder: 0, published: true });

export default function CertificationsPage() {
  const [items, setItems] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Partial<Cert>>(empty());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const load = async () => { setLoading(true); try { const r = await fetch("/api/admin/certifications"); if (r.ok) setItems(await r.json()); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing.title) return showToast("Title required", "error");
    setSaving(true);
    try {
      const isEdit = modal === "edit" && editing.id;
      const url = isEdit ? `/api/admin/certifications?id=${editing.id}` : "/api/admin/certifications";
      const r = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      if (!r.ok) { const e = await r.json(); return showToast(e.error, "error"); }
      showToast(isEdit ? "Updated!" : "Added!"); setModal(null); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; const r = await fetch(`/api/admin/certifications?id=${id}`, { method: "DELETE" }); if (r.ok) { showToast("Deleted"); load(); } };

  return (
    <div className="space-y-5 max-w-4xl">
      {toast && <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${toast.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border border-red-500/30 text-red-300"}`}>{toast.msg}</div>}
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Certifications & Achievements</h1><p className="text-sm text-white/40">{items.length} total</p></div>
        <button onClick={() => { setEditing(empty()); setModal("add"); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold"><Plus size={16} />Add</button>
      </div>
      {loading ? <div className="text-center py-12 text-white/30">Loading...</div> : items.length === 0 ? <div className="text-center py-12 text-white/30">No entries yet</div> : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4 hover:bg-white/[0.05] transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0"><Award size={18} className="text-orange-400" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                <p className="text-xs text-white/40">{item.issuer} • {item.date}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => { setEditing({ ...item }); setModal("edit"); }} className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-blue-400"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-white/[0.1] rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]"><h2 className="text-lg font-bold text-white">{modal === "add" ? "Add" : "Edit"} Certification</h2><button onClick={() => setModal(null)} className="text-white/40 hover:text-white/80"><X size={20} /></button></div>
            <div className="p-6 space-y-4">
              {[{ l: "Title *", f: "title" }, { l: "Issuer *", f: "issuer" }, { l: "Date", f: "date" }, { l: "Icon (Lucide)", f: "icon" }, { l: "Credential URL", f: "credentialUrl" }, { l: "Image URL", f: "image" }].map(({ l, f }) => (
                <div key={f}><label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">{l}</label><input value={(editing as any)[f] || ""} onChange={e => setEditing(p => ({ ...p, [f]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all" /></div>
              ))}
              <div><label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Description</label><textarea rows={3} value={editing.description || ""} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-none" /></div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/[0.08]">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
