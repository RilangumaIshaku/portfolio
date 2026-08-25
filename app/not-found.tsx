import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-display-lg mb-4">404</h1>
        <p className="text-muted-foreground mb-8">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
}
