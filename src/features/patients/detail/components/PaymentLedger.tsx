"use client"

import { useState } from "react"
import { RiBankCardLine } from "@remixicon/react"
import { Button } from "@/components/Button"
import { useAppTranslations } from "@/lib/useAppTranslations"
import type { AppTranslations } from "@/lib/app-translations"
import { useLocale } from "@/contexts/locale-context"
import { canVerifyPayments } from "@/lib/permissions"
import { useUserClinic } from "@/contexts/user-clinic-context"
import type { MockPayment } from "@/data/mock/payments"
import { tierLabel } from "../patient-profile.labels"
import { formatProfileDate } from "../patient-profile.utils"
import { ProfileCardActionsMenu } from "./ProfileCardActionsMenu"

interface PaymentLedgerProps {
  payments: MockPayment[]
  onRecordPayment?: () => void
  onVerifyPayment: (paymentId: string) => Promise<void>
}

function paymentStatusLabel(status: MockPayment["status"], t: AppTranslations) {
  if (status === "submitted") return t.profile.paymentStatusSubmitted
  if (status === "verified") return t.profile.paymentStatusVerified
  if (status === "rejected") return t.profile.paymentStatusRejected
  return status
}

export function PaymentLedger({
  payments,
  onRecordPayment,
  onVerifyPayment,
}: PaymentLedgerProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const { currentUser } = useUserClinic()
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const canVerify = canVerifyPayments(currentUser)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2 rtl:flex-row-reverse">
        <p className="flex items-center gap-1.5 text-theme-xs font-semibold uppercase tracking-wider text-gray-500">
          <RiBankCardLine className="size-3.5" aria-hidden />
          {t.profile.paymentLedger}
        </p>
        {onRecordPayment && (
          <ProfileCardActionsMenu
            ariaLabel={t.profile.paymentLedger}
            onAdd={onRecordPayment}
            addLabel={t.profile.recordPayment}
          />
        )}
      </div>

      {payments.length === 0 ? (
        <p className="text-theme-sm text-gray-500">{t.profile.noPayments}</p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100">
          {payments.map((payment) => {
            const typeLabel = tierLabel(payment.type, t) ?? payment.type
            const showVerify = canVerify && payment.status === "submitted"
            return (
              <li key={payment.id} className="px-3 py-2.5">
                <div className="flex flex-wrap items-start justify-between gap-2 rtl:flex-row-reverse">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="app-pill app-pill--muted text-[10px]">{typeLabel}</span>
                      <span className="app-pill app-pill--primary text-[10px]">
                        {paymentStatusLabel(payment.status, t)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-gray-800" dir="ltr">
                      {payment.amount.toLocaleString("en-US")} {payment.currency}
                      <span className="ms-1 font-normal text-gray-500">· {payment.method}</span>
                    </p>
                    <p className="text-theme-xs text-gray-500">
                      {formatProfileDate(payment.created_at, lang)}
                      {payment.appointment_id && (
                        <span className="ms-1">· {t.profile.linkedAppointment}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {payment.receipt_ref && (
                      <a
                        href={payment.receipt_ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-theme-xs text-primary-700 hover:text-primary-800"
                      >
                        {t.profile.viewReceipt}
                      </a>
                    )}
                    {showVerify && (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={verifyingId === payment.id}
                        onClick={async () => {
                          setVerifyingId(payment.id)
                          try {
                            await onVerifyPayment(payment.id)
                          } finally {
                            setVerifyingId(null)
                          }
                        }}
                      >
                        {t.profile.verifyPayment}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
