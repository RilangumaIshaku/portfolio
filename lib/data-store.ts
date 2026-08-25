/**
 * Data Store Abstraction
 *
 * Priority for WRITES:
 *   1. GitHub API  (GITHUB_TOKEN + GITHUB_REPO set) → commits JSON to your repo → Vercel auto-redeploys
 *   2. Upstash Redis (UPSTASH_REDIS_REST_URL set)   → writes to KV store
 *   3. Filesystem                                    → local dev only
 *
 * Priority for READS:
 *   1. In-memory cache (populated on every write — gives instant feedback in admin UI)
 *   2. Upstash Redis (if configured)
 *   3. Filesystem (the JSON files bundled at build time)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

// ── In-memory cache (reflects writes immediately within a warm serverless instance) ──
const memStore: Record<string, unknown> = {};

// ── Redis client (lazy-initialized) ────────────────────────
let redisClient: any = null;

function getRedis() {
  if (redisClient) return redisClient;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    redisClient = new Redis({ url, token });
    return redisClient;
  } catch (err) {
    console.error("Failed to initialize Redis client:", err);
    return null;
  }
}

export const USE_KV = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
export const USE_GITHUB = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);

// ── KV key prefix ──────────────────────────────────────────
const KEY_PREFIX = "portfolio:";

// ── Local file paths ───────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data");

const SECTION_FILES: Record<string, string> = {
  services:     path.join(DATA_DIR, "services.json"),
  faq:          path.join(DATA_DIR, "faq.json"),
  projects:     path.join(DATA_DIR, "projects.json"),
  testimonials: path.join(DATA_DIR, "testimonials.json"),
  pricing:      path.join(DATA_DIR, "pricing.json"),
  process:      path.join(DATA_DIR, "process.json"),
  advantages:   path.join(DATA_DIR, "advantages.json"),
  jobs:         path.join(DATA_DIR, "jobs.json"),
};

const AVAILABILITY_PATH = path.join(DATA_DIR, "availability.json");
const CONTENT_PATH      = path.join(DATA_DIR, "site-content.json");

// ── GitHub repo file paths (relative to repo root) ─────────
const GITHUB_FILE_PATHS: Record<string, string> = {
  services:     "data/services.json",
  faq:          "data/faq.json",
  projects:     "data/projects.json",
  testimonials: "data/testimonials.json",
  pricing:      "data/pricing.json",
  process:      "data/process.json",
  advantages:   "data/advantages.json",
  jobs:         "data/jobs.json",
  availability: "data/availability.json",
  content:      "data/site-content.json",
};

export const SECTION_KEYS = Object.keys(SECTION_FILES);

// ── Filesystem helpers ─────────────────────────────────────
function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function readFsJson<T>(filePath: string, fallback: T): T {
  try {
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeFsJson(filePath: string, data: unknown) {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ── KV helpers ─────────────────────────────────────────────
async function kvGet<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const raw = await redis.get(`${KEY_PREFIX}${key}`);
    if (raw === null || raw === undefined) return null;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

async function kvSet(key: string, value: unknown): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(`${KEY_PREFIX}${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`KV set failed for ${key}:`, err);
  }
}

// ── GitHub API write ───────────────────────────────────────
async function githubWriteFile(
  section: string,
  data: unknown
): Promise<{ ok: boolean; reason?: string }> {
  const token  = process.env.GITHUB_TOKEN;
  const repo   = process.env.GITHUB_REPO; // e.g. "RilangumaIshaku/portfolio"
  const branch = process.env.GITHUB_BRANCH || "main";
  const filePath = GITHUB_FILE_PATHS[section];

  if (!token || !repo) {
    return { ok: false, reason: "GITHUB_TOKEN or GITHUB_REPO not set" };
  }

  // Non-file sections (bot_status, bot_enabled) — memStore only, no commit needed
  if (!filePath) return { ok: true };

  const contentBase64 = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const headers: Record<string, string> = {
    Authorization:        `Bearer ${token}`,
    Accept:               "application/vnd.github+json",
    "Content-Type":       "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Fetch current SHA (required by GitHub to update an existing file)
  let sha: string | undefined;
  try {
    const getRes = await fetch(`${apiUrl}?ref=${branch}`, { headers });
    if (getRes.ok) {
      const fileData: any = await getRes.json();
      sha = fileData.sha;
    }
  } catch { /* file may not exist yet */ }

  // Commit the updated file
  const body: Record<string, unknown> = {
    message: `admin: update ${filePath}`,
    content: contentBase64,
    branch,
  };
  if (sha) body.sha = sha;

  try {
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!putRes.ok) {
      const err: any = await putRes.json();
      console.error("GitHub API write error:", err);
      return { ok: false, reason: `GitHub API error: ${err.message}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: `GitHub request failed: ${String(err)}` };
  }
}

function resolveFilePath(section: string): string | null {
  if (section === "availability") return AVAILABILITY_PATH;
  if (section === "content")      return CONTENT_PATH;
  return SECTION_FILES[section] || null;
}

// ══════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════

/**
 * Read data for a section.
 * 1 → in-memory cache  2 → Redis  3 → bundled filesystem JSON
 */
export async function readData<T>(section: string, fallback: T): Promise<T> {
  // 1. In-memory (reflects writes made in this warm instance)
  if (memStore[section] !== undefined) {
    return memStore[section] as T;
  }

  // 2. Redis / KV
  if (USE_KV) {
    const kvData = await kvGet<T>(section);
    if (kvData !== null) return kvData;

    // seed KV from bundled file on first read
    const filePath = resolveFilePath(section);
    if (filePath) {
      const fsData = readFsJson<T>(filePath, fallback);
      if (fsData !== fallback) {
        await kvSet(section, fsData);
        return fsData;
      }
    }
    return fallback;
  }

  // 3. Filesystem
  const filePath = resolveFilePath(section);
  if (filePath) return readFsJson<T>(filePath, fallback);
  return fallback;
}

/**
 * Write data for a section.
 * Always updates memStore first so the admin UI sees changes immediately.
 * 1 → GitHub API  2 → Redis  3 → filesystem (local dev)
 */
export async function writeData<T>(
  section: string,
  data: T
): Promise<{ ok: boolean; reason?: string }> {
  // Always cache in memory for immediate read-back
  memStore[section] = data;

  // 1. GitHub (commits to repo → Vercel auto-redeploys ~60s later)
  if (USE_GITHUB) {
    return await githubWriteFile(section, data);
  }

  // 2. Redis / KV
  if (USE_KV) {
    try {
      await kvSet(section, data);
      return { ok: true };
    } catch (err) {
      console.error(`KV write failed for ${section}:`, err);
      return { ok: false, reason: "Redis write failed" };
    }
  }

  // 3. Local filesystem (dev only)
  const filePath = resolveFilePath(section);
  if (filePath) {
    try {
      writeFsJson(filePath, data);
      return { ok: true };
    } catch {
      return { ok: false, reason: "Filesystem write failed" };
    }
  }

  return {
    ok: false,
    reason:
      "No storage configured. Add GITHUB_TOKEN + GITHUB_REPO to your Vercel environment variables.",
  };
}

/**
 * Read all section data at once (for the /api/content endpoint).
 */
export async function readAllSections(): Promise<Record<string, unknown[]>> {
  const data: Record<string, unknown[]> = {};
  for (const key of Object.keys(SECTION_FILES)) {
    data[key] = await readData<unknown[]>(key, []);
  }
  return data;
}
