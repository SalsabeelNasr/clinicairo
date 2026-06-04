import type { AppTranslations } from "@/lib/app-translations"
import type { PatientLabResult } from "./lab-result.types"
import { isLabFileEntry, isLabMetricEntry } from "./lab-file.utils"

export { isLabFileEntry, isLabMetricEntry }

export function sortLabResults(results: PatientLabResult[]): PatientLabResult[] {
  return [...results].sort(
    (a, b) =>
      b.test_date.localeCompare(a.test_date) || a.test_name.localeCompare(b.test_name),
  )
}

export function labStatusClass(status: string): string {
  if (status === "normal") return "text-green-700"
  if (status === "abnormal") return "text-red-700"
  if (status === "borderline") return "text-amber-700"
  return "text-gray-600"
}

export function labStatusLabel(status: string, t: AppTranslations): string {
  if (status === "normal") return t.profile.labStatusNormal
  if (status === "abnormal") return t.profile.labStatusAbnormal
  if (status === "borderline") return t.profile.labStatusBorderline
  return status
}
