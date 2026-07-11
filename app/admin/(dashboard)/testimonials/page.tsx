"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, MessageSquare, Star, CheckCircle2 } from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  photo: string;
  role: string;
  rating: number;
  feedback: string;
  published: boolean;
  displayOrder: number;
}

const emptyTestimonial = (): Partial<Testimonial> => ({
  clientName: "",
  company: "",
  photo: "",
  role: "",
  rating: 5,
  feedback: "",
  published: true,
  displayOrder: 0
});

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Partial<Testimonial>>(emptyTestimonial());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/testimonials");
      if (r.ok) setItems(await r.json());
    } catch {
      showToast("Failed to load testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing.clientName) return showToast("Client Name is required", "error");
    if (!editing.feedback) return showToast("Feedback is required", "error");
    setSaving(true);
    try {
      const isEdit = modal === "edit" && editing.id;
      const url = isEdit ? `/api/admin/testimonials?id=${editing.id}` : "/api/admin/testimonials";
      const r = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing)
      });
      if (!r.ok) {
        const e = await r.json();
        return showToast(e.error || "Failed to save", "error");
      }
      showToast(isEdit ? "Testimonial updated!" : "Testimonial added!");
      setModal(null);
      load();
    } catch {
      showToast("Failed to save testimonial", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const r = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      if (r.ok) {
        showToast("Testimonial deleted");
        load();
      } else {
        showToast("Failed to delete", "error");
      }
    } catch {
      showToast("Error deleting testimonial", "error");
    }
  };

  const openEdit = (item: Testimonial) => {
    setEditing({ ...item });
    setModal("edit");
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${
            toast.type === "success"
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
              : "bg-red-500/20 border border-red-500/30 text-red-300"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Testimonials</h1>
          <p className="text-sm text-white/40">{items.length} client feedback entries</p>
        </div>
        <button
          onClick={() => {
            setEditing(emptyTestimonial());
            setModal("add");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md"
        >
          <Plus size={16} />
          Add Testimonial
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-white/30">Loading testimonials...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-white/30 border border-white/[0.05] bg-white/[0.01] rounded-2xl">
          <MessageSquare size={32} className="mx-auto text-white/10 mb-3" />
          <p className="text-sm">No testimonials entries yet</p>
          <button
            onClick={() => {
              setEditing(emptyTestimonial());
              setModal("add");
            }}
            className="mt-3 px-3.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-semibold"
          >
            Create First Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/[0.06] flex items-center justify-center shrink-0 border border-white/[0.08]">
                      {item.photo ? (
                        <img src={item.photo} alt={item.clientName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold text-white/40">
                          {item.clientName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.clientName}</p>
                      <p className="text-[10px] text-white/40">
                        {item.role} at {item.company}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.published
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : "bg-white/[0.06] text-white/40 border border-white/[0.08]"
                    }`}
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                </div>
                {/* Rating stars */}
                <div className="flex gap-0.5 mb-2.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className={i < item.rating ? "text-amber-400 fill-amber-400" : "text-white/10"}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/60 line-clamp-4 italic mb-4">"{item.feedback}"</p>
              </div>
              <div className="flex justify-between items-center border-t border-white/[0.05] pt-3">
                <span className="text-[10px] text-white/20 font-mono">Display Order: {item.displayOrder}</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-blue-400 transition-all"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-red-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-white/[0.1] rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-bold text-white font-heading">
                {modal === "add" ? "Add Testimonial" : "Edit Testimonial"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editing.clientName}
                    onChange={(e) => setEditing((p) => ({ ...p, clientName: e.target.value }))}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    value={editing.company}
                    onChange={(e) => setEditing((p) => ({ ...p, company: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Client Role / Title
                  </label>
                  <input
                    type="text"
                    value={editing.role}
                    onChange={(e) => setEditing((p) => ({ ...p, role: e.target.value }))}
                    placeholder="e.g. CEO, Project Manager"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Photo Avatar URL
                  </label>
                  <input
                    type="text"
                    value={editing.photo}
                    onChange={(e) => setEditing((p) => ({ ...p, photo: e.target.value }))}
                    placeholder="e.g. /images/jane.jpg"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Rating Star (1 to 5)
                </label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setEditing((p) => ({ ...p, rating: num }))}
                      className="p-1 rounded-lg hover:bg-white/[0.06] transition-all"
                    >
                      <Star
                        size={20}
                        className={num <= (editing.rating || 5) ? "text-amber-400 fill-amber-400" : "text-white/10"}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-white/30 ml-2 font-mono">{editing.rating || 5} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Feedback Message
                </label>
                <textarea
                  rows={4}
                  value={editing.feedback}
                  onChange={(e) => setEditing((p) => ({ ...p, feedback: e.target.value }))}
                  placeholder="Paste client feedback details..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editing.displayOrder}
                    onChange={(e) => setEditing((p) => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
                <div className="flex items-center justify-between mt-5">
                  <span className="text-sm text-white/70">Publish Online</span>
                  <div
                    onClick={() => setEditing((prev) => ({ ...prev, published: !prev.published }))}
                    className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      editing.published ? "bg-blue-600" : "bg-white/[0.1]"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        editing.published ? "left-7" : "left-1"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.08]">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.04] text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-all"
              >
                <CheckCircle2 size={13} />
                {saving ? "Saving..." : "Save Testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
