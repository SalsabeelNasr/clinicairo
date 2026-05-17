import { getTranslations } from "next-intl/server";
import { WhatsAppButton } from "@/components/whatsapp-button";

export async function FinalCta() {
  const t = await getTranslations("landing.finalCta");

  return (
    <section className="bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto max-w-3xl space-y-6 px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
        <p className="text-lg text-primary-foreground/90">{t("subtitle")}</p>
        <WhatsAppButton
          size="lg"
          label={t("cta")}
          className="bg-white text-primary hover:bg-white/90"
        />
      </div>
    </section>
  );
}
