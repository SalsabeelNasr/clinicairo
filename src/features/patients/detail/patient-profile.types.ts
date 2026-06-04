import type { StaffRole } from "@/data/mock/users-clinics"
import type { VisitNoteTrack } from "@/data/mock/visit-notes"

export type ProfileMainTab = "profile" | "treatment" | "dietFitness" | "bookings"

export const ROLE_DEFAULT_MAIN_TAB: Record<StaffRole, ProfileMainTab> = {
  owner: "profile",
  assistant: "bookings",
  doctor: "treatment",
  nutritionist: "dietFitness",
  coach: "dietFitness",
}

export type VisitNoteTrackFilter = VisitNoteTrack | "all"

export const ROLE_DEFAULT_VISIT_TRACK: Record<StaffRole, VisitNoteTrackFilter> = {
  owner: "all",
  assistant: "all",
  doctor: "consultation",
  nutritionist: "nutrition",
  coach: "coaching",
}

export type ProfileDrawer =
  | "task"
  | "prescription"
  | "weight"
  | "file"
  | "visit_note"
  | null
