import { useTranslations } from "next-intl";
import { Check, Stethoscope, Users, Zap } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatApproxLyd } from "@/lib/utils";

export default function PricingPage() {
  const t = useTranslations("pricing");

  const tiers = [
    {
      id: "guide",
      name: t("tiers.guide.name"),
      focus: t("tiers.guide.focus"),
      usdAmount: 50,
      strategy: t("tiers.guide.strategy"),
      features: [
        t("tiers.guide.features.0"),
        t("tiers.guide.features.1"),
        t("tiers.guide.features.2"),
        t("tiers.guide.features.3"),
      ],
      popular: false,
    },
    {
      id: "protocol",
      name: t("tiers.protocol.name"),
      focus: t("tiers.protocol.focus"),
      usdAmount: 150,
      strategy: t("tiers.protocol.strategy"),
      features: [
        t("tiers.protocol.features.0"),
        t("tiers.protocol.features.1"),
        t("tiers.protocol.features.2"),
        t("tiers.protocol.features.3"),
        t("tiers.protocol.features.4"),
        t("tiers.protocol.features.5"),
        t("tiers.protocol.features.6"),
      ],
      popular: true,
    },
  ];

  const whyItems = [
    { icon: Stethoscope },
    { icon: Users },
    { icon: Zap },
  ];

  return (
    <div className="relative isolate bg-background py-16 sm:py-24">
      {/* Background decoration */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#67e8f9] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h1 className="marketing-hero-title mb-4">{t("title")}</h1>
          <p className="marketing-section-lead mx-auto max-w-2xl">
            {t("lead")}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-3xl border p-8 shadow-sm transition-all hover:shadow-md ${
                tier.popular
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  {t("tiers.protocol.popular")}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                <p className="mt-4 text-sm text-muted-foreground">{tier.focus}</p>
              </div>

              <div className="mb-8">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-4xl font-black tracking-tight text-foreground">
                    ${tier.usdAmount}
                  </span>
                  <span className="text-lg font-semibold text-muted-foreground">
                    {formatApproxLyd(tier.usdAmount)}
                  </span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tier.strategy}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <WhatsAppButton
                className="w-full"
                variant={tier.popular ? "default" : "outline"}
                label={t("cta")}
              />
            </div>
          ))}
        </div>

        {/* Why choose us section */}
        <div className="mt-24 sm:mt-32">
          <div className="text-center">
            <h2 className="marketing-section-title mb-12">{t("why.title")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {whyItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {t(`why.items.${i}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`why.items.${i}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
