import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TrustStrip } from "@/components/trust-strip";
import { Services } from "@/components/services";
import { Projects } from "@/components/projects";
import { Process } from "@/components/process";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { About } from "@/components/about";
import { Advantages } from "@/components/advantages";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { getSiteContentAsync } from "@/lib/siteContent";
import { readData } from "@/lib/data-store";

// Revalidate every 60 seconds so admin edits reflect on the live site
export const revalidate = 60;

interface AvailabilityData {
  isAvailable: boolean;
  status: string;
  color: "green" | "yellow" | "red";
}

export default async function Home() {
  const [
    content,
    availability,
    processData,
    testimonialsData,
    advantagesData,
    servicesData,
    faqData,
    projectsData,
  ] = await Promise.all([
    getSiteContentAsync(),
    readData<AvailabilityData>("availability", {
      isAvailable: true,
      status: "Available for new projects",
      color: "green",
    }),
    readData<any[]>("process", []),
    readData<any[]>("testimonials", []),
    readData<any[]>("advantages", []),
    readData<any[]>("services", []),
    readData<any[]>("faq", []),
    readData<any[]>("projects", []),
  ]);

  return (
    <>
      <Navbar site={content.site} />
      <main>
        <Hero availability={availability} hero={content.hero} projects={projectsData} />
        <TrustStrip />
        <Services initialData={servicesData} />
        <Projects images={content.images.projects} initialData={projectsData} />
        <About />
        <Advantages initialData={advantagesData} />
        <Process initialData={processData} />
        <Testimonials initialData={testimonialsData} />
        <Pricing />
        <FAQ initialData={faqData} />
        <Contact site={content.site} />
      </main>
      <Footer site={content.site} />
    </>
  );
}
