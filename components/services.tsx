import { SectionLabel } from "@/components/section-label";

export interface Capability {
  title: string;
  description: string;
}

/**
 * Areas of work, set as a definition list. Each row is separated by the same
 * hairline used elsewhere instead of being boxed into cards.
 */
export function Capabilities({ items }: { items: Capability[] }) {
  if (items.length === 0) return null;

  return (
    <section id="capabilities" className="mt-20 scroll-mt-16 md:mt-24">
      <SectionLabel>Capabilities.</SectionLabel>

      <dl className="mt-7">
        {items.map((item) => (
          <div
            key={item.title}
            className="grid gap-2 border-b border-rule py-6 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-10 md:py-7"
          >
            <dt className="text-title leading-snug text-ink">{item.title}</dt>
            <dd className="text-ink-muted">{item.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
