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

// Accent palette — more visible for a colorful personality
const SERVICE_ACCENTS = [
  { color: "#7187C4", muted: "rgba(113, 135, 196, 0.12)" }, // blue
  { color: "#9B8FBC", muted: "rgba(155, 143, 188, 0.12)" }, // lilac
  { color: "#C4A66B", muted: "rgba(196, 166, 107, 0.12)" }, // amber
  { color: "#C98B7C", muted: "rgba(201, 139, 124, 0.12)" }, // coral
  { color: "#8FA58D", muted: "rgba(143, 165, 141, 0.12)" }, // sage
  { color: "#729B98", muted: "rgba(114, 155, 152, 0.12)" }, // teal
];

export function Services() {
  const { data } = useContentData();
  const services = data.services;

  if (services.length === 0) return null;

  return (
    <section id="services" className="section-spacing bg-surface">
      <div className="section-container section-padding">
        <SectionHeading
          label="Services"
          title="Design services I provide"
          description="From focused landing pages to complete digital experiences, I design and build websites that are clear, modern and built to perform."
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
                  {/* Visible accent glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 30% 20%, ${accent.muted} 0%, transparent 70%)`,
                    }}
                  />
                  {/* Always-visible subtle tint at top-left */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 20% 10%, ${accent.muted.replace("0.12", "0.06")} 0%, transparent 60%)`,
                    }}
                  />

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

                  {/* Icon with visible accent color */}
                  <div className="relative mb-4 transition-transform duration-500 group-hover:translate-y-[-2px]">
                    {Icon && (
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        className="transition-colors duration-300"
                        style={{ color: accent.color }}
                      />
                    )}
                    {/* Accent circle behind icon — always visible at low opacity */}
                    <div
                      className="absolute -top-1 -left-1 w-8 h-8 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: accent.muted }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="relative text-body font-medium text-primary mb-2 tracking-tight leading-snug">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="relative text-body-sm leading-[var(--leading-body)] text-muted-foreground flex-1">
                    {service.description}
                  </p>

                  {/* Bottom accent line on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${accent.color}30 50%, transparent 100%)`,
                    }}
                  />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
