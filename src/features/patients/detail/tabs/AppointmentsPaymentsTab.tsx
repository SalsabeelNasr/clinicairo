"use client"

import { RiCalendarLine, RiMoneyDollarCircleLine } from "@remixicon/react"
import { useLocale } from "@/contexts/locale-context"
import { useAppTranslations } from "@/lib/useAppTranslations"
import type { PatientPageData } from "../usePatientPageData"
import { formatProfileDate, formatProfileDateTime } from "../patient-profile.utils"

interface AppointmentsPaymentsTabProps {
  data: PatientPageData
}

export function AppointmentsPaymentsTab({ data }: AppointmentsPaymentsTabProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const s = t.profile.section

  if (data.appointments.length === 0 && data.payments.length === 0) {
    return <p className="text-theme-sm text-gray-500">{t.profile.emptyOps}</p>
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-2 flex items-center gap-1 text-theme-sm font-semibold text-gray-800">
          <RiCalendarLine className="size-4" />
          {s.appointments}
        </h3>
        <div className="space-y-2">
          {data.appointments.map((item) => (
            <div key={item.id} className="rounded-lg border border-gray-100 p-3 text-theme-sm">
              <p className="font-medium text-gray-800">
                {item.type} · {item.status}
              </p>
              <p className="text-theme-xs text-gray-500">
                {formatProfileDateTime(item.scheduled_at, lang)}
              </p>
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
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 flex items-center gap-1 text-theme-sm font-semibold text-gray-800">
          <RiMoneyDollarCircleLine className="size-4" />
          {s.payments}
        </h3>
        <div className="space-y-2">
          {data.payments.map((item) => (
            <div key={item.id} className="rounded-lg border border-gray-100 p-3 text-theme-sm">
              <p className="font-medium text-gray-800" dir="ltr">
                {item.amount.toLocaleString("en-US")} {item.currency}
              </p>
              <p className="text-theme-xs text-gray-500">
                {item.status} · {formatProfileDate(item.created_at, lang)}
              </p>
              {item.receipt_ref && (
                <a
                  href={item.receipt_ref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-theme-xs text-primary-700"
                >
                  {t.profile.viewReceipt}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
