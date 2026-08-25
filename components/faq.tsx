"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContentData } from "@/lib/useContentData";
import { SectionHeading } from "@/components/ui/section-heading";
import { Plus, Minus } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/animated-section";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

        <div className="max-w-2xl mx-auto">
          <StaggerContainer className="space-y-0" staggerDelay={0.05}>
            {faqs.map((faq: any, i: number) => (
              <StaggerItem key={i}>
                <div className="border-b border-border">
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === i ? null : i)
                    }
                    className="flex items-center justify-between w-full py-4 text-left gap-4 group"
                    aria-expanded={openIndex === i}
                  >
                    <span className="text-body font-medium text-primary group-hover:text-primary/80 transition-colors">
                      {faq.question}
                    </span>
                    <motion.span
                      className="shrink-0"
                      style={{
                        color:
                          openIndex === i
                            ? "rgba(111, 134, 199, 0.5)"
                            : "rgba(120, 113, 108, 0.5)",
                      }}
                      animate={{ rotate: openIndex === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {openIndex === i ? (
                        <Minus size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
                          opacity: { duration: 0.2 },
                        }}
                        className="overflow-hidden"
                      >
                        <p className="text-body-sm leading-[var(--leading-body)] text-muted-foreground pb-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
