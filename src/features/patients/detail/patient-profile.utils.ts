import type { MockVisitNote, VisitNoteTrack } from "@/data/mock/visit-notes"
import type { VisitNoteTrackFilter } from "./patient-profile.types"
import type { Patient } from "@/features/patients/patients.types"

export const RED_FLAG_KEYS = [
  "has_pancreatitis",
  "is_pregnant",
  "is_breastfeeding",
  "has_heart_failure",
  "has_hepatic",
] as const

export const CONTRAINDICATION_KEYS = [
  "is_diabetic",
  "is_hypertensive",
  "has_pancreatitis",
  "is_pregnant",
  "is_breastfeeding",
  "glp1a_previous_exposure",
  "has_rheumatoid",
  "has_ihd",
  "has_heart_failure",
  "has_gerd",
  "has_gastritis",
  "has_hepatic",
  "has_anaemia",
  "has_bronchial_asthma",
] as const

export type PatientFlagKey = (typeof CONTRAINDICATION_KEYS)[number]

export function formatProfileDate(dateString: string, lang: "ar" | "en"): string {
  return new Date(dateString).toLocaleDateString(lang === "ar" ? "ar-LY-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatProfileDateTime(dateString: string, lang: "ar" | "en"): string {
  return new Date(dateString).toLocaleString(lang === "ar" ? "ar-LY-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function trackLabel(track: VisitNoteTrack | "all", lang: "ar" | "en", trackAll: string): string {
  if (track === "all") return trackAll
  if (track === "consultation") return lang === "ar" ? "الطبيب" : "Doctor"
  if (track === "nutrition") return lang === "ar" ? "التغذية" : "Nutrition"
  if (track === "coaching") return lang === "ar" ? "اللياقة" : "Coaching"
  return lang === "ar" ? "عام" : "Ad-hoc"
}

export const VISIT_NOTE_TRACK_FILTERS = ["all", "consultation", "nutrition", "coaching"] as const

export function filterVisitNotes(
  notes: MockVisitNote[],
  trackFilter: VisitNoteTrackFilter,
): MockVisitNote[] {
  const sorted = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  if (trackFilter === "all") return sorted
  if (trackFilter === "consultation") {
    return sorted.filter((n) => n.track === "consultation" || n.track === "ad-hoc")
  }
  return sorted.filter((n) => n.track === trackFilter)
}

export function hasPatientFlag(patient: Patient, key: PatientFlagKey): boolean {
  return Boolean(patient[key])
}

export function whatsAppHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`
}

export function computeBmi(weightKg: number, heightCm: number): number | null {
  if (weightKg <= 0 || heightCm <= 0) return null
  const heightM = heightCm / 100
  return Number((weightKg / (heightM * heightM)).toFixed(1))
}
