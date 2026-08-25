import { NextResponse } from "next/server";

/**
 * Diagnostic endpoint — shows which storage backend is active on the server.
 * Safe to expose: shows only boolean/prefix values, never actual secrets.
 */
export async function GET() {
  const kvUrl       = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken     = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo  = process.env.GITHUB_REPO;

  let activeStorage = "❌ NONE — saves will fail (Vercel read-only filesystem)";
  if (githubToken && githubRepo) {
    activeStorage = `✅ GitHub API → ${githubRepo}`;
  } else if (kvUrl && kvToken) {
    activeStorage = `✅ Redis/KV → ${kvUrl.substring(0, 40)}...`;
  }

  return NextResponse.json({
    activeStorage,
    env: {
      GITHUB_TOKEN:           githubToken ? `✅ set (starts with ${githubToken.substring(0, 8)}...)` : "❌ NOT SET",
      GITHUB_REPO:            githubRepo  ? `✅ ${githubRepo}` : "❌ NOT SET",
      KV_REST_API_URL:        process.env.KV_REST_API_URL        ? "✅ set" : "❌ NOT SET",
      KV_REST_API_TOKEN:      process.env.KV_REST_API_TOKEN      ? "✅ set" : "❌ NOT SET",
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? "✅ set" : "❌ NOT SET",
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? "✅ set" : "❌ NOT SET",
      ADMIN_PASSWORD:         process.env.ADMIN_PASSWORD          ? "✅ set" : "❌ NOT SET",
    },
  });
}
