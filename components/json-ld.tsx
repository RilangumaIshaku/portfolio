import { getSiteContent } from "@/lib/siteContent";
import { readFileSync, existsSync } from "fs";
import path from "path";

function readJsonData<T>(section: string, fallback: T): T {
  try {
    const filePath = path.join(process.cwd(), "data", `${section}.json`);
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

/**
 * Server component that renders JSON-LD structured data for SEO.
 * Includes: Person, FAQ, and Project schemas.
 */
export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";
  const content = getSiteContent();
  const faqs = readJsonData<any[]>("faq", []);
  const projects = readJsonData<any[]>("projects", []);

  // Person / Organization schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.site.name,
    jobTitle: "Freelance Web Developer",
    url: siteUrl,
    email: content.site.email,
    sameAs: [
      content.site.socials.github,
      content.site.socials.linkedin,
      content.site.socials.twitter,
    ].filter(Boolean),
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Web Design",
      "Responsive Design",
      "Frontend Development",
    ],
    description: content.site.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
    },
  };

  // FAQ schema (shows rich results in Google)
  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq: any) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // Portfolio / CreativeWork schemas
  const projectSchemas = projects
    .filter((p: any) => p.url)
    .map((project: any) => ({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      url: project.url,
      author: {
        "@type": "Person",
        name: content.site.name,
      },
      about: {
        "@type": "Thing",
        name: project.category,
      },
      keywords: (project.technologies || []).join(", "),
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {projectSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
