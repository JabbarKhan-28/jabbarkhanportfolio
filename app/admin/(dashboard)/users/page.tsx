"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Users, Shield, ShieldCheck, ShieldAlert, Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

const emptyUser = (): Partial<AdminUser> & { password?: string } => ({
  name: "",
  email: "",
  role: "Editor",
  password: ""
});

export default function UsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Partial<AdminUser> & { password?: string }>(emptyUser());
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/users");
      if (r.status === 403) {
        setForbidden(true);
        return;
      }
      if (r.ok) {
        setItems(await r.json());
      }
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing.name) return showToast("Name is required", "error");
    if (!editing.email) return showToast("Email is required", "error");
    if (modal === "add" && !editing.password) return showToast("Password is required for new users", "error");

    setSaving(true);
    try {
      const isEdit = modal === "edit" && editing.id;
      const url = isEdit ? `/api/admin/users?id=${editing.id}` : "/api/admin/users";
      const r = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing)
      });
      if (!r.ok) {
        const e = await r.json();
        return showToast(e.error || "Failed to save user", "error");
      }
      showToast(isEdit ? "User updated successfully!" : "User created successfully!");
      setModal(null);
      load();
    } catch {
      showToast("Failed to save user", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user account?")) return;
    try {
      const r = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (r.ok) {
        showToast("User deleted successfully!");
        load();
      } else {
        const e = await r.json();
        showToast(e.error || "Failed to delete user", "error");
      }
    } catch {
      showToast("Error deleting user", "error");
    }
  };

  const openEdit = (item: AdminUser) => {
    setEditing({ ...item, password: "" });
    setModal("edit");
  };

  if (forbidden) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldAlert size={44} className="text-red-500/40 mb-4 animate-pulse" />
        <h1 className="text-xl font-bold text-white mb-2">Access Forbidden</h1>
        <p className="text-sm text-white/40 max-w-md">
          Only Super Administrators have access to manage system accounts and credentials.
        </p>
      </div>
    );
  }

  if (loading) return <div className="text-center py-12 text-white/30">Loading accounts...</div>;

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
          <h1 className="text-xl font-bold text-white">User Accounts</h1>
          <p className="text-sm text-white/40">{items.length} administrators registered</p>
        </div>
        <button
          onClick={() => {
            setEditing(emptyUser());
            setModal("add");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md"
        >
          <Plus size={16} />
          Create User
        </button>
      </div>

      {/* List */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Users size={16} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-white">System Administrators</h2>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/[0.06]">
                  {item.role === "Super Admin" ? (
                    <ShieldCheck size={20} className="text-blue-400" />
                  ) : item.role === "Editor" ? (
                    <Shield size={20} className="text-violet-400" />
                  ) : (
                    <Shield size={20} className="text-white/30" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{item.email}</p>
                  <p className="text-[9px] text-white/20 mt-1 font-mono">
                    Registered: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-blue-400 transition-all"
                  title="Edit Account"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.07] text-white/30 hover:text-red-400 transition-all"
                  title="Delete Account"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-white/[0.1] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-bold text-white font-heading">
                {modal === "add" ? "Create Account" : "Edit Account"}
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
                  Display Name
                </label>
                <input
                  type="text"
                  value={editing.name || ""}
                  onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Jabbar Khan"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editing.email || ""}
                  onChange={(e) => setEditing((p) => ({ ...p, email: e.target.value }))}
                  placeholder="e.g. admin@jabbarkhan.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Account Role
                </label>
                <select
                  value={editing.role || "Editor"}
                  onChange={(e) => setEditing((p) => ({ ...p, role: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                >
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Editor">Editor (Add/Edit Content)</option>
                  <option value="Viewer">Viewer (Read-Only access)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Password {modal === "edit" && "(Leave blank to keep current)"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={editing.password || ""}
                    onChange={(e) => setEditing((p) => ({ ...p, password: e.target.value }))}
                    placeholder={modal === "edit" ? "••••••••" : "Create password"}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
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
                {saving ? "Saving..." : "Save Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
