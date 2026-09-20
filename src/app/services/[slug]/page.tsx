import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactTrigger } from "@/components/ContactMenu";
import { Closing } from "@/components/home/Closing";
import { ArrowRight } from "@/components/Icons";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import { services } from "@/content/site";
import { vars } from "@/lib/css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: service.title, description: service.summary };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();

  const service = services[index];
  const next = services[(index + 1) % services.length];

  return (
    <div
      style={vars({
        "--mark": `var(--c-${service.color})`,
        "--service": `var(--c-${service.color})`,
        "--tint": `var(--c-${service.color})`,
        "--next-service-color": `var(--c-${next.color})`,
      })}
    >
      <PageHero
        title={[service.title]}
        lead={service.lead}
        crumbs={[{ label: "Services", href: "/services" }]}
      >
        <ContactTrigger />
      </PageHero>

      <section className="section container rule-top" aria-labelledby="outcomes-title">
        <div className="grid split">
          <div className="split__aside">
            <h2 id="outcomes-title" className="section-title">
              <span className="hole" aria-hidden="true" />
              What you can expect
            </h2>
          </div>
          <ul className="split__main check-list">
            {service.outcomes.map((o, i) => (
              <Reveal as="li" key={o} delay={i * 0.06}>
                <span className="hole" aria-hidden="true" />
                <span className="t-h3">{o}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section container rule-top" aria-labelledby="includes-title">
        <div className="grid split">
          <div className="split__aside">
            <h2 id="includes-title" className="section-title">
              <span className="hole" aria-hidden="true" />
              What&apos;s included
            </h2>
          </div>
          <dl className="split__main def-list">
            {service.includes.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05} className="def-list__item">
                <dt className="t-h4">{item.title}</dt>
                <dd className="t-muted" style={{ margin: 0 }}>
                  {item.body}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="section band-tint" aria-labelledby="signals-title">
        <div className="container grid split">
          <div className="split__aside">
            <h2 id="signals-title" className="section-title" style={{ marginBottom: "1.5rem" }}>
              <span className="hole" aria-hidden="true" />
              When to call us
            </h2>
            <p className="t-muted">Clients usually reach out when one of these sounds familiar.</p>
          </div>
          <ul className="split__main check-list">
            {service.signals.map((s, i) => (
              <Reveal as="li" key={s} delay={i * 0.06}>
                <span className="hole" aria-hidden="true" />
                <span className="t-lead" style={{ color: "var(--ink)" }}>
                  {s}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section container" aria-label="Next service">
        <Link href={`/services/${next.slug}`} className="next-service">
          <span>
            <span className="t-caption" style={{ display: "block", marginBottom: "0.75rem" }}>
              Next service
            </span>
            <span className="t-h2">{next.title}</span>
          </span>
          <ArrowRight size={36} />
        </Link>
      </section>

      <Closing />
    </div>
  );
}
