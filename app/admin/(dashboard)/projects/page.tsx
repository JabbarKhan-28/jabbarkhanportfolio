"use client";
import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, Search, Eye, EyeOff, Star, StarOff,
  ExternalLink, Github, MoreHorizontal, CheckSquare, Square, X
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  skills: string;
  published: boolean;
  featured: boolean;
  githubLink: string;
  liveLink: string;
  image: string;
  displayOrder: number;
}

const emptyProject = (): Partial<Project> => ({
  name: "", description: "", category: "Web", skills: "",
  published: true, featured: false, githubLink: "", liveLink: "",
  image: "", displayOrder: 0
});

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "featured">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Partial<Project>>(emptyProject());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) setProjects(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    if (filter === "published") return matchSearch && p.published;
    if (filter === "draft") return matchSearch && !p.published;
    if (filter === "featured") return matchSearch && p.featured;
    return matchSearch;
  });

  const toggleSelect = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.id)));
  };

  const handleSave = async () => {
    if (!editing.name) return showToast("Project name is required", "error");
    setSaving(true);
    try {
      const isEdit = modal === "edit" && editing.id;
      const url = isEdit ? `/api/admin/projects?id=${editing.id}` : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editing,
          skills: typeof editing.skills === "string" ? editing.skills.split(",").map(s => s.trim()).filter(Boolean) : editing.skills
        })
      });
      if (!res.ok) { const e = await res.json(); return showToast(e.error, "error"); }
      showToast(isEdit ? "Project updated!" : "Project added!");
      setModal(null);
      setEditing(emptyProject());
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Project deleted"); load(); }
    else showToast("Failed to delete", "error");
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} projects?`)) return;
    const ids = Array.from(selected).join(",");
    const res = await fetch(`/api/admin/projects?id=${ids}`, { method: "DELETE" });
    if (res.ok) { showToast(`${selected.size} projects deleted`); setSelected(new Set()); load(); }
    else showToast("Failed to bulk delete", "error");
  };

  const togglePublish = async (p: Project) => {
    const res = await fetch(`/api/admin/projects?id=${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, published: !p.published })
    });
    if (res.ok) { showToast(!p.published ? "Published!" : "Unpublished"); load(); }
  };

  const toggleFeatured = async (p: Project) => {
    const res = await fetch(`/api/admin/projects?id=${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, featured: !p.featured })
    });
    if (res.ok) { showToast(!p.featured ? "Marked as featured" : "Removed from featured"); load(); }
  };

  const openEdit = (p: Project) => {
    setEditing({ ...p, skills: Array.isArray(p.skills) ? (p.skills as any[]).join(", ") : p.skills });
    setModal("edit");
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl transition-all ${
          toast.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border border-red-500/30 text-red-300"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Projects</h1>
          <p className="text-sm text-white/40 mt-0.5">{projects.length} total projects</p>
        </div>
        <button
          onClick={() => { setEditing(emptyProject()); setModal("add"); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all w-fit"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft", "featured"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === f ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white/70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
          <span>{selected.size} selected</span>
          <button onClick={handleBulkDelete} className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors">
            <Trash2 size={13} />
            Delete selected
          </button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-white/30 hover:text-white/60">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left">
                  <button onClick={toggleAll} className="text-white/30 hover:text-white/70">
                    {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-white/30">Loading projects...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-white/30">No projects found</td></tr>
              ) : filtered.map(project => (
                <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => toggleSelect(project.id)} className="text-white/30 hover:text-white/70">
                      {selected.has(project.id) ? <CheckSquare size={15} className="text-blue-400" /> : <Square size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white/90 leading-tight">{project.name}</p>
                    <p className="text-xs text-white/35 mt-0.5 truncate max-w-xs">{project.description}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50">
                      {project.category || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        project.published ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                      }`}>
                        {project.published ? "Published" : "Draft"}
                      </span>
                      {project.featured && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => toggleFeatured(project)} title={project.featured ? "Unfeature" : "Feature"} className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-amber-400 transition-all">
                        {project.featured ? <Star size={14} className="text-amber-400" /> : <StarOff size={14} />}
                      </button>
                      <button onClick={() => togglePublish(project)} title={project.published ? "Unpublish" : "Publish"} className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-emerald-400 transition-all">
                        {project.published ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-white/70 transition-all">
                          <Github size={14} />
                        </a>
                      )}
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-white/70 transition-all">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-blue-400 transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-red-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-white/[0.1] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-bold text-white">{modal === "add" ? "Add Project" : "Edit Project"}</h2>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white/80 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Form fields */}
              {[
                { label: "Project Name *", field: "name", type: "text", placeholder: "DoctorQ — Doctor Appointment Platform" },
                { label: "Short Description *", field: "description", type: "textarea", placeholder: "A brief description of the project..." },
                { label: "GitHub URL", field: "githubLink", type: "url", placeholder: "https://github.com/..." },
                { label: "Live Demo URL", field: "liveLink", type: "url", placeholder: "https://..." },
                { label: "Thumbnail Image URL", field: "image", type: "url", placeholder: "/uploads/project-thumb.jpg" },
                { label: "Tech Stack (comma separated)", field: "skills", type: "text", placeholder: "Next.js, TypeScript, Tailwind CSS" },
                { label: "Problem", field: "problem", type: "textarea", placeholder: "What problem does this project solve?" },
                { label: "Solution", field: "solution", type: "textarea", placeholder: "How was it solved?" },
                { label: "Result", field: "result", type: "textarea", placeholder: "What was the outcome?" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
                  {type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={(editing as any)[field] || ""}
                      onChange={e => setEditing(prev => ({ ...prev, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-none"
                    />
                  ) : (
                    <input
                      type={type}
                      value={(editing as any)[field] || ""}
                      onChange={e => setEditing(prev => ({ ...prev, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                    />
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={editing.category || "Web"}
                    onChange={e => setEditing(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                  >
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={editing.displayOrder || 0}
                    onChange={e => setEditing(prev => ({ ...prev, displayOrder: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(editing.published)} onChange={e => setEditing(prev => ({ ...prev, published: e.target.checked }))} className="accent-blue-500" />
                  <span className="text-sm text-white/60">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(editing.featured)} onChange={e => setEditing(prev => ({ ...prev, featured: e.target.checked }))} className="accent-blue-500" />
                  <span className="text-sm text-white/60">Featured</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/[0.08]">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {saving ? "Saving..." : modal === "add" ? "Add Project" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
