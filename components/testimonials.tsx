"use client";

import { useRef, useState } from "react";
import { useContentData } from "@/lib/useContentData";
import { SectionHeading } from "@/components/ui/section-heading";

export function Testimonials({ initialData }: { initialData?: any[] } = {}) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data } = useContentData();
  const testimonials = initialData && initialData.length > 0 ? initialData : data.testimonials;

  if (testimonials.length === 0) return null;

  const items = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="relative py-14 md:py-20 bg-surface overflow-hidden">
      {/* Atmospheric lilac glow behind testimonials */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(155, 143, 188, 0.10) 0%, transparent 70%)' }} />

      <div className="relative section-container section-padding mb-8 md:mb-10">
        <SectionHeading
          label="Testimonials"
          title={
            <>
              What my{" "}
              <span className="relative inline-block">
                <span className="text-muted-foreground/50 line-through decoration-2 text-[0.85em]">clients</span>{" "}
                <span className="text-primary">Partners are Saying</span>
              </span>
            </>
          }
          description="Real feedback from people and projects I've worked with."
        />
        {/* Visible accent dot next to label */}
        <div className="flex justify-center -mt-8 mb-8 md:-mt-10 md:mb-10">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-lilac)', opacity: 0.5 }} />
        </div>
      </div>

      <div
        className="relative -mt-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 px-5 md:px-8"
          style={{
            animation: `marqueeScroll 40s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {items.map((t: any, i: number) => (
            <div
              key={`${t.name}-${i}`}
              className="shrink-0 w-[280px] md:w-[340px] rounded-xl border border-border/80 bg-surface-elevated p-5 md:p-6 flex flex-col justify-between transition-all duration-500 hover:border-accent-lilac/20 hover:shadow-[0_4px_24px_-4px_rgba(155,143,188,0.12)]"
              style={{ minHeight: "180px" }}
            >
              <p className="text-body-sm leading-[var(--leading-body)] text-primary/70">
                <span style={{ color: 'var(--accent-lilac)', fontSize: '1.4em', lineHeight: 0, opacity: 0.45 }}>&ldquo;</span>{t.quote}<span style={{ color: 'var(--accent-lilac)', fontSize: '1.4em', lineHeight: 0, opacity: 0.45 }}>&rdquo;</span>
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                  {t.image && !t.image.includes("placeholder") ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-body-sm font-medium text-muted-foreground/40">
                      {t.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-body-sm font-medium text-primary truncate">{t.name}</p>
                  <p className="text-caption text-muted-foreground truncate">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="marqueeScroll"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
