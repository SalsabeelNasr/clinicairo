import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    key: "alone",
    image: "/images/pain-alone.png",
  },
  {
    key: "regain",
    image: "/images/pain-regain.png",
    position: "object-top",
  },
  {
    key: "access",
    image: "/images/pain-access.png",
    position: "object-center",
  },
] as const;

export async function PainPoints() {
  const t = await getTranslations("landing.painPoints");

  return (
    <section className="border-y border-border bg-muted/40 py-12 sm:py-24">
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
          {ITEMS.map((item) => (
            <div
              key={item.key}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md sm:rounded-3xl"
            >
              <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[16/10]">
                <Image
                  src={item.image}
                  alt={t(`items.${item.key}.title`)}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-500 group-hover:scale-105",
                    "position" in item ? item.position : "object-center",
                  )}
                  sizes="(min-width: 640px) 33vw, 400px"
                />
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h3 className="text-base font-bold text-foreground sm:text-lg">
                  {t(`items.${item.key}.title`)}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                  {t(`items.${item.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
