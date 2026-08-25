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

const stepVisuals = [
  {
    elements: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-primary/[0.06] bg-white/70" style={{ width: 48 + i * 12, height: 56 + i * 8, opacity: 0.6 + i * 0.1 }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    elements: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-6 rounded-md border border-primary/[0.08] bg-white/60" />
          <div className="w-px h-4 bg-primary/[0.1]" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-14 h-10 rounded-md border border-primary/[0.08] bg-white/60" />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    elements: (
      <div className="absolute inset-0 p-8 flex flex-col gap-3">
        <div className="h-8 w-full rounded-lg border border-primary/[0.06] bg-white/50" />
        <div className="flex gap-3 flex-1">
          <div className="w-1/3 rounded-lg border border-primary/[0.06] bg-white/50" />
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex-1 rounded-lg border border-primary/[0.06] bg-white/50" />
            <div className="flex-1 rounded-lg border border-primary/[0.06] bg-white/50" />
          </div>
        </div>
      </div>
    ),
  },
  {
    elements: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-48 h-32 rounded-xl border border-primary/[0.08] bg-white/70 shadow-sm" />
          <div className="absolute -bottom-3 -right-3 w-24 h-16 rounded-lg border border-primary/[0.06] bg-white/60 shadow-sm" />
        </div>
      </div>
    ),
  },
  {
    elements: (
      <div className="absolute inset-0 p-8 flex flex-col gap-2 justify-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="h-2.5 rounded-full bg-primary/[0.06]" style={{ width: 30 + i * 12 + "%" }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    elements: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl border-2 border-primary/[0.1] bg-white/60 flex items-center justify-center">
          <div className="w-0 h-0 border-l-[10px] border-l-primary/20 border-y-[8px] border-y-transparent ml-1" />
        </div>
      </div>
    ),
  },
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
      {/* Visual area — show uploaded image if available, else CSS gradient */}
      <div className="relative aspect-[16/6] overflow-hidden" style={{ background: gradient }}>
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
