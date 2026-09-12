"use client";

import { useInView } from "@/lib/useInView";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  useVisitorMarket,
  type VisitorMarket,
} from "@/lib/visitor-market";
import {
  getPricingTiers,
  getPricingAnchor,
  type PricingTier,
} from "@/lib/pricing";
import { Check, ArrowUpRight } from "lucide-react";

export function Pricing() {
  const { ref, isInView } = useInView();
  const market: VisitorMarket = useVisitorMarket();
  const pricingTiers = getPricingTiers(market);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="section-spacing bg-muted/30">
      <div className="section-container section-padding">
        <SectionHeading
          label="Investment &amp; Scoping"
          title={getPricingAnchor(market)}
          description="Every project is scoped individually based on your goals, requirements and complexity."
        />

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto"
        >
          {pricingTiers.map((tier: PricingTier, i: number) => (
            <div
              key={tier.name}
              className={cn(
                "relative rounded-2xl border p-5 md:p-6 flex flex-col transition-all duration-500",
                tier.highlighted
                  ? "border-accent/30 bg-surface shadow-lg shadow-accent/[0.04] md:-mt-3 md:mb-3"
                  : "border-border bg-surface hover:border-border/80",
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {tier.highlighted && (
                <div className="btn-dark absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0a0a0b] text-white text-caption font-medium">
                  Recommended Scope
                </div>
              )}
              {/* Subtle top accent line for highlighted tier */}
              {tier.highlighted && (
                <div className="absolute top-0 left-6 right-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(111, 134, 199, 0.2), transparent)' }} />
              )}

              <div className="mb-4">
                <h3 className="text-display-sm font-medium mb-1">{tier.name}</h3>
                <p className="text-body-sm text-muted-foreground">{tier.description}</p>
              </div>

              <div className="mb-4">
                {tier.custom ? (
                  <span className="text-display-sm font-semibold">
                    Let&apos;s discuss your requirements.
                  </span>
                ) : (
                  <span className="text-display-sm font-semibold">
                    <span className="text-muted-foreground text-body-sm font-normal">
                      From{" "}
                    </span>
                    {tier.price}
                  </span>
                )}
              </div>

              <ul className="flex-1 space-y-2.5 mb-5">
                {tier.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-3 text-body-sm">
                    <Check
                      size={16}
                      className={cn(
                        "mt-0.5 shrink-0",
                        tier.highlighted ? "text-accent-blue/70" : "text-muted-foreground/50"
                      )}
                    />
                    <span className="text-muted-foreground leading-[var(--leading-body)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.highlighted ? "primary" : "secondary"}
                className="w-full text-xs font-medium"
                onClick={scrollToContact}
              >
                Request a project estimate
              </Button>
            </div>
          ))}
        </div>

        {/* Tailored scoping discussion link */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
            onClick={scrollToContact}
            className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Have unique requirements? Request a custom project estimate
            <ArrowUpRight size={14} className="transition-transform hover:translate-x-0.5" />
          </a>

          {/* Small, subtle disclaimer */}
          <p className="mt-4 text-caption text-muted-foreground/50">
            Final pricing varies based on project scope, requirements and market.
          </p>
        </div>
      </div>
    </section>
  );
}
