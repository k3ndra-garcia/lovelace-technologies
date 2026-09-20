import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero container" style={{ minHeight: "80svh" }}>
      <h1 className="t-display page-hero__title">This page isn&apos;t here.</h1>
      <p className="t-lead">It may have moved, or the link may be mistyped.</p>
      <div style={{ marginTop: "2.5rem", display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
        <Link href="/" className="btn">
          <span className="btn__hole" aria-hidden="true" />
          Go to the homepage
        </Link>
        <Link href="/services" className="text-link">
          Browse services
        </Link>
      </div>
    </section>
  );
}
