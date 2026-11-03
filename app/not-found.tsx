import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-screen flex-col justify-center py-24">
      <p className="meta">404</p>
      <h1 className="display-serif mt-4 text-[2rem] md:text-[2.5rem]">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="mt-3 max-w-[46ch] text-ink-muted">
        The link may be out of date. Everything I&rsquo;ve made is still on the
        homepage.
      </p>
      <div className="mt-8">
        <Link href="/" className="pill">
          Back home
        </Link>
      </div>
    </div>
  );
}
