"use client";

import { useInView } from "@/lib/useInView";
import { useContentData } from "@/lib/useContentData";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";

const stepGradients = [
  "linear-gradient(135deg, #faf5ee 0%, #f2e8da 50%, #faf6ef 100%)",   // warm ivory — Discovery
  "linear-gradient(135deg, #eef1fa 0%, #dde5f5 50%, #f0f4fc 100%)",   // visible blue — Strategy
  "linear-gradient(135deg, #f0eef8 0%, #e5dff2 50%, #f2eff9 100%)",   // visible lilac — Design
  "linear-gradient(135deg, #eef5f0 0%, #dfeee3 50%, #f0f6f1 100%)",   // visible sage — Development
  "linear-gradient(135deg, #f8f3e8 0%, #efe5d0 50%, #faf5eb 100%)",   // visible amber — Testing
  "linear-gradient(135deg, #f5efed 0%, #ede4e1 50%, #f6f1ef 100%)",   // visible coral — Launch
];

// Accent tints per step — visible colored glow behind the alien icon
const stepTints = [
  "rgba(196, 166, 107, 0.15)", // amber — Discovery
  "rgba(113, 135, 196, 0.15)", // blue — Strategy
  "rgba(155, 143, 188, 0.15)", // lilac — Design
  "rgba(143, 165, 141, 0.15)", // sage — Development
  "rgba(196, 166, 107, 0.15)", // amber — Testing
  "rgba(201, 139, 124, 0.15)", // coral — Launch
];

const stepAccentColors = [
  "#C4A66B", // amber
  "#7187C4", // blue
  "#9B8FBC", // lilac
  "#8FA58D", // sage
  "#C4A66B", // amber
  "#C98B7C", // coral
];

function AlienIcon({ index }: { index: number }) {
  const tint = stepTints[index] || stepTints[0];
  const accentColor = stepAccentColors[index] || stepAccentColors[0];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Ambient glow */}
      <div
        className="absolute w-40 h-40 rounded-full blur-3xl"
        style={{ background: tint }}
      />
      {/* Icon container */}
      <div className="relative">
        <img
          src="/alien.svg"
          alt=""
          className="w-20 h-20 md:w-24 md:h-24 drop-shadow-sm"
          style={{ filter: `drop-shadow(0 2px 8px ${tint})` }}
        />
        {/* Subtle accent ring */}
        <div
          className="absolute inset-0 rounded-full border-2 opacity-20 -m-3"
          style={{ borderColor: accentColor }}
        />
      </div>
    </div>
  );
}

const stepVisuals = [
  { elements: <AlienIcon index={0} /> },
  { elements: <AlienIcon index={1} /> },
  { elements: <AlienIcon index={2} /> },
  { elements: <AlienIcon index={3} /> },
  { elements: <AlienIcon index={4} /> },
  { elements: <AlienIcon index={5} /> },
];

export function Process({ initialData }: { initialData?: any[] } = {}) {
  const { data } = useContentData();
  const processSteps = initialData && initialData.length > 0 ? initialData : data.process;

  if (processSteps.length === 0) return null;

  return (
    <section id="process" className="section-spacing bg-muted/30">
      <div className="section-container section-padding">
        <SectionHeading
          label="Process"
          title="How we get from idea to launch"
          description="A clear process that takes your idea from an initial conversation to a polished, functional website."
        />

        <div className="flex flex-col gap-4 md:gap-5 max-w-3xl mx-auto">
          {processSteps.map((step: any, i: number) => (
            <ProcessCard key={step.number || i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessCard({ step, index }: { step: any; index: number }) {
  const { ref, isInView } = useInView();
  const visual = stepVisuals[index] || stepVisuals[0];
  const gradient = stepGradients[index] || stepGradients[0];

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border bg-surface-elevated overflow-hidden transition-all duration-700 hover:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)]",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Visual area — show uploaded image if available, else gradient + alien icon */}
      {/* Height increased ~20%: was aspect-[16/6], now aspect-[16/7.2] */}
      <div className="relative aspect-[16/7.2] overflow-hidden" style={{ background: gradient }}>
        {step.image ? (
          <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
        ) : (
          visual.elements
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <span className="text-label font-medium tracking-[var(--tracking-label)] text-muted-foreground/40 uppercase mt-1 shrink-0">
            Step {step.number}
          </span>
          <div>
            <h3 className="text-display-sm font-medium text-primary tracking-tight">
              {step.title}
            </h3>
            <p className="mt-1.5 text-body-sm text-muted-foreground leading-[var(--leading-body)] max-w-2xl">
              {step.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
