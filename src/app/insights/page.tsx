import type { Metadata } from "next";
import { ContactTrigger } from "@/components/ContactMenu";
import { Closing } from "@/components/home/Closing";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import { insights } from "@/content/site";

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical perspectives on AI, software, governance, and technology strategy from Lovelace Technologies.",
};

const topics = ["AI adoption", "Software selection", "Governance", "Technology strategy"];

export default function InsightsPage() {
  return (
    <>
      <PageHero
        title={["Insights"]}
        lead="Practical perspectives on AI, software, governance, and technology strategy, written for the people making the decisions."
      />

      <section className="container" style={{ paddingBottom: "var(--section-y)" }} aria-label="Articles">
        {insights.length > 0 ? (
          <ul className="def-list">
            {insights.map((post) => (
              <li key={post.slug} className="def-list__item">
                <p className="t-caption">
                  {post.topic}, {post.date}
                </p>
                <div>
                  <h2 className="t-h3">{post.title}</h2>
                  <p className="t-muted">{post.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="def-list">
            <Reveal className="def-list__item">
              <div>
                <p className="t-h3">Our first articles are in progress.</p>
              </div>
              <div style={{ display: "grid", gap: "1.5rem", justifyItems: "start" }}>
                <p className="t-muted">
                  We&apos;ll be writing about the questions clients ask us most. If there&apos;s a topic
                  you&apos;d like us to cover, or you&apos;d rather talk it through now, get in touch.
                </p>
                <ul className="interest-grid" aria-label="Upcoming topics">
                  {topics.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
                <ContactTrigger>Suggest a topic</ContactTrigger>
              </div>
            </Reveal>
          </div>
        )}
      </section>

      <Closing />
    </>
  );
}
