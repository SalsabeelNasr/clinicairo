"use client"

import { useMemo, useState, type Dispatch, type SetStateAction } from "react"
import { PageHeaderAction } from "@/components/shared/PageHeaderAction"
import { RiUserAddLine } from "@remixicon/react"
import { SearchInput } from "@/components/SearchInput"
import { useLocale } from "@/contexts/locale-context"
import { useToast } from "@/hooks/useToast"
import {
  LEAD_STAGES,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from "@/features/leads/leads.types"
import { cn } from "@/lib/utils"

// lead_cold_after_days (from Settings §7) — mock value; "now" anchored to the demo date.
const COLD_AFTER_DAYS = 14
const NOW = new Date("2026-06-03T12:00:00")

// Known patient phones (mock) — convert-to-patient warns if the phone already exists (§ assumptions).
const EXISTING_PATIENT_PHONES = new Set(["+218 91 234 5678"])

const SEED: Lead[] = [
  { id: "l1", name: "منى العبيدي", phone: "+218 91 555 1122", email: null, source: "meta_ad", status: "new", assigned_to: "user-003", notes: null, created_at: "2026-06-02", last_contacted_at: null, converted_patient_id: null },
  { id: "l2", name: "أحمد الفيتوري", phone: "+218 92 333 4455", email: "ahmed@example.com", source: "instagram", status: "contacted", assigned_to: "user-003", notes: "مهتم بالباقة الشهرية", created_at: "2026-05-28", last_contacted_at: "2026-05-30", converted_patient_id: null },
  { id: "l3", name: "سعاد التارقي", phone: "+218 94 777 8899", email: null, source: "referral", status: "qualified", assigned_to: "user-003", notes: null, created_at: "2026-05-20", last_contacted_at: "2026-05-16", converted_patient_id: null },
  { id: "l4", name: "خالد المصراتي", phone: "+218 91 234 5678", email: null, source: "website", status: "booked", assigned_to: "user-003", notes: "حجز كشف الخميس", created_at: "2026-05-25", last_contacted_at: "2026-06-01", converted_patient_id: null },
  { id: "l5", name: "ليلى بن سعيد", phone: "+218 93 222 1100", email: null, source: "instagram", status: "lost", assigned_to: "user-003", notes: "السعر مرتفع", created_at: "2026-05-10", last_contacted_at: "2026-05-12", converted_patient_id: null },
]

const TT = {
  ar: {
    title: "العملاء المحتملون", add: "إضافة عميل", all: "الكل", cold: "باردة", empty: "لا عملاء في هذه المرحلة.", searchPlaceholder: "ابحث بالاسم أو رقم الهاتف…",
    followUp: "متابعة", convert: "تحويل لمريض",
    followToast: "تم إنشاء مهمة متابعة.", convertToast: "تم تحويل العميل إلى مريض.",
    convertWarn: "تحذير: رقم الهاتف موجود مسبقاً كمريض.",
    phone: "الهاتف:", lastContact: "آخر تواصل", never: "لم يتم", coldHint: "بحاجة متابعة",
    status: { new: "جديد", contacted: "تم التواصل", qualified: "مؤهل", booked: "محجوز", converted: "تحوّل", lost: "مفقود" } as Record<LeadStatus, string>,
    source: { meta_ad: "إعلان ميتا", instagram: "إنستقرام", referral: "إحالة", website: "الموقع", walk_in: "زيارة", other: "أخرى" } as Record<LeadSource, string>,
  },
  en: {
    title: "Leads", add: "Add lead", all: "All", cold: "Cold", empty: "No leads in this stage.", searchPlaceholder: "Search by name or phone…",
    followUp: "Follow up", convert: "Convert to patient",
    followToast: "Follow-up task created.", convertToast: "Lead converted to a patient.",
    convertWarn: "Warning: this phone already exists as a patient.",
    phone: "Phone:", lastContact: "Last contact", never: "Never", coldHint: "Needs follow-up",
    status: { new: "New", contacted: "Contacted", qualified: "Qualified", booked: "Booked", converted: "Converted", lost: "Lost" } as Record<LeadStatus, string>,
    source: { meta_ad: "Meta ad", instagram: "Instagram", referral: "Referral", website: "Website", walk_in: "Walk-in", other: "Other" } as Record<LeadSource, string>,
  },
}

const STATUS_CLASS: Record<LeadStatus, string> = {
  new: "lead-card__status--new",
  contacted: "lead-card__status--contacted",
  qualified: "lead-card__status--qualified",
  booked: "lead-card__status--booked",
  converted: "lead-card__status--converted",
  lost: "lead-card__status--lost",
}

function isCold(lead: Lead): boolean {
  if (lead.status === "converted" || lead.status === "lost") return false
  const ref = lead.last_contacted_at ? new Date(lead.last_contacted_at) : new Date(lead.created_at)
  const days = (NOW.getTime() - ref.getTime()) / 86_400_000
  return days >= COLD_AFTER_DAYS
}

function formatContactDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-")
  return `${day}-${month}-${year}`
}

