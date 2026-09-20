import Link from "next/link";
import { services } from "@/content/site";
import { vars } from "@/lib/css";
import { ArrowRight } from "./Icons";
import { Reveal } from "./motion/Reveal";

export function ServiceList({ className = "" }: { className?: string }) {
  return (
    <ul className={`services__list ${className}`}>
      {services.map((service, i) => (
        <Reveal
          as="li"
          key={service.slug}
          delay={i * 0.05}
          y={16}
          style={vars({ "--service": `var(--c-${service.color})` })}
        >
          <Link href={`/services/${service.slug}`} className="service-row">
            <h3 className="t-h3 service-row__title">
              <span className="hole" aria-hidden="true" />
              {service.title}
            </h3>
            <p className="service-row__summary">{service.summary}</p>
            <span className="service-row__go" aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
