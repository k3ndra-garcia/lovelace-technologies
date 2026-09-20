import type { Metadata } from "next";
import { ContactTrigger } from "@/components/ContactMenu";
import { Approach } from "@/components/home/Approach";
import { Closing } from "@/components/home/Closing";
import { Through } from "@/components/home/Through";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Approach",
  description: "Assess, prioritize, implement, enable: how Lovelace carries work from strategy through adoption.",
};

export default function ApproachPage() {
  return (
    <>
      <PageHero
        title={["From assessment", "to implementation."]}
        lead="Every engagement follows the same four stages. Some clients start at the beginning; others bring us in mid-stream. Either way, we stay accountable until your team owns the result."
      >
        <ContactTrigger />
      </PageHero>
      <Approach id="stages" />
      <Through />
      <Closing />
    </>
  );
}
