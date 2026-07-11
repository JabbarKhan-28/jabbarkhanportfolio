"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, FolderKanban, Code2, Briefcase, User, Wrench,
  Trophy, Award, MessageSquare, Mail, Image, Search, Settings,
  Users, BarChart3, Palette, Database, LogOut, ChevronLeft,
  ChevronRight, Bell, Globe, Menu, X, Shield
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { href: "/admin/skills", icon: Code2, label: "Skills" },
  { href: "/admin/experience", icon: Briefcase, label: "Experience" },
  { href: "/admin/about", icon: User, label: "About" },
  { href: "/admin/services", icon: Wrench, label: "Services" },
  { href: "/admin/certifications", icon: Award, label: "Certifications" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { href: "/admin/hero", icon: Globe, label: "Hero Section" },
  { href: "/admin/navigation", icon: Menu, label: "Navigation" },
  { href: "/admin/messages", icon: Mail, label: "Messages" },
  { href: "/admin/media", icon: Image, label: "Media Library" },
  { href: "/admin/seo", icon: Search, label: "SEO" },
  { href: "/admin/appearance", icon: Palette, label: "Appearance" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/backup", icon: Database, label: "Backup" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth");
      if (!res.ok) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (!data.authenticated) {
        router.replace("/admin/login");
        return;
      }
      setUser(data.user);
    } catch {
      router.replace("/admin/login");
    } finally {
      setChecking(false);
    }
  }, [router]);

  // Check unread message count
  const fetchUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/messages?unread=true");
      if (res.ok) {
        const data = await res.json();
        setUnreadMessages(Array.isArray(data) ? data.length : 0);
      }
    } catch {}
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) fetchUnread();
  }, [user, fetchUnread, pathname]);

  // Auto-logout on inactivity (2 hours)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleLogout();
      }, 2 * 60 * 60 * 1000); // 2 hours
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.replace("/admin/login");
  };

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href) && item.href !== "/admin";
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Shield className="text-blue-400" size={32} />
          <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
          <Shield className="text-blue-400" size={16} />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-white leading-none">Portfolio</p>
            <p className="text-[10px] text-white/30 mt-0.5">Admin CMS</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group relative ${
                active
                  ? "bg-blue-500/15 text-blue-300 font-semibold"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={16} className={active ? "text-blue-400" : "text-current"} />
              {!collapsed && <span>{item.label}</span>}
              {item.href === "/admin/messages" && unreadMessages > 0 && !collapsed && (
                <span className="ml-auto text-[10px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadMessages}
                </span>
              )}
              {item.href === "/admin/messages" && unreadMessages > 0 && collapsed && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={`border-t border-white/[0.06] p-3 ${collapsed ? "items-center" : ""}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-white/30 truncate">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/25 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-2 text-white/25 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/10"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex text-white">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar – Desktop */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen z-30 bg-[#0d0d14] border-r border-white/[0.06] transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#1a1a2e] border border-white/[0.1] rounded-full flex items-center justify-center text-white/40 hover:text-white/80 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
        <SidebarContent />
      </aside>

      {/* Sidebar – Mobile */}
      <aside
        className={`flex lg:hidden flex-col fixed top-0 left-0 h-screen z-50 w-64 bg-[#0d0d14] border-r border-white/[0.06] transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-60"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-white/40 hover:text-white/80 transition-colors p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-white/30">
              <span>Admin</span>
              {pathname !== "/admin" && (
                <>
                  <ChevronRight size={14} />
                  <span className="text-white/60 capitalize">
                    {pathname.split("/").pop()?.replace(/-/g, " ")}
                  </span>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08]"
            >
              <Globe size={13} />
              View Site
            </a>
            <button className="relative text-white/30 hover:text-white/70 transition-colors p-1.5 rounded-lg hover:bg-white/[0.05]">
              <Bell size={16} />
              {unreadMessages > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-400 rounded-full" />
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
