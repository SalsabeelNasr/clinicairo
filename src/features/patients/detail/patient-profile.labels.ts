import type { VisitNoteTrack } from "@/data/mock/visit-notes"
import type { AppTranslations } from "@/lib/app-translations"
import type { VisitNoteTrackFilter } from "./patient-profile.types"

type T = AppTranslations

export function tierLabel(
  tier: string | null | undefined,
  t: T,
): string | null {
  if (!tier) return null
  if (tier === "assessment") return t.profile.tierAssessment
  if (tier === "tier_1") return t.profile.tier1
  if (tier === "tier_2") return t.profile.tier2
  return tier
}

export function subscriptionStatusLabel(
  status: string | null | undefined,
  t: T,
): string | null {
  if (!status) return null
  const map: Record<string, string> = {
    active: t.profile.statusActive,
    grace: t.profile.statusGrace,
    paused: t.profile.statusPaused,
    lapsed: t.profile.statusLapsed,
    cancelled: t.profile.statusCancelled,
  }
  return map[status] ?? status
}

export function defaultVisitTrackForRole(
  role: string,
): "consultation" | "nutrition" | "coaching" {
  if (role === "nutritionist") return "nutrition"
  if (role === "coach") return "coaching"
  return "consultation"
}

export function visitTrackForAdd(
  filter: VisitNoteTrackFilter,
  role: string,
): VisitNoteTrack {
  if (filter !== "all") return filter
  return defaultVisitTrackForRole(role)
}
