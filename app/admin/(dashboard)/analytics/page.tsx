"use client";
import { useEffect, useState } from "react";
import { BarChart3, Mail, FolderKanban, Eye, TrendingUp, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalSkills: number;
  totalExperiences: number;
  totalCertifications: number;
  totalServices: number;
  totalTestimonials: number;
  unreadMessages: number;
  totalMessages: number;
  totalMediaFiles: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const INITIAL_STATS: DashboardStats = {
  totalProjects: 0, publishedProjects: 0, draftProjects: 0,
  totalSkills: 0, totalExperiences: 0, totalCertifications: 0,
  totalServices: 0, totalTestimonials: 0, unreadMessages: 0,
  totalMessages: 0, totalMediaFiles: 0
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [projects, skills, experiences, certifications, services, testimonials, messages, media] = await Promise.all([
          fetch("/api/admin/projects").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/skills").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/experiences").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/certifications").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/services").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/testimonials").then(r => r.ok ? r.json() : []),
          fetch("/api/messages").then(r => r.ok ? r.json() : []),
          fetch("/api/media").then(r => r.ok ? r.json() : []),
        ]);

        const unread = Array.isArray(messages) ? messages.filter((m: any) => !m.read).length : 0;
        const published = Array.isArray(projects) ? projects.filter((p: any) => p.published).length : 0;
        const draft = Array.isArray(projects) ? projects.filter((p: any) => !p.published).length : 0;

        setStats({
          totalProjects: Array.isArray(projects) ? projects.length : 0,
          publishedProjects: published,
          draftProjects: draft,
          totalSkills: Array.isArray(skills) ? skills.length : 0,
          totalExperiences: Array.isArray(experiences) ? experiences.length : 0,
          totalCertifications: Array.isArray(certifications) ? certifications.length : 0,
          totalServices: Array.isArray(services) ? services.length : 0,
          totalTestimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          unreadMessages: unread,
          totalMessages: Array.isArray(messages) ? messages.length : 0,
          totalMediaFiles: Array.isArray(media) ? media.length : 0,
        });

        if (Array.isArray(messages)) {
          // Sort messages and slice first 5
          const sorted = [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setRecentMessages(sorted.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const totalContentEntries = stats.totalProjects + stats.totalSkills + stats.totalExperiences + stats.totalCertifications + stats.totalServices + stats.totalTestimonials;

  // Percentage Calculations
  const projectPubRatio = stats.totalProjects > 0 ? Math.round((stats.publishedProjects / stats.totalProjects) * 100) : 0;
  const msgReadRatio = stats.totalMessages > 0 ? Math.round(((stats.totalMessages - stats.unreadMessages) / stats.totalMessages) * 100) : 0;

  if (loading) return <div className="text-center py-12 text-white/30">Loading analytics...</div>;

  return (
    <div className="space-y-6 max-w-5xl font-sans text-white">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Analytics & Content Insights</h1>
        <p className="text-sm text-white/40">Gain insights into database distributions, message rates, and content publishing ratios</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Content Base */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute right-4 top-4 text-white/5">
            <Sparkles size={72} />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded-full">
            Database Size
          </span>
          <p className="text-3xl font-extrabold mt-3">{totalContentEntries}</p>
          <p className="text-xs text-white/40 mt-1 font-medium">Total registered content nodes</p>
        </div>

        {/* Project Publication */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute right-4 top-4 text-white/5">
            <FolderKanban size={72} />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full">
            Project Live Ratio
          </span>
          <p className="text-3xl font-extrabold mt-3">{projectPubRatio}%</p>
          <p className="text-xs text-white/40 mt-1 font-medium">
            {stats.publishedProjects} of {stats.totalProjects} projects published
          </p>
        </div>

        {/* Message Read rate */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute right-4 top-4 text-white/5">
            <Mail size={72} />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-violet-400 uppercase bg-violet-500/10 px-2 py-0.5 rounded-full">
            Message Triage Rate
          </span>
          <p className="text-3xl font-extrabold mt-3">{msgReadRatio}%</p>
          <p className="text-xs text-white/40 mt-1 font-medium">
            {stats.totalMessages - stats.unreadMessages} of {stats.totalMessages} messages read
          </p>
        </div>
      </div>

      {/* Main Analysis grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Node Distribution chart */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold">Content Node Distribution</h2>
          </div>
          <div className="space-y-3.5">
            {[
              { label: "Projects", count: stats.totalProjects, color: "bg-blue-500" },
              { label: "Skills", count: stats.totalSkills, color: "bg-violet-500" },
              { label: "Experiences", count: stats.totalExperiences, color: "bg-cyan-500" },
              { label: "Certifications", count: stats.totalCertifications, color: "bg-orange-500" },
              { label: "Services", count: stats.totalServices, color: "bg-teal-500" },
              { label: "Testimonials", count: stats.totalTestimonials, color: "bg-pink-500" },
            ].map((node) => {
              const percentage = totalContentEntries > 0 ? Math.round((node.count / totalContentEntries) * 100) : 0;
              return (
                <div key={node.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white/60">{node.label}</span>
                    <span className="text-white/45">
                      {node.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className={`h-full ${node.color} rounded-full`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick info metrics list */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold">Activity Health</h2>
          </div>
          <div className="divide-y divide-white/[0.04] space-y-4">
            <div className="pt-0">
              <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Unread Mail Queue</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold">{stats.unreadMessages} messages</span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    stats.unreadMessages > 0 ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {stats.unreadMessages > 0 ? "Action Required" : "Clean"}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Media Library Allocation</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold">{stats.totalMediaFiles} files</span>
                <Link
                  href="/admin/media"
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  Manage Media <Eye size={10} />
                </Link>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Project Drafting Ratio</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold">{stats.draftProjects} draft projects</span>
                <span className="text-xs text-white/45">
                  {stats.publishedProjects} active, {stats.draftProjects} in draft
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Triage */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3.5 mb-2">
          <Mail size={16} className="text-blue-400" />
          <h2 className="text-sm font-semibold">Recent Messages Triage Logs</h2>
        </div>
        <div className="space-y-2">
          {recentMessages.length === 0 ? (
            <div className="text-center py-6 text-white/20 text-xs flex flex-col items-center justify-center gap-1 bg-white/[0.01] border border-white/[0.03] rounded-xl">
              <AlertCircle size={20} className="text-white/10" />
              <span>No incoming messages registered yet</span>
            </div>
          ) : (
            recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start justify-between p-3 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-white">{msg.name}</p>
                    <p className="text-[10px] text-white/30 truncate">({msg.email})</p>
                    {!msg.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-white/70 mt-1 truncate">
                    <span className="font-semibold text-white/90">Subject: </span>
                    {msg.subject || "No Subject"}
                  </p>
                  <p className="text-[10px] text-white/40 mt-1">
                    Received: {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                <Link
                  href="/admin/messages"
                  className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-[9px] font-semibold text-white/80 shrink-0 transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
