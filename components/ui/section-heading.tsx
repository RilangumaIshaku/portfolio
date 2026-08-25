"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";

interface SectionHeadingProps {
  label?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        "mb-8 md:mb-12 lg:mb-14",
        align === "center" && "text-center",
        className
      )}
    >
      {label && (
        <span
          className={cn(
            "mb-5 inline-block text-label font-medium uppercase tracking-[var(--tracking-label)] text-accent-blue transition-all duration-500",
            isInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
          style={{ opacity: 0.55 }}
        >
          {label}
        </span>
      )}
      <h2
        className={cn(
          "text-display-lg transition-all duration-500 delay-100",
          align === "center" && "mx-auto max-w-3xl",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-3 text-body leading-[var(--leading-body)] text-muted-foreground transition-all duration-500 delay-200",
            align === "center" && "mx-auto max-w-2xl",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
