import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WHATSAPP_URL } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Headphones,
  ShieldCheck,
  TrendingDown,
  Users,
  type LucideIcon,
} from "lucide-react";

const STAT_KEYS = ["support", "noHiddenFees", "weightLoss", "patients"] as const;

const STATS: { key: (typeof STAT_KEYS)[number]; Icon: LucideIcon }[] = [
  { key: "support", Icon: Headphones },
  { key: "noHiddenFees", Icon: ShieldCheck },
  { key: "weightLoss", Icon: TrendingDown },
  { key: "patients", Icon: Users },
];

export async function LandingHero() {
  const t = await getTranslations("landing.hero");

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex flex-col lg:flex-row lg:items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-bg.jpg"
          alt={t("imageAlt")}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative w-full py-12 lg:py-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start space-y-8 lg:space-y-10">
            <div className="space-y-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-7xl leading-[1.2] lg:leading-[1.1]">
                {t("title")}
              </h1>

              <ul className="inline-flex flex-col space-y-4 text-start">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-base sm:text-lg text-slate-700">
                    <div className="mt-1 flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-primary">
                      <CheckCircle2 className="size-3 sm:size-4 text-white" aria-hidden />
                    </div>
                    <span className="font-bold">{t(`bullets.${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-6 w-full sm:w-auto">
              <Link
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto min-h-[56px] sm:min-h-[64px] px-8 sm:px-12 text-lg sm:text-xl rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300",
                )}
              >
                {t("cta")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-y border-border/50 lg:absolute lg:bottom-0 lg:inset-x-0 lg:bg-white/80 lg:backdrop-blur-md lg:border-t lg:border-b-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 py-10 sm:gap-6 lg:grid-cols-4 lg:gap-8 lg:py-6">
            {STATS.map(({ key, Icon }) => (
              <div key={key} className="flex flex-col items-center text-center gap-3 sm:flex-row sm:text-start">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary sm:size-11">
                  <Icon className="size-5 text-white" aria-hidden />
                </div>
                <p className="text-xs font-bold text-slate-900 leading-tight sm:text-sm">
                  {t(`stats.${key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
