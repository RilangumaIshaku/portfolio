"use client";

import { useState } from "react";
import { useInView } from "@/lib/useInView";
import { useContentData } from "@/lib/useContentData";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Plus, Minus } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isInView } = useInView();
  const { data } = useContentData();
  const faqs = data.faq;

  if (faqs.length === 0) return null;

  return (
    <section className="section-spacing bg-surface">
      <div className="section-container section-padding">
        <SectionHeading
          label="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know before we start working together."
        />

        <div ref={ref} className="max-w-2xl mx-auto">
          {faqs.map((faq: any, i: number) => (
            <div
              key={i}
              className={cn(
                "border-b border-border transition-all duration-500",
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between w-full py-4 text-left gap-4 group"
                aria-expanded={openIndex === i}
              >
                <span className="text-body font-medium text-primary group-hover:text-primary/80 transition-colors">
                  {faq.question}
                </span>
                <span className="shrink-0 transition-colors duration-300" style={{ color: openIndex === i ? 'rgba(111, 134, 199, 0.5)' : 'rgba(120, 113, 108, 0.5)' }}>
                  {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === i ? "max-h-48 pb-4" : "max-h-0"
                )}
              >
                <p className="text-body-sm leading-[var(--leading-body)] text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
