"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useInView } from "@/lib/useInView";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckCircle2, Globe, Terminal } from "lucide-react";

const PILLARS = [
  {
    title: "Design with purpose",
    description: "Interfaces built around clarity, hierarchy, and outcomes — not templates or trends.",
  },
  {
    title: "Engineering that holds",
    description: "Modern stack, secure by default, architected for performance and long-term maintenance.",
  },
  {
    title: "Direct collaboration",
    description: "You work with the person designing and building. No handoffs, no lost context.",
  },
  {
    title: "Full-cycle delivery",
    description: "From strategy and scoping through deployment and QA — I manage the entire process.",
  },
  {
    title: "Security as default",
    description: "Auth, access control, and data handling designed to fail closed. Plus independent work in cryptography and media forensics.",
  },
  {
    title: "Clear communication",
    description: "Honest timelines, plain language, transparent scope — you always know what's being built and why.",
  },
];

const TECH_BADGES = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Sanity CMS",
  "Node.js",
  "Python",
  "Vercel",
  "REST & GraphQL",
];

// Restrained, Apple/Notion-style reveal: short distance, long-ish ease.
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/**
 * ScrollProgressiveText — words sharpen from faint grey to full ink
 * progressively as the user scrolls through the paragraph, driven by
 * the element's own scroll progress. Calm and continuous, no jumps.
 */
function ScrollProgressiveText({
  text,
  progress,
  className,
}: {
  text: string;
  progress: MotionValue<number>;
  className?: string;
}) {
  const words = useMemo(() => text.split(" "), [text]);
  const total = words.length;

  return (
    <p className={className}>
      {words.map((word, i) => (
        <Word key={i} word={word} index={i} total={total} progress={progress} />
      ))}
    </p>
  );
}

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each word brightens across its own slice of the scroll progress,
  // with a slight overlap so the effect reads as one smooth wave.
  const start = index / total;
  const end = start + 1 / total;
  const color = useTransform(
    progress,
    [start, end],
    ["rgba(10, 10, 11, 0.22)", "rgba(10, 10, 11, 1)"]
  );

  return (
    <motion.span style={{ color }} className="inline-block whitespace-pre">
      {word}{" "}
    </motion.span>
  );
}

export function About() {
  const { ref, isInView } = useInView();
  const reduceMotion = useReducedMotion();

  // Scroll progress measured across the narrative card itself: 0 when its
  // top enters the lower viewport, 1 as its center reaches mid-viewport.
  const narrativeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: narrativeRef,
    offset: ["start 0.9", "start 0.25"],
  });
  const paragraphOneProgress = scrollYProgress;
  const paragraphTwoProgress = useTransform(
    scrollYProgress,
    [0.45, 1],
    [0, 1]
  );

  // With reduced motion: no entrance animation at all — content is simply visible.
  const motionProps = (delay: number) =>
    reduceMotion
      ? {}
      : {
          variants: reveal,
          initial: isInView ? "visible" : "hidden",
          animate: isInView ? "visible" : "hidden",
          transition: {
            duration: 0.6,
            delay,
            ease: EASE,
          },
        };

  return (
    <section id="about" className="section-spacing bg-surface">
      <div className="section-container section-padding">
        <SectionHeading
          label="About"
          title="Ambitious ideas made tangible."
          description=""
        />

        <div
          ref={ref}
          className={cn(
            "max-w-4xl mx-auto space-y-10 md:space-y-12",
            !reduceMotion &&
              (isInView
                ? "opacity-100"
                : "opacity-0 transition-opacity duration-500")
          )}
        >
          {/* Main narrative block */}
          <motion.div
            ref={narrativeRef}
            className="rounded-2xl border border-border bg-surface-elevated p-8 md:p-10 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]"
            {...motionProps(0)}
          >
            <div className="space-y-5 text-body leading-[var(--leading-body)]">
              <ScrollProgressiveText
                text="I'm Dave — a digital product designer and developer building at the intersection of design, technology, and craft. I work on products that need to feel as considered as they are functional."
                progress={paragraphOneProgress}
                className="font-medium text-body-lg"
              />
              <ScrollProgressiveText
                text="From concept to deployment, I work directly with the people who have the idea — keeping things focused, honest, and built to last."
                progress={paragraphTwoProgress}
                className="text-body"
              />
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
                <Globe size={14} style={{ color: "var(--accent-sage)" }} />
                <span>Based in Nigeria — working with teams and individuals globally.</span>
              </div>
            </div>
          </motion.div>

          {/* Core delivery pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                className="rounded-xl border border-border/80 bg-surface p-6 flex flex-col justify-between"
                {...motionProps(0.15 + i * 0.08)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2
                      size={16}
                      className="shrink-0"
                      style={{ color: "var(--accent-sage)" }}
                    />
                    <h4 className="text-body font-medium text-primary">{pillar.title}</h4>
                  </div>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Clean, secondary technical foundation */}
          <motion.div
            className="pt-4 border-t border-border/60"
            {...motionProps(0.35)}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                <Terminal size={14} />
                <span>Core Engineering Stack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TECH_BADGES.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-full border border-border/70 bg-surface text-[11px] font-medium text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
