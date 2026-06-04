import type { CurrencyCode } from "./clinic-settings"

export interface MockRefund {
  id: string
  payment_id: string
  patient_id: string
  amount: number
  currency: CurrencyCode
  reason: string
  receipt_ref: string | null
  created_by: string
  created_at: string
}

export const mockRefunds: MockRefund[] = [
  {
    id: "refund-001",
    payment_id: "pay-004",
    patient_id: "patient-004",
    amount: 50,
    currency: "USD",
    reason: "Assessment cancelled within refund window",
    receipt_ref: null,
    created_by: "user-001",
    created_at: "2026-05-29T15:00:00.000Z",
  },
]
