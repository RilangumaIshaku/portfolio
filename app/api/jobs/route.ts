import { NextRequest, NextResponse } from "next/server";
import { readData } from "@/lib/data-store";

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

// ── GET /api/jobs ───────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    if (!verifyToken(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
