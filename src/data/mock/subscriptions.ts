import type { CurrencyCode } from "./clinic-settings"

export type SubscriptionTier = "assessment" | "tier_1" | "tier_2"
export type SubscriptionStatus = "active" | "paused" | "grace" | "lapsed" | "cancelled"

export interface MockSubscription {
  id: string
  patient_id: string
  tier: SubscriptionTier
  price: number
  currency: CurrencyCode
  status: SubscriptionStatus
  start_date: string
  next_renewal: string
  consultations_remaining: number | null
}

export const mockSubscriptions: MockSubscription[] = [
  {
    id: "sub-001",
    patient_id: "patient-001",
    tier: "tier_1",
    price: 120,
    currency: "USD",
    status: "active",
    start_date: "2026-05-01",
    next_renewal: "2026-07-01",
    consultations_remaining: null,
  },
  {
    id: "sub-002",
    patient_id: "patient-002",
    tier: "tier_2",
    price: 954,
    currency: "LYD",
    status: "active",
    start_date: "2026-05-01",
    next_renewal: "2026-07-01",
    consultations_remaining: null,
  },
  {
    id: "sub-003",
    patient_id: "patient-003",
    tier: "tier_1",
    price: 120,
    currency: "USD",
    status: "grace",
    start_date: "2026-04-01",
    next_renewal: "2026-06-01",
    consultations_remaining: null,
  },
  {
    id: "sub-004",
    patient_id: "patient-005",
    tier: "tier_2",
    price: 150,
    currency: "USD",
    status: "paused",
    start_date: "2026-03-01",
    next_renewal: "2026-07-01",
    consultations_remaining: 2,
  },
]
