// Leads (spec §5). Stages + sources are hardcoded funnel logic (spec §7 "NOT configurable").

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "booked" // appointment agreed (≠ converted)
  | "converted" // paid / became a patient
  | "lost"

export type LeadSource =
  | "meta_ad"
  | "instagram"
  | "referral"
  | "website"
  | "walk_in"
  | "other"

export interface Lead {
  id: string
  name: string
  phone: string
  email: string | null
  source: LeadSource
  status: LeadStatus
  assigned_to: string | null
  notes: string | null
  created_at: string
  last_contacted_at: string | null
  converted_patient_id: string | null
}

/** Ordered funnel (booked ≠ converted; the booked→converted gap is the key drop-off). */
export const LEAD_STAGES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "booked",
  "converted",
  "lost",
]
