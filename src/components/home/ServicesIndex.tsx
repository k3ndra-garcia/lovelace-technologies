import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceGraphic } from "@/components/ServiceGraphic";
import { services } from "@/content/site";
import { vars } from "@/lib/css";

export function ServicesIndex() {
  return (
    <section id="services" className="section container" aria-labelledby="services-title">
      <div className="services-grid">
        <div className="panel panel--intro">
          <h2 id="services-title" className="section-title">
            <span className="hole" aria-hidden="true" />
            Services
          </h2>
          <div>
            <LineReveal
              as="p"
              className="t-h3"
              lines={["Five practices,", "one team", "accountable", "for results."]}
            />
            <p className="t-muted" style={{ marginTop: "1.25rem" }}>
              Each stands on its own, and they work together as your needs move from diagnosis to
              delivery.
            </p>
          </div>
          <Link href="/services" className="text-link" style={{ justifySelf: "start" }}>
            How our services fit together
          </Link>
        </div>

        {services.map((service, i) => (
          <Reveal
            as="div"
            key={service.slug}
            delay={i * 0.06}
            y={18}
            className="panel panel--service"
            style={vars({ "--service": `var(--c-${service.color})`, "--mark": `var(--c-${service.color})` })}
          >
            <Link href={`/services/${service.slug}`} className="panel__link">
              <span className="panel__art">
                <ServiceGraphic slug={service.slug} />
              </span>
              <h3 className="panel__title t-h4">
                <span className="hole" aria-hidden="true" />
                {service.title}
              </h3>
              <p className="panel__summary t-muted">{service.summary}</p>
              <span className="panel__go" aria-hidden="true">
                <ArrowRight size={20} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
