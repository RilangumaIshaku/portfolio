import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/fraunces/full.css";
import "./globals.css";
import { getSiteContentAsync } from "@/lib/siteContent";
import { JsonLd } from "@/components/json-ld";
import { MediaCursor } from "@/components/media-cursor";
import { SoundToggle } from "@/components/sound-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";

/*
 * Typography carries this design, so both faces are self-hosted from the
 * fontsource packages imported above instead of relying on whatever the
 * visitor's OS substitutes. Inter sets the body copy; Fraunces supplies the
 * display lines, tuned to the soft, low-wonk cut that reads closest to the
 * reference's serif. (The reference's own faces, Untitled Sans and Gelica, are
 * commercial licences and are not shipped here.)
 */

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContentAsync();
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
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Runs before paint so a remembered dark preference never flashes white. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('portfolio:theme')==='dark'){document.documentElement.dataset.theme='dark'}}catch(e){}",
          }}
        />
        <JsonLd />
        {children}
        <MediaCursor />
        <ThemeToggle />
        <SoundToggle />
      </body>
    </html>
  );
}
