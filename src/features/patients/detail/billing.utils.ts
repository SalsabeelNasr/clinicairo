import { mockClinicSettings } from "@/data/mock/clinic-settings"
import type { MockPayment } from "@/data/mock/payments"
import type { MockSubscription, SubscriptionStatus } from "@/data/mock/subscriptions"
import type { Patient } from "@/features/patients/patients.types"

export type BillingGateKind =
  | "ok"
  | "pending_verification"
  | "subscription_inactive"
  | "no_coverage"

export interface BillingGate {
  kind: BillingGateKind
}

const BOOKABLE_SUB_STATUSES: SubscriptionStatus[] = ["active", "grace"]

export function hasPendingPayment(payments: MockPayment[]): boolean {
  return payments.some((p) => p.status === "submitted")
}

export function hasVerifiedAssessmentCredit(payments: MockPayment[]): boolean {
  const now = Date.now()
  return payments.some(
    (p) =>
      p.type === "assessment" &&
      p.status === "verified" &&
      (!p.credit_expires_at || new Date(p.credit_expires_at).getTime() >= now),
  )
}

export function subscriptionAllowsBooking(
  subscription: MockSubscription | null,
): boolean {
  if (!subscription) return false
  return BOOKABLE_SUB_STATUSES.includes(subscription.status)
}

export function canBookAppointment(
  patient: Patient,
  subscription: MockSubscription | null,
  payments: MockPayment[],
): boolean {
  if (hasPendingPayment(payments)) return false
  if (subscriptionAllowsBooking(subscription)) return true
  if (hasVerifiedAssessmentCredit(payments)) return true
  const status = patient.subscription_status
  if (status && BOOKABLE_SUB_STATUSES.includes(status as SubscriptionStatus)) {
    return true
  }
  return false
}

export function getBillingGate(
  patient: Patient,
  subscription: MockSubscription | null,
  payments: MockPayment[],
): BillingGate {
  if (hasPendingPayment(payments)) {
    return { kind: "pending_verification" }
  }
  if (canBookAppointment(patient, subscription, payments)) {
    return { kind: "ok" }
  }
  const inactive =
    subscription?.status === "lapsed" ||
    subscription?.status === "cancelled" ||
    subscription?.status === "paused" ||
    patient.subscription_status === "lapsed" ||
    patient.subscription_status === "cancelled" ||
    patient.subscription_status === "paused"
  if (inactive) {
    return { kind: "subscription_inactive" }
  }
  return { kind: "no_coverage" }
}

export function getPaymentForAppointment(
  appointmentId: string,
  payments: MockPayment[],
): MockPayment | undefined {
  return payments.find((p) => p.appointment_id === appointmentId)
}

export function assessmentCreditExpiryIso(): string {
  const days = mockClinicSettings.assessment_credit_window_days
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}
