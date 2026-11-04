"use client";

import { useEffect, useState } from "react";

/**
 * The quiet contents list that sits in the left margin of a case study.
 * Hidden below 1320px, where there is no gutter to hold it.
 */
export function CaseStudyToc({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="case-toc">
      <nav aria-label="Contents" className="case-toc__inner">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-active={active === item.id}
            aria-current={active === item.id ? "true" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
