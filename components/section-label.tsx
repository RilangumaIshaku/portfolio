import { cn } from "@/lib/utils";

/**
 * Section label with the hairline that runs to the edge of the measure.
 * The reference uses a single rule for every section heading rather than
 * nested cards or dividers.
 */
export function SectionLabel({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-5", className)}>
      <h2
        id={id}
        className="shrink-0 text-[1.0625rem] font-normal leading-none text-ink md:text-[1.1875rem]"
      >
        {children}
      </h2>
      <span className="rule" aria-hidden="true" />
    </div>
  );
}
