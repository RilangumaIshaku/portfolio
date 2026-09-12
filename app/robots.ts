import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Keep the admin dashboard and its APIs out of search indexes.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com"}/sitemap.xml`,
  };
}
