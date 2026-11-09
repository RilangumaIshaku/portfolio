import { SiteHeader } from "@/components/navbar";
import { Introduction } from "@/components/hero";
import { Work } from "@/components/projects";
import { Capabilities } from "@/components/services";
import { About } from "@/components/about";
import { FAQ } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { ctaHref, getSiteContentAsync } from "@/lib/siteContent";
import { readData } from "@/lib/data-store";
import { getProjects, withUploadedImages } from "@/lib/projects";

// Revalidate every 60 seconds so admin edits reflect on the live site
export const revalidate = 60;

export default async function Home() {
  const [content, capabilities, faqData, storedProjects] = await Promise.all([
    getSiteContentAsync(),
    readData<{ title: string; description: string }[]>("services", []),
    readData<{ question: string; answer: string }[]>("faq", []),
    getProjects(),
  ]);

  // Stored project edits win over the bundled records; admin-uploaded imagery
  // wins over the path on the record.
  const projects = withUploadedImages(storedProjects, content.images.projects);

  return (
    <>
      <div className="shell pt-12">
        <div className="enter">
          <SiteHeader
            site={content.site}
            profileImage={content.images.profile}
            ctaHref={ctaHref(content.links.ctaTarget)}
          />
        </div>

        <main>
          <div className="enter enter-delay-1">
            <Introduction content={content} />
          </div>

          <div className="enter enter-delay-2">
            <Work projects={projects} />
          </div>

          <Capabilities
            items={capabilities.filter((item) => item?.title && item?.description)}
          />

          <About />

          <FAQ items={faqData.filter((item) => item?.question && item?.answer)} />

          <Contact
            email={content.site.email}
            telegram={content.site.telegram}
          />
        </main>
      </div>

      <Footer site={content.site} />
    </>
  );
}
