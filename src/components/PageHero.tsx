import Link from "next/link";
import { LineReveal } from "./motion/LineReveal";
import { Reveal } from "./motion/Reveal";

type Crumb = { label: string; href: string };

type PageHeroProps = {
  title: string[];
  lead?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
};

export function PageHero({ title, lead, crumbs, children }: PageHeroProps) {
  return (
    <section className="page-hero container">
      {crumbs && (
        <Reveal y={0}>
          <nav aria-label="Breadcrumb">
            <ol className="page-hero__crumb">
              {crumbs.map((c) => (
                <li key={c.href} style={{ display: "flex", gap: "0.5rem" }}>
                  <Link href={c.href}>{c.label}</Link>
                  <span aria-hidden="true">/</span>
                </li>
              ))}
              <li aria-current="page" style={{ color: "var(--ink)" }}>
                {title.join(" ")}
              </li>
            </ol>
          </nav>
        </Reveal>
      )}
      <LineReveal as="h1" trigger="load" delay={0.15} className="t-display page-hero__title" lines={title} />
      {lead && (
        <Reveal delay={0.55} y={16}>
          <p className="t-lead">{lead}</p>
        </Reveal>
      )}
      {children && (
        <Reveal delay={0.7} y={16}>
          <div style={{ marginTop: "clamp(2rem, 3.5vw, 3rem)", display: "flex", flexWrap: "wrap", gap: "1.25rem 2rem", alignItems: "center" }}>
            {children}
          </div>
        </Reveal>
      )}
    </section>
  );
}
