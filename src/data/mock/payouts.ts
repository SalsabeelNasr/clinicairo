import type { CurrencyCode } from "./clinic-settings"

export interface MockPayout {
  id: string
  staff_id: string
  period: string
  amount: number
  currency: CurrencyCode
  status: "pending" | "paid"
}

export const mockPayouts: MockPayout[] = [
  {
    id: "payout-001",
    staff_id: "user-002",
    period: "2026-05",
    amount: 800,
    currency: "USD",
    status: "paid",
  },
  {
    id: "payout-002",
    staff_id: "user-004",
    period: "2026-05",
    amount: 1500,
    currency: "LYD",
    status: "pending",
  },
]
