import type { CurrencyCode } from "./clinic-settings"

export interface MockExpense {
  id: string
  category: string
  amount: number
  currency: CurrencyCode
  vendor: string
  method: string
  date: string
  receipt_ref: string | null
}

export const mockExpenses: MockExpense[] = [
  {
    id: "expense-001",
    category: "Marketing",
    amount: 200,
    currency: "USD",
    vendor: "Meta Ads",
    method: "card",
    date: "2026-06-01",
    receipt_ref: null,
  },
  {
    id: "expense-002",
    category: "Operations",
    amount: 300,
    currency: "LYD",
    vendor: "Local agent",
    method: "cash",
    date: "2026-05-30",
    receipt_ref: "/mock/receipt-sample.jpg",
  },
]
