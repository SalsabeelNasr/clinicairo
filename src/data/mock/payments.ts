import type { CurrencyCode } from "./clinic-settings"
import type { SubscriptionTier } from "./subscriptions"

export type PaymentStatus = "submitted" | "verified" | "rejected" | "refunded"

export interface MockPayment {
  id: string
  patient_id: string
  doctor_id: string | null
  /** Links one-time assessment pay to a booked consultation. */
  appointment_id: string | null
  type: SubscriptionTier
  amount: number
  currency: CurrencyCode
  method: string
  status: PaymentStatus
  receipt_ref: string | null
  uploaded_by: string
  verified_by: string | null
  verified_at: string | null
  credit_expires_at: string | null
  created_at: string
}

export const mockPayments: MockPayment[] = [
  {
    id: "pay-001",
    patient_id: "patient-001",
    doctor_id: "user-002",
    type: "tier_1",
    amount: 120,
    currency: "USD",
    method: "transfer",
    status: "verified",
    receipt_ref: "/mock/receipt-sample.jpg",
    uploaded_by: "user-003",
    verified_by: "user-001",
    verified_at: "2026-06-01T10:00:00.000Z",
    appointment_id: null,
    credit_expires_at: null,
    created_at: "2026-06-01T09:30:00.000Z",
  },
  {
    id: "pay-002",
    patient_id: "patient-002",
    doctor_id: "user-002",
    type: "tier_2",
    amount: 954,
    currency: "LYD",
    method: "wallet",
    status: "verified",
    receipt_ref: "/mock/receipt-sample.jpg",
    uploaded_by: "user-003",
    verified_by: "user-001",
    verified_at: "2026-06-01T11:00:00.000Z",
    appointment_id: null,
    credit_expires_at: null,
    created_at: "2026-06-01T10:35:00.000Z",
  },
  {
    id: "pay-003",
    patient_id: "patient-003",
    doctor_id: "user-002",
    type: "assessment",
    amount: 50,
    currency: "USD",
    method: "transfer",
    status: "submitted",
    receipt_ref: "/mock/receipt-sample.jpg",
    uploaded_by: "user-003",
    verified_by: null,
    verified_at: null,
    appointment_id: null,
    credit_expires_at: "2026-06-17",
    created_at: "2026-06-03T12:00:00.000Z",
  },
]
