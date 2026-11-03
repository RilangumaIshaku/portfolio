import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource/instrument-serif/latin-400.css";
import "./globals.css";
import { getSiteContent } from "@/lib/siteContent";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";

/*
 * Typography carries this design, so both faces are self-hosted from the
 * fontsource packages imported above instead of relying on whatever the
 * visitor's OS substitutes. Inter sets the body copy; Instrument Serif
 * supplies the occasional high-contrast display line on project pages.
 */

export function generateMetadata(): Metadata {
  const content = getSiteContent();
  // Empty ogImage → let the generated /opengraph-image route supply the card.
  // A configured path is resolved against the real origin instead of being
  // emitted relative to a placeholder domain.
  const ogImage = content.seo.ogImage?.trim();
  const images = ogImage ? [absoluteUrl(ogImage)] : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: content.seo.title,
    description: content.seo.description,
    applicationName: content.site.name,
    keywords: [
      "product design",
      "frontend development",
      "interaction design",
      "design engineering",
      "legal technology",
      "media forensics",
      "fintech product design",
      "Next.js developer",
      "TypeScript",
      "David Ishaku",
    ],
    authors: [{ name: content.site.name, url: SITE_URL }],
    creator: content.site.name,
    publisher: content.site.name,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: absoluteUrl("/"),
      title: content.seo.title,
      description: content.seo.description,
      siteName: content.site.name,
      ...(images
        ? {
            images: images.map((url) => ({
              url,
              width: 1200,
              height: 630,
              alt: content.site.name,
            })),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
      ...(images ? { images } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
