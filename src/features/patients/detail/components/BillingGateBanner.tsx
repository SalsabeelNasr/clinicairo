"use client"

import { RiErrorWarningLine } from "@remixicon/react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import type { BillingGate } from "../billing.utils"

interface BillingGateBannerProps {
  gate: BillingGate
}

export function BillingGateBanner({ gate }: BillingGateBannerProps) {
  const t = useAppTranslations()

  if (gate.kind === "ok") return null

  const message =
    gate.kind === "pending_verification"
      ? t.profile.gatePendingVerification
      : gate.kind === "subscription_inactive"
        ? t.profile.gateSubscriptionInactive
        : t.profile.gateNoCoverage

  return (
    <div
      className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-theme-sm text-amber-900"
      role="status"
    >
      <RiErrorWarningLine className="size-5 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  )
}
