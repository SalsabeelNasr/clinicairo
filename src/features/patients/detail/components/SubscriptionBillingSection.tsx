"use client"

import { Button } from "@/components/Button"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { MockSubscription } from "@/data/mock/subscriptions"
import type { MockPayment } from "@/data/mock/payments"
import { formatProfileDate } from "../patient-profile.utils"

interface SubscriptionBillingSectionProps {
  subscription: MockSubscription | null
  latestPayment: MockPayment | null
  tierLabel: string | null
  statusLabel: string | null
  canVerify: boolean
  onVerifyPayment?: () => void
  verifying?: boolean
}

export function SubscriptionBillingSection({
  subscription,
  latestPayment,
  tierLabel,
  statusLabel,
  canVerify,
  onVerifyPayment,
  verifying,
}: SubscriptionBillingSectionProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()

  if (!subscription && !latestPayment) {
    return <p className="text-theme-sm text-gray-500">{t.profile.noSubscription}</p>
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {subscription && (
        <>
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
            <p className="mt-0.5 text-sm font-semibold text-gray-800">{statusLabel ?? subscription.status}</p>
            <p className="mt-0.5 text-theme-xs text-gray-500">
              {t.profile.nextRenewal}: {formatProfileDate(subscription.next_renewal, lang)}
            </p>
          </div>
        </>
      )}
      {latestPayment && (
        <div className="sm:col-span-2">
          <p className="text-theme-xs text-gray-500">{t.profile.lastPayment}</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-800" dir="ltr">
            {latestPayment.amount.toLocaleString("en-US")} {latestPayment.currency} · {latestPayment.status}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {latestPayment.receipt_ref && (
              <a
                href={latestPayment.receipt_ref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-xs text-primary-700 hover:text-primary-800"
              >
                {t.profile.viewReceipt}
              </a>
            )}
            {canVerify && latestPayment.status === "submitted" && onVerifyPayment && (
              <Button variant="secondary" size="sm" onClick={onVerifyPayment} disabled={verifying}>
                {t.profile.verifyPayment}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
