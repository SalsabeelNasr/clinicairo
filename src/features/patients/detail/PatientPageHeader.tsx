"use client"

import { RiCalendarLine, RiVideoChatLine } from "@remixicon/react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { Patient } from "@/features/patients/patients.types"
import { cn } from "@/lib/utils"
import { formatProfileDateTime } from "./patient-profile.utils"
import { InlineComplaintField } from "./components/InlineComplaintField"

interface HeaderAppointment {
  scheduled_at: string
  type: string
  online_call_link?: string
}

interface PatientPageHeaderProps {
  patient: Patient
  upcomingAppointment: HeaderAppointment | null
  lastAppointment: HeaderAppointment | null
  meetUrl?: string | null
  subscriptionStatusLabel?: string | null
  onUpdatePatient: (updates: Partial<Patient>) => Promise<void>
}

export function PatientPageHeader({
  patient,
  upcomingAppointment,
  lastAppointment,
  meetUrl,
  subscriptionStatusLabel,
  onUpdatePatient,
}: PatientPageHeaderProps) {
  const t = useAppTranslations()
  const { lang, isRtl } = useLocale()
  const ts = t.profile.teleStrip
  const showNext = Boolean(upcomingAppointment)
  const displayAppointment = showNext ? upcomingAppointment : lastAppointment
  const appointmentLabel = showNext ? ts.nextAppointment : ts.lastAppointment

  return (
    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <div className="min-w-0 flex-1">
        <div
          className="max-w-3xl text-start"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="m-0 p-0 text-title-sm font-bold leading-tight text-gray-800">
              {patient.first_name} {patient.last_name}
            </h1>
            {patient.age != null && (
              <span className="app-pill app-pill--muted shrink-0">
                {patient.age}y · {patient.gender}
              </span>
            )}
            {subscriptionStatusLabel && patient.subscription_status && (
              <span className="app-pill app-pill--primary shrink-0 text-[10px]">
                {subscriptionStatusLabel}
              </span>
            )}
          </div>
          <InlineComplaintField
            value={patient.complaint}
            placeholder={t.profile.placeholderComplaint}
            onSave={(complaint) => onUpdatePatient({ complaint })}
            isRtl={isRtl}
            className="mt-1 w-full truncate text-theme-sm font-normal leading-5 text-gray-600"
          />
        </div>
        {(patient.status !== "active" || patient.is_cold) && (
          <div className="mt-2 flex max-w-3xl flex-wrap items-center gap-2 text-start">
            {patient.status !== "active" && (
              <span className="app-pill app-pill--muted">{patient.status}</span>
            )}
            {patient.is_cold && (
              <span className="app-pill app-pill--warning">{t.profile.patientCold}</span>
            )}
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex shrink-0 flex-col gap-2",
          isRtl ? "items-start text-start" : "items-end text-end",
        )}
      >
        {displayAppointment ? (
          <div className="min-w-[10rem]">
            <p
              className={cn(
                "mb-1 flex items-center gap-1 text-theme-xs text-gray-500",
                isRtl ? "justify-start" : "justify-end",
              )}
            >
              <RiCalendarLine className="size-3.5 shrink-0" aria-hidden />
              {appointmentLabel}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {formatProfileDateTime(displayAppointment.scheduled_at, lang)}
            </p>
            <p className="text-theme-xs text-gray-500">{displayAppointment.type}</p>
            {showNext && displayAppointment.online_call_link && (
              <a
                href={displayAppointment.online_call_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-theme-xs text-primary-700 hover:text-primary-800"
              >
                {t.profile.openMeetLink}
              </a>
            )}
          </div>
        ) : (
          <p className="text-theme-sm text-gray-500">{ts.noAppointment}</p>
        )}
        {meetUrl && (
          <a
            href={meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="app-btn--join"
          >
            <RiVideoChatLine className="app-btn--join__icon" />
            <span>{t.profile.joinCall}</span>
          </a>
        )}
      </div>
    </div>
  )
}
