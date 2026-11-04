/**
 * Every route change remounts this template, so the reference's soft blur-up
 * doubles as a page transition. CSS-only and reduced-motion aware (see .enter
 * in globals.css), so nothing depends on JavaScript to become visible.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="enter">{children}</div>;
}
