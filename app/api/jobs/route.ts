import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data-store";
import { verifyToken } from "@/lib/auth";

// ── GET /api/jobs ───────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    if (!verifyToken(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "status") {
      const botStatus = await readData<any>("bot_status", { status: "idle", logs: [], lastScanResult: null });
      const isEnabled = await readData<boolean>("bot_enabled", false);
      // If the bot is supposed to be running (enabled) but status is idle, we show it as "running" (background mode)
      if (isEnabled && botStatus.status === "idle") {
        botStatus.status = "running";
      } else if (!isEnabled && botStatus.status === "running") {
        botStatus.status = "idle";
      }
      return NextResponse.json({ success: true, data: botStatus });
    }

    const jobs = await readData<any[]>("jobs", []);
    return NextResponse.json({ success: true, data: jobs });
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

    // Get jobs data
    if (action === "get") {
      const jobs = await readData<any[]>("jobs", []);
      return NextResponse.json({ success: true, data: jobs });
    }

    if (action === "start") {
      await writeData("bot_enabled", true);
      return NextResponse.json({ success: true });
    }

    if (action === "stop") {
      await writeData("bot_enabled", false);
      return NextResponse.json({ success: true });
    }

    if (action === "scan") {
      // In a Vercel environment, we can't spawn long-running Python scripts.
      // We instruct the user to trigger the Github Action instead.
      const status = await readData<any>("bot_status", { status: "idle", logs: [] });
      status.logs.push("Scan triggered via UI. (Note: On Vercel, this requires GitHub Actions Webhook integration to actually run).");
      await writeData("bot_status", status);
      return NextResponse.json({ success: true, data: status });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
