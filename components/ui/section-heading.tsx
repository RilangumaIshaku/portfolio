"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn(
        "mb-8 md:mb-12 lg:mb-14",
        align === "center" && "text-center",
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {label && (
        <motion.span
          className={cn(
            "mb-5 inline-block text-label font-medium uppercase tracking-[var(--tracking-label)] text-accent-blue",
            "opacity-55"
          )}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        className={cn(
          "text-display-lg",
          align === "center" && "mx-auto max-w-3xl"
        )}
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          className={cn(
            "mt-3 text-body leading-[var(--leading-body)] text-muted-foreground",
            align === "center" && "mx-auto max-w-2xl"
          )}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
