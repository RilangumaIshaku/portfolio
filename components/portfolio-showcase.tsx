"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContentData } from "@/lib/useContentData";
import { cn } from "@/lib/utils";

const CYCLE_INTERVAL = 10000;

/**
 * Portfolio Showcase — Clean video/image display area.
 * Supports video, image fallback, and auto-cycling with smooth crossfade via framer-motion.
 */

export function PortfolioShowcase() {
  const { data } = useContentData();
  const projects = data.projects;
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cycleToNext = useCallback(() => {
    if (projects.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % projects.length);
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
        {/* The showcase — video or image with framer-motion crossfade */}
        <div className="relative aspect-video overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
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
                <div className="w-full h-full bg-neutral-900" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Subtle navigation dots — only visible when multiple projects exist */}
      {projects.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {projects.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
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
