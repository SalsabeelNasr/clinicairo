import Image from "next/image";
import { getTranslations } from "next-intl/server";

const STEPS = [
  {
    id: "today",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "week1",
    image: "/images/process-consultation.png",
  },
  {
    id: "week2_4",
    image: "/images/process-support.png",
  },
] as const;

export async function Process() {
  const t = await getTranslations("landing.process");

  return (
    <section className="bg-muted/30 py-12 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="marketing-section-title text-2xl sm:text-3xl md:text-4xl">
            {t("title")}
          </h2>
          <p className="marketing-section-lead text-base sm:text-lg">
            {t("lead")}
          </p>
        </div>
        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-4 sm:mt-16 sm:max-w-none sm:grid sm:grid-cols-3 sm:gap-8">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md sm:rounded-3xl"
            >
              <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[16/10]">
                <Image
                  src={step.image}
                  alt={t(`steps.${step.id}.title`)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 640px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 start-3 sm:bottom-4 sm:start-4">
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm sm:px-3 sm:py-1 sm:text-xs">
                    {t(`steps.${step.id}.time`)}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h3 className="text-base font-bold text-foreground sm:text-xl">
                  {t(`steps.${step.id}.title`)}
                </h3>
                <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-muted-foreground sm:mt-3 sm:text-sm">
                  {t(`steps.${step.id}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
