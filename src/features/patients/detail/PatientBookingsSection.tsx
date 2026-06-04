"use client"

import { RiBankCardLine, RiTeamLine } from "@remixicon/react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import type { MockPayment } from "@/data/mock/payments"
import type { MockSubscription } from "@/data/mock/subscriptions"
import type { PatientPageData } from "./usePatientPageData"
import type { BillingGate } from "./billing.utils"
import { SubscriptionBillingSection } from "./components/SubscriptionBillingSection"
import { PaymentLedger } from "./components/PaymentLedger"
import { BillingGateBanner } from "./components/BillingGateBanner"
import { AppointmentsPaymentsSectionCard } from "./cards/AppointmentsPaymentsSectionCard"

interface PatientBookingsSectionProps {
  careTeam: { doctor?: string; nutritionist?: string; coach?: string }
  subscription: MockSubscription | null
  payments: MockPayment[]
  tierLabel: string | null
  statusLabel: string | null
  gate: BillingGate
  data: PatientPageData
  onRecordPayment: () => void
  onVerifyPayment: (paymentId: string) => Promise<void>
  onAddAppointment: () => void
  canRecordPayment: boolean
}

export function PatientBookingsSection({
  careTeam,
  subscription,
  payments,
  tierLabel,
  statusLabel,
  gate,
  data,
  onRecordPayment,
  onVerifyPayment,
  onAddAppointment,
  canRecordPayment,
}: PatientBookingsSectionProps) {
  const t = useAppTranslations()
  const hasBilling = Boolean(subscription || payments.length > 0)

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
        <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <RiBankCardLine className="size-4 text-primary-600" aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {t.profile.subscriptionBilling}
            </h2>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <BillingGateBanner gate={gate} />

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-theme-xs font-semibold uppercase tracking-wider text-gray-500">
              <RiTeamLine className="size-3.5" aria-hidden />
              {t.profile.careTeam}
            </p>
            <p className="text-theme-sm text-gray-700">
              {t.profile.careTeamDoctor}: {careTeam.doctor ?? "—"}
              {careTeam.nutritionist
                ? ` · ${t.profile.careTeamNutritionist}: ${careTeam.nutritionist}`
                : ""}
              {careTeam.coach ? ` · ${t.profile.careTeamCoach}: ${careTeam.coach}` : ""}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            {hasBilling ? (
              <SubscriptionBillingSection
                subscription={subscription}
                tierLabel={tierLabel}
                statusLabel={statusLabel}
              />
            ) : (
              <p className="text-theme-sm text-gray-500">{t.profile.noSubscription}</p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <PaymentLedger
              payments={payments}
              onRecordPayment={canRecordPayment ? onRecordPayment : undefined}
              onVerifyPayment={onVerifyPayment}
            />
          </div>
        </div>
      </section>

      <AppointmentsPaymentsSectionCard
        data={data}
        defaultExpanded
        onAddAppointment={onAddAppointment}
        canBook={gate.kind === "ok"}
      />
    </div>
  )
}
