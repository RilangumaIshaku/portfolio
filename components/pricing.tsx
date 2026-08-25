"use client";

import { useInView } from "@/lib/useInView";
import { useContentData } from "@/lib/useContentData";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/useCurrency";
import { Check, ArrowUpRight } from "lucide-react";

export function Pricing({ initialData }: { initialData?: any[] } = {}) {
  const { ref, isInView } = useInView();
  const { formatPrice } = useCurrency();
  const { data } = useContentData();
  const pricingTiers = initialData && initialData.length > 0 ? initialData : data.pricing;

  if (pricingTiers.length === 0) return null;

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-spacing bg-muted/30">
      <div className="section-container section-padding">
        <SectionHeading
          label="Pricing"
          title="Transparent, fair pricing"
          description="Every project is different, but these starting tiers give you a clear idea. We can always discuss what's right for your specific needs."
        />

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto"
        >
          {pricingTiers.map((tier: any, i: number) => (
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
                  Most Popular
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
                <span className="text-display-sm">
                  {tier.priceAmount > 0 ? formatPrice(tier.priceAmount) : tier.price}
                </span>
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
                className="w-full"
                onClick={scrollToContact}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        {/* Explore more pricing link */}
        <div className="mt-12 text-center">
          <a
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Explore more pricing
            <ArrowUpRight size={14} className="transition-transform hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
