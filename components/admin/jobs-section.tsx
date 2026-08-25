"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Globe,
  Sparkles,
  Search,
  Calendar,
  Download,
  Trash2,
  Loader2,
  ChevronUp,
  ChevronDown,
  Link,
  X,
} from "lucide-react";

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

export function JobsSection({
  jobs,
  setJobs,
  token,
  loading,
}: {
  jobs: JobEntry[];
  setJobs: (v: JobEntry[]) => void;
  token: string;
  loading: boolean;
}) {
  const [filter, setFilter] = useState<"all" | "high" | "today">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [botStatus, setBotStatus] = useState<
    "idle" | "running" | "scanning" | "error" | null
  >(null);
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
            if (json.data.lastScanResult)
              setScanResult(json.data.lastScanResult);
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
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ action: "scan" }),
      });
      const json = await res.json();
      if (json.success) {
        setScanResult(json.data);
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
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
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
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
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

  const todayCount = jobs.filter(
    (j) =>
      j.found_at &&
      j.found_at.startsWith(new Date().toISOString().split("T")[0])
  ).length;
  const highCount = jobs.filter((j) => j.high_priority).length;

  const handleDownload = async (dateFilter?: string) => {
    setDownloading(true);
    try {
      const body: any = { action: "download-jobs" };
      if (dateFilter) body.date = dateFilter;
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          res.headers
            .get("Content-Disposition")
            ?.match(/filename="(.+)"/)?.[1] || "jobs.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch {}
    setDownloading(false);
  };

  const handleClear = async (olderThanDays?: number) => {
    if (
      !confirm(
        olderThanDays
          ? `Delete jobs older than ${olderThanDays} days?`
          : "Delete ALL jobs?"
      )
    )
      return;
    setClearing(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ action: "clear-jobs", olderThanDays }),
      });
      const json = await res.json();
      if (json.success) {
        setJobs(json.data || []);
      }
    } catch {}
    setClearing(false);
  };

  const sourceBreakdown = jobs.reduce(
    (acc, j) => {
      acc[j.source] = (acc[j.source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const topSources = Object.entries(sourceBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxSourceCount = topSources[0]?.[1] || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl blur-xl" />
        <div className="relative">
          <h1 className="text-xl font-semibold text-white/90 tracking-tight">
            Job Scraper
          </h1>
          <p className="text-sm text-white/30 mt-1">
            Scrapes 8 platforms — control the bot, view matches, download
            results.
          </p>
        </div>
      </div>

      {/* Bot Control Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full blur-2xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div
                className={`w-3 h-3 rounded-full ${botStatus === "running" ? "bg-emerald-400" : botStatus === "scanning" ? "bg-blue-400" : botStatus === "error" ? "bg-red-400" : "bg-white/20"}`}
              />
              {(botStatus === "running" || botStatus === "scanning") && (
                <div
                  className={`absolute inset-0 w-3 h-3 rounded-full animate-ping ${botStatus === "running" ? "bg-emerald-400/50" : "bg-blue-400/50"}`}
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-white/80 font-medium">
                  {botStatus === "running"
                    ? "Auto-Scan Active"
                    : botStatus === "scanning"
                      ? "Scanning..."
                      : botStatus === "error"
                        ? "Error"
                        : "Manual Mode"}
                </p>
                {scanResult && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/30 font-mono">
                    {scanResult.matched} matched · {scanResult.new} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/25 mt-0.5">
                {botStatus === "running"
                  ? "Checks every 6 hours automatically"
                  : "Click Scan Now to fetch latest jobs"}
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
                {scanning ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                {scanning ? "Scanning..." : "Scan Now"}
              </span>
            </button>
            {botStatus === "running" ? (
              <button
                onClick={handleStop}
                disabled={stopping}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400/80 hover:bg-red-500/20 hover:border-red-500/30 transition-all disabled:opacity-40"
              >
                {stopping ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <X size={13} />
                )}
                Stop
              </button>
            ) : (
              <button
                onClick={handleStart}
                disabled={starting || botStatus === "scanning"}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400/80 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all disabled:opacity-40"
              >
                {starting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Globe size={13} />
                )}
                Auto-Scan
              </button>
            )}
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.08] transition-all"
            >
              {showLogs ? (
                <ChevronUp size={13} />
              ) : (
                <ChevronDown size={13} />
              )}
              Logs
            </button>
          </div>
        </div>
        {showLogs && scanLogs.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-black/50 border border-white/[0.04] max-h-52 overflow-y-auto scrollbar-thin">
            {scanLogs.map((line, i) => (
              <p
                key={i}
                className={`text-[11px] font-mono leading-relaxed ${line.startsWith("[ERR]") ? "text-red-400/60" : line.includes("Done") ? "text-emerald-400/50" : "text-white/25"}`}
              >
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Briefcase size={13} className="text-white/40" />
            </div>
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">
              Total
            </p>
          </div>
          <p className="text-2xl font-bold text-white/85 tracking-tight">
            {jobs.length}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-500/[0.08] bg-emerald-500/[0.03] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-400/10 flex items-center justify-center">
              <Sparkles size={13} className="text-emerald-400/60" />
            </div>
            <p className="text-[10px] text-emerald-400/40 uppercase tracking-widest font-medium">
              Priority
            </p>
          </div>
          <p className="text-2xl font-bold text-emerald-400/80 tracking-tight">
            {highCount}
          </p>
        </div>
        <div className="rounded-2xl border border-blue-500/[0.08] bg-blue-500/[0.03] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-400/10 flex items-center justify-center">
              <Calendar size={13} className="text-blue-400/60" />
            </div>
            <p className="text-[10px] text-blue-400/40 uppercase tracking-widest font-medium">
              Today
            </p>
          </div>
          <p className="text-2xl font-bold text-blue-400/80 tracking-tight">
            {todayCount}
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Globe size={13} className="text-white/40" />
            </div>
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">
              Sources
            </p>
          </div>
          <p className="text-2xl font-bold text-white/85 tracking-tight">
            {Object.keys(sourceBreakdown).length}
          </p>
        </div>
      </div>

      {/* Source Distribution */}
      {topSources.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium mb-4">
            Source Breakdown
          </p>
          <div className="space-y-2.5">
            {topSources.map(([source, count]) => (
              <div key={source} className="flex items-center gap-3">
                <span className="text-[11px] text-white/40 font-medium w-24 shrink-0 capitalize">
                  {source}
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(count / maxSourceCount) * 100}%`,
                      backgroundColor: SOURCE_COLORS[source] || "#666",
                    }}
                  />
                </div>
                <span className="text-[11px] text-white/25 font-mono w-8 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, company, keyword..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.05] transition-all"
          />
        </div>
        <div className="flex gap-1.5 bg-white/[0.02] p-1 rounded-xl border border-white/[0.04]">
          {(["all", "high", "today"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-9 px-4 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? "bg-white/[0.1] text-white/80 shadow-sm"
                  : "text-white/30 hover:text-white/50 hover:bg-white/[0.04]"
              }`}
            >
              {f === "all"
                ? `All (${jobs.length})`
                : f === "high"
                  ? `🔥 High (${highCount})`
                  : `Today (${todayCount})`}
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
          {downloading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Download size={12} />
          )}
          CSV All
        </button>
        <button
          onClick={() =>
            handleDownload(new Date().toISOString().split("T")[0])
          }
          disabled={downloading || todayCount === 0}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.08] transition-all disabled:opacity-30"
        >
          {downloading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Calendar size={12} />
          )}
          CSV Today
        </button>
        <div className="w-px h-5 bg-white/[0.06] self-center" />
        <button
          onClick={() => handleClear(7)}
          disabled={clearing || jobs.length === 0}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/30 hover:text-white/50 hover:bg-white/[0.08] transition-all disabled:opacity-30"
        >
          {clearing ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Trash2 size={12} />
          )}
          Clear Old
        </button>
        <button
          onClick={() => handleClear()}
          disabled={clearing || jobs.length === 0}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-red-500/[0.06] border border-red-500/[0.1] text-xs text-red-400/50 hover:text-red-400/70 hover:bg-red-500/[0.1] transition-all disabled:opacity-30"
        >
          {clearing ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Trash2 size={12} />
          )}
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
              {jobs.length === 0
                ? "Click Scan Now to fetch jobs from all platforms"
                : "Try adjusting your filters or search query"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="text-[11px] text-white/20 px-1">
            Showing {filtered.length} of {jobs.length} jobs
          </p>
          {filtered.map((job, i) => {
            const srcColor = SOURCE_COLORS[job.source] || "#666";
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
                  onClick={() =>
                    setExpanded(expanded === i ? null : i)
                  }
                >
                  <div
                    className={`w-1 h-8 rounded-full shrink-0 transition-all ${job.high_priority ? "bg-gradient-to-b from-emerald-400 to-emerald-600" : "bg-white/[0.06]"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white/75 font-medium truncate group-hover:text-white/90 transition-colors">
                        {job.title}
                      </p>
                      {job.high_priority && (
                        <span className="text-[10px]">🔥</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-white/35">
                        {job.company || "Unknown"}
                      </span>
                      <span className="text-white/10">·</span>
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${srcColor}15`,
                          color: `${srcColor}99`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: srcColor }}
                        />
                        {job.source}
                      </span>
                      {job.salary && (
                        <span className="text-[10px] text-emerald-400/50 font-medium">
                          💰 {job.salary}
                        </span>
                      )}
                      {job.location && job.location !== "Remote" && (
                        <span className="text-[10px] text-white/20">
                          📍 {job.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-center">
                      <p className="text-sm font-bold text-white/60 font-mono leading-none">
                        {job.score}
                      </p>
                      <p className="text-[8px] text-white/20 uppercase tracking-wider mt-0.5">
                        score
                      </p>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        expanded === i
                          ? "bg-white/[0.08]"
                          : "bg-white/[0.03] group-hover:bg-white/[0.06]"
                      }`}
                    >
                      {expanded === i ? (
                        <ChevronUp
                          size={13}
                          className="text-white/30"
                        />
                      ) : (
                        <ChevronDown
                          size={13}
                          className="text-white/20"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {expanded === i && (
                  <div className="px-4 pb-4 space-y-3 border-t border-white/[0.04] pt-3.5">
                    {(job.keywords_matched || []).length > 0 && (
                      <div>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest font-medium mb-1.5">
                          Matched Keywords
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(job.keywords_matched || []).map((kw) => (
                            <span
                              key={kw}
                              className="text-[10px] font-medium bg-emerald-400/[0.08] text-emerald-400/60 px-2 py-0.5 rounded-full border border-emerald-400/[0.08]"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(job.tags || []).filter(Boolean).length > 0 && (
                      <div>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest font-medium mb-1.5">
                          Tags
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(job.tags || [])
                            .filter(Boolean)
                            .map((tag: string) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium bg-white/[0.04] text-white/35 px-2 py-0.5 rounded-full border border-white/[0.05]"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {job.description && (
                      <div>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest font-medium mb-1.5">
                          Description
                        </p>
                        <p className="text-[12px] text-white/30 leading-relaxed line-clamp-4 bg-white/[0.02] rounded-xl p-3 border border-white/[0.03]">
                          {job.description}
                        </p>
                      </div>
                    )}

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
                        {job.found_at
                          ? new Date(job.found_at).toLocaleDateString()
                          : ""}
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
