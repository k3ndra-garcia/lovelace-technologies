import Link from "next/link";
import { services, site } from "@/content/site";
import { Brand } from "./Brand";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer on-night">
      <div className="container">
        <div className="grid footer__top rule-top" style={{ paddingTop: "clamp(3rem, 6vw, 4.5rem)" }}>
          <div className="footer__brand">
            <Brand />
            <p className="t-muted" style={{ maxWidth: "24rem" }}>
              {site.description}
            </p>
          </div>

          <div className="footer__col">
            <h2>Services</h2>
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>
                {s.title}
              </Link>
            ))}
          </div>

          <div className="footer__col">
            <h2>Company</h2>
            <Link href="/approach">Approach</Link>
            <Link href="/about">About</Link>
            <Link href="/insights">Insights</Link>
            {site.showWorkInNav && <Link href="/work">Work</Link>}
          </div>

          <div className="footer__col">
            <h2>Get in touch</h2>
            <a href={site.calendlyUrl} target="_blank" rel="noopener noreferrer">
              Book a call
            </a>
            <Link href="/contact">Send us a note</Link>
            <a href={`mailto:${site.email}`}>Email us</a>
          </div>
        </div>

        <div className="footer__bottom t-caption">
          <p>
            © {year} {site.name}
          </p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
