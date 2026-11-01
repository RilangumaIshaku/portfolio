import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Projects } from "@/components/projects";
import { Process } from "@/components/process";
import { BeyondWork } from "@/components/beyond-work";
import { About } from "@/components/about";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
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
    readData<any[]>("services", []),
    readData<any[]>("faq", []),
    readData<any[]>("projects", []),
  ]);

  return (
    <>
      <Navbar site={content.site} />
      <main>
        <Hero availability={availability} hero={content.hero} projects={projectsData} />
        <Projects images={content.images.projects} initialData={projectsData} />
        <Services initialData={servicesData} />
        <Process initialData={processData} />
        <BeyondWork />
        <About />
        {testimonialsData.length > 0 && <Testimonials initialData={testimonialsData} />}
        <FAQ initialData={faqData} />
        <Contact site={content.site} />
      </main>
      <Footer site={content.site} />
    </>
  );
}
