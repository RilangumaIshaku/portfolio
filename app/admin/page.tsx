"use client";

import { useState, useEffect, FormEvent, useRef, useCallback } from "react";
import {
  Lock,
  LogOut,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Globe,
  User,
  Image as ImageIcon,
  Link,
  Type,
  Upload,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  MessageSquare,
  DollarSign,
  HelpCircle,
  Layers,
  Sparkles,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  X,
  Download,
  Search,
  Calendar,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────
interface SiteContent {
  site: {
    name: string;
    brand: string;
    tagline: string;
    description: string;
    email: string;
    whatsapp: string;
    socials: { github: string; linkedin: string; twitter: string };
  };
  seo: { title: string; description: string; ogImage: string };
  hero: {
    headline: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaPrimaryTarget: string;
    ctaSecondaryTarget: string;
  };
  images: { profile: string; projects: Record<string, string> };
  links: { whatsappMessage: string; ctaTarget: string };
}

interface AvailabilityData {
  isAvailable: boolean;
  status: string;
  color: "green" | "yellow" | "red";
  updatedAt: string;
}

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
  { id: "testimonials", label: "Testimonials", icon: MessageSquare, group: "Content" },
  { id: "pricing", label: "Pricing", icon: DollarSign, group: "Content" },
  { id: "faq", label: "FAQ", icon: HelpCircle, group: "Content" },
  { id: "site", label: "Site Info", icon: Globe, group: "Settings" },
  { id: "images", label: "Images", icon: ImageIcon, group: "Settings" },
  { id: "links", label: "Links & SEO", icon: Link, group: "Settings" },
  { id: "availability", label: "Availability", icon: User, group: "Settings" },
  { id: "jobs", label: "Job Scraper", icon: Briefcase, group: "Tools" },
];

const COLOR_OPTIONS = [
  { value: "green" as const, label: "Green", dot: "#22c55e" },
  { value: "yellow" as const, label: "Yellow", dot: "#eab308" },
  { value: "red" as const, label: "Red", dot: "#ef4444" },
];

const PRESET_MESSAGES = [
  "Available for new projects",
  "Accepting 2 jobs for this month",
  "Limited availability — reach out fast",
  "Fully booked until next month",
  "Open for quick projects only",
  "Not available for new projects",
];

const PROJECT_IDS = ["kasuwa", "liora", "tradingpal", "bloomstudio", "medconnect"];

const ICON_OPTIONS = [
  "Globe", "Layout", "Layers", "Zap", "Hexagon", "Package",
  "Smartphone", "Target", "MessageCircle", "Sparkles",
];

