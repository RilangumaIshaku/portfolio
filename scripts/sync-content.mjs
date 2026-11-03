#!/usr/bin/env node
/**
 * Push the repo's data/*.json into the live Upstash/Vercel KV store.
 *
 * Why this exists: the deployed site reads content from KV first, and KV keeps
 * whatever it held when it was seeded. Committing new JSON and redeploying does
 * NOT overwrite it — the admin panel writes are the only thing that normally
 * updates it. This script makes "deploy the repo content" a single command.
 *
 *   node scripts/sync-content.mjs --dry-run   # show what would be written
 *   node scripts/sync-content.mjs             # actually write
 *
 * Credentials are read from the environment, or from .env.local when it exists.
 */
import { readFileSync, existsSync } from "fs";
import path from "path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const KEY_PREFIX = "portfolio:";

const SECTIONS = [
  "services",
  "faq",
  "projects",
  "testimonials",
  "process",
  "advantages",
];

/** Minimal .env.local reader so plain `node` sees the same values Next.js does. */
function loadEnvLocal() {
  const file = path.join(ROOT, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf-8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

const dryRun = process.argv.includes("--dry-run");

loadEnvLocal();

const url =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  "";
const token =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  "";

if (!url || !token) {
  console.error(
    "No KV credentials found. Set KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)\n" +
      "in .env.local, or in your shell before running this script."
  );
  process.exit(1);
}

/** Upstash REST: POST / with ["SET", key, value] as the body. */
async function kvSet(key, value) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(["SET", key, value]),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
  }
  return res.json();
}

let failed = 0;

for (const section of SECTIONS) {
  const file = path.join(DATA_DIR, `${section}.json`);
  if (!existsSync(file)) {
    console.log(`- ${section}: no data/${section}.json, skipped`);
    continue;
  }

  const payload = JSON.parse(readFileSync(file, "utf-8"));
  const key = `${KEY_PREFIX}${section}`;
  const summary = Array.isArray(payload)
    ? `${payload.length} item(s)`
    : typeof payload;

  if (dryRun) {
    console.log(`~ ${key} ← data/${section}.json (${summary}) [dry run]`);
    continue;
  }

  try {
    await kvSet(key, JSON.stringify(payload));
    console.log(`✓ ${key} ← data/${section}.json (${summary})`);
  } catch (error) {
    failed += 1;
    console.error(`✗ ${key}: ${error.message}`);
  }
}

if (dryRun) {
  console.log("\nDry run only — re-run without --dry-run to write to KV.");
} else if (failed > 0) {
  console.error(`\n${failed} section(s) failed to sync.`);
  process.exit(1);
} else {
  console.log("\nDone. Reload the live site (it revalidates within 60s).");
}
