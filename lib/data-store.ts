/**
 * Data Store Abstraction
 *
 * - On Vercel (UPSTASH_REDIS_REST_URL is set): Uses Upstash Redis for reads/writes
 * - Locally (no Redis): Falls back to filesystem reads/writes
 *
 * On first KV read, seeds from the bundled JSON files so existing data is preserved.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

// ── Redis client (lazy-initialized) ────────────────────────
let redisClient: any = null;

function getRedis() {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  // Dynamic import to avoid build errors when env vars are missing
  try {
    const { Redis } = require("@upstash/redis");
    redisClient = new Redis({ url, token });
    return redisClient;
  } catch {
    return null;
  }
}

const USE_KV = !!process.env.UPSTASH_REDIS_REST_URL;

// ── KV key prefix ──────────────────────────────────────────
const KEY_PREFIX = "portfolio:";

// ── File paths (same as before) ────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data");

const SECTION_FILES: Record<string, string> = {
  services: path.join(DATA_DIR, "services.json"),
  faq: path.join(DATA_DIR, "faq.json"),
  projects: path.join(DATA_DIR, "projects.json"),
  testimonials: path.join(DATA_DIR, "testimonials.json"),
  pricing: path.join(DATA_DIR, "pricing.json"),
  process: path.join(DATA_DIR, "process.json"),
  advantages: path.join(DATA_DIR, "advantages.json"),
  jobs: path.join(DATA_DIR, "jobs.json"),
};

const AVAILABILITY_PATH = path.join(DATA_DIR, "availability.json");
const CONTENT_PATH = path.join(DATA_DIR, "site-content.json");

// ── Section names ──────────────────────────────────────────
export const SECTION_KEYS = Object.keys(SECTION_FILES);

// ── Filesystem helpers (local dev fallback) ────────────────
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

// ── Unified read ───────────────────────────────────────────
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

function resolveFilePath(section: string): string | null {
  if (section === "availability") return AVAILABILITY_PATH;
  if (section === "content") return CONTENT_PATH;
  return SECTION_FILES[section] || null;
}

// ══════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════

/**
 * Read data for a section.
 * On Vercel: tries KV first, falls back to fs-bundled file, seeds KV if empty.
 * Locally: reads from fs directly.
 */
export async function readData<T>(section: string, fallback: T): Promise<T> {
  const filePath = resolveFilePath(section);

  if (USE_KV) {
    // Try KV first
    const kvData = await kvGet<T>(section);
    if (kvData !== null) return kvData;

    // KV empty → seed from bundled file
    if (filePath) {
      const fsData = readFsJson<T>(filePath, fallback);
      if (fsData !== fallback) {
        await kvSet(section, fsData);
        return fsData;
      }
    }
    return fallback;
  }

  // Local dev: read from filesystem
  if (filePath) {
    return readFsJson<T>(filePath, fallback);
  }
  return fallback;
}

/**
 * Write data for a section.
 * On Vercel: writes to KV (and tries fs too, which will silently fail — that's OK).
 * Locally: writes to fs.
 */
export async function writeData<T>(section: string, data: T): Promise<void> {
  const filePath = resolveFilePath(section);

  if (USE_KV) {
    await kvSet(section, data);
  }

  // Always try fs too (works locally, silently fails on Vercel — fine)
  if (filePath) {
    try {
      writeFsJson(filePath, data);
    } catch {
      // Expected to fail on Vercel's read-only filesystem
    }
  }
}

/**
 * Read all section data at once (for the content API).
 */
export async function readAllSections(): Promise<Record<string, unknown[]>> {
  const data: Record<string, unknown[]> = {};
  for (const key of Object.keys(SECTION_FILES)) {
    data[key] = await readData<unknown[]>(key, []);
  }
  return data;
}
