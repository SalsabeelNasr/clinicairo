import { mockData } from "@/data/mock/mock-data"
import { mockClinicSettings } from "@/data/mock/clinic-settings"
import type { CurrencyCode } from "@/data/mock/clinic-settings"
import type { MockPayment } from "@/data/mock/payments"
import type { SubscriptionTier } from "@/data/mock/subscriptions"
import { assessmentCreditExpiryIso } from "./billing.utils"

export interface RecordPaymentPayload {
  patientId: string
  doctorId: string | null
  type: SubscriptionTier
  amount: number
  currency: CurrencyCode
  method: string
  receiptRef: string | null
  uploadedBy: string
  appointmentId?: string | null
}

export function listPaymentsByPatient(patientId: string): MockPayment[] {
  return mockData.payments
    .filter((p) => p.patient_id === patientId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function recordPayment(payload: RecordPaymentPayload): Promise<MockPayment> {
  const payment: MockPayment = {
    id: `pay-${Date.now()}`,
    patient_id: payload.patientId,
    doctor_id: payload.doctorId,
    appointment_id: payload.appointmentId ?? null,
    type: payload.type,
    amount: payload.amount,
    currency: payload.currency,
    method: payload.method,
    status: "submitted",
    receipt_ref: payload.receiptRef,
    uploaded_by: payload.uploadedBy,
    verified_by: null,
    verified_at: null,
    credit_expires_at: payload.type === "assessment" ? assessmentCreditExpiryIso() : null,
    created_at: new Date().toISOString(),
  }
  mockData.payments.push(payment)
  return payment
}

function syncPatientSubscriptionFromPayment(payment: MockPayment): void {
  const patient = mockData.patients.find((p) => p.id === payment.patient_id)
  if (!patient) return

  patient.subscription_tier = payment.type

  if (payment.type === "assessment") {
    patient.subscription_status = "active"
    return
  }

  patient.subscription_status = "active"

  const tierPrices = mockClinicSettings.tier_prices[payment.type]
  const price =
    payment.currency === "LYD"
      ? tierPrices?.lyd
      : payment.currency === "EGP"
        ? tierPrices?.egp
        : tierPrices?.usd

  let sub = mockData.subscriptions.find((s) => s.patient_id === payment.patient_id)
  if (!sub) {
    const start = new Date()
    const renewal = new Date(start)
    renewal.setMonth(renewal.getMonth() + 1)
    sub = {
      id: `sub-${Date.now()}`,
      patient_id: payment.patient_id,
      tier: payment.type,
      price: price ?? payment.amount,
      currency: payment.currency,
      status: "active",
      start_date: start.toISOString().split("T")[0],
      next_renewal: renewal.toISOString().split("T")[0],
      consultations_remaining: mockClinicSettings.consultations_included_per_cycle,
    }
    mockData.subscriptions.push(sub)
  } else {
    sub.tier = payment.type
    sub.price = price ?? payment.amount
    sub.currency = payment.currency
    sub.status = "active"
    if (sub.consultations_remaining == null) {
      sub.consultations_remaining = mockClinicSettings.consultations_included_per_cycle
    }
  }
}

export async function verifyPayment(
  paymentId: string,
  verifierId: string,
): Promise<MockPayment | null> {
  const payment = mockData.payments.find((p) => p.id === paymentId)
  if (!payment || payment.status !== "submitted") return null
  payment.status = "verified"
  payment.verified_by = verifierId
  payment.verified_at = new Date().toISOString()
  syncPatientSubscriptionFromPayment(payment)
  return payment
}
