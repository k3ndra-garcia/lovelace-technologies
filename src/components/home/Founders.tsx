import Link from "next/link";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";

export function Founders({ showLink = true }: { showLink?: boolean }) {
  return (
    <section
      className="section on-paper"
      aria-labelledby="founders-title"
      data-header-theme="light"
    >
      <div className="container grid">
        <div className="founders__note">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/lovelace-mark.png"
              alt=""
              width={206}
              height={256}
              style={{ width: "2.75rem", height: "auto", marginBottom: "2rem" }}
            />
          </Reveal>
          <LineReveal
            as="p"
            className="t-statement"
            lines={[
              "Named for Ada Lovelace,",
              "who saw in 1843 that a",
              "computing machine could",
              "do far more than calculate.",
            ]}
          />
        </div>

        <div className="founders__body">
          <h2 id="founders-title" className="section-title">
            <span className="hole" aria-hidden="true" />
            About Lovelace
          </h2>
          <Reveal>
            <p className="t-h3">Founded by Georgia Tech graduates.</p>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="t-muted">
              Our founders hold graduate degrees in business and management, including an MBA and an
              M.S. in Management. That pairing shapes how we work: fluent in the technology, grounded
              in budgets and operations, and focused on the people who have to use what we build.
            </p>
          </Reveal>

          {showLink && (
            <Link href="/about" className="text-link" style={{ justifySelf: "start" }}>
              More about Lovelace
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
