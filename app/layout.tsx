import type { Metadata } from "next";
import "./globals.css";
import { getSiteContent } from "@/lib/siteContent";
import { JsonLd } from "@/components/json-ld";

export function generateMetadata(): Metadata {
  const content = getSiteContent();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";
  return {
    metadataBase: new URL(siteUrl),
    title: content.seo.title,
    description: content.seo.description,
    keywords: [
      "premium web design",
      "web development",
      "Next.js developer",
      "independent digital studio",
      "corporate website design",
      "UI UX design",
      "TypeScript developer",
      "responsive web experiences",
    ],
    authors: [{ name: content.site.name }],
    creator: content.site.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: content.seo.title,
      description: content.seo.description,
      siteName: content.site.name,
      images: [
        {
          url: content.seo.ogImage,
          width: 1200,
          height: 630,
          alt: content.site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
      images: [content.seo.ogImage],
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
