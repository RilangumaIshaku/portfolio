"use client";

import { motion } from "framer-motion";
import { useInView } from "@/lib/useInView";
import { SectionHeading } from "@/components/ui/section-heading";
import { Brain, Shield, Palette } from "lucide-react";

const CARDS = [
  {
    title: "AI & Automation Workflows",
    description:
      "Exploring how language models and agent systems can augment creative and technical work.",
    icon: Brain,
  },
  {
    title: "Security & Digital Forensics",
    description:
      "Applied cryptography, media verification, and the intersection of trust and technology.",
    icon: Shield,
  },
  {
    title: "Creative Experiments",
    description:
      "3D exploration, visual storytelling, and the space between tools and expression.",
    icon: Palette,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function BeyondWork() {
  const { ref, isInView } = useInView();

  return (
    <section id="beyond-work" className="section-spacing bg-surface">
      <div className="section-container section-padding">
        <SectionHeading
          label="Beyond the Work"
          title="Interests, Experiments & Emerging Technology"
          description=""
        />

        <div ref={ref} className="max-w-5xl mx-auto">
          <motion.p
            className="text-center text-body text-muted-foreground mb-10 max-w-2xl mx-auto leading-[var(--leading-body)]"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            This space is for the things that don't fit a project card — the
            experiments, the curiosities, the rabbit holes worth going down.
            Technology exploration, creative side-work, ideas in progress.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  className="group relative rounded-xl border border-border bg-surface-elevated p-6 transition-all duration-300 hover:border-border/60"
                  variants={fadeUp}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.1,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <div className="mb-4">
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      style={{ color: "var(--accent-sage)" }}
                    />
                  </div>
                  <h3 className="text-body font-medium text-primary mb-2">
                    {card.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground leading-[var(--leading-body)]">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
