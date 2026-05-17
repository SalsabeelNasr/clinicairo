import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { TREATMENT_LOGOS } from "@/lib/data/information";

export async function TreatmentLogos() {
  const t = await getTranslations("information.treatments");

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          {t("lead")}
        </p>
      </div>

      <ul className="grid gap-6 sm:grid-cols-3">
        {TREATMENT_LOGOS.map((treatment) => (
          <li
            key={treatment.id}
            className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
          >
            <div className="relative mb-5 flex h-20 w-full items-center justify-center">
              <Image
                src={treatment.image}
                alt={t(`${treatment.translationKey}.name`)}
                width={200}
                height={80}
                className="max-h-16 w-auto object-contain"
              />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {t(`${treatment.translationKey}.name`)}
            </h3>
            <p className="mt-1 text-sm font-medium text-primary">
              {t(`${treatment.translationKey}.ingredient`)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t(`${treatment.translationKey}.description`)}
            </p>
          </li>
        ))}
      </ul>

      <p className="rounded-xl border border-border/80 bg-muted/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        {t("disclaimer")}
      </p>
    </section>
  );
}
