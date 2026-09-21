import type { Metadata } from "next";
import { Closing } from "@/components/home/Closing";
import { Work } from "@/components/home/Work";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Engagements from Lovelace Technologies across AI enablement, implementation, audits, governance, and strategy.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        title={["Case studies"]}
        lead="Engagements across AI enablement, implementation, audits, governance, and strategy, shared with our clients' permission."
      />
      <Work heading={false} />
      <Closing />
    </>
  );
}
