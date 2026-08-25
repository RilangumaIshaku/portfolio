"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Lock,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Globe,
  Type,
  User,
  ImageIcon,
  Link,
  Briefcase,
  MessageSquare,
  DollarSign,
  HelpCircle,
  Layers,
  Sparkles,
  FolderOpen,
  Menu,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────
import type { SiteContent, AvailabilityData } from "@/components/admin/types";

// ── Section components ──────────────────────────────────────
import { HeroSection } from "@/components/admin/hero-section";
import { ServicesSection } from "@/components/admin/services-section";
import { ProjectsSection } from "@/components/admin/projects-section";
import { ProcessSection } from "@/components/admin/process-section";
import { TestimonialsSection } from "@/components/admin/testimonials-section";
import { PricingSection } from "@/components/admin/pricing-section";
import { FaqSection } from "@/components/admin/faq-section";
import { SiteSection } from "@/components/admin/site-section";
import { ImagesSection } from "@/components/admin/images-section";
import { LinksSection } from "@/components/admin/links-section";
import { AvailabilitySection } from "@/components/admin/availability-section";
import { JobsSection } from "@/components/admin/jobs-section";

type Section =
  | "hero"
  | "services"
  | "projects"
  | "process"
  | "testimonials"
  | "pricing"
  | "faq"
  | "site"
  | "images"
  | "links"
  | "availability"
  | "jobs";

interface NavItem {
  id: Section;
  label: string;
  icon: typeof Globe;
  group: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Hero", icon: Type, group: "Content" },
  { id: "services", label: "Services", icon: Briefcase, group: "Content" },
  { id: "projects", label: "Projects", icon: FolderOpen, group: "Content" },
  { id: "process", label: "Process", icon: Layers, group: "Content" },
  {
    id: "testimonials",
    label: "Testimonials",
    icon: MessageSquare,
    group: "Content",
  },
  { id: "pricing", label: "Pricing", icon: DollarSign, group: "Content" },
  { id: "faq", label: "FAQ", icon: HelpCircle, group: "Content" },
  { id: "site", label: "Site Info", icon: Globe, group: "Settings" },
  { id: "images", label: "Images", icon: ImageIcon, group: "Settings" },
  { id: "links", label: "Links & SEO", icon: Link, group: "Settings" },
  { id: "availability", label: "Availability", icon: User, group: "Settings" },
  { id: "jobs", label: "Job Scraper", icon: Briefcase, group: "Tools" },
];

const defaultContent: SiteContent = {
  site: {
    name: "Rilan",
    brand: "Rilan",
    tagline: "Freelance Web Developer",
    description:
      "I design and develop fast, modern, responsive websites for businesses and startups.",
    email: "davidishaku560@gmail.com",
    whatsapp: "+2347051565727",
    socials: {
      github: "https://github.com/RilangumaIshaku",
      linkedin: "https://linkedin.com/in/Rilanguma",
      twitter: "https://twitter.com/rilanguma",
    },
  },
  seo: {
    title: "Rilan — Freelance Web Developer",
    description:
      "Freelance web developer crafting modern, responsive websites.",
    ogImage: "/images/og-image.png",
  },
  hero: {
    headline:
      "Hey, I'm Rilan. I design premium & high-converting experiences.",
    subtitle:
      "Designing and developing fast, modern, responsive websites for businesses and startups that want to stand out and convert.",
    ctaPrimary: "Start a Project",
    ctaSecondary: "View My Work",
    ctaPrimaryTarget: "#contact",
    ctaSecondaryTarget: "#work",
  },
  images: { profile: "", projects: {} },
  links: {
    whatsappMessage:
      "Hi! I'm interested in working with you on a project.",
    ctaTarget: "#contact",
  },
};

