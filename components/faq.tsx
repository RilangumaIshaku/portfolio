"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/section-label";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Accordion built on hairlines and a CSS grid transition — the open state is
 * the only motion on the page, and it stays under 300ms.
 */
export function FAQ({
  items,
  label = "FAQ.",
}: {
  items: FaqItem[];
  label?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <section id="faq" className="mt-14 scroll-mt-16">
      <SectionLabel>{label}</SectionLabel>

      <div className="mt-6">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;

          return (
            <div key={item.question} className="border-b border-rule">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="group flex w-full items-start justify-between gap-6 py-4 text-left"
                >
                  <span className="text-[0.9375rem] leading-[1.5333] text-ink transition-colors group-hover:text-ink-muted">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative mt-2 h-3 w-3 shrink-0 text-ink-faint transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  >
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                className="accordion-panel"
                data-open={isOpen}
              >
                <div>
                  <p className="max-w-[58ch] pb-5 pr-8 text-ink-muted">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
