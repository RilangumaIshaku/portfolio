import { NextRequest, NextResponse } from "next/server";
import { spawn, ChildProcess } from "child_process";
import path from "path";
import fs from "fs";

// ── Bot state ───────────────────────────────────────────────
let botProcess: ChildProcess | null = null;
let botStatus: "idle" | "running" | "scanning" | "error" = "idle";
let lastScanAt: string | null = null;
let lastScanResult: { matched: number; new: number; sources: string[] } | null = null;
let scanLogs: string[] = [];

const BOT_DIR = path.join(process.cwd(), "scripts", "job-bot");
const JOBS_PATH = path.join(process.cwd(), "data", "jobs.json");
const PYTHON = process.platform === "win32" ? "python" : "python3";

// ── Token verification ──────────────────────────────────────
function verifyToken(request: NextRequest): boolean {
  const token = request.headers.get("x-admin-token");
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const password = decoded.split(":")[0];
    const adminPassword = process.env.ADMIN_PASSWORD || "Rilanguma18";
    return password === adminPassword;
  } catch {
    return false;
  }
}

// ── Run a single scan (synchronous, returns when done) ──────
function runScan(): Promise<{ matched: number; new: number; sources: string[]; logs: string[] }> {
  return new Promise((resolve, reject) => {
    botStatus = "scanning";
    scanLogs = [];

    const child = spawn(PYTHON, ["main.py"], {
      cwd: BOT_DIR,
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.stdout?.on("data", (data: Buffer) => {
      const line = data.toString().trim();
      scanLogs.push(line);
      console.log(`[job-bot] ${line}`);
    });

    child.stderr?.on("data", (data: Buffer) => {
      const line = data.toString().trim();
      scanLogs.push(`[ERR] ${line}`);
      console.error(`[job-bot] ${line}`);
    });

    child.on("close", (code) => {
      lastScanAt = new Date().toISOString();

      // Parse summary from logs
      let matched = 0;
      let newCount = 0;
      let sources: string[] = [];
      for (const line of scanLogs) {
        const totalMatch = line.match(/TOTAL:\s*(\d+)\s*matched/);
        if (totalMatch) matched = parseInt(totalMatch[1]);
        const newMatch = line.match(/(\d+)\s*are new/);
        if (newMatch) newCount = parseInt(newMatch[1]);
        if (line.startsWith("Fetching jobs from:")) {
          sources = line.replace("Fetching jobs from:", "").split(",").map((s) => s.trim());
        }
      }

      lastScanResult = { matched, new: newCount, sources };
      botStatus = code === 0 ? "idle" : "error";
      resolve({ matched, new: newCount, sources, logs: scanLogs });
    });

    child.on("error", (err) => {
      botStatus = "error";
      scanLogs.push(`[FATAL] ${err.message}`);
      reject(err);
    });
  });
}

// ── Start the scheduler (background loop) ────────────────────
function startScheduler() {
  if (botProcess) {
    return { success: false, message: "Scheduler already running" };
  }

  botProcess = spawn(PYTHON, ["scheduler.py"], {
    cwd: BOT_DIR,
    env: { ...process.env },
    stdio: ["pipe", "pipe", "pipe"],
  });

  botStatus = "running";

  botProcess.stdout?.on("data", (data: Buffer) => {
    const line = data.toString().trim();
    console.log(`[job-bot-scheduler] ${line}`);
  });

  botProcess.stderr?.on("data", (data: Buffer) => {
    console.error(`[job-bot-scheduler] ${data.toString().trim()}`);
  });

  botProcess.on("close", () => {
    botProcess = null;
    botStatus = "idle";
  });

  botProcess.on("error", () => {
    botProcess = null;
    botStatus = "error";
  });

  return { success: true, message: "Scheduler started" };
}

// ── Stop the scheduler ───────────────────────────────────────
function stopScheduler() {
  if (!botProcess) {
    return { success: false, message: "No scheduler running" };
  }
  botProcess.kill("SIGTERM");
  botProcess = null;
  botStatus = "idle";
  return { success: true, message: "Scheduler stopped" };
}

// ── GET /api/jobs ───────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    if (!verifyToken(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    // Get bot status
    if (action === "status") {
      return NextResponse.json({
        success: true,
        data: {
          status: botStatus,
          lastScanAt,
          lastScanResult,
          logs: scanLogs.slice(-50),
        },
      });
    }

    // Get jobs data
    try {
      if (fs.existsSync(JOBS_PATH)) {
        const data = JSON.parse(fs.readFileSync(JOBS_PATH, "utf-8"));
        return NextResponse.json({ success: true, data });
      }
    } catch {}

    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/jobs ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    if (!verifyToken(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    // Run a single scan
    if (action === "scan") {
      if (botStatus === "scanning") {
        return NextResponse.json({ success: false, error: "Scan already in progress" }, { status: 409 });
      }
      try {
        const result = await runScan();
        return NextResponse.json({ success: true, data: result });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
      }
    }

    // Start the scheduler (continuous mode)
    if (action === "start") {
      const result = startScheduler();
      return NextResponse.json(result);
    }

    // Stop the scheduler
    if (action === "stop") {
      const result = stopScheduler();
      return NextResponse.json(result);
    }

    // Get status
    if (action === "status") {
      return NextResponse.json({
        success: true,
        data: {
          status: botStatus,
          lastScanAt,
          lastScanResult,
          logs: scanLogs.slice(-50),
        },
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
