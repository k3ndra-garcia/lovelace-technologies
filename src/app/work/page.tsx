import type { Metadata } from "next";
import { Closing } from "@/components/home/Closing";
import { Work } from "@/components/home/Work";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected engagements from Lovelace Technologies.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        title={["Selected work"]}
        lead="Engagements across AI enablement, implementation, audits, governance, and strategy, shared with our clients' permission."
      />
      <Work heading={false} />
      <Closing />
    </>
  );
}
