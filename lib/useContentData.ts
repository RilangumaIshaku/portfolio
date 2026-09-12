"use client";

import { useState, useEffect, useCallback } from "react";

interface ContentData {
  services: any[];
  faq: any[];
  projects: any[];
  testimonials: any[];
  process: any[];
  advantages: any[];
}

const defaultData: ContentData = {
  services: [],
  faq: [],
  projects: [],
  testimonials: [],
  process: [],
  advantages: [],
};

// In-memory cache so all sections share one fetch and remounts are free.
let cachedData: ContentData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30_000; // 30 seconds

// In-flight request dedupe — concurrent hook mounts share a single fetch.
let inFlight: Promise<void> | null = null;

export function useContentData(initialData?: Partial<ContentData>) {
  // Hydrate from server-rendered data when provided, cache otherwise.
  const [data, setData] = useState<ContentData>(() => {
    if (initialData) {
      const merged = { ...defaultData, ...initialData };
      // Seed the shared cache so sibling sections don't refetch.
      if (!cachedData) {
        cachedData = merged;
        cacheTimestamp = Date.now();
      }
      return merged;
    }
    return cachedData || defaultData;
  });
  const [loading, setLoading] = useState(
    !initialData && !cachedData
  );

  const fetchData = useCallback(async () => {
    if (cachedData && Date.now() - cacheTimestamp < CACHE_TTL) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    // Collapse concurrent fetches into a single network request.
    if (!inFlight) {
      inFlight = (async () => {
        const res = await fetch("/api/content");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        const newData: ContentData = {
          services: result.services || [],
          faq: result.faq || [],
          projects: result.projects || [],
          testimonials: result.testimonials || [],
          process: result.process || [],
          advantages: result.advantages || [],
        };
        cachedData = newData;
        cacheTimestamp = Date.now();
      })();
    }

    try {
      await inFlight;
      if (cachedData) setData(cachedData);
    } catch (err) {
      console.error("Failed to fetch content data:", err);
      // Keep existing data on error
    } finally {
      inFlight = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Skip refetch when fresh server data was just provided.
    if (initialData && Date.now() - cacheTimestamp < CACHE_TTL) {
      setLoading(false);
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  return { data, loading };
}
