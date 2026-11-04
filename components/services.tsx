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
    <section id="capabilities" className="mt-14 scroll-mt-16">
      <SectionLabel>Capabilities.</SectionLabel>

      <dl className="mt-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="grid gap-1.5 border-b border-rule py-4 md:grid-cols-[minmax(0,13rem)_1fr] md:gap-10"
          >
            <dt className="text-[0.9375rem] leading-[1.45] text-ink">
              {item.title}
            </dt>
            <dd className="text-ink-muted">{item.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
