import { DoctorsTeaser } from "@/components/landing/doctors-teaser";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingHero } from "@/components/landing/hero";
import { PainPoints } from "@/components/landing/pain-points";
import { Process } from "@/components/landing/process";
import { WhyCurefit } from "@/components/landing/why-curefit";

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <PainPoints />
      <WhyCurefit />
      <Process />
      <DoctorsTeaser />
      <FinalCta />
    </>
  );
}
