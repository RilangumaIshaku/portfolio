import { cn } from "@/lib/utils";

/**
 * The small circular portrait that anchors the top of every page. The site is
 * designed to work without a photograph, so a quiet monogram stands in until
 * one is uploaded through the admin panel.
 */
export function Avatar({
  src,
  name,
  size = 56,
  className,
}: {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "block shrink-0 overflow-hidden rounded-full bg-panel",
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size * 2}
          height={size * 2}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center font-serif leading-none text-ink-faint"
          style={{ fontSize: Math.round(size * 0.32) }}
        >
          {initials || "·"}
        </span>
      )}
    </span>
  );
}
