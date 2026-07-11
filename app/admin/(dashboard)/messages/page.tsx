"use client";
import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Search, X, RefreshCw, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/messages");
      if (r.ok) setMessages(await r.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = messages.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    if (filter === "unread") return matchSearch && !m.read;
    if (filter === "read") return matchSearch && m.read;
    return matchSearch;
  });

  const toggleRead = async (m: Message) => {
    const r = await fetch(`/api/messages?id=${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read })
    });
    if (r.ok) { showToast(!m.read ? "Marked as read" : "Marked as unread"); load(); }
    else showToast("Failed to update", "error");
  };

  const openMessage = (id: string, m: Message) => {
    setExpanded(expanded === id ? null : id);
    if (!m.read) toggleRead(m);
  };

  const handleDelete = async (id: string) => {
    // Use the messages API - no DELETE in the current implementation, show a toast
    showToast("Delete via database admin for now", "error");
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-5 max-w-4xl">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${toast.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border border-red-500/30 text-red-300"}`}>
          {toast.msg}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Messages</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {messages.length} total
            {unreadCount > 0 && <span className="ml-2 text-blue-400 font-semibold">{unreadCount} unread</span>}
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white text-sm transition-all w-fit">
          <RefreshCw size={14} />Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all" />
        </div>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white/70"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-12 text-white/30">Loading messages...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-white/30">No messages found</div>
        ) : filtered.map(m => (
          <div key={m.id} className={`bg-white/[0.03] border rounded-xl overflow-hidden transition-all ${!m.read ? "border-blue-500/20" : "border-white/[0.06]"}`}>
            <button onClick={() => openMessage(m.id, m)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left">
              <div className={`shrink-0 ${m.read ? "text-white/20" : "text-blue-400"}`}>
                {m.read ? <MailOpen size={18} /> : <Mail size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-semibold ${m.read ? "text-white/60" : "text-white"}`}>{m.name}</p>
                  <span className="text-xs text-white/30">{m.email}</span>
                  {!m.read && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/20">NEW</span>}
                </div>
                <p className="text-xs text-white/40 truncate mt-0.5">{m.subject || "(No subject)"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-white/25">{new Date(m.createdAt).toLocaleDateString()}</span>
                <ChevronDown size={14} className={`text-white/25 transition-transform ${expanded === m.id ? "rotate-180" : ""}`} />
              </div>
            </button>
            {expanded === m.id && (
              <div className="px-5 pb-4 border-t border-white/[0.06]">
                <p className="text-sm text-white/70 mt-4 leading-relaxed whitespace-pre-wrap">{m.message}</p>
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={() => toggleRead(m)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white/80 text-xs transition-all border border-white/[0.06]">
                    {m.read ? <><Mail size={13} />Mark unread</> : <><MailOpen size={13} />Mark read</>}
                  </button>
                  <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs transition-all border border-blue-500/20">
                    <Mail size={13} />Reply via Email
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
