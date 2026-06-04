import type { PastMedication, PastProcedure } from "@/features/prescriptions/prescriptions.types"

export type PastHistoryItem =
  | { kind: "medication"; data: PastMedication }
  | { kind: "procedure"; data: PastProcedure }
