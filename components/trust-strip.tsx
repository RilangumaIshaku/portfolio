"use client";

import { useInView } from "@/lib/useInView";
import { cn } from "@/lib/utils";

/**
 * Trusted By — Premium Client Logo Strip
 *
 * Each brand has a distinct wordmark treatment within a unified monochrome system.
 * Subtle dividers, balanced spacing, refined hover interactions.
 */

const BRANDS = [
  {
    name: "Kasuwa",
    wordmark: (
      <span className="font-semibold tracking-[-0.01em] text-[15px] md:text-[17px]">
        KASUWA
      </span>
    ),
  },
  {
    name: "Liora",
    wordmark: (
      <span className="font-light tracking-[0.18em] text-[14px] md:text-[16px] uppercase">
        Liora
      </span>
    ),
  },
  {
    name: "TradingPal",
    wordmark: (
      <span className="font-medium tracking-[0.02em] text-[15px] md:text-[17px]">
        Trading<span className="font-light">Pal</span>
      </span>
    ),
  },
  {
    name: "Bloom Studio",
    wordmark: (
      <span className="text-[15px] md:text-[17px]">
        <span className="font-semibold tracking-[-0.01em]">Bloom</span>{" "}
        <span className="font-light tracking-[0.06em] uppercase text-[13px] md:text-[14px]">Studio</span>
      </span>
    ),
  },
  {
    name: "MedConnect",
    wordmark: (
      <span className="font-normal tracking-[0.03em] text-[15px] md:text-[17px]">
        Med<span className="font-semibold">Connect</span>
      </span>
    ),
  },
];

export function TrustStrip() {
  const { ref, isInView } = useInView();

  return (
    <section className="relative py-10 md:py-14 bg-surface overflow-hidden">
      <div ref={ref} className="relative section-container section-padding">
        {/* Top divider */}
        <div
          className={cn(
            "mx-auto max-w-md h-px mb-8 md:mb-10 transition-all duration-700",
            isInView
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          )}
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)",
          }}
        />

        {/* Heading */}
        <p
          className={cn(
            "text-center font-medium uppercase text-[10px] md:text-[11px] tracking-[0.2em] text-muted-foreground/35 mb-8 md:mb-10 transition-all duration-500",
            isInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          )}
        >
          Trusted by 30+ brands including
        </p>

        {/* Desktop: equal-width brand cells with dividers */}
        <div
          className={cn(
            "hidden md:block transition-all duration-700",
            isInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          <div className="flex items-stretch justify-center max-w-3xl mx-auto">
            {BRANDS.map((brand, i) => (
              <div key={brand.name} className="flex items-center">
                {/* Left divider (before first item) */}
                {i === 0 && (
                  <div className="w-px h-5 bg-black/[0.06] mr-0 shrink-0" />
                )}
                {/* Brand cell */}
                <div
                  className={cn(
                    "flex-1 flex items-center justify-center px-6 lg:px-8 py-3",
                    "text-black/30 hover:text-black/60 transition-colors duration-300",
                    "cursor-default select-none"
                  )}
                  style={{ transitionDelay: `${i * 40}ms` }}
                  aria-label={brand.name}
                  title={brand.name}
                >
                  {brand.wordmark}
                </div>
                {/* Right divider (after each item) */}
                <div className="w-px h-5 bg-black/[0.06] shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: 2-column grid */}
        <div
          className={cn(
            "md:hidden transition-all duration-700",
            isInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-xs mx-auto">
            {BRANDS.map((brand, i) => (
              <div
                key={brand.name}
                className={cn(
                  "flex items-center justify-center py-2.5",
                  "text-black/30 hover:text-black/60 transition-colors duration-300",
                  "cursor-default select-none",
                  // Last item spans full width if odd count
                  i === BRANDS.length - 1 && BRANDS.length % 2 !== 0 && "col-span-2"
                )}
                style={{ transitionDelay: `${i * 40}ms` }}
                aria-label={brand.name}
                title={brand.name}
              >
                {brand.wordmark}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom divider */}
        <div
          className={cn(
            "mx-auto max-w-md h-px mt-8 md:mt-10 transition-all duration-700 delay-100",
            isInView
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          )}
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
}
