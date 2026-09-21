import { Reveal } from "@/components/motion/Reveal";
import { ScrollInk } from "@/components/motion/ScrollInk";
import { vars } from "@/lib/css";

export function Intro() {
  return (
    <section className="section container" aria-labelledby="intro-title">
      <div className="grid">
        <div className="intro__aside">
          <h2 id="intro-title" className="section-title">
            <span className="hole" aria-hidden="true" />
            What we do
          </h2>
        </div>
        <div className="intro__body">
          <ScrollInk
            className="t-statement"
            text="We help leadership teams choose the right technology, then put it in place and make it stick."
          />
          <div className="intro__more">
            <Reveal style={vars({ "--mark": "var(--c-teal)" })}>
              <span className="hole" aria-hidden="true" style={{ marginBottom: "0.875rem" }} />
              <h3 className="t-h4">Built for established organizations</h3>
              <p className="t-muted" style={{ marginTop: "0.5rem" }}>
                We partner with mid-market and enterprise teams that need advisors fluent in both the
                technology and the business case.
              </p>
            </Reveal>
            <Reveal delay={0.08} style={vars({ "--mark": "var(--c-plum)" })}>
              <span className="hole" aria-hidden="true" style={{ marginBottom: "0.875rem" }} />
              <h3 className="t-h4">Clear enough to act on</h3>
              <p className="t-muted" style={{ marginTop: "0.5rem" }}>
                Plain-language findings and plans that leadership can approve and teams can follow,
                without a glossary.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
