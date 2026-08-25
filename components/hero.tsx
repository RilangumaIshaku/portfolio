"use client";

import { ArrowRight } from "lucide-react";
import { PortfolioShowcase } from "@/components/portfolio-showcase";

interface HeroContent {
  headline: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryTarget: string;
  ctaSecondaryTarget: string;
}

interface AvailabilityData {
  isAvailable: boolean;
  status: string;
  color: "green" | "yellow" | "red";
}

const COLOR_MAP = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
} as const;

export function Hero({ availability, hero }: { availability: AvailabilityData; hero: HeroContent }) {
  const scrollToTarget = (target: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Base background */}
      <div className="absolute inset-0 bg-surface" />
      {/* Atmospheric lavender/lilac glow behind hero content */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full blur-[140px]" style={{ background: 'radial-gradient(ellipse at center, rgba(155, 143, 188, 0.18) 0%, rgba(113, 135, 196, 0.08) 40%, transparent 70%)' }} />
      {/* Warm ivory pool in the center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(205, 181, 135, 0.14) 0%, rgba(196, 166, 107, 0.06) 50%, transparent 75%)' }} />
      {/* Soft blue accent at the top */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(113, 135, 196, 0.10) 0%, transparent 70%)' }} />
      {/* Edge fade to white on outer edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/40 pointer-events-none" />

      <div className="relative section-container section-padding pt-24 pb-14 md:pt-32 md:pb-24">
        {/* Badge — dynamically loaded from availability.json */}
        {availability.isAvailable && (
          <div className="mb-6 flex justify-center animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: COLOR_MAP[availability.color] }}
              />
              {availability.status}
            </span>
          </div>
        )}

        {/* Headline */}
        <h1 className="text-center text-display-xl max-w-4xl mx-auto animate-slide-up">
          {hero.headline.split('premium').map((part, i, arr) => (
            i < arr.length - 1 ? (
              <span key={i}>{part}<span className="relative inline-block"><span className="relative z-10" style={{ color: 'var(--accent-lilac)' }}>premium</span><span className="absolute bottom-1 left-0 right-0 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent-lilac), var(--accent-blue))', opacity: 0.35 }} /></span></span>
            ) : part
          ))}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-center text-body md:text-body text-muted-foreground max-w-xl mx-auto leading-[var(--leading-body)] animate-slide-up-delayed">
          {hero.subtitle}
        </p>

        {/* CTAs — compact, minimal buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 animate-slide-up-delayed">
          <button
            onClick={scrollToTarget(hero.ctaPrimaryTarget)}
            className="inline-flex items-center gap-1.5 h-[34px] px-5 rounded-full bg-[#0a0a0b] text-white text-[12px] font-medium tracking-wide hover:bg-[#1a1a1c] transition-all duration-300 active:scale-[0.98]"
          >
            {hero.ctaPrimary}
            <ArrowRight size={13} className="transition-transform duration-300 hover:translate-x-0.5" />
          </button>
          <button
            onClick={scrollToTarget(hero.ctaSecondaryTarget)}
            className="inline-flex items-center gap-1.5 h-[34px] px-5 rounded-full bg-transparent text-primary text-[12px] font-medium tracking-wide hover:bg-muted/60 transition-all duration-300 active:scale-[0.98]"
          >
            {hero.ctaSecondary}
          </button>
        </div>

        {/* Portfolio Showcase — clean video/image display */}
        <div className="mt-12 md:mt-16 animate-fade-in">
          <PortfolioShowcase />
        </div>
      </div>
    </section>
  );
}
