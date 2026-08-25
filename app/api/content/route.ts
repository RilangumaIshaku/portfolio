import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

const SECTION_FILES: Record<string, string> = {
  services: path.join(DATA_DIR, "services.json"),
  faq: path.join(DATA_DIR, "faq.json"),
  projects: path.join(DATA_DIR, "projects.json"),
  testimonials: path.join(DATA_DIR, "testimonials.json"),
  pricing: path.join(DATA_DIR, "pricing.json"),
  process: path.join(DATA_DIR, "process.json"),
  advantages: path.join(DATA_DIR, "advantages.json"),
};

function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

// Cache for 60 seconds to reduce disk reads
let cache: { data: Record<string, unknown[]>; ts: number } | null = null;
const CACHE_TTL = 60_000;

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  const data: Record<string, unknown[]> = {};
  for (const [key, filePath] of Object.entries(SECTION_FILES)) {
    data[key] = readJson<unknown[]>(filePath, []);
  }

  cache = { data, ts: now };
  return NextResponse.json(data);
}
