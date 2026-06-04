import { mockData } from "@/data/mock/mock-data"
import type { MockPayment } from "@/data/mock/payments"

export function listPaymentsByPatient(patientId: string): MockPayment[] {
  return mockData.payments
    .filter((p) => p.patient_id === patientId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
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
  return payment
}
