"use client"

import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { MockSubscription } from "@/data/mock/subscriptions"
import { formatProfileDate } from "../patient-profile.utils"

interface SubscriptionBillingSectionProps {
  subscription: MockSubscription | null
  tierLabel: string | null
  statusLabel: string | null
}

export function SubscriptionBillingSection({
  subscription,
  tierLabel,
  statusLabel,
}: SubscriptionBillingSectionProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()

  if (!subscription) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <p className="text-theme-xs text-gray-500">{t.profile.subscriptionTier}</p>
        <p className="mt-0.5 text-sm font-semibold text-gray-800">
          {tierLabel ?? subscription.tier}
          {subscription.price != null && (
            <span className="ms-1 font-normal text-gray-500" dir="ltr">
              · {subscription.price.toLocaleString("en-US")} {subscription.currency}
            </span>
          )}
        </p>
      </div>
      <div>
        <p className="text-theme-xs text-gray-500">{t.profile.subscriptionStatus}</p>
        <p className="mt-0.5 text-sm font-semibold text-gray-800">
          {statusLabel ?? subscription.status}
        </p>
        <p className="mt-0.5 text-theme-xs text-gray-500">
          {t.profile.nextRenewal}: {formatProfileDate(subscription.next_renewal, lang)}
        </p>
      </div>
      {subscription.consultations_remaining != null && (
        <div className="sm:col-span-2">
          <p className="text-theme-xs text-gray-500">{t.profile.consultationsRemaining}</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-800" dir="ltr">
            {subscription.consultations_remaining.toLocaleString("en-US")}
          </p>
        </div>
      )}
    </div>
  )
}
