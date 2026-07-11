"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Wrench, CheckCircle2 } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  published: boolean;
}

const emptyService = (): Partial<Service> => ({
  title: "",
  description: "",
  icon: "Wrench",
  displayOrder: 0,
  published: true
});

const POPULAR_ICONS = ["Wrench", "Code2", "Smartphone", "Database", "Globe", "Layout", "Palette", "Server", "TrendingUp", "Cpu", "ShieldCheck", "Settings"];

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Partial<Service>>(emptyService());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/services");
      if (r.ok) setItems(await r.json());
    } catch {
      showToast("Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing.title) return showToast("Title is required", "error");
    setSaving(true);
    try {
      const isEdit = modal === "edit" && editing.id;
      const url = isEdit ? `/api/admin/services?id=${editing.id}` : "/api/admin/services";
      const r = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing)
      });
      if (!r.ok) {
        const e = await r.json();
        return showToast(e.error || "Failed to save", "error");
      }
      showToast(isEdit ? "Service updated successfully!" : "Service added successfully!");
      setModal(null);
      load();
    } catch {
      showToast("Failed to save service", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const r = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (r.ok) {
        showToast("Service deleted");
        load();
      } else {
        showToast("Failed to delete", "error");
      }
    } catch {
      showToast("Error deleting service", "error");
    }
  };

  const openEdit = (item: Service) => {
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
          <h1 className="text-xl font-bold text-white">Services</h1>
          <p className="text-sm text-white/40">{items.length} services configured</p>
        </div>
        <button
          onClick={() => {
            setEditing(emptyService());
            setModal("add");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-white/30">Loading services...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-white/30 border border-white/[0.05] bg-white/[0.01] rounded-2xl">
          <Wrench size={32} className="mx-auto text-white/10 mb-3" />
          <p className="text-sm">No services entries yet</p>
          <button
            onClick={() => {
              setEditing(emptyService());
              setModal("add");
            }}
            className="mt-3 px-3.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-semibold"
          >
            Create First Service
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
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                      <Wrench size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-[10px] text-white/35 font-mono">Icon: {item.icon} | Order: {item.displayOrder}</p>
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
                <p className="text-xs text-white/60 line-clamp-3 mb-4">{item.description}</p>
              </div>
              <div className="flex justify-end gap-1.5 border-t border-white/[0.05] pt-3">
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
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-white/[0.1] rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-bold text-white">
                {modal === "add" ? "Add Service" : "Edit Service"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Service Title
                </label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Mobile Application Development"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Icon Name (Lucide)
                  </label>
                  <select
                    value={POPULAR_ICONS.includes(editing.icon || "") ? editing.icon : "Custom"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val !== "Custom") setEditing((p) => ({ ...p, icon: val }));
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                  >
                    {POPULAR_ICONS.map((ico) => (
                      <option key={ico} value={ico}>
                        {ico}
                      </option>
                    ))}
                    <option value="Custom">Custom Text Input...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Custom Icon Value
                  </label>
                  <input
                    type="text"
                    value={editing.icon}
                    onChange={(e) => setEditing((p) => ({ ...p, icon: e.target.value }))}
                    placeholder="e.g. Code2"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editing.description}
                  onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe your service offerings in detail..."
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
                {saving ? "Saving..." : "Save Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
