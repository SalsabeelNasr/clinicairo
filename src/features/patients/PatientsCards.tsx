"use client"

import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import { RiEyeLine, RiUserLine } from "@remixicon/react"
import Link from "next/link"
import type { PatientListItem } from "./patients.types"
import { calculateAge } from "./patients.utils"

interface PatientsCardsProps {
  patients: PatientListItem[]
}

function formatAge(age: number | string, lang: "ar" | "en"): string {
  if (typeof age !== "number") return String(age)
  return lang === "ar" ? `${age} سنة` : `${age}y`
}

function formatVisitDate(dateString: string | null, lang: "ar" | "en"): string {
  if (!dateString) return "—"
  // Use ar-LY-u-nu-latn to keep Arabic text but use Latin (English) numerals
  return new Date(dateString).toLocaleDateString(lang === "ar" ? "ar-LY-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function PatientsCards({ patients }: PatientsCardsProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()

  return (
    <div className="app-list">
      {patients.map((patient) => {
        const age = calculateAge(patient.date_of_birth, patient.age)
        const ageDisplay = formatAge(age, lang)
        const phone = patient.phone.replace(/\s/g, "")

        return (
          <article key={patient.id} className="app-row app-row--patient">
            <div className="app-row__main">
              <div className="app-row__avatar">
                <RiUserLine className="app-row__avatar-icon" aria-hidden />
              </div>
              <div className="app-row__divider" aria-hidden />
              <div className="app-row__info">
                <div className="app-row__title-row">
                  <h3 className="app-row__info-title">
                    {patient.first_name} {patient.last_name}
                  </h3>
                  <div className="app-row__chips">
                    <span className="app-pill app-pill--muted">{ageDisplay}</span>
                  </div>
                </div>
                {patient.complaint && (
                  <p className="app-row__info-subtitle">{patient.complaint}</p>
                )}
                {/* Mobile meta: vertically aligned under complaint */}
                <div className="mt-2 space-y-0.5 md:hidden">
                  <p className="app-row__meta-primary">{phone}</p>
                  <p className="app-row__meta-secondary">
                    {t.patients.visited}{" "}
                    {formatVisitDate(patient.lastAppointmentDate, lang)}
                  </p>
                </div>
              </div>
            </div>

            <div className="app-row__meta hidden md:block">
              <p className="app-row__meta-primary">{phone}</p>
              <p className="app-row__meta-secondary">
                {t.patients.visited}{" "}
                {formatVisitDate(patient.lastAppointmentDate, lang)}
              </p>
            </div>

            <div className="app-row__actions">
              <Link href={`/patients/${patient.id}`} className="app-btn--join" title={t.common.view}>
                <RiEyeLine className="app-btn--join__icon" aria-hidden />
                <span className="max-lg:hidden">{t.common.view}</span>
              </Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}
