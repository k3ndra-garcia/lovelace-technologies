import { Approach } from "@/components/home/Approach";
import { Closing } from "@/components/home/Closing";
import { Founders } from "@/components/home/Founders";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { ServicesIndex } from "@/components/home/ServicesIndex";
import { Through } from "@/components/home/Through";
import { Work } from "@/components/home/Work";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <ServicesIndex />
      <Approach />
      <Through />
      <Founders />
      <Work />
      <Closing />
    </>
  );
}
