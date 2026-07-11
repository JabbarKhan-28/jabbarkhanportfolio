"use client";
import { useEffect, useState, useRef } from "react";
import { Upload, Search, Trash2, Image, Copy, CheckCircle2, X, RefreshCw } from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const load = async () => { setLoading(true); try { const r = await fetch("/api/media"); if (r.ok) setMedia(await r.json()); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const filtered = media.filter(m => m.filename.toLowerCase().includes(search.toLowerCase()));

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append("files", f));
      const r = await fetch("/api/media/upload", { method: "POST", body: fd });
      if (!r.ok) { const e = await r.json(); return showToast(e.error, "error"); }
      showToast(`${files.length} file(s) uploaded!`);
      load();
    } finally { setUploading(false); }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    const r = await fetch(`/api/media?id=${item.id}`, { method: "DELETE" });
    if (r.ok) { showToast("Deleted"); load(); if (preview?.id === item.id) setPreview(null); }
    else showToast("Failed to delete", "error");
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${toast.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border border-red-500/30 text-red-300"}`}>
          {toast.msg}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-white">Media Library</h1><p className="text-sm text-white/40">{media.length} files</p></div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white text-sm transition-all">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => inputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
            <Upload size={16} />{uploading ? "Uploading..." : "Upload Files"}
          </button>
          <input ref={inputRef} type="file" className="hidden" multiple accept="image/*,.svg" onChange={e => handleUpload(e.target.files)} />
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver ? "border-blue-500/60 bg-blue-500/5" : "border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]"}`}
      >
        <Upload size={24} className="text-white/20 mx-auto mb-2" />
        <p className="text-sm text-white/40">Drag & drop files here, or <span className="text-blue-400">browse</span></p>
        <p className="text-xs text-white/20 mt-1">PNG, JPEG, WEBP, SVG supported</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/40 transition-all" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-white/30">Loading media...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Image size={32} className="text-white/10 mx-auto mb-2" />
          <p className="text-white/30">No media files yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(item => (
            <div key={item.id} className="group relative bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.12] transition-all">
              <div className="aspect-square bg-white/[0.03] flex items-center justify-center overflow-hidden">
                {item.mimeType === "image/svg+xml" ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img src={item.url} alt={item.filename} className="max-w-full max-h-full" />
                  </div>
                ) : (
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
              </div>
              <div className="px-2.5 py-2">
                <p className="text-xs font-medium text-white/70 truncate">{item.filename}</p>
                <p className="text-[10px] text-white/25 mt-0.5">{formatBytes(item.size)}</p>
              </div>
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(item.url)} title="Copy URL" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                  {copied === item.url ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
                <button onClick={() => setPreview(item)} title="Preview" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                  <Image size={16} />
                </button>
                <button onClick={() => handleDelete(item)} title="Delete" className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreview(null)}>
          <div className="bg-[#0f0f1a] border border-white/[0.1] rounded-2xl max-w-2xl w-full p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">{preview.filename}</h3>
              <button onClick={() => setPreview(null)} className="text-white/40 hover:text-white/80"><X size={20} /></button>
            </div>
            <div className="bg-black/20 rounded-xl overflow-hidden flex items-center justify-center min-h-48">
              <img src={preview.url} alt={preview.filename} className="max-w-full max-h-96 object-contain" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/40">
              <div><p className="text-white/20 uppercase tracking-wider text-[10px]">URL</p><p className="text-white/60 truncate">{preview.url}</p></div>
              <div><p className="text-white/20 uppercase tracking-wider text-[10px]">Size</p><p className="text-white/60">{formatBytes(preview.size)}</p></div>
              <div><p className="text-white/20 uppercase tracking-wider text-[10px]">Type</p><p className="text-white/60">{preview.mimeType}</p></div>
              <div><p className="text-white/20 uppercase tracking-wider text-[10px]">Uploaded</p><p className="text-white/60">{new Date(preview.createdAt).toLocaleDateString()}</p></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => copyUrl(preview.url)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-white/60 hover:text-white text-sm border border-white/[0.08] transition-all">
                {copied === preview.url ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied === preview.url ? "Copied!" : "Copy URL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
