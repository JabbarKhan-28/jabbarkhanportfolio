"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban, Code2, Briefcase, Award, Mail, Globe,
  TrendingUp, Eye, CheckCircle2, Clock, Plus, ArrowRight,
  BarChart3, Palette, Settings, Database, AlertCircle
} from "lucide-react";

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
  totalUsers: number;
}

const INITIAL_STATS: DashboardStats = {
  totalProjects: 0, publishedProjects: 0, draftProjects: 0,
  totalSkills: 0, totalExperiences: 0, totalCertifications: 0,
  totalServices: 0, totalTestimonials: 0, unreadMessages: 0,
  totalMessages: 0, totalMediaFiles: 0, totalUsers: 0
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [dbOnline, setDbOnline] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projects, skills, experiences, certifications, services, testimonials, messages, media, users] = await Promise.all([
          fetch("/api/admin/projects").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/skills").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/experiences").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/certifications").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/services").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/testimonials").then(r => r.ok ? r.json() : []),
          fetch("/api/messages").then(r => r.ok ? r.json() : []),
          fetch("/api/media").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/users").then(r => r.ok ? r.json() : []),
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
          totalUsers: Array.isArray(users) ? users.length : 0,
        });
        setDbOnline(true);
      } catch (err) {
        setDbOnline(false);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Projects", value: stats.totalProjects, icon: FolderKanban, color: "text-blue-400", bg: "bg-blue-500/10", href: "/admin/projects" },
    { label: "Published", value: stats.publishedProjects, icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/10", href: "/admin/projects" },
    { label: "Drafts", value: stats.draftProjects, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", href: "/admin/projects" },
    { label: "Skills", value: stats.totalSkills, icon: Code2, color: "text-violet-400", bg: "bg-violet-500/10", href: "/admin/skills" },
    { label: "Experiences", value: stats.totalExperiences, icon: Briefcase, color: "text-cyan-400", bg: "bg-cyan-500/10", href: "/admin/experience" },
    { label: "Certifications", value: stats.totalCertifications, icon: Award, color: "text-orange-400", bg: "bg-orange-500/10", href: "/admin/certifications" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: Mail, color: "text-red-400", bg: "bg-red-500/10", href: "/admin/messages" },
    { label: "Media Files", value: stats.totalMediaFiles, icon: Eye, color: "text-pink-400", bg: "bg-pink-500/10", href: "/admin/media" },
  ];

  const quickActions = [
    { label: "Add Project", icon: Plus, href: "/admin/projects", color: "text-blue-400" },
    { label: "View Messages", icon: Mail, href: "/admin/messages", color: "text-red-400", badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined },
    { label: "Edit Appearance", icon: Palette, href: "/admin/appearance", color: "text-violet-400" },
    { label: "Manage SEO", icon: TrendingUp, href: "/admin/seo", color: "text-emerald-400" },
    { label: "Media Library", icon: Eye, href: "/admin/media", color: "text-cyan-400" },
    { label: "Site Settings", icon: Settings, href: "/admin/settings", color: "text-amber-400" },
    { label: "Backup Data", icon: Database, href: "/admin/backup", color: "text-orange-400" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics", color: "text-pink-400" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/40 mt-0.5">Overview of your portfolio content</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 hover:text-white hover:bg-white/[0.07] transition-all"
        >
          <Globe size={14} />
          View Live Site
          <ArrowRight size={13} />
        </a>
      </div>

      {/* DB Status Banner */}
      {!dbOnline && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          <AlertCircle size={16} />
          <span>Database not seeded yet. Run the seed script to populate default data. Showing placeholder stats.</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon size={17} className={card.color} />
                </div>
                <ArrowRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>
                {loading ? "—" : card.value}
              </p>
              <p className="text-xs text-white/40 mt-0.5 font-medium">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={15} className={action.color} />
                    <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors">{action.label}</span>
                  </div>
                  {action.badge ? (
                    <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                      {action.badge}
                    </span>
                  ) : (
                    <ArrowRight size={13} className="text-white/15 group-hover:text-white/40 transition-colors" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Summary + Checklist */}
        <div className="lg:col-span-2 space-y-4">
          {/* Content summary */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Content Summary</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Services", value: stats.totalServices, icon: "🛠" },
                { label: "Testimonials", value: stats.totalTestimonials, icon: "💬" },
                { label: "Total Messages", value: stats.totalMessages, icon: "📩" },
                { label: "Team Members", value: stats.totalUsers, icon: "👤" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-lg font-bold text-white">{loading ? "—" : item.value}</p>
                    <p className="text-[11px] text-white/35">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Setup checklist */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Setup Checklist</h2>
            <div className="space-y-2">
              {[
                { label: "Projects added", done: stats.totalProjects > 0, href: "/admin/projects" },
                { label: "Skills configured", done: stats.totalSkills > 0, href: "/admin/skills" },
                { label: "Experience added", done: stats.totalExperiences > 0, href: "/admin/experience" },
                { label: "Contact info updated", done: true, href: "/admin/contact" },
                { label: "SEO settings configured", done: true, href: "/admin/seo" },
                { label: "Appearance customized", done: true, href: "/admin/appearance" },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors group"
                >
                  <CheckCircle2 size={15} className={item.done ? "text-emerald-400" : "text-white/15"} />
                  <span className={`text-sm ${item.done ? "text-white/50 line-through" : "text-white/70"} group-hover:text-white/90 transition-colors`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
