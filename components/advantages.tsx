"use client";

import { useInView } from "@/lib/useInView";
import { useContentData } from "@/lib/useContentData";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Zap,
  Smartphone,
  Target,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Smartphone,
  Target,
  MessageCircle,
  Sparkles,
};

export function Advantages() {
  const { ref, isInView } = useInView();
  const { data } = useContentData();
  const advantages = data.advantages;

  if (advantages.length === 0) return null;

  return (
    <section className="section-spacing bg-surface">
      <div className="section-container section-padding">
        <SectionHeading
          label="Why Me"
          title="Why work with me"
          description="I'm not a design agency or a dev shop. I'm one person who cares about your project and delivers quality."
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {advantages.map((advantage: any, i: number) => {
            const Icon = iconMap[advantage.icon];
            return (
              <div
                key={advantage.title}
                className={cn(
                  "group rounded-2xl border border-border bg-surface-elevated p-7 transition-all duration-500 hover:border-border hover:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-0.5",
                  i === advantages.length - 1 && advantages.length % 3 === 2 && "sm:col-span-2 sm:max-w-md sm:mx-auto lg:col-span-1 lg:max-w-none lg:mx-0",
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="mb-4">
                  {Icon && (
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-primary/60 transition-colors duration-300 group-hover:text-primary"
                    />
                  )}
                </div>
                <h3 className="text-body font-medium text-primary mb-1.5 tracking-tight">
                  {advantage.title}
                </h3>
                <p className="text-body-sm leading-[var(--leading-body)] text-muted-foreground">
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
