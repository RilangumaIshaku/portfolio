import { SectionLabel } from "@/components/section-label";

export function About({
  paragraphs,
  label = "About.",
}: {
  paragraphs: string[];
  label?: string;
}) {
  if (paragraphs.length === 0) return null;

  return (
    <section id="about" className="mt-14 scroll-mt-16">
      <SectionLabel>{label}</SectionLabel>

      <div className="mt-6 space-y-6 text-ink-muted">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
