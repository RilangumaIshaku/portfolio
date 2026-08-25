"use client";

import { useState, useEffect, useCallback } from "react";

interface ContentData {
  services: any[];
  faq: any[];
  projects: any[];
  testimonials: any[];
  pricing: any[];
  process: any[];
  advantages: any[];
}

const defaultData: ContentData = {
  services: [],
  faq: [],
  projects: [],
  testimonials: [],
  pricing: [],
  process: [],
  advantages: [],
};

// In-memory cache to avoid re-fetching on every mount
let cachedData: ContentData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30_000; // 30 seconds

export function useContentData() {
  const [data, setData] = useState<ContentData>(cachedData || defaultData);
  const [loading, setLoading] = useState(!cachedData);

  const fetchData = useCallback(async () => {
    // Use cache if still fresh
    if (cachedData && Date.now() - cacheTimestamp < CACHE_TTL) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const result = await res.json();
        const newData: ContentData = {
          services: result.services || [],
          faq: result.faq || [],
          projects: result.projects || [],
          testimonials: result.testimonials || [],
          pricing: result.pricing || [],
          process: result.process || [],
          advantages: result.advantages || [],
        };
        cachedData = newData;
        cacheTimestamp = Date.now();
        setData(newData);
      }
    } catch (err) {
      console.error("Failed to fetch content data:", err);
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading };
}
