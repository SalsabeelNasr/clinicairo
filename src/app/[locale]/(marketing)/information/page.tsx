import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { InstagramReelsCarousel } from "@/components/landing/instagram-reels-carousel";
import { TreatmentLogos } from "@/components/information/treatment-logos";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { BRAND_NAME } from "@/lib/constants";
import { INFORMATION_REEL_EMBEDS } from "@/lib/landing/curefit-reel-embeds";

const SECTION_KEYS = [
  "why",
  "how",
  "who",
  "which",
  "injectionsWork",
  "sideEffects",
  "dangerous",
  "noSupervision",
  "expectedResults",
  "selfAdmin",
  "whoCanReceive",
  "whichSuitable",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("information");
  return {
    title: `${t("pageTitle")} | ${BRAND_NAME}`,
    description: t("pageLead"),
  };
}

export default async function InformationPage() {
  const t = await getTranslations("information");

  return (
    <article>
      <header className="relative overflow-hidden border-b border-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-14 pb-7 sm:px-6 sm:pt-20 sm:pb-10 lg:grid-cols-2 lg:items-center">
          <div className="relative z-10 space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {t("eyebrow")}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {t("pageTitle")}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("pageLead")}
            </p>
          </div>
          <div className="relative aspect-[4/3] bg-white lg:aspect-square">
            <Image
              src="/images/information-hero.png"
              alt={t("heroImageAlt")}
              fill
              unoptimized
              className="object-contain p-4"
              sizes="(min-width: 1024px) 480px, 100vw"
              priority
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-16 px-4 py-14 sm:px-6 sm:py-20">
        {SECTION_KEYS.map((key) => (
          <section key={key} className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t(`sections.${key}.title`)}
            </h2>
            <div className="space-y-4 whitespace-pre-line text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t(`sections.${key}.body`)
                .split("\n\n")
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
            </div>
          </section>
        ))}

        <TreatmentLogos />
      </div>

      <section className="border-t border-border bg-muted/30 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl md:text-start">
            {t("videos.heading")}
          </h2>
          <InstagramReelsCarousel
            items={INFORMATION_REEL_EMBEDS}
            messagesNamespace="information.videos"
          />
        </div>
      </section>

      <section className="bg-primary py-14 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-3xl space-y-6 px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">{t("cta.title")}</h2>
          <p className="text-base text-primary-foreground/90 sm:text-lg">
            {t("cta.subtitle")}
          </p>
          <WhatsAppButton
            size="lg"
            showIcon
            label={t("cta.button")}
            className="mt-2 bg-white text-primary hover:bg-white/90"
          />
        </div>
      </section>
    </article>
  );
}
