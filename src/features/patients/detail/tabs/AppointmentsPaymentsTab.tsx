"use client"

import { RiCalendarLine } from "@remixicon/react"
import { Button } from "@/components/Button"
import { useLocale } from "@/contexts/locale-context"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { cn } from "@/lib/utils"
import type { MockPayment } from "@/data/mock/payments"
import type { PatientPageData } from "../usePatientPageData"
import { getPaymentForAppointment } from "../billing.utils"
import { formatProfileDateTime } from "../patient-profile.utils"
import { ProfileExpandToggle, useProfileExpanded } from "../components/ProfileExpandable"

interface AppointmentsPaymentsTabProps {
  data: PatientPageData
  onAddAppointment?: () => void
  canBook?: boolean
}

function paymentHint(
  payment: MockPayment | undefined,
  t: ReturnType<typeof useAppTranslations>,
): string | null {
  if (!payment) return null
  if (payment.status === "submitted") return t.profile.paymentAwaitingVerification
  if (payment.status === "verified") return t.profile.paymentVerifiedLabel
  return payment.status
}

function AppointmentRow({
  item,
  lang,
  payments,
  isLatest,
}: {
  item: PatientPageData["appointments"][number]
  lang: "ar" | "en"
  payments: MockPayment[]
  isLatest?: boolean
}) {
  const t = useAppTranslations()
  const linked = getPaymentForAppointment(item.id, payments)
  const hint = paymentHint(linked, t)

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-100 p-3 text-theme-sm",
        isLatest && "border-primary-100 bg-primary-50/30",
      )}
    >
      {isLatest && (
        <span className="app-pill app-pill--primary mb-2 inline-block text-[10px]">
          {t.profile.currentAppointment}
        </span>
      )}
      <p className="font-medium text-gray-800">
        {item.type} · {item.status}
      </p>
      <p className="text-theme-xs text-gray-500">
        {formatProfileDateTime(item.scheduled_at, lang)}
      </p>
      {hint && <p className="mt-1 text-theme-xs text-gray-600">{hint}</p>}
      {item.online_call_link && (
        <a
          href={item.online_call_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-theme-xs text-primary-700"
        >
          {t.profile.openMeetLink}
        </a>
      )}
    </div>
  )
}

export function AppointmentsPaymentsTab({
  data,
  onAddAppointment,
  canBook = true,
}: AppointmentsPaymentsTabProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const { expanded: historyExpanded, toggle: toggleHistory } = useProfileExpanded()
  const sorted = data.appointments
  const latest = sorted[0] ?? null
  const history = sorted.slice(1)
  const hasHistory = history.length > 0

  if (sorted.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-theme-sm text-gray-500">{t.profile.emptyOps}</p>
        {onAddAppointment && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onAddAppointment}
            disabled={!canBook}
          >
            {t.profile.logNewAppointment}
          </Button>
        )}
        {!canBook && (
          <p className="text-theme-xs text-amber-800">{t.profile.bookingBlockedHint}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-1 text-theme-sm font-semibold text-gray-800">
        <RiCalendarLine className="size-4" />
        {t.profile.section.appointments}
      </h3>

      <AppointmentRow
        item={latest!}
        lang={lang}
        payments={data.payments}
        isLatest
      />

      {hasHistory && (
        <>
          <div
            className={cn(
              historyExpanded && "max-h-64 space-y-2 overflow-y-auto overscroll-contain",
            )}
          >
            {historyExpanded &&
              history.map((item) => (
                <AppointmentRow
                  key={item.id}
                  item={item}
                  lang={lang}
                  payments={data.payments}
                />
              ))}
          </div>
          <ProfileExpandToggle
            expanded={historyExpanded}
            onToggle={toggleHistory}
            expandLabel={t.profile.showAppointmentHistory.replace(
              "{n}",
              String(history.length),
            )}
          />
        </>
      )}
    </div>
  )
}
