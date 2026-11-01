"use client";

import { motion } from "framer-motion";
import { useContentData } from "@/lib/useContentData";
import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import {
  Globe,
  Layout,
  Layers,
  Zap,
  Hexagon,
  Package,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Layout,
  Layers,
  Zap,
  Hexagon,
  Package,
};

// Accent palette — simplified to sage and muted charcoal/grey
const SERVICE_ACCENTS = [
  { color: "#A6B2A1", muted: "rgba(166, 178, 161, 0.12)" }, // sage
  { color: "#78716c", muted: "rgba(120, 113, 108, 0.12)" }, // muted charcoal
  { color: "#A6B2A1", muted: "rgba(166, 178, 161, 0.12)" }, // sage
  { color: "#78716c", muted: "rgba(120, 113, 108, 0.12)" }, // muted charcoal
  { color: "#A6B2A1", muted: "rgba(166, 178, 161, 0.12)" }, // sage
  { color: "#78716c", muted: "rgba(120, 113, 108, 0.12)" }, // muted charcoal
];

export function Services({ initialData }: { initialData?: any[] } = {}) {
  const { data } = useContentData({ services: initialData });
  const services = data.services;

  if (services.length === 0) return null;

  return (
    <section id="capabilities" className="section-spacing bg-surface">
      <div className="section-container section-padding">
        <SectionHeading
          label="Capabilities"
          title="What I Do"
          description="Four areas where design, technology, and craft come together."
        />

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-2xl overflow-hidden"
          staggerDelay={0.06}
        >
          {services.map((service: any, i: number) => {
            const Icon = iconMap[service.icon];
            const number = String(i + 1).padStart(2, "0");
            const accent = SERVICE_ACCENTS[i % SERVICE_ACCENTS.length];
            return (
              <StaggerItem key={service.title}>
                <div className="group relative bg-surface-elevated p-7 md:p-8 flex flex-col transition-all duration-500 hover:bg-muted/40">
                  {/* Top row: number + arrow */}
                  <div className="relative flex items-center justify-between mb-4">
                    <span
                      className="text-label font-medium tracking-[var(--tracking-label)] uppercase transition-colors duration-300"
                      style={{
                        color: `color-mix(in srgb, ${accent.color} 35%, #78716c)`,
                      }}
                    >
                      {number}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground/30 transition-all duration-500 group-hover:text-muted-foreground/60 group-hover:translate-x-1"
                    />
                  </div>

                  {/* Icon with sage accent color */}
                  <div className="relative mb-4 transition-transform duration-500 group-hover:translate-y-[-2px]">
                    {Icon && (
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        style={{ color: "var(--accent-sage)" }}
                      />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="relative text-body font-medium text-primary mb-2 tracking-tight leading-snug">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="relative text-body-sm leading-[var(--leading-body)] text-muted-foreground flex-1">
                    {service.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
