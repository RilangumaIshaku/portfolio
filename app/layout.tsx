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
      "freelance web developer",
      "web development",
      "website design",
      "Next.js developer",
      "responsive websites",
      "modern web design",
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
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