// ── Component ───────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [availability, setAvailability] =
    useState<AvailabilityData | null>(null);
  const [saveMsg, setSaveMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [storageInfo, setStorageInfo] = useState<string | null>(null);

  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [processSteps, setProcessSteps] = useState<any[]>([]);
  const [advantages, setAdvantages] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    // Single bulk request instead of 10 separate API calls
    fetch("/api/admin/bulk", {
      headers: { "x-admin-token": token },
    })
      .then((r) => {
        if (r.status === 401) throw new Error("Unauthorized");
        return r.json();
      })
      .then((json) => {
        if (!json.success) throw new Error("Failed to load");
        const d = json.data;
        if (d.content) setContent(d.content);
        // Fetch storage info in background (non-blocking)
        fetch("/api/debug", { headers: { "x-admin-token": token } })
          .then((r) => r.ok ? r.json() : null)
          .then((debug) => {
            if (debug?.storage) setStorageInfo(debug.storage.message);
          })
          .catch(() => {});
        if (d.availability) setAvailability(d.availability);
        if (d.services) setServices(d.services);
        if (d.projects) setProjects(d.projects);
        if (d.testimonials) setTestimonials(d.testimonials);
        if (d.pricing) setPricing(d.pricing);
        if (d.faq) setFaqs(d.faq);
        if (d.process) setProcessSteps(d.process);
        if (d.advantages) setAdvantages(d.advantages);
        if (d.jobs) setJobs(d.jobs);
      })
      .catch(() => {
        sessionStorage.removeItem("admin_token");
        setToken(null);
      })
      .finally(() => {
        setInitialLoad(false);
        setLoading(false);
      });
  }, [token]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLoginError(json.error || "Wrong password");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("admin_token", json.token);
      setToken(json.token);
    } catch {
      setLoginError("Connection failed");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
    setPassword("");
    setContent(null);
    setAvailability(null);
  };

  const flash = (type: "success" | "error", text: string) => {
    setSaveMsg({ type, text });
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const forceLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  };

  const saveSection = async (
    section: string,
    data: Record<string, unknown>
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token!,
        },
        body: JSON.stringify({ action: "update-content", section, data }),
      });
      if (res.status === 401) {
        forceLogout();
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (!res.ok) flash("error", json.error || "Failed to save");
      else {
        if (json.data) setContent(json.data);
        flash("success", "Saved");
      }
    } catch {
      flash("error", "Connection failed");
    }
    setLoading(false);
  };

  const saveAvailability = async () => {
    if (!availability) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token!,
        },
        body: JSON.stringify({ action: "update", ...availability }),
      });
      if (res.status === 401) {
        forceLogout();
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (!res.ok) flash("error", json.error || "Failed to save");
      else {
        if (json.data) setAvailability(json.data);
        flash("success", "Saved");
      }
    } catch {
      flash("error", "Connection failed");
    }
    setLoading(false);
  };

  const saveSectionData = async (section: string, data: unknown[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token!,
        },
        body: JSON.stringify({ action: "update-section", section, data }),
      });
      if (res.status === 401) {
        forceLogout();
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (!res.ok) flash("error", json.error || "Failed to save");
      else flash("success", "Saved");
    } catch {
      flash("error", "Connection failed");
    }
    setLoading(false);
  };

  // ── LOGIN ──
  if (!token) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center px-5 relative overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(155, 143, 188, 0.12) 0%, rgba(113, 135, 196, 0.06) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(196, 166, 107, 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="w-full max-w-[340px] relative z-10 animate-[fadeIn_0.6s_ease]">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                style={{
                  background:
                    "radial-gradient(circle, rgba(155, 143, 188, 0.3) 0%, transparent 70%)",
                }}
              />
              <div className="relative w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm">
                <Lock size={18} className="text-white/35" />
              </div>
            </div>
          </div>

          <div className="text-center mb-9">
            <h1 className="text-[22px] font-semibold text-white/90 tracking-tight">
              Welcome back
            </h1>
            <p className="text-[13px] text-white/25 mt-2.5">
              Enter your password to access the dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full h-12 px-5 pr-12 rounded-xl bg-white/[0.03] border border-white/[0.07] text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-white/[0.18] focus:bg-white/[0.05] transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors duration-200 p-1"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {loginError && (
              <div className="flex items-center gap-2.5 text-[13px] text-red-400/70 bg-red-400/[0.06] border border-red-400/[0.08] rounded-xl px-4 py-3 animate-[fadeIn_0.2s_ease]">
                <AlertCircle size={13} className="shrink-0" />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/[0.92] active:scale-[0.98] disabled:opacity-30 disabled:cursor-wait transition-all duration-200 mt-1"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                  Checking...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-white/12 mt-8">
            Dashboard access is restricted
          </p>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ── DASHBOARD ──
  const grouped = NAV_ITEMS.reduce(
    (acc, item) => {
      (acc[item.group] = acc[item.group] || []).push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>
  );

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#111111] border-r border-white/[0.06] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-14 px-5 flex items-center gap-2.5 border-b border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center">
            <Globe size={14} className="text-white/50" />
          </div>
          <span className="text-sm font-semibold text-white/70 tracking-tight">
            Dashboard
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/20 px-2 mb-2">
                {group}
              </p>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 h-9 px-3 rounded-xl text-[13px] font-medium transition-all duration-150 mb-0.5 ${
                    activeSection === item.id
                      ? "bg-white/[0.08] text-white/80"
                      : "text-white/30 hover:text-white/50 hover:bg-white/[0.03]"
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-xs text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-all"
            >
              <Eye size={13} /> Preview
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 h-9 w-9 rounded-xl text-white/30 hover:text-red-400/70 hover:bg-white/[0.04] transition-all"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-60 min-h-screen">
        <header className="sticky top-0 z-20 h-14 bg-[#0c0c0c]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/40 hover:text-white/60"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-medium text-white/50">
              {NAV_ITEMS.find((n) => n.id === activeSection)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {storageInfo && (
              <span className="text-[10px] text-white/20 hidden sm:inline max-w-[200px] truncate" title={storageInfo}>
                {storageInfo.startsWith("⚠️") ? (
                  <span className="text-amber-400/60">⚠️ No persistent storage</span>
                ) : (
                  <span className="text-emerald-400/50">✓ {storageInfo.split("→")[0].trim()}</span>
                )}
              </span>
            )}
            {saveMsg && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs ${saveMsg.type === "success" ? "text-emerald-400/80" : "text-red-400/80"}`}
              >
                {saveMsg.type === "success" ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <AlertCircle size={13} />
                )}
                {saveMsg.text}
              </span>
            )}
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-5 py-8">
          {initialLoad ? (
            <div className="space-y-6 animate-pulse">
              {/* Skeleton: heading */}
              <div className="space-y-3">
                <div className="h-6 w-48 rounded-lg bg-white/[0.04]" />
                <div className="h-4 w-72 rounded-lg bg-white/[0.03]" />
              </div>
              {/* Skeleton: card 1 */}
              <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 space-y-4">
                <div className="h-4 w-24 rounded bg-white/[0.04]" />
                <div className="h-11 w-full rounded-xl bg-white/[0.03]" />
                <div className="h-11 w-full rounded-xl bg-white/[0.03]" />
              </div>
              {/* Skeleton: card 2 */}
              <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 space-y-4">
                <div className="h-4 w-32 rounded bg-white/[0.04]" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-11 rounded-xl bg-white/[0.03]" />
                  <div className="h-11 rounded-xl bg-white/[0.03]" />
                </div>
              </div>
              {/* Skeleton: save button */}
              <div className="h-11 w-40 rounded-xl bg-white/[0.04]" />
            </div>
          ) : !content || !availability ? (
            <div className="text-center py-32 text-red-400/60 text-sm">
              Failed to load data
            </div>
          ) : (
            <>
              {activeSection === "hero" && (
                <HeroSection
                  content={content}
                  onSave={saveSection}
                  loading={loading}
                />
              )}
              {activeSection === "services" && (
                <ServicesSection
                  data={services}
                  onSave={(d) => saveSectionData("services", d)}
                  loading={loading}
                  token={token!}
                />
              )}
              {activeSection === "projects" && (
                <ProjectsSection
                  data={projects}
                  onSave={(d) => saveSectionData("projects", d)}
                  loading={loading}
                  token={token!}
                />
              )}
              {activeSection === "process" && (
                <ProcessSection
                  data={processSteps}
                  onSave={(d) => saveSectionData("process", d)}
                  loading={loading}
                  token={token!}
                />
              )}
              {activeSection === "testimonials" && (
                <TestimonialsSection
                  data={testimonials}
                  onSave={(d) => saveSectionData("testimonials", d)}
                  loading={loading}
                  token={token!}
                />
              )}
              {activeSection === "pricing" && (
                <PricingSection
                  data={pricing}
                  onSave={(d) => saveSectionData("pricing", d)}
                  loading={loading}
                />
              )}
              {activeSection === "faq" && (
                <FaqSection
                  data={faqs}
                  onSave={(d) => saveSectionData("faq", d)}
                  loading={loading}
                />
              )}
              {activeSection === "site" && (
                <SiteSection
                  content={content}
                  onSave={saveSection}
                  loading={loading}
                />
              )}
              {activeSection === "images" && (
                <ImagesSection
                  content={content}
                  flash={flash}
                  token={token!}
                />
              )}
              {activeSection === "links" && (
                <LinksSection
                  content={content}
                  onSave={saveSection}
                  loading={loading}
                />
              )}
              {activeSection === "availability" && (
                <AvailabilitySection
                  availability={availability}
                  setAvailability={setAvailability}
                  onSave={saveAvailability}
                  loading={loading}
                />
              )}
              {activeSection === "jobs" && (
                <JobsSection
                  jobs={jobs}
                  setJobs={setJobs}
                  token={token!}
                  loading={loading}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
