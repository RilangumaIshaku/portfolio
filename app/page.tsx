import { readFileSync, existsSync } from "fs";
import path from "path";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TrustStrip } from "@/components/trust-strip";
import { Services } from "@/components/services";
import { Projects } from "@/components/projects";
import { Process } from "@/components/process";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { getSiteContent, type SiteContent } from "@/lib/siteContent";

interface AvailabilityData {
  isAvailable: boolean;
  status: string;
  color: "green" | "yellow" | "red";
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function getAvailability(): AvailabilityData {
  return readJson(path.join(process.cwd(), "data", "availability.json"), {
    isAvailable: true,
    status: "Available for new projects",
    color: "green",
  });
}

export default function Home() {
  const availability = getAvailability();
  const content = getSiteContent();

  // Read section data from JSON files so client components get fresh data
  const processData = readJson<any[]>(path.join(process.cwd(), "data", "process.json"), []);
  const testimonialsData = readJson<any[]>(path.join(process.cwd(), "data", "testimonials.json"), []);

  return (
    <>
      <Navbar site={content.site} />
      <main>
        <Hero availability={availability} hero={content.hero} />
        <TrustStrip />
        <Services />
        <Projects images={content.images.projects} />
        <Process initialData={processData} />
        <Testimonials initialData={testimonialsData} />
        <Pricing />
        <FAQ />
        <Contact site={content.site} links={content.links} />
      </main>
      <Footer site={content.site} />
    </>
  );
}