function formatCompactPhone(phone: string): string {
  return phone.replace(/\s/g, "")
}

function followUpLead(id: string, setLeads: Dispatch<SetStateAction<Lead[]>>) {
  setLeads((prev) =>
    prev.map((l) =>
      l.id === id ? { ...l, last_contacted_at: "2026-06-03" } : l,
    ),
  )
}

export default function LeadsPage() {
  const { lang } = useLocale()
  const t = TT[lang]
  const { showToast } = useToast()
  const [leads, setLeads] = useState<Lead[]>(SEED)
  const [filter, setFilter] = useState<LeadStatus | "all" | "cold">("all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const base =
      filter === "all" ? leads : filter === "cold" ? leads.filter(isCold) : leads.filter((l) => l.status === filter)
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter((l) => l.name.toLowerCase().includes(q) || l.phone.toLowerCase().includes(q))
  }, [leads, filter, query])

  const coldCount = useMemo(() => leads.filter(isCold).length, [leads])

  const setStatus = (id: string, status: LeadStatus) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))

  const chips: Array<{ key: LeadStatus | "all" | "cold"; label: string; count?: number }> = [
    { key: "all", label: t.all },
    { key: "cold", label: `${t.cold} (${coldCount})` },
    ...LEAD_STAGES.map((s) => ({ key: s, label: t.status[s] })),
  ]

  return (
    <div className="app-page">
      <header className="app-page-header">
        <h1 className="app-page-title">{t.title}</h1>
        <PageHeaderAction icon={RiUserAddLine} onClick={() => showToast(t.add, "info")}>
          {t.add}
        </PageHeaderAction>
      </header>

      <SearchInput
        placeholder={t.searchPlaceholder}
        value={query}
        onSearchChange={setQuery}
        className="max-w-md"
      />

      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={
              "rounded-full px-3.5 py-1.5 text-theme-sm font-medium transition-colors " +
              (filter === c.key
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50")
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-theme-sm text-gray-500">
          {t.empty}
        </div>
      ) : (
        <div className="lead-card-grid">
          {filtered.map((lead) => {
            const cold = isCold(lead)
            const canConvert = lead.status === "qualified" || lead.status === "booked"

            return (
              <article key={lead.id} className="lead-card">
                <header className="lead-card__header">
                  <h3 className="lead-card__name">{lead.name}</h3>
                  <span className={cn("lead-card__status", STATUS_CLASS[lead.status])}>
                    {t.status[lead.status]}
                  </span>
                </header>

                <div className="lead-card__body">
                  <div className="lead-card__field">
                    <span className="lead-card__label">{t.phone}</span>
                    <span className="lead-card__value" dir="ltr" lang="en">
                      {formatCompactPhone(lead.phone)}
                    </span>
                  </div>

                  <div className="lead-card__tags">
                    <span className="lead-card__tag">{t.source[lead.source]}</span>
                    {cold && (
                      <span className="lead-card__tag--alert">{t.coldHint}</span>
                    )}
                  </div>

                  <p className="lead-card__meta">
                    {t.lastContact}:{" "}
                    {lead.last_contacted_at
                      ? formatContactDate(lead.last_contacted_at)
                      : t.never}
                  </p>
                </div>

                <footer
                  className={cn(
                    "lead-card__actions",
                    !canConvert && "lead-card__actions--single",
                  )}
                >
                  {canConvert && (
                    <button
                      type="button"
                      className="lead-card__btn-primary"
                      onClick={() => {
                        if (EXISTING_PATIENT_PHONES.has(lead.phone)) {
                          showToast(t.convertWarn, "error")
                          return
                        }
                        setStatus(lead.id, "converted")
                        showToast(t.convertToast, "success")
                      }}
                    >
                      {t.convert}
                    </button>
                  )}
                  <button
                    type="button"
                    className="lead-card__btn-secondary"
                    onClick={() => {
                      followUpLead(lead.id, setLeads)
                      showToast(t.followToast, "success")
                    }}
                  >
                    {t.followUp}
                  </button>
                </footer>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
