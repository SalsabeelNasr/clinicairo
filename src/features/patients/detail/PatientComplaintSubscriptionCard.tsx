"use client"

import { useState } from "react"
import { RiBankCardLine, RiTeamLine } from "@remixicon/react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { canVerifyPayments } from "@/lib/permissions"
import { useUserClinic } from "@/contexts/user-clinic-context"
import type { MockSubscription } from "@/data/mock/subscriptions"
import type { MockPayment } from "@/data/mock/payments"
import { SubscriptionBillingSection } from "./components/SubscriptionBillingSection"

interface PatientComplaintSubscriptionCardProps {
  careTeam: { doctor?: string; nutritionist?: string; coach?: string }
  subscription: MockSubscription | null
  latestPayment: MockPayment | null
  tierLabel: string | null
  statusLabel: string | null
  onVerifyPayment?: () => Promise<void>
}

export function PatientComplaintSubscriptionCard({
  careTeam,
  subscription,
  latestPayment,
  tierLabel,
  statusLabel,
  onVerifyPayment,
}: PatientComplaintSubscriptionCardProps) {
  const t = useAppTranslations()
  const { currentUser } = useUserClinic()
  const [verifying, setVerifying] = useState(false)

  const canVerify = canVerifyPayments(currentUser) && latestPayment?.status === "submitted"
  const hasBilling = Boolean(subscription || latestPayment)

  return (
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
          <p className="mb-2 flex items-center gap-1.5 text-theme-xs font-semibold uppercase tracking-wider text-gray-500">
            <RiBankCardLine className="size-3.5" aria-hidden />
            {t.profile.subscriptionBilling}
          </p>
        {hasBilling ? (
          <SubscriptionBillingSection
            subscription={subscription}
            latestPayment={latestPayment}
            tierLabel={tierLabel}
            statusLabel={statusLabel}
            canVerify={canVerify}
            verifying={verifying}
            onVerifyPayment={
              onVerifyPayment
                ? async () => {
                    setVerifying(true)
                    try {
                      await onVerifyPayment()
                    } finally {
                      setVerifying(false)
                    }
                  }
                : undefined
            }
          />
        ) : (
          <p className="text-theme-sm text-gray-500">{t.profile.noSubscription}</p>
        )}
        </div>
      </div>
    </section>
  )
}
