import { SectionLabel } from "@/components/section-label";

export function About() {
  return (
    <section id="about" className="mt-20 scroll-mt-16 md:mt-24">
      <SectionLabel>About.</SectionLabel>

      <div className="mt-7 max-w-[64ch] space-y-6 text-ink-muted">
        <p>
          I&rsquo;m David, a product designer and frontend engineer based in
          Nigeria, working remotely with teams and founders. I move between
          design and code, which keeps decisions grounded in what the browser
          can actually do.
        </p>
        <p>
          Most of the work I take on carries a lot of information and a lot of
          consequence &mdash; legal research, disputed media, trade, money. The
          interesting part is the reduction: deciding what someone needs to see
          in order to trust what they are looking at.
        </p>
        <p>
          Alongside client work I build small experiments that test an idea
          before it becomes a feature &mdash; prototypes, tools, and the
          occasional game.
        </p>
      </div>
    </section>
  );
}
