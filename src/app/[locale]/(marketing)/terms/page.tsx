import { getTranslations } from "next-intl/server";

const SECTION_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

export default async function TermsPage() {
  const t = await getTranslations("terms");

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 border-b border-border pb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
      </header>

      <div className="mb-12 whitespace-pre-line text-base leading-relaxed text-foreground/90">
        {t("intro")}
      </div>

      <div className="space-y-12">
        {SECTION_KEYS.map((key) => (
          <section key={key} className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              {t(`sections.${key}.title`)}
            </h2>
            <div className="whitespace-pre-line text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t(`sections.${key}.body`)}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