// ── Upload helper ───────────────────────────────────────────
async function uploadFile(file: File, key: string, token: string): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);
  try {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "x-admin-token": token },
      body: formData,
    });
    const json = await res.json();
    if (json.url) return json.url;
  } catch {}
  return null;
}

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
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

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
    // Helper that detects 401 and throws so we can force re-login
    const authFetch = (body: object) =>
      fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(body),
      }).then((r) => {
        if (r.status === 401) throw new Error("Unauthorized");
        return r.json();
      });

    Promise.all([
      authFetch({ action: "get-content" }),
      authFetch({ action: "get" }),
      authFetch({ action: "get-section", section: "services" }),
      authFetch({ action: "get-section", section: "projects" }),
      authFetch({ action: "get-section", section: "testimonials" }),
      authFetch({ action: "get-section", section: "pricing" }),
      authFetch({ action: "get-section", section: "faq" }),
      authFetch({ action: "get-section", section: "process" }),
      authFetch({ action: "get-section", section: "advantages" }),
      authFetch({ action: "get-section", section: "jobs" }),
    ])
      .then(([c, a, s, p, t, pr, f, ps, ad, jb]) => {
        if (c.data) setContent(c.data);
        if (a.data) setAvailability(a.data);
        if (s.data) setServices(s.data);
        if (p.data) setProjects(p.data);
        if (t.data) setTestimonials(t.data);
        if (pr.data) setPricing(pr.data);
        if (f.data) setFaqs(f.data);
        if (ps.data) setProcessSteps(ps.data);
        if (ad.data) setAdvantages(ad.data);
        if (jb.data) setJobs(jb.data);
      })
      .catch(() => {
        // Token invalid (stale UUID from old session, wrong password, etc.) — force re-login
        sessionStorage.removeItem("admin_token");
        setToken(null);
      })
      .finally(() => { setInitialLoad(false); setLoading(false); });
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
      if (!res.ok) { setLoginError(json.error || "Wrong password"); setLoading(false); return; }
      sessionStorage.setItem("admin_token", json.token);
      setToken(json.token);
    } catch { setLoginError("Connection failed"); }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null); setPassword(""); setContent(null); setAvailability(null);
  };

  const flash = (type: "success" | "error", text: string) => {
    setSaveMsg({ type, text });
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const forceLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  };

  const saveSection = async (section: string, data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token! },
        body: JSON.stringify({ action: "update-content", section, data }),
      });
      if (res.status === 401) { forceLogout(); setLoading(false); return; }
      const json = await res.json();
      if (!res.ok) flash("error", json.error || "Failed to save");
      else { if (json.data) setContent(json.data); flash("success", "Saved"); }
    } catch { flash("error", "Connection failed"); }
    setLoading(false);
  };

  const saveAvailability = async () => {
    if (!availability) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token! },
        body: JSON.stringify({ action: "update", ...availability }),
      });
      if (res.status === 401) { forceLogout(); setLoading(false); return; }
      const json = await res.json();
      if (!res.ok) flash("error", json.error || "Failed to save");
      else { if (json.data) setAvailability(json.data); flash("success", "Saved"); }
    } catch { flash("error", "Connection failed"); }
    setLoading(false);
  };

  const saveSectionData = async (section: string, data: unknown[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token! },
        body: JSON.stringify({ action: "update-section", section, data }),
      });
      if (res.status === 401) { forceLogout(); setLoading(false); return; }
      const json = await res.json();
      if (!res.ok) flash("error", json.error || "Failed to save");
      else flash("success", "Saved");
    } catch { flash("error", "Connection failed"); }
    setLoading(false);
  };

  // ── LOGIN ──
  if (!token) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center px-5 relative overflow-hidden">
        {/* Atmospheric glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(155, 143, 188, 0.12) 0%, rgba(113, 135, 196, 0.06) 40%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full blur-[100px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196, 166, 107, 0.08) 0%, transparent 60%)' }} />

        <div className="w-full max-w-[340px] relative z-10 animate-[fadeIn_0.6s_ease]">
          {/* Lock icon with subtle glow */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-40" style={{ background: 'radial-gradient(circle, rgba(155, 143, 188, 0.3) 0%, transparent 70%)' }} />
              <div className="relative w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm">
                <Lock size={18} className="text-white/35" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-9">
            <h1 className="text-[22px] font-semibold text-white/90 tracking-tight">Welcome back</h1>
            <p className="text-[13px] text-white/25 mt-2.5">Enter your password to access the dashboard</p>
          </div>

          {/* Form */}
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
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors duration-200 p-1">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {loginError && (
              <div className="flex items-center gap-2.5 text-[13px] text-red-400/70 bg-red-400/[0.06] border border-red-400/[0.08] rounded-xl px-4 py-3 animate-[fadeIn_0.2s_ease]">
                <AlertCircle size={13} className="shrink-0" />
                {loginError}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/[0.92] active:scale-[0.98] disabled:opacity-30 disabled:cursor-wait transition-all duration-200 mt-1">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                  Checking...
                </span>
              ) : "Continue"}
            </button>
          </form>

          {/* Subtle footer */}
          <p className="text-center text-[11px] text-white/12 mt-8">Dashboard access is restricted</p>
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
  const grouped = NAV_ITEMS.reduce((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex">
      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#111111] border-r border-white/[0.06] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="h-14 px-5 flex items-center gap-2.5 border-b border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center">
            <Globe size={14} className="text-white/50" />
          </div>
          <span className="text-sm font-semibold text-white/70 tracking-tight">Dashboard</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/20 px-2 mb-2">{group}</p>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
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

        {/* Footer */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-xs text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-all">
              <Eye size={13} /> Preview
            </a>
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 h-9 w-9 rounded-xl text-white/30 hover:text-red-400/70 hover:bg-white/[0.04] transition-all">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-60 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 bg-[#0c0c0c]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/40 hover:text-white/60">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <h2 className="text-sm font-medium text-white/50">{NAV_ITEMS.find(n => n.id === activeSection)?.label}</h2>
          </div>
          <div className="flex items-center gap-3">
            {saveMsg && (
              <span className={`inline-flex items-center gap-1.5 text-xs ${saveMsg.type === "success" ? "text-emerald-400/80" : "text-red-400/80"}`}>
                {saveMsg.type === "success" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                {saveMsg.text}
              </span>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-5 py-8">
          {initialLoad ? (
            <div className="text-center py-32 text-white/20 text-sm">Loading...</div>
          ) : !content || !availability ? (
            <div className="text-center py-32 text-red-400/60 text-sm">Failed to load data</div>
          ) : (
            <>
              {activeSection === "hero" && <HeroSection content={content} onSave={saveSection} loading={loading} />}
              {activeSection === "services" && <ServicesSection data={services} onSave={(d) => saveSectionData("services", d)} loading={loading} token={token!} />}
              {activeSection === "projects" && <ProjectsSection data={projects} onSave={(d) => saveSectionData("projects", d)} loading={loading} token={token!} />}
              {activeSection === "process" && <ProcessSection data={processSteps} onSave={(d) => saveSectionData("process", d)} loading={loading} token={token!} />}
              {activeSection === "testimonials" && <TestimonialsSection data={testimonials} onSave={(d) => saveSectionData("testimonials", d)} loading={loading} token={token!} />}
              {activeSection === "pricing" && <PricingSection data={pricing} onSave={(d) => saveSectionData("pricing", d)} loading={loading} />}
              {activeSection === "faq" && <FaqSection data={faqs} onSave={(d) => saveSectionData("faq", d)} loading={loading} />}
              {activeSection === "site" && <SiteSection content={content} onSave={saveSection} loading={loading} />}
              {activeSection === "images" && <ImagesSection content={content} flash={flash} token={token!} />}
              {activeSection === "links" && <LinksSection content={content} onSave={saveSection} loading={loading} />}
              {activeSection === "availability" && <AvailabilitySection availability={availability} setAvailability={setAvailability} onSave={saveAvailability} loading={loading} />}
              {activeSection === "jobs" && <JobsSection jobs={jobs} setJobs={setJobs} token={token!} loading={loading} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHARED PRIMITIVES
// ═══════════════════════════════════════════════════════════════

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-white/50 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-white/20 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all" />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all resize-none" />
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4 ${className}`}>{children}</div>;
}

function SaveButton({ onClick, loading, label = "Save Changes" }: { onClick: () => void; loading: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="inline-flex items-center gap-2.5 h-11 px-6 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] disabled:opacity-25 transition-all duration-200">
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
      {loading ? "Saving..." : label}
    </button>
  );
}

function ImageUploadInline({ label, currentImage, onUpload, loading }: { label: string; currentImage: string; onUpload: (file: File) => Promise<void>; loading: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await onUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <div className="w-14 h-14 rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
        {currentImage ? <img src={currentImage} alt={label} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-white/15" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/50 font-medium">{label}</p>
        <p className="text-[11px] text-white/20 mt-0.5 truncate">{currentImage || "No image"}</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <button onClick={() => inputRef.current?.click()} disabled={loading}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[11px] text-white/50 hover:text-white/70 hover:bg-white/[0.10] transition-all disabled:opacity-30 shrink-0">
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
        Upload
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION COMPONENTS — matching landing page order
// ═══════════════════════════════════════════════════════════════

// ── Hero ────────────────────────────────────────────────────
function HeroSection({ content, onSave, loading }: { content: SiteContent; onSave: (s: string, d: Record<string, unknown>) => Promise<void>; loading: boolean }) {
  const [data, setData] = useState(content.hero);
  useEffect(() => { setData(content.hero); }, [content.hero]);
  const u = (f: string, v: string) => setData((p) => ({ ...p, [f]: v }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Hero Section</h1>
        <p className="text-sm text-white/30 mt-1">The first thing visitors see on your homepage.</p>
      </div>
      <Card>
        <Field label="Headline" hint="The big bold text in the hero">
          <TextArea value={data.headline} onChange={(v) => u("headline", v)} rows={2} />
        </Field>
        <Field label="Subtitle" hint="Supporting text below the headline">
          <TextArea value={data.subtitle} onChange={(v) => u("subtitle", v)} rows={3} />
        </Field>
      </Card>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">Call-to-Action Buttons</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Primary Button Text"><Input value={data.ctaPrimary} onChange={(v) => u("ctaPrimary", v)} /></Field>
          <Field label="Primary Links To" hint="Section ID or URL"><Input value={data.ctaPrimaryTarget} onChange={(v) => u("ctaPrimaryTarget", v)} /></Field>
          <Field label="Secondary Button Text"><Input value={data.ctaSecondary} onChange={(v) => u("ctaSecondary", v)} /></Field>
          <Field label="Secondary Links To"><Input value={data.ctaSecondaryTarget} onChange={(v) => u("ctaSecondaryTarget", v)} /></Field>
        </div>
      </Card>
      <SaveButton onClick={() => onSave("hero", data)} loading={loading} />
    </div>
  );
}

// ── Services ────────────────────────────────────────────────
function ServicesSection({ data, onSave, loading }: { data: any[]; onSave: (d: any[]) => void; loading: boolean; token: string }) {
  const [list, setList] = useState(data);
  const [expanded, setExpanded] = useState<number | null>(null);
  useEffect(() => { setList(data); }, [data]);
  const update = (i: number, v: any) => { const n = [...list]; n[i] = v; setList(n); };
  const add = () => { const n = [...list, { title: "New Service", description: "Description.", icon: "Globe" }]; setList(n); setExpanded(n.length - 1); };
  const remove = (i: number) => { setList(list.filter((_, j) => j !== i)); if (expanded === i) setExpanded(null); };
  const move = (i: number, d: number) => { const t = i + d; if (t < 0 || t >= list.length) return; const n = [...list]; [n[i], n[t]] = [n[t], n[i]]; setList(n); setExpanded(t); };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Services</h1>
        <p className="text-sm text-white/30 mt-1">The services you offer. Each card on the landing page.</p>
      </div>
      {list.map((item: any, i: number) => (
        <Card key={i} className="!p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex gap-0.5">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronUp size={12} /></button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronDown size={12} /></button>
            </div>
            <span className="text-[11px] text-white/20 font-mono">#{i + 1}</span>
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex-1 text-left text-sm text-white/60 hover:text-white/80 truncate">{item.title}</button>
            <button onClick={() => remove(i)} className="text-white/20 hover:text-red-400/70 p-1"><Trash2 size={12} /></button>
          </div>
          {expanded === i && (
            <div className="p-4 space-y-3">
              <Field label="Title"><Input value={item.title} onChange={(v) => update(i, { ...item, title: v })} /></Field>
              <Field label="Description"><TextArea value={item.description} onChange={(v) => update(i, { ...item, description: v })} rows={2} /></Field>
              <Field label="Icon">
                <select value={item.icon} onChange={(e) => update(i, { ...item, icon: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none transition-all">
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic} className="bg-[#0c0c0c]">{ic}</option>)}
                </select>
              </Field>
            </div>
          )}
        </Card>
      ))}
      <div className="flex gap-3">
        <button onClick={add} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all"><Plus size={14} /> Add</button>
        <SaveButton onClick={() => onSave(list)} loading={loading} />
      </div>
    </div>
  );
}

// ── Projects ────────────────────────────────────────────────
function ProjectsSection({ data, onSave, loading, token }: { data: any[]; onSave: (d: any[]) => void; loading: boolean; token: string }) {
  const [list, setList] = useState(data);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [imgLoading, setImgLoading] = useState<number | null>(null);
  useEffect(() => { setList(data); }, [data]);
  const update = (i: number, v: any) => { const n = [...list]; n[i] = v; setList(n); };
  const add = () => { const n = [...list, { id: `p-${Date.now()}`, title: "New Project", category: "Category", description: "Description.", technologies: [], image: "", url: "", color: "#000000" }]; setList(n); setExpanded(n.length - 1); };
  const remove = (i: number) => { setList(list.filter((_, j) => j !== i)); if (expanded === i) setExpanded(null); };
  const move = (i: number, d: number) => { const t = i + d; if (t < 0 || t >= list.length) return; const n = [...list]; [n[i], n[t]] = [n[t], n[i]]; setList(n); setExpanded(t); };
  const uploadImg = async (i: number, file: File) => {
    setImgLoading(i);
    const url = await uploadFile(file, `project-${list[i].id}-image`, token);
    if (url) update(i, { ...list[i], image: url });
    setImgLoading(null);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Projects</h1>
        <p className="text-sm text-white/30 mt-1">Your portfolio. Each project card on the landing page.</p>
      </div>
      {list.map((item: any, i: number) => (
        <Card key={i} className="!p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex gap-0.5">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronUp size={12} /></button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronDown size={12} /></button>
            </div>
            <span className="text-[11px] text-white/20 font-mono">#{i + 1}</span>
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex-1 text-left text-sm text-white/60 hover:text-white/80 truncate">{item.title} <span className="text-white/20">— {item.category}</span></button>
            <button onClick={() => remove(i)} className="text-white/20 hover:text-red-400/70 p-1"><Trash2 size={12} /></button>
          </div>
          {expanded === i && (
            <div className="p-4 space-y-3">
              <ImageUploadInline label="Project Screenshot" currentImage={item.image || ""} onUpload={(f) => uploadImg(i, f)} loading={imgLoading === i} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title"><Input value={item.title} onChange={(v) => update(i, { ...item, title: v })} /></Field>
                <Field label="Category"><Input value={item.category} onChange={(v) => update(i, { ...item, category: v })} /></Field>
              </div>
              <Field label="Description"><TextArea value={item.description} onChange={(v) => update(i, { ...item, description: v })} rows={2} /></Field>
              <Field label="Technologies" hint="Comma-separated">
                <Input value={(item.technologies || []).join(", ")} onChange={(v) => update(i, { ...item, technologies: v.split(",").map((s: string) => s.trim()).filter(Boolean) })} placeholder="Next.js, React, TypeScript" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="URL" hint="Leave empty to hide"><Input value={item.url || ""} onChange={(v) => update(i, { ...item, url: v })} /></Field>
                <Field label="Accent Color"><Input value={item.color || "#000000"} onChange={(v) => update(i, { ...item, color: v })} /></Field>
              </div>
            </div>
          )}
        </Card>
      ))}
      <div className="flex gap-3">
        <button onClick={add} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all"><Plus size={14} /> Add</button>
        <SaveButton onClick={() => onSave(list)} loading={loading} />
      </div>
    </div>
  );
}

// ── Process ─────────────────────────────────────────────────
function ProcessSection({ data, onSave, loading, token }: { data: any[]; onSave: (d: any[]) => void; loading: boolean; token: string }) {
  const [list, setList] = useState(data);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [imgLoading, setImgLoading] = useState<number | null>(null);
  useEffect(() => { setList(data); }, [data]);
  const update = (i: number, v: any) => { const n = [...list]; n[i] = v; setList(n); };
  const add = () => { const n = [...list, { number: String(list.length + 1), title: "New Step", description: "Description.", image: "" }]; setList(n); setExpanded(n.length - 1); };
  const remove = (i: number) => { setList(list.filter((_, j) => j !== i)); if (expanded === i) setExpanded(null); };
  const move = (i: number, d: number) => { const t = i + d; if (t < 0 || t >= list.length) return; const n = [...list]; [n[i], n[t]] = [n[t], n[i]]; setList(n); setExpanded(t); };
  const uploadImg = async (i: number, file: File) => {
    setImgLoading(i);
    const url = await uploadFile(file, `process-step-${i}-image`, token);
    if (url) update(i, { ...list[i], image: url });
    setImgLoading(null);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Process Steps</h1>
        <p className="text-sm text-white/30 mt-1">Your workflow. Each step card on the landing page, with optional visual image.</p>
      </div>
      {list.map((item: any, i: number) => (
        <Card key={i} className="!p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex gap-0.5">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronUp size={12} /></button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronDown size={12} /></button>
            </div>
            <span className="text-[11px] text-white/20 font-mono">#{item.number}</span>
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex-1 text-left text-sm text-white/60 hover:text-white/80 truncate">{item.title}</button>
            <button onClick={() => remove(i)} className="text-white/20 hover:text-red-400/70 p-1"><Trash2 size={12} /></button>
          </div>
          {expanded === i && (
            <div className="p-4 space-y-3">
              <ImageUploadInline label="Step Visual Image" currentImage={item.image || ""} onUpload={(f) => uploadImg(i, f)} loading={imgLoading === i} />
              <div className="grid grid-cols-4 gap-3">
                <Field label="Number"><Input value={item.number} onChange={(v) => update(i, { ...item, number: v })} /></Field>
                <div className="col-span-3"><Field label="Title"><Input value={item.title} onChange={(v) => update(i, { ...item, title: v })} /></Field></div>
              </div>
              <Field label="Description"><TextArea value={item.description} onChange={(v) => update(i, { ...item, description: v })} rows={2} /></Field>
            </div>
          )}
        </Card>
      ))}
      <div className="flex gap-3">
        <button onClick={add} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all"><Plus size={14} /> Add</button>
        <SaveButton onClick={() => onSave(list)} loading={loading} />
      </div>
    </div>
  );
}

// ── Testimonials ────────────────────────────────────────────
function TestimonialsSection({ data, onSave, loading, token }: { data: any[]; onSave: (d: any[]) => void; loading: boolean; token: string }) {
  const [list, setList] = useState(data);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [imgLoading, setImgLoading] = useState<number | null>(null);
  useEffect(() => { setList(data); }, [data]);
  const update = (i: number, v: any) => { const n = [...list]; n[i] = v; setList(n); };
  const add = () => { const n = [...list, { quote: "Your testimonial here.", name: "Client Name", role: "Role / Company", image: "", isPlaceholder: true }]; setList(n); setExpanded(n.length - 1); };
  const remove = (i: number) => { setList(list.filter((_, j) => j !== i)); if (expanded === i) setExpanded(null); };
  const move = (i: number, d: number) => { const t = i + d; if (t < 0 || t >= list.length) return; const n = [...list]; [n[i], n[t]] = [n[t], n[i]]; setList(n); setExpanded(t); };
  const uploadImg = async (i: number, file: File) => {
    setImgLoading(i);
    const url = await uploadFile(file, `testimonial-${i}-avatar`, token);
    if (url) update(i, { ...list[i], image: url });
    setImgLoading(null);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Testimonials</h1>
        <p className="text-sm text-white/30 mt-1">Client quotes in the marquee. Upload avatar images for each person.</p>
      </div>
      {list.map((item: any, i: number) => (
        <Card key={i} className="!p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex gap-0.5">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronUp size={12} /></button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronDown size={12} /></button>
            </div>
            <span className="text-[11px] text-white/20 font-mono">#{i + 1}</span>
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex-1 text-left text-sm text-white/60 hover:text-white/80 truncate">{item.name} <span className="text-white/20">— {item.role}</span></button>
            <button onClick={() => remove(i)} className="text-white/20 hover:text-red-400/70 p-1"><Trash2 size={12} /></button>
          </div>
          {expanded === i && (
            <div className="p-4 space-y-3">
              <ImageUploadInline label="Avatar Photo" currentImage={item.image || ""} onUpload={(f) => uploadImg(i, f)} loading={imgLoading === i} />
              <Field label="Quote"><TextArea value={item.quote} onChange={(v) => update(i, { ...item, quote: v })} rows={3} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Client Name"><Input value={item.name} onChange={(v) => update(i, { ...item, name: v })} /></Field>
                <Field label="Role / Company"><Input value={item.role} onChange={(v) => update(i, { ...item, role: v })} /></Field>
              </div>
            </div>
          )}
        </Card>
      ))}
      <div className="flex gap-3">
        <button onClick={add} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all"><Plus size={14} /> Add</button>
        <SaveButton onClick={() => onSave(list)} loading={loading} />
      </div>
    </div>
  );
}

// ── Pricing ─────────────────────────────────────────────────
function PricingSection({ data, onSave, loading }: { data: any[]; onSave: (d: any[]) => void; loading: boolean }) {
  const [list, setList] = useState(data);
  const [expanded, setExpanded] = useState<number | null>(null);
  useEffect(() => { setList(data); }, [data]);
  const update = (i: number, v: any) => { const n = [...list]; n[i] = v; setList(n); };
  const add = () => { const n = [...list, { name: "New Tier", price: "₦0", priceAmount: 0, description: "Description.", features: [], highlighted: false }]; setList(n); setExpanded(n.length - 1); };
  const remove = (i: number) => { setList(list.filter((_, j) => j !== i)); if (expanded === i) setExpanded(null); };
  const move = (i: number, d: number) => { const t = i + d; if (t < 0 || t >= list.length) return; const n = [...list]; [n[i], n[t]] = [n[t], n[i]]; setList(n); setExpanded(t); };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Pricing</h1>
        <p className="text-sm text-white/30 mt-1">Your pricing tiers. Each card on the landing page.</p>
      </div>
      {list.map((item: any, i: number) => (
        <Card key={i} className="!p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex gap-0.5">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronUp size={12} /></button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronDown size={12} /></button>
            </div>
            <span className={`text-[11px] font-mono ${item.highlighted ? "text-emerald-400/70" : "text-white/20"}`}>#{i + 1}</span>
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex-1 text-left text-sm text-white/60 hover:text-white/80 truncate">{item.name} <span className="text-white/20">— {item.price}</span></button>
            <button onClick={() => remove(i)} className="text-white/20 hover:text-red-400/70 p-1"><Trash2 size={12} /></button>
          </div>
          {expanded === i && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tier Name"><Input value={item.name} onChange={(v) => update(i, { ...item, name: v })} /></Field>
                <Field label="Price Display" hint="₦150,000 or Let's talk"><Input value={item.price} onChange={(v) => update(i, { ...item, price: v })} /></Field>
              </div>
              <Field label="Price Amount" hint="Numeric NGN (0 = custom)"><Input type="number" value={String(item.priceAmount || 0)} onChange={(v) => update(i, { ...item, priceAmount: parseInt(v) || 0 })} /></Field>
              <Field label="Description"><TextArea value={item.description} onChange={(v) => update(i, { ...item, description: v })} rows={2} /></Field>
              <Field label="Features" hint="One per line"><TextArea value={(item.features || []).join("\n")} onChange={(v) => update(i, { ...item, features: v.split("\n").filter(Boolean) })} rows={4} /></Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={item.highlighted || false} onChange={(e) => update(i, { ...item, highlighted: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/[0.04]" />
                <span className="text-sm text-white/50">Highlighted (Most Popular)</span>
              </label>
            </div>
          )}
        </Card>
      ))}
      <div className="flex gap-3">
        <button onClick={add} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all"><Plus size={14} /> Add</button>
        <SaveButton onClick={() => onSave(list)} loading={loading} />
      </div>
    </div>
  );
}

// ── FAQ ─────────────────────────────────────────────────────
function FaqSection({ data, onSave, loading }: { data: any[]; onSave: (d: any[]) => void; loading: boolean }) {
  const [list, setList] = useState(data);
  const [expanded, setExpanded] = useState<number | null>(null);
  useEffect(() => { setList(data); }, [data]);
  const update = (i: number, v: any) => { const n = [...list]; n[i] = v; setList(n); };
  const add = () => { const n = [...list, { question: "New question?", answer: "Answer." }]; setList(n); setExpanded(n.length - 1); };
  const remove = (i: number) => { setList(list.filter((_, j) => j !== i)); if (expanded === i) setExpanded(null); };
  const move = (i: number, d: number) => { const t = i + d; if (t < 0 || t >= list.length) return; const n = [...list]; [n[i], n[t]] = [n[t], n[i]]; setList(n); setExpanded(t); };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">FAQ</h1>
        <p className="text-sm text-white/30 mt-1">Frequently asked questions shown on the landing page.</p>
      </div>
      {list.map((item: any, i: number) => (
        <Card key={i} className="!p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex gap-0.5">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronUp size={12} /></button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1} className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"><ChevronDown size={12} /></button>
            </div>
            <span className="text-[11px] text-white/20 font-mono">#{i + 1}</span>
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex-1 text-left text-sm text-white/60 hover:text-white/80 truncate">{item.question}</button>
            <button onClick={() => remove(i)} className="text-white/20 hover:text-red-400/70 p-1"><Trash2 size={12} /></button>
          </div>
          {expanded === i && (
            <div className="p-4 space-y-3">
              <Field label="Question"><Input value={item.question} onChange={(v) => update(i, { ...item, question: v })} /></Field>
              <Field label="Answer"><TextArea value={item.answer} onChange={(v) => update(i, { ...item, answer: v })} rows={3} /></Field>
            </div>
          )}
        </Card>
      ))}
      <div className="flex gap-3">
        <button onClick={add} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all"><Plus size={14} /> Add</button>
        <SaveButton onClick={() => onSave(list)} loading={loading} />
      </div>
    </div>
  );
}

// ── Site Info ───────────────────────────────────────────────
function SiteSection({ content, onSave, loading }: { content: SiteContent; onSave: (s: string, d: Record<string, unknown>) => Promise<void>; loading: boolean }) {
  const [data, setData] = useState(content.site);
  useEffect(() => { setData(content.site); }, [content.site]);
  const u = (f: string, v: string) => setData((p) => ({ ...p, [f]: v }));
  const us = (f: string, v: string) => setData((p) => ({ ...p, socials: { ...p.socials, [f]: v } }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Site Information</h1>
        <p className="text-sm text-white/30 mt-1">Your name, contact details, and social links.</p>
      </div>
      <Card>
        <Field label="Full Name" hint="Displayed in footer and SEO">
          <Input value={data.name} onChange={(v) => { u("name", v); u("brand", v); }} />
        </Field>
        <Field label="Tagline"><Input value={data.tagline} onChange={(v) => u("tagline", v)} /></Field>
        <Field label="Description"><TextArea value={data.description} onChange={(v) => u("description", v)} rows={2} /></Field>
      </Card>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">Contact</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email"><Input value={data.email} onChange={(v) => u("email", v)} type="email" /></Field>
          <Field label="WhatsApp" hint="With country code, no + or spaces"><Input value={data.whatsapp} onChange={(v) => u("whatsapp", v)} /></Field>
        </div>
      </Card>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">Social Links</p>
        <div className="space-y-3">
          <Field label="GitHub"><Input value={data.socials.github} onChange={(v) => us("github", v)} /></Field>
          <Field label="LinkedIn"><Input value={data.socials.linkedin} onChange={(v) => us("linkedin", v)} /></Field>
          <Field label="Twitter / X"><Input value={data.socials.twitter} onChange={(v) => us("twitter", v)} /></Field>
        </div>
      </Card>
      <SaveButton onClick={() => onSave("site", data)} loading={loading} />
    </div>
  );
}

// ── Images ──────────────────────────────────────────────────
function ImagesSection({ content, flash, token }: { content: SiteContent; flash: (t: "success" | "error", m: string) => void; token: string }) {
  const [profileImg, setProfileImg] = useState(content.images.profile);
  const [projImages, setProjImages] = useState(content.images.projects);
  const [uploading, setUploading] = useState<string | null>(null);
  useEffect(() => { setProfileImg(content.images.profile); setProjImages(content.images.projects); }, [content]);

  const handleUpload = async (file: File, key: string) => {
    setUploading(key);
    const url = await uploadFile(file, key, token);
    if (url) {
      if (key === "profile") setProfileImg(url);
      else if (key.startsWith("project-")) {
        const id = key.replace("project-", "");
        setProjImages((p) => ({ ...p, [id]: url! }));
      }
      flash("success", "Image uploaded");
    } else flash("error", "Upload failed");
    setUploading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Images</h1>
        <p className="text-sm text-white/30 mt-1">Upload or replace images used across your site.</p>
      </div>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">Profile Photo</p>
        <ImageUploadInline label="Profile" currentImage={profileImg} onUpload={(f) => handleUpload(f, "profile")} loading={uploading === "profile"} />
      </Card>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">Project Screenshots</p>
        <div className="space-y-3">
          {PROJECT_IDS.map((id) => (
            <ImageUploadInline key={id} label={id.charAt(0).toUpperCase() + id.slice(1)} currentImage={projImages[id] || ""} onUpload={(f) => handleUpload(f, `project-${id}`)} loading={uploading === `project-${id}`} />
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Links & SEO ─────────────────────────────────────────────
function LinksSection({ content, onSave, loading }: { content: SiteContent; onSave: (s: string, d: Record<string, unknown>) => Promise<void>; loading: boolean }) {
  const [links, setLinks] = useState(content.links);
  const [seo, setSeo] = useState(content.seo);
  useEffect(() => { setLinks(content.links); setSeo(content.seo); }, [content]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Links & SEO</h1>
        <p className="text-sm text-white/30 mt-1">WhatsApp message, page title, meta description, and OG image.</p>
      </div>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">WhatsApp</p>
        <Field label="Default Message" hint="Pre-filled when someone clicks WhatsApp">
          <TextArea value={links.whatsappMessage} onChange={(v) => setLinks((p) => ({ ...p, whatsappMessage: v }))} rows={2} />
        </Field>
      </Card>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">SEO Metadata</p>
        <Field label="Page Title"><Input value={seo.title} onChange={(v) => setSeo((p) => ({ ...p, title: v }))} /></Field>
        <Field label="Meta Description"><TextArea value={seo.description} onChange={(v) => setSeo((p) => ({ ...p, description: v }))} rows={2} /></Field>
        <Field label="OG Image Path" hint="Place file in public/ folder"><Input value={seo.ogImage} onChange={(v) => setSeo((p) => ({ ...p, ogImage: v }))} /></Field>
      </Card>
      <div className="flex gap-3">
        <SaveButton onClick={() => onSave("links", links)} loading={loading} label="Save Links" />
        <SaveButton onClick={() => onSave("seo", seo)} loading={loading} label="Save SEO" />
      </div>
    </div>
  );
}

// ── Availability ────────────────────────────────────────────
function AvailabilitySection({ availability, setAvailability, onSave, loading }: { availability: AvailabilityData; setAvailability: (v: AvailabilityData) => void; onSave: () => Promise<void>; loading: boolean }) {
  const dotColor = availability.color === "green" ? "#22c55e" : availability.color === "yellow" ? "#eab308" : "#ef4444";
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">Availability</h1>
        <p className="text-sm text-white/30 mt-1">Control the availability badge on your homepage.</p>
      </div>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">Live Preview</p>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: dotColor }} />
          <span className="text-sm text-white/70">{availability.status}</span>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70 font-medium">Show badge</p>
            <p className="text-xs text-white/25 mt-1">{availability.isAvailable ? "Visible" : "Hidden"}</p>
          </div>
          <button onClick={() => setAvailability({ ...availability, isAvailable: !availability.isAvailable })}
            className={`relative w-[51px] h-[31px] rounded-full transition-colors duration-200 shrink-0 ml-4 ${availability.isAvailable ? "bg-[#34c759]" : "bg-white/[0.12]"}`}>
            <span className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-200 ${availability.isAvailable ? "translate-x-[20px]" : ""}`} />
          </button>
        </div>
      </Card>
      <Card>
        <Field label="Status Message">
          <Input value={availability.status} onChange={(v) => setAvailability({ ...availability, status: v })} />
        </Field>
        <div className="flex flex-wrap gap-2 mt-2">
          {PRESET_MESSAGES.map((msg) => (
            <button key={msg} onClick={() => setAvailability({ ...availability, status: msg })}
              className={`h-8 px-3 rounded-full text-[11px] font-medium transition-all ${availability.status === msg ? "bg-white/[0.12] text-white/80 border border-white/[0.12]" : "bg-white/[0.03] text-white/30 border border-transparent hover:bg-white/[0.06]"}`}>
              {msg}
            </button>
          ))}
        </div>
      </Card>
      <div>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">Dot Color</p>
        <div className="grid grid-cols-3 gap-3">
          {COLOR_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setAvailability({ ...availability, color: opt.value })}
              className={`flex flex-col items-center gap-3 py-5 rounded-2xl border transition-all ${availability.color === opt.value ? "border-white/[0.15] bg-white/[0.06]" : "border-white/[0.05] bg-white/[0.01] hover:border-white/[0.1]"}`}>
              <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: opt.dot }} />
              <span className="text-xs text-white/50 font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      <SaveButton onClick={onSave} loading={loading} />
    </div>
  );
}

// ── Jobs (from job-bot scraper) ──────────────────────────────
interface JobEntry {
  id: string;
  source: string;
  title: string;
  company: string;
  url: string;
  description: string;
  score: number;
  high_priority: boolean;
  keywords_matched: string[];
  found_at: string;
  salary?: string;
  location?: string;
  tags?: string[];
}

function JobsSection({ jobs, setJobs, token, loading }: { jobs: JobEntry[]; setJobs: (v: JobEntry[]) => void; token: string; loading: boolean }) {
  const [filter, setFilter] = useState<"all" | "high" | "today">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [botStatus, setBotStatus] = useState<"idle" | "running" | "scanning" | "error" | null>(null);
  const [scanning, setScanning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Fetch bot status on mount and periodically
  useEffect(() => {
    if (!token) return;
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/jobs?action=status", {
          headers: { "x-admin-token": token },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setBotStatus(json.data.status);
            setScanLogs(json.data.logs || []);
            if (json.data.lastScanResult) setScanResult(json.data.lastScanResult);
          }
        }
      } catch {}
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const handleScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ action: "scan" }),
      });
      const json = await res.json();
      if (json.success) {
        setScanResult(json.data);
        // Refresh jobs list
        const jobsRes = await fetch("/api/jobs", {
          headers: { "x-admin-token": token },
        });
        if (jobsRes.ok) {
          const jobsJson = await jobsRes.json();
          if (jobsJson.data) setJobs(jobsJson.data);
        }
      }
    } catch {}
    setScanning(false);
  };

  const handleStart = async () => {
    setStarting(true);
    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ action: "start" }),
      });
    } catch {}
    setStarting(false);
  };

  const handleStop = async () => {
    setStopping(true);
    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ action: "stop" }),
      });
    } catch {}
    setStopping(false);
  };

  // Filter jobs
  const filtered = jobs.filter((j) => {
    if (filter === "high" && !j.high_priority) return false;
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      if (!j.found_at || !j.found_at.startsWith(today)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const searchable = `${j.title} ${j.company} ${j.source} ${(j.keywords_matched || []).join(" ")}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });

  const todayCount = jobs.filter((j) => j.found_at && j.found_at.startsWith(new Date().toISOString().split("T")[0])).length;
  const highCount = jobs.filter((j) => j.high_priority).length;

  const handleDownload = async (dateFilter?: string) => {
    setDownloading(true);
    try {
      const body: any = { action: "download-jobs" };
      if (dateFilter) body.date = dateFilter;

      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] || "jobs.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch {}
    setDownloading(false);
  };

  const handleClear = async (olderThanDays?: number) => {
    if (!confirm(olderThanDays ? `Delete jobs older than ${olderThanDays} days?` : "Delete ALL jobs?")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ action: "clear-jobs", olderThanDays }),
      });
      const json = await res.json();
      if (json.success) {
        setJobs(json.data || []);
      }
    } catch {}
    setClearing(false);
  };

  // Source distribution for the visual breakdown
  const sourceBreakdown = jobs.reduce((acc, j) => { acc[j.source] = (acc[j.source] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topSources = Object.entries(sourceBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxSourceCount = topSources[0]?.[1] || 1;

  const SOURCE_COLORS: Record<string, string> = {
    remoteok: "#f97316",
    wwr: "#8b5cf6",
    himalayas: "#06b6d4",
    remotive: "#22c55e",
    jobicy: "#eab308",
    arbeitnow: "#ec4899",
    jooble: "#3b82f6",
    adzuna: "#ef4444",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl blur-xl" />
        <div className="relative">
          <h1 className="text-xl font-semibold text-white/90 tracking-tight">Job Scraper</h1>
          <p className="text-sm text-white/30 mt-1">Scrapes 8 platforms — control the bot, view matches, download results.</p>
        </div>
      </div>

      {/* Bot Control Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full blur-2xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${botStatus === "running" ? "bg-emerald-400" : botStatus === "scanning" ? "bg-blue-400" : botStatus === "error" ? "bg-red-400" : "bg-white/20"}`} />
              {(botStatus === "running" || botStatus === "scanning") && (
                <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping ${botStatus === "running" ? "bg-emerald-400/50" : "bg-blue-400/50"}`} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-white/80 font-medium">
                  {botStatus === "running" ? "Auto-Scan Active" : botStatus === "scanning" ? "Scanning..." : botStatus === "error" ? "Error" : "Manual Mode"}
                </p>
                {scanResult && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/30 font-mono">
                    {scanResult.matched} matched · {scanResult.new} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/25 mt-0.5">
                {botStatus === "running" ? "Checks every 6 hours automatically" : "Click Scan Now to fetch latest jobs"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <button
              onClick={handleScan}
              disabled={scanning || botStatus === "scanning"}
              className="group relative inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-[0.98] disabled:opacity-40 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                {scanning ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {scanning ? "Scanning..." : "Scan Now"}
              </span>
            </button>
            {botStatus === "running" ? (
              <button
                onClick={handleStop}
                disabled={stopping}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400/80 hover:bg-red-500/20 hover:border-red-500/30 transition-all disabled:opacity-40"
              >
                {stopping ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                Stop
              </button>
            ) : (
              <button
                onClick={handleStart}
                disabled={starting || botStatus === "scanning"}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400/80 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all disabled:opacity-40"
              >
                {starting ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
                Auto-Scan
              </button>
            )}
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.08] transition-all"
            >
              {showLogs ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              Logs
            </button>
          </div>
        </div>
        {showLogs && scanLogs.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-black/50 border border-white/[0.04] max-h-52 overflow-y-auto scrollbar-thin">
            {scanLogs.map((line, i) => (
              <p key={i} className={`text-[11px] font-mono leading-relaxed ${line.startsWith("[ERR]") ? "text-red-400/60" : line.includes("Done") ? "text-emerald-400/50" : "text-white/25"}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center"><Briefcase size={13} className="text-white/40" /></div>
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">Total</p>
          </div>
          <p className="text-2xl font-bold text-white/85 tracking-tight">{jobs.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/[0.08] bg-emerald-500/[0.03] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-400/10 flex items-center justify-center"><Sparkles size={13} className="text-emerald-400/60" /></div>
            <p className="text-[10px] text-emerald-400/40 uppercase tracking-widest font-medium">Priority</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400/80 tracking-tight">{highCount}</p>
        </div>
        <div className="rounded-2xl border border-blue-500/[0.08] bg-blue-500/[0.03] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-400/10 flex items-center justify-center"><Calendar size={13} className="text-blue-400/60" /></div>
            <p className="text-[10px] text-blue-400/40 uppercase tracking-widest font-medium">Today</p>
          </div>
          <p className="text-2xl font-bold text-blue-400/80 tracking-tight">{todayCount}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center"><Globe size={13} className="text-white/40" /></div>
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">Sources</p>
          </div>
          <p className="text-2xl font-bold text-white/85 tracking-tight">{Object.keys(sourceBreakdown).length}</p>
        </div>
      </div>

      {/* Source Distribution */}
      {topSources.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium mb-4">Source Breakdown</p>
          <div className="space-y-2.5">
            {topSources.map(([source, count]) => (
              <div key={source} className="flex items-center gap-3">
                <span className="text-[11px] text-white/40 font-medium w-24 shrink-0 capitalize">{source}</span>
                <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(count / maxSourceCount) * 100}%`, backgroundColor: SOURCE_COLORS[source] || '#666' }}
                  />
                </div>
                <span className="text-[11px] text-white/25 font-mono w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, company, keyword..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.05] transition-all"
          />
        </div>
        <div className="flex gap-1.5 bg-white/[0.02] p-1 rounded-xl border border-white/[0.04]">
          {["all", "high", "today"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`h-9 px-4 rounded-lg text-xs font-medium transition-all ${
                filter === f ? "bg-white/[0.1] text-white/80 shadow-sm" : "text-white/30 hover:text-white/50 hover:bg-white/[0.04]"
              }`}
            >
              {f === "all" ? `All (${jobs.length})` : f === "high" ? `🔥 High (${highCount})` : `Today (${todayCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Download & Clear Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleDownload()}
          disabled={downloading || jobs.length === 0}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.08] transition-all disabled:opacity-30"
        >
          {downloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
          CSV All
        </button>
        <button
          onClick={() => handleDownload(new Date().toISOString().split("T")[0])}
          disabled={downloading || todayCount === 0}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.08] transition-all disabled:opacity-30"
        >
          {downloading ? <Loader2 size={12} className="animate-spin" /> : <Calendar size={12} />}
          CSV Today
        </button>
        <div className="w-px h-5 bg-white/[0.06] self-center" />
        <button
          onClick={() => handleClear(7)}
          disabled={clearing || jobs.length === 0}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/30 hover:text-white/50 hover:bg-white/[0.08] transition-all disabled:opacity-30"
        >
          {clearing ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Clear Old
        </button>
        <button
          onClick={() => handleClear()}
          disabled={clearing || jobs.length === 0}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-red-500/[0.06] border border-red-500/[0.1] text-xs text-red-400/50 hover:text-red-400/70 hover:bg-red-500/[0.1] transition-all disabled:opacity-30"
        >
          {clearing ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Clear All
        </button>
      </div>

      {/* Job List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
              <Briefcase size={24} className="text-white/10" />
            </div>
            <p className="text-sm text-white/30 font-medium">
              {jobs.length === 0 ? "No jobs yet" : "No matches found"}
            </p>
            <p className="text-xs text-white/15 mt-1.5">
              {jobs.length === 0 ? "Click Scan Now to fetch jobs from all platforms" : "Try adjusting your filters or search query"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="text-[11px] text-white/20 px-1">
            Showing {filtered.length} of {jobs.length} jobs
          </p>
          {filtered.map((job, i) => {
            const srcColor = SOURCE_COLORS[job.source] || '#666';
            return (
              <div
                key={job.id}
                className={`group rounded-2xl border transition-all duration-200 ${
                  expanded === i
                    ? "border-white/[0.1] bg-white/[0.04] shadow-lg shadow-black/20"
                    : "border-white/[0.04] bg-white/[0.015] hover:border-white/[0.08] hover:bg-white/[0.03]"
                }`}
              >
                <div
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  {/* Priority indicator */}
                  <div className={`w-1 h-8 rounded-full shrink-0 transition-all ${job.high_priority ? 'bg-gradient-to-b from-emerald-400 to-emerald-600' : 'bg-white/[0.06]'}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white/75 font-medium truncate group-hover:text-white/90 transition-colors">{job.title}</p>
                      {job.high_priority && <span className="text-[10px]">🔥</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-white/35">{job.company || "Unknown"}</span>
                      <span className="text-white/10">·</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${srcColor}15`, color: `${srcColor}99` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: srcColor }} />
                        {job.source}
                      </span>
                      {job.salary && (
                        <span className="text-[10px] text-emerald-400/50 font-medium">💰 {job.salary}</span>
                      )}
                      {job.location && job.location !== "Remote" && (
                        <span className="text-[10px] text-white/20">📍 {job.location}</span>
                      )}
                    </div>
                  </div>

                  {/* Score & expand */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-center">
                      <p className="text-sm font-bold text-white/60 font-mono leading-none">{job.score}</p>
                      <p className="text-[8px] text-white/20 uppercase tracking-wider mt-0.5">score</p>
                    </div>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${expanded === i ? 'bg-white/[0.08]' : 'bg-white/[0.03] group-hover:bg-white/[0.06]'}`}>
                      {expanded === i ? <ChevronUp size={13} className="text-white/30" /> : <ChevronDown size={13} className="text-white/20" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {expanded === i && (
                  <div className="px-4 pb-4 space-y-3 border-t border-white/[0.04] pt-3.5 ">
                    {/* Matched Keywords */}
                    {(job.keywords_matched || []).length > 0 && (
                      <div>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest font-medium mb-1.5">Matched Keywords</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(job.keywords_matched || []).map((kw) => (
                            <span key={kw} className="text-[10px] font-medium bg-emerald-400/[0.08] text-emerald-400/60 px-2 py-0.5 rounded-full border border-emerald-400/[0.08]">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {(job.tags || []).filter(Boolean).length > 0 && (
                      <div>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest font-medium mb-1.5">Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(job.tags || []).filter(Boolean).map((tag: string) => (
                            <span key={tag} className="text-[10px] font-medium bg-white/[0.04] text-white/35 px-2 py-0.5 rounded-full border border-white/[0.05]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {job.description && (
                      <div>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest font-medium mb-1.5">Description</p>
                        <p className="text-[12px] text-white/30 leading-relaxed line-clamp-4 bg-white/[0.02] rounded-xl p-3 border border-white/[0.03]">
                          {job.description}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[11px] text-white/50 hover:text-white/70 hover:bg-white/[0.10] transition-all"
                      >
                        <Link size={11} /> View Posting
                      </a>
                      <span className="text-[10px] text-white/15">
                        {job.found_at ? new Date(job.found_at).toLocaleDateString() : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
