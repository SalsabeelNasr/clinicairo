import type { PastMedication, PastProcedure } from "@/features/prescriptions/prescriptions.types"
import type { PastHistoryItem } from "./past-history.types"

function medicationSortDate(med: PastMedication): string {
  return med.takenTo ?? med.takenFrom
}

export function buildPastHistoryItems(
  medications: PastMedication[],
  procedures: PastProcedure[],
): PastHistoryItem[] {
  const items: PastHistoryItem[] = [
    ...medications.map((data) => ({ kind: "medication" as const, data })),
    ...procedures.map((data) => ({ kind: "procedure" as const, data })),
  ]

  return items.sort((a, b) => {
    const dateA =
      a.kind === "medication" ? medicationSortDate(a.data) : a.data.procedureDate
    const dateB =
      b.kind === "medication" ? medicationSortDate(b.data) : b.data.procedureDate
    return dateB.localeCompare(dateA)
  })
}
