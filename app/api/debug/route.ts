import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getStorageInfo, USE_KV, USE_GITHUB } from "@/lib/data-store";

/**
 * Diagnostic endpoint — shows which storage backend is active.
 * Requires admin authentication.
 */
export async function GET(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storage = getStorageInfo();
  const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

  return NextResponse.json({
    storage,
    env: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN
        ? `✅ set (starts with ${process.env.GITHUB_TOKEN.substring(0, 8)}...)`
        : "❌ NOT SET",
      GITHUB_REPO: process.env.GITHUB_REPO
        ? `✅ ${process.env.GITHUB_REPO}`
        : "❌ NOT SET",
      KV_REST_API_URL: process.env.KV_REST_API_URL ? "✅ set" : "❌ NOT SET",
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN
        ? "✅ set"
        : "❌ NOT SET",
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL
        ? "✅ set"
        : "❌ NOT SET",
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN
        ? "✅ set"
        : "❌ NOT SET",
      BLOB_READ_WRITE_TOKEN: hasBlobToken ? "✅ set" : "❌ NOT SET",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "✅ set" : "❌ NOT SET",
    },
  });
}
