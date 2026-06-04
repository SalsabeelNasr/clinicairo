"use client"

import { RiCalendarCheckLine } from "@remixicon/react"
import { useLocale } from "@/contexts/locale-context"
import { useAppTranslations } from "@/lib/useAppTranslations"
import type { PatientPageData } from "../usePatientPageData"
import { formatProfileDateTime } from "../patient-profile.utils"
import { ProfileCardActionsMenu } from "../components/ProfileCardActionsMenu"
import { ProfileSectionCard } from "../components/ProfileSectionCard"
import { AppointmentsPaymentsTab } from "../tabs/AppointmentsPaymentsTab"

interface AppointmentsPaymentsSectionCardProps {
  data: PatientPageData
  defaultExpanded?: boolean
  onAddAppointment?: () => void
  canBook?: boolean
}

export function AppointmentsPaymentsSectionCard({
  data,
  defaultExpanded,
  onAddAppointment,
  canBook = true,
}: AppointmentsPaymentsSectionCardProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const tabs = t.profile.tabs
  const isEmpty = data.appointments.length === 0

  const parts: string[] = []
  if (data.upcomingAppointment) {
    parts.push(
      `${t.profile.teleStrip.nextAppointment}: ${formatProfileDateTime(data.upcomingAppointment.scheduled_at, lang)}`,
    )
  } else if (data.appointments[0]) {
    parts.push(
      `${t.profile.teleStrip.lastAppointment}: ${formatProfileDateTime(data.appointments[0].scheduled_at, lang)}`,
    )
  }
  if (data.appointments.length > 0) {
    parts.push(`${data.appointments.length} ${t.profile.section.appointments}`)
  }

  return (
    <ProfileSectionCard
      title={tabs.appointmentsPayments}
      icon={RiCalendarCheckLine}
      summary={isEmpty ? t.profile.emptyOps : parts.join(" · ") || "—"}
      defaultExpanded={defaultExpanded}
      headerAction={
        onAddAppointment ? (
          <ProfileCardActionsMenu
            ariaLabel={t.profile.section.appointments}
            onAdd={onAddAppointment}
            addLabel={t.profile.logNewAppointment}
          />
        ) : undefined
      }
    >
      <AppointmentsPaymentsTab
        data={data}
        onAddAppointment={onAddAppointment}
        canBook={canBook}
      />
    </ProfileSectionCard>
  )
}
