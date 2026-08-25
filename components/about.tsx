"use client";

import { useInView } from "@/lib/useInView";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/data/siteConfig";

export function About() {
  const { ref, isInView } = useInView();

  return (
    <section id="about" className="section-spacing bg-muted/30">
      <div className="section-container section-padding">
        <SectionHeading
          label="About"
          title={`Hi, I'm ${siteConfig.name}`}
          description="A freelance developer who combines design, development, and modern tools to build things that work beautifully."
        />

        <div
          ref={ref}
          className={cn(
            "flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-4xl mx-auto transition-all duration-700",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Profile image placeholder */}
          <div className="shrink-0">
            <div className="relative">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                {/* Replace with: <img src="/images/profile.jpg" alt="..." className="w-full h-full object-cover" /> */}
                <span className="text-4xl text-muted-foreground/30">
                  {siteConfig.name.charAt(0) || "Y"}
                </span>
              </div>
              {/* Decorative accent corner */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg border-2 border-accent/30" />
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-body-sm text-muted-foreground leading-[var(--leading-body)] mb-4">
              I&apos;m a freelance web developer focused on creating modern,
              high-performing websites for businesses and startups. I handle
              everything from initial concept and design to development and
              deployment.
            </p>
            <p className="text-body-sm text-muted-foreground leading-[var(--leading-body)] mb-4">
              I combine clean design with solid engineering to build websites
              that look professional and work flawlessly. I use modern
              technologies and AI tools to deliver quality results efficiently.
            </p>
            <p className="text-body-sm text-muted-foreground leading-[var(--leading-body)]">
              My goal is simple: build websites that make your business look
              credible, modern, and ready for customers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
