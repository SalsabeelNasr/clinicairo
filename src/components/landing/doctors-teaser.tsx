"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { HorizontalScrollCarousel } from "@/components/ui/horizontal-scroll-carousel";
import { listDoctors } from "@/lib/data/doctors";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function DoctorsTeaser() {
  // const t = useTranslations("landing.doctorsTeaser");
  // const doctors = listDoctors();

  return null;
  /*
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-bold text-[#2D2D2D] sm:text-4xl">
            {t("title")}
          </h2>
          <p className="marketing-section-lead mx-auto max-w-2xl text-[#555555]">
            {t("lead")}
          </p>
        </div>

        <HorizontalScrollCarousel
          className="mt-16"
          itemCount={doctors.length}
          fadeFrom="from-background"
          scrollerClassName="gap-4 pb-8 sm:gap-8"
        >
          {doctors.map((doctor) => (
            <article
              key={doctor.id}
              data-carousel-slide
              className="flex w-[min(42vw,10rem)] shrink-0 snap-center flex-col items-center gap-3 sm:w-40"
            >
              <Link
                href={ROUTES.doctor(doctor.slug)}
                className="group flex w-full flex-col items-center gap-3 text-center"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-full bg-[#E8DCC4] shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 160px, 128px"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2D2D2D] sm:text-base">
                    {doctor.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-medium text-[#888888] sm:text-xs">
                    {doctor.title}
                  </p>
                </div>
              </Link>
              <Link
                href={ROUTES.doctor(doctor.slug)}
                className={cn(buttonVariants({ size: "sm" }), "w-full")}
              >
                {t("viewProfile")}
              </Link>
            </article>
          ))}
        </HorizontalScrollCarousel>
      </div>
    </section>
  );
  */
}
