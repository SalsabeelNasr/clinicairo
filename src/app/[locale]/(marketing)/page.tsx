import { DoctorsTeaser } from "@/components/landing/doctors-teaser";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingHero } from "@/components/landing/hero";
import { PainPoints } from "@/components/landing/pain-points";
import { Process } from "@/components/landing/process";
import { WhyCliniCairo } from "@/components/landing/why-clinicairo";

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <PainPoints />
      <WhyCliniCairo />
      <Process />
      {/* <DoctorsTeaser /> */}
      <FinalCta />
    </>
  );
}
