import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DoctorVideoCarousel } from "@/components/doctors/doctor-video-carousel";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Link } from "@/i18n/navigation";
import { getDoctorBySlug, listDoctors } from "@/lib/data/doctors";
import { getVideosByDoctor } from "@/lib/data/videos";
import { ROUTES } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listDoctors().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return {};
  return {
    title: `${doctor.name} | CureFit`,
    description: doctor.bio,
  };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  const t = await getTranslations("doctors");

  if (!doctor) notFound();

  const videos = getVideosByDoctor(doctor.id);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-16">
      <Link
        href={ROUTES.home}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <span aria-hidden>→</span> {t("backToHome")}
      </Link>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative size-32 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted sm:size-40">
              <Image
                src={doctor.imageUrl}
                alt={doctor.name}
                fill
                className="object-cover"
                sizes="160px"
                priority
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                {doctor.name}
              </h1>
              <p className="text-lg font-medium text-primary">{doctor.title}</p>
              <p className="text-muted-foreground">{doctor.specialty}</p>
              <p className="text-sm text-muted-foreground">
                {doctor.yearsExperience} {t("years")}
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">{t("bioHeading")}</h2>
            <p className="leading-relaxed text-muted-foreground">{doctor.bio}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">{t("highlightsHeading")}</h2>
            <ul className="list-disc space-y-2 ps-5 text-muted-foreground">
              {doctor.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <DoctorVideoCarousel videos={videos} heading={t("videosHeading")} />
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="mb-4 text-sm text-muted-foreground">
              {t("bookWhatsApp")}
            </p>
            <WhatsAppButton className="w-full" size="lg" />
          </div>
        </aside>
      </div>
    </div>
  );
}
