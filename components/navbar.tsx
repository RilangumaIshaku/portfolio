import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/avatar";

interface HeaderSite {
  name: string;
}

/**
 * The site header: a portrait, a single black pill, nothing else.
 * `variant="detail"` adds the back button and centres the portrait, matching
 * the reference's project pages.
 */
export function SiteHeader({
  site,
  profileImage,
  ctaHref = "#contact",
  variant = "home",
}: {
  site: HeaderSite;
  profileImage?: string;
  ctaHref?: string;
  variant?: "home" | "detail";
}) {
  if (variant === "detail") {
    return (
      <header className="grid grid-cols-[1fr_auto_1fr] items-center">
        <Link
          href="/"
          aria-label="Back to the homepage"
          className="inline-flex h-11 w-11 items-center justify-center justify-self-start rounded-full bg-panel text-ink-muted transition-colors hover:bg-[#ecece8] hover:text-ink"
        >
          <ArrowLeft size={17} strokeWidth={1.6} />
        </Link>

        <Link href="/" aria-label={`${site.name} — home`} className="justify-self-center">
          <Avatar src={profileImage} name={site.name} />
        </Link>

        <Link href={ctaHref} className="pill justify-self-end">
          Work with me
        </Link>
      </header>
    );
  }

  return (
    <header className="flex items-start justify-between">
      <Link href="/" aria-label={`${site.name} — home`}>
        <Avatar src={profileImage} name={site.name} />
      </Link>

      <a href={ctaHref} className="pill">
        Work with me
      </a>
    </header>
  );
}
