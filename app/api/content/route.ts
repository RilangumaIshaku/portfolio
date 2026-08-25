import { NextResponse } from "next/server";
import { readAllSections } from "@/lib/data-store";

// Cache for 60 seconds to reduce reads
let cache: { data: Record<string, unknown[]>; ts: number } | null = null;
const CACHE_TTL = 60_000;

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  const data = await readAllSections();

  cache = { data, ts: now };
  return NextResponse.json(data);
}
