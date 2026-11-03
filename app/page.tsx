import { SiteHeader } from "@/components/navbar";
import { Introduction } from "@/components/hero";
import { Work } from "@/components/projects";
import { Capabilities } from "@/components/services";
import { About } from "@/components/about";
import { FAQ } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { getSiteContentAsync } from "@/lib/siteContent";
import { readData } from "@/lib/data-store";
import { projects as projectRecords } from "@/data/projects";

// Revalidate every 60 seconds so admin edits reflect on the live site
export const revalidate = 60;

export default async function Home() {
  const [content, capabilities, faqData] = await Promise.all([
    getSiteContentAsync(),
    readData<{ title: string; description: string }[]>("services", []),
    readData<{ question: string; answer: string }[]>("faq", []),
  ]);

  // Admin-uploaded imagery wins over the path stored on the project record.
  const projects = projectRecords.map((project) => ({
    ...project,
    image: content.images.projects[project.id] || project.image,
  }));

  return (
    <>
      <div className="shell pt-10 md:pt-12">
        <SiteHeader site={content.site} profileImage={content.images.profile} />

        <main>
          <Introduction content={content} />

          <Work projects={projects} />

          <Capabilities
            items={capabilities.filter((item) => item?.title && item?.description)}
          />

          <About />

          <FAQ items={faqData.filter((item) => item?.question && item?.answer)} />

          <Contact email={content.site.email} />
        </main>
      </div>

      <Footer site={content.site} />
    </>
  );
}
