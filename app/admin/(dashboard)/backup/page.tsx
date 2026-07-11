"use client";
import { useEffect, useState } from "react";
import { Database, Download, Upload, ShieldAlert, AlertTriangle, CheckCircle2, FileJson, X } from "lucide-react";

export default function BackupPage() {
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<any>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    // Perform a test GET request to check auth permissions
    fetch("/api/auth")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.user && data.user.role !== "Super Admin") {
          setForbidden(true);
        }
      })
      .catch(() => showToast("Failed to verify credentials", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/backup");
      if (!res.ok) {
        const err = await res.json();
        return showToast(err.error || "Failed to download backup", "error");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("Backup exported successfully!");
    } catch {
      showToast("Failed to generate backup", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      return showToast("Please select a valid JSON backup file", "error");
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.tables) {
          showToast("Invalid backup file: missing 'tables' attribute", "error");
          setSelectedFile(null);
          return;
        }
        setFileContent(json);
      } catch {
        showToast("Malformed JSON backup file", "error");
        setSelectedFile(null);
      }
    };
    reader.readAsText(file);
  };

  const triggerImport = () => {
    if (!fileContent) return;
    setConfirmModal(true);
  };

  const handleImport = async () => {
    setConfirmModal(false);
    setImporting(true);
    try {
      const r = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileContent)
      });
      if (!r.ok) {
        const e = await r.json();
        return showToast(e.error || "Failed to restore database", "error");
      }
      showToast("Database restored successfully! Reloading site...");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch {
      showToast("Critical error during backup restoration", "error");
    } finally {
      setImporting(false);
      setSelectedFile(null);
      setFileContent(null);
    }
  };

  if (forbidden) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldAlert size={44} className="text-red-500/40 mb-4 animate-pulse" />
        <h1 className="text-xl font-bold text-white mb-2">Access Restricted</h1>
        <p className="text-sm text-white/40 max-w-md">
          Only Super Administrators can view, download, or restore database backup files.
        </p>
      </div>
    );
  }

  if (loading) return <div className="text-center py-12 text-white/30">Verifying backup credentials...</div>;

  return (
    <div className="space-y-6 max-w-3xl font-sans text-white">
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
      <div>
        <h1 className="text-xl font-bold">Database Backup & Recovery</h1>
        <p className="text-sm text-white/40">Secure your portfolio data or recover configurations from JSON dumps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Export Card */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Download size={18} />
              <h2 className="text-sm font-semibold text-white">Export Data</h2>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Downloads a compressed JSON representation of your portfolio. This includes projects, settings, social configurations, messages, and user logs.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-md shrink-0"
          >
            <Database size={15} />
            {exporting ? "Generating Backup..." : "Download Backup File"}
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-violet-400">
              <Upload size={18} />
              <h2 className="text-sm font-semibold text-white">Restore / Import Data</h2>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Upload a previously exported JSON backup file to restore database state. Note that this action is irreversible.
            </p>
          </div>

          <div className="space-y-3 shrink-0">
            {/* File Input wrapper */}
            {!selectedFile ? (
              <label className="flex flex-col items-center justify-center py-4 px-3 rounded-xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all cursor-pointer">
                <FileJson size={24} className="text-white/20 mb-1" />
                <span className="text-xs text-white/50 font-medium">Select JSON Backup</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/10 bg-white/[0.04]">
                <div className="min-w-0 pr-3">
                  <p className="text-xs text-white font-semibold truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-white/30">Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setFileContent(null);
                  }}
                  className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            <button
              onClick={triggerImport}
              disabled={!fileContent || importing}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:hover:bg-violet-600 text-white text-sm font-semibold transition-all shadow-md"
            >
              <Upload size={15} />
              {importing ? "Restoring Database..." : "Restore From File"}
            </button>
          </div>
        </div>
      </div>

      {/* Safety Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border border-red-500/20 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={32} className="shrink-0 animate-bounce" />
              <div>
                <h3 className="text-base font-bold text-white">Irreversible Operation!</h3>
                <p className="text-[11px] text-red-400/80">Destructive Actions Warning</p>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              You are about to restore the database from a backup file. This will <strong className="text-white font-bold">erase all current records</strong> (projects, user accounts, logs, messages, and social tags) and replace them with the backup content.
            </p>

            <p className="text-xs text-white/60 leading-relaxed">
              If the database restore includes a different users file, your current admin session will be invalidated and you will be logged out.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.04] text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all"
              >
                Confirm Overwrite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
