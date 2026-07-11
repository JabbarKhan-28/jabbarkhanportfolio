"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search, CheckSquare, Square } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  yearsExperience: string;
  displayOrder: number;
  published: boolean;
}

const CATEGORIES = ["Frontend Engineering", "Mobile Development", "Backend & Databases", "Tools & Practices"];
const empty = (): Partial<Skill> => ({ name: "", icon: "Code2", color: "text-primary", category: "Frontend Engineering", yearsExperience: "1 year", displayOrder: 0, published: true });

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Partial<Skill>>(empty());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const load = async () => { setLoading(true); try { const r = await fetch("/api/admin/skills"); if (r.ok) setSkills(await r.json()); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const filtered = skills.filter(s => {
    const m = s.name.toLowerCase().includes(search.toLowerCase());
    return catFilter === "all" ? m : m && s.category === catFilter;
  });

  const toggleAll = () => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(s => s.id)));
  const toggleSelect = (id: string) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s); };

  const handleSave = async () => {
    if (!editing.name) return showToast("Skill name required", "error");
    setSaving(true);
    try {
      const isEdit = modal === "edit" && editing.id;
      const url = isEdit ? `/api/admin/skills?id=${editing.id}` : "/api/admin/skills";
      const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      if (!res.ok) { const e = await res.json(); return showToast(e.error, "error"); }
      showToast(isEdit ? "Skill updated!" : "Skill added!"); setModal(null); setEditing(empty()); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    const r = await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
    if (r.ok) { showToast("Deleted"); load(); } else showToast("Failed", "error");
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} skills?`)) return;
    const r = await fetch(`/api/admin/skills?id=${Array.from(selected).join(",")}`, { method: "DELETE" });
    if (r.ok) { showToast(`${selected.size} deleted`); setSelected(new Set()); load(); } else showToast("Failed", "error");
  };

  const grouped = CATEGORIES.map(cat => ({ cat, items: filtered.filter(s => s.category === cat) })).filter(g => catFilter === "all" ? true : g.cat === catFilter);

  return (
    <div className="space-y-5 max-w-6xl">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${toast.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border border-red-500/30 text-red-300"}`}>
          {toast.msg}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-white">Skills</h1><p className="text-sm text-white/40">{skills.length} total skills</p></div>
        <button onClick={() => { setEditing(empty()); setModal("add"); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all w-fit">
          <Plus size={16} />Add Skill
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm focus:outline-none">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
          <span>{selected.size} selected</span>
          <button onClick={handleBulkDelete} className="flex items-center gap-1.5 text-red-400 hover:text-red-300"><Trash2 size={13} />Delete selected</button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-white/30 hover:text-white/60"><X size={14} /></button>
        </div>
      )}
      {loading ? (
        <div className="text-center py-12 text-white/30">Loading skills...</div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ cat, items }) => items.length > 0 && (
            <div key={cat} className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white/70">{cat} <span className="text-white/30 font-normal ml-2">{items.length} skills</span></h2>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {items.map(skill => (
                  <div key={skill.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                    <button onClick={() => toggleSelect(skill.id)} className="text-white/30 hover:text-white/70 shrink-0">
                      {selected.has(skill.id) ? <CheckSquare size={15} className="text-blue-400" /> : <Square size={15} />}
                    </button>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white/90">{skill.name}</p>
                      <p className="text-xs text-white/35">{skill.yearsExperience} • {skill.icon}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${skill.published ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.05] text-white/30"}`}>
                      {skill.published ? "Visible" : "Hidden"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setEditing({ ...skill }); setModal("edit"); }} className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-blue-400 transition-all"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {grouped.every(g => g.items.length === 0) && <div className="text-center py-12 text-white/30">No skills found</div>}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-white/[0.1] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-bold text-white">{modal === "add" ? "Add Skill" : "Edit Skill"}</h2>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white/80"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[{ label: "Skill Name *", field: "name", placeholder: "Next.js" }, { label: "Icon (Lucide name)", field: "icon", placeholder: "Code2" }, { label: "Years of Experience", field: "yearsExperience", placeholder: "2 years" }].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
                  <input value={(editing as any)[field] || ""} onChange={e => setEditing(prev => ({ ...prev, [field]: e.target.value }))} placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Category</label>
                <select value={editing.category || CATEGORIES[0]} onChange={e => setEditing(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(editing.published)} onChange={e => setEditing(prev => ({ ...prev, published: e.target.checked }))} className="accent-blue-500" />
                  <span className="text-sm text-white/60">Visible</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/[0.08]">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2">
                {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {saving ? "Saving..." : modal === "add" ? "Add Skill" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
