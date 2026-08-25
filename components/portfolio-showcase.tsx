"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useContentData } from "@/lib/useContentData";
import { cn } from "@/lib/utils";

const CYCLE_INTERVAL = 10000;

/**
 * Portfolio Showcase — Clean video/image display area.
 * No browser chrome. No Apple bars. Just the work.
 *
 * Supports:
 *   - Video: add "video": "/path/to/video.mp4" to projects.json
 *   - Image fallback: uses "image" field when no video is present
 *   - Auto-cycles every 10s with smooth crossfade
 */

export function PortfolioShowcase() {
  const { data } = useContentData();
  const projects = data.projects;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cycleToNext = useCallback(() => {
    if (projects.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 400);
  }, [projects.length]);

  useEffect(() => {
    if (projects.length <= 1) return;
    const interval = setInterval(cycleToNext, CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, [cycleToNext, projects.length]);

  // Play video when active project changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  if (projects.length === 0) return null;

  const activeProject = projects[activeIndex];
  const hasVideo = !!activeProject.video;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/[0.08]">
        {/* The showcase — video or image, nothing else */}
        <div
          className={cn(
            "relative aspect-video overflow-hidden transition-opacity duration-500",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}
        >
          {hasVideo ? (
            <video
              ref={videoRef}
              src={activeProject.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : activeProject.image ? (
            <img
              src={activeProject.image}
              alt={`${activeProject.title} preview`}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            /* Minimal fallback — just a clean dark surface */
            <div className="w-full h-full bg-neutral-900" />
          )}
        </div>
      </div>

      {/* Subtle navigation dots — only visible when multiple projects exist */}
      {projects.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {projects.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setActiveIndex(i);
                  setTimeout(() => setIsTransitioning(false), 50);
                }, 400);
              }}
              className={cn(
                "rounded-full transition-all duration-300",
                i === activeIndex
                  ? "h-1.5 w-5 bg-primary/50"
                  : "h-1.5 w-1.5 bg-primary/20 hover:bg-primary/35"
              )}
              aria-label={`View project ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
