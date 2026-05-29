import { getTranslations } from "next-intl/server";
import { Stethoscope, Users, Bot } from "lucide-react";
import { InstagramReelsCarousel } from "@/components/landing/instagram-reels-carousel";
import { LANDING_REEL_EMBEDS } from "@/lib/landing/clinicairo-reel-embeds";

const ITEMS = [
  { key: "leadership", Icon: Stethoscope },
  { key: "staff", Icon: Users },
  { key: "ai", Icon: Bot },
] as const;

export async function WhyClinicairo() {
  const t = await getTranslations("landing.why");

  return (
    <section className="border-y border-border/50 bg-white py-12 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-3 text-center sm:space-y-4">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            {t("title")}
          </h2>
          <p className="marketing-section-lead mx-auto max-w-2xl text-base sm:text-lg">
            {t("lead")}
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-4 sm:mt-16 sm:max-w-none sm:grid sm:grid-cols-3 sm:gap-8">
          {ITEMS.map(({ key, Icon }) => (
            <div
              key={key}
              className="relative flex flex-col items-center rounded-2xl border border-border/60 bg-muted/20 p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-sm sm:border-transparent sm:bg-transparent sm:p-8 sm:hover:-translate-y-1"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mb-6 sm:size-16 sm:rounded-2xl">
                <Icon className="size-6 sm:size-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-bold text-foreground sm:text-xl">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:text-sm">
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/50 pt-10 sm:mt-20 sm:pt-16">
          <InstagramReelsCarousel items={LANDING_REEL_EMBEDS} />
        </div>
      </div>
    </section>
  );
}
