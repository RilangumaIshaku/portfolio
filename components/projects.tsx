"use client";

import { motion } from "framer-motion";
import { useContentData } from "@/lib/useContentData";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowUpRight } from "lucide-react";

// Visible accent colors per project
const PROJECT_ACCENTS: Record<
  string,
  { accent: string; muted: string; glow: string }
> = {
  kasuwa: {
    accent: "#8FA58D",
    muted: "rgba(143, 165, 141, 0.12)",
    glow: "rgba(143, 165, 141, 0.18)",
  },
  liora: {
    accent: "#9B8FBC",
    muted: "rgba(155, 143, 188, 0.12)",
    glow: "rgba(155, 143, 188, 0.18)",
  },
  tradingpal: {
    accent: "#7187C4",
    muted: "rgba(113, 135, 196, 0.12)",
    glow: "rgba(113, 135, 196, 0.18)",
  },
  bloomstudio: {
    accent: "#C4A66B",
    muted: "rgba(196, 166, 107, 0.12)",
    glow: "rgba(196, 166, 107, 0.18)",
  },
  medconnect: {
    accent: "#729B98",
    muted: "rgba(114, 155, 152, 0.12)",
    glow: "rgba(114, 155, 152, 0.18)",
  },
};

const DEFAULT_ACCENT = {
  accent: "#C98B7C",
  muted: "rgba(201, 139, 124, 0.12)",
  glow: "rgba(201, 139, 124, 0.18)",
};

export function Projects({ images }: { images?: Record<string, string> }) {
  const { data } = useContentData();
  const projects = data.projects;

  if (projects.length === 0) return null;

  return (
    <section id="work" className="section-spacing bg-muted/30">
      <div className="section-container section-padding">
        <SectionHeading
          label="Selected Work"
          title="Projects I've built"
          description="A selection of projects that showcase what I can deliver — from marketplaces to AI platforms to modern business websites."
        />

        <div className="space-y-6 md:space-y-10">
          {projects.map((project: any, i: number) => {
            const uploadedImage =
              images?.[project.id] || project.image || "";
            const projectAccent =
              PROJECT_ACCENTS[project.id] || DEFAULT_ACCENT;
            return (
              <motion.div
                key={project.id}
                className="group"
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <div
                  className={cn(
                    "grid gap-6 md:gap-8 items-center",
                    i % 2 === 0
                      ? "md:grid-cols-[1fr_1.1fr]"
                      : "md:grid-cols-[1.1fr_1fr]"
                  )}
                >
                  {/* Project image */}
                  <div
                    className={cn("relative", i % 2 !== 0 && "md:order-2")}
                  >
                    <div className="rounded-xl border border-border bg-surface shadow-xl shadow-black/[0.04] overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/[0.06] group-hover:-translate-y-1">
                      <div
                        className="relative aspect-[16/10] flex flex-col overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${project.color}0a 0%, ${project.color}05 50%, transparent 100%)`,
                        }}
                      >
                        {uploadedImage ? (
                          <img
                            src={uploadedImage}
                            alt={`${project.title} screenshot`}
                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6 md:mb-8">
                              <div
                                className="h-4 w-24 rounded"
                                style={{
                                  backgroundColor: `${project.color}20`,
                                }}
                              />
                              <div className="flex gap-3">
                                {[...Array(3)].map((_, j) => (
                                  <div
                                    key={j}
                                    className="h-2.5 w-10 rounded bg-primary/8"
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <div
                                className="h-7 md:h-8 w-44 md:w-56 rounded-lg mb-3"
                                style={{
                                  backgroundColor: `${project.color}12`,
                                }}
                              />
                              <div className="h-3 w-full max-w-md rounded bg-primary/5 mb-1.5" />
                              <div className="h-3 w-3/4 max-w-sm rounded bg-primary/5 mb-5" />
                              <div className="flex gap-2">
                                <div
                                  className="h-7 w-24 rounded-full"
                                  style={{
                                    backgroundColor: `${project.color}18`,
                                  }}
                                />
                                <div className="h-7 w-24 rounded-full border border-border" />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-6">
                              {[...Array(3)].map((_, j) => (
                                <div
                                  key={j}
                                  className="h-12 md:h-16 rounded-lg border border-border/60 bg-surface/80"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visible radial accent glow behind the card */}
                    <div
                      className="absolute -inset-6 -z-10 rounded-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at center, ${projectAccent.glow} 0%, transparent 70%)`,
                      }}
                    />
                  </div>

                  {/* Project info */}
                  <div
                    className={cn(
                      "flex flex-col gap-4",
                      i % 2 !== 0 && "md:order-1 md:items-end md:text-right"
                    )}
                  >
                    <span
                      className="text-label font-medium uppercase tracking-[var(--tracking-label)] transition-colors duration-300"
                      style={{
                        color: `color-mix(in srgb, ${projectAccent.accent} 45%, #78716c)`,
                      }}
                    >
                      {project.category}
                    </span>
                    <h3 className="text-display-sm">{project.title}</h3>
                    <p className="text-body-sm text-muted-foreground leading-[var(--leading-body)] max-w-md">
                      {project.description}
                    </p>
                    <div
                      className={cn(
                        "flex flex-wrap gap-2",
                        i % 2 !== 0 && "md:justify-end"
                      )}
                    >
                      {project.technologies.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full border border-border bg-surface text-caption font-medium text-muted-foreground transition-colors duration-300 group-hover:border-border/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-1.5 text-button font-medium transition-colors duration-300",
                          "mt-2"
                        )}
                        style={{
                          color: `color-mix(in srgb, ${projectAccent.accent} 60%, var(--color-primary))`,
                        }}
                      >
                        View Project
                        <ArrowUpRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
