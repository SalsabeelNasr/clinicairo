import type { Lead, LeadSource, LeadStatus } from "./leads.types"

const MS_PER_DAY = 86_400_000

export const LEAD_SOURCE_LABELS: Record<LeadSource, { ar: string; en: string }> = {
  meta_ad: { ar: "إعلان ميتا", en: "Meta ad" },
  instagram: { ar: "إنستقرام", en: "Instagram" },
  referral: { ar: "إحالة", en: "Referral" },
  website: { ar: "الموقع", en: "Website" },
  walk_in: { ar: "زيارة", en: "Walk-in" },
  other: { ar: "أخرى", en: "Other" },
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, { ar: string; en: string }> = {
  new: { ar: "جديد", en: "New" },
  contacted: { ar: "تم التواصل", en: "Contacted" },
  qualified: { ar: "مؤهل", en: "Qualified" },
  booked: { ar: "محجوز", en: "Booked" },
  converted: { ar: "تحوّل", en: "Converted" },
  lost: { ar: "مفقود", en: "Lost" },
}

export const STATUS_PILL: Record<LeadStatus, string> = {
  new: "app-pill--info",
  contacted: "app-pill--warning",
  qualified: "app-pill--primary",
  booked: "app-pill--success",
  converted: "app-pill--success",
  lost: "app-pill--muted",
}

export const SOURCE_PILL: Record<LeadSource, string> = {
  meta_ad: "app-pill--info",
  instagram: "app-pill--indigo",
  referral: "app-pill--success",
  website: "app-pill--muted",
  walk_in: "app-pill--warning",
  other: "app-pill--muted",
}

export function isColdLead(lead: Lead, coldAfterDays: number, now = new Date()): boolean {
  if (lead.status === "converted" || lead.status === "lost") return false
  const reference = lead.last_contacted_at ? new Date(lead.last_contacted_at) : new Date(lead.created_at)
  const ageDays = (now.getTime() - reference.getTime()) / MS_PER_DAY
  return ageDays >= coldAfterDays
}

export function formatLeadDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-")
  return `${day}-${month}-${year}`
}

export function compactPhone(phone: string): string {
  return phone.replace(/\s/g, "")
}
