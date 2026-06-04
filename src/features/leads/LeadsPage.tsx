"use client"

import { useMemo, useState } from "react"
import { RiUserAddLine } from "@remixicon/react"
import { PageHeaderAction } from "@/components/shared/PageHeaderAction"
import { useLocale } from "@/contexts/locale-context"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useToast } from "@/hooks/useToast"
import { mockData } from "@/data/mock/mock-data"
import { createPatient } from "@/features/patients/patients.api"
import { createTask } from "@/features/tasks/tasks.api"
import type { Lead, LeadStatus } from "./leads.types"
import { createLead, listLeads, touchLead, updateLead, type CreateLeadInput, type UpdateLeadInput } from "./leads.api"
import { isColdLead } from "./leads.utils"
import { LeadsFilterBar } from "./LeadsFilterBar"
import { LeadsList } from "./LeadsList"
import { AddLeadDrawer } from "./AddLeadDrawer"
import { LeadDetailDrawer } from "./LeadDetailDrawer"

const NOW = new Date("2026-06-03T12:00:00")

const T = {
  ar: {
    title: "العملاء المحتملون",
    add: "إضافة عميل",
    all: "الكل",
    cold: "باردة",
    empty: "لا عملاء في هذه المرحلة.",
    searchPlaceholder: "ابحث بالاسم أو رقم الهاتف…",
    convert: "تحويل لمريض",
    followUp: "متابعة",
    viewDetails: "عرض التفاصيل",
    noActions: "لا توجد إجراءات",
    coldHint: "بحاجة متابعة",
    followToast: "تم إنشاء مهمة متابعة.",
    convertToast: "تم تحويل العميل إلى مريض.",
    convertWarn: "تحذير: رقم الهاتف موجود مسبقاً كمريض.",
    saved: "تم الحفظ.",
    drawer: {
      addTitle: "إضافة عميل محتمل",
      detailTitle: "تفاصيل العميل",
      name: "الاسم",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      source: "المصدر",
      assignedTo: "مسؤول المتابعة",
      notes: "ملاحظات",
      status: "المرحلة",
      unassigned: "غير مخصص",
      cancel: "إلغاء",
      save: "حفظ",
    },
  },
  en: {
    title: "Leads",
    add: "Add lead",
    all: "All",
    cold: "Cold",
    empty: "No leads in this stage.",
    searchPlaceholder: "Search by name or phone…",
    convert: "Convert to patient",
    followUp: "Follow up",
    viewDetails: "View details",
    noActions: "No actions",
    coldHint: "Needs follow-up",
    followToast: "Follow-up task created.",
    convertToast: "Lead converted to a patient.",
    convertWarn: "Warning: this phone already exists as a patient.",
    saved: "Saved.",
    drawer: {
      addTitle: "Add lead",
      detailTitle: "Lead details",
      name: "Name",
      phone: "Phone",
      email: "Email",
      source: "Source",
      assignedTo: "Assigned to",
      notes: "Notes",
      status: "Stage",
      unassigned: "Unassigned",
      cancel: "Cancel",
      save: "Save",
    },
  },
}

function splitName(name: string): { first_name: string; last_name: string } {
  const parts = name.trim().split(/\s+/)
  return {
    first_name: parts[0] ?? name,
    last_name: parts.slice(1).join(" ") || "-",
  }
}

function tomorrowIsoDate(): string {
  const date = new Date(NOW)
  date.setDate(date.getDate() + 1)
  return date.toISOString()
}

export function LeadsPage() {
  const { lang } = useLocale()
  const { currentUser, currentClinic, allUsers } = useUserClinic()
  const { showToast } = useToast()
  const t = T[lang]
  const [leads, setLeads] = useState<Lead[]>(() => [...mockData.leads])
  const [filter, setFilter] = useState<LeadStatus | "all" | "cold">("all")
  const [query, setQuery] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [detailLead, setDetailLead] = useState<Lead | null>(null)

  const coldAfterDays = mockData.clinicSettings.lead_cold_after_days

  const refresh = async () => {
    setLeads(await listLeads())
  }

  const filtered = useMemo(() => {
    const base =
      filter === "all"
        ? leads
        : filter === "cold"
          ? leads.filter((lead) => isColdLead(lead, coldAfterDays, NOW))
          : leads.filter((lead) => lead.status === filter)
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return base
    return base.filter((lead) =>
      lead.name.toLowerCase().includes(normalizedQuery) ||
      lead.phone.toLowerCase().includes(normalizedQuery)
    )
  }, [coldAfterDays, filter, leads, query])

  const coldCount = useMemo(
    () => leads.filter((lead) => isColdLead(lead, coldAfterDays, NOW)).length,
    [coldAfterDays, leads],
  )

  const existingPatientPhones = useMemo(
    () => new Set(mockData.patients.map((patient) => patient.phone.replace(/\s/g, ""))),
    [],
  )

  const getAssignedToName = (staffId: string | null) =>
    staffId ? allUsers.find((user) => user.id === staffId)?.full_name : undefined

  const handleCreateLead = async (input: CreateLeadInput) => {
    await createLead(input)
    await refresh()
    showToast(t.saved, "success")
  }

  const handleUpdateLead = async (leadId: string, input: UpdateLeadInput) => {
    await updateLead(leadId, input)
    await refresh()
    showToast(t.saved, "success")
  }

  const handleFollowUp = async (lead: Lead) => {
    await touchLead(lead.id)
    await createTask({
      title: `${t.followUp}: ${lead.name}`,
      description: lead.notes ?? undefined,
      type: "cold_lead",
      priority: "normal",
      dueDate: tomorrowIsoDate(),
      assignedToUserId: lead.assigned_to ?? currentUser.id,
      clinicId: currentClinic.id,
      createdByUserId: currentUser.id,
    })
    await refresh()
    showToast(t.followToast, "success")
  }

  const handleConvert = async (lead: Lead) => {
    const compactLeadPhone = lead.phone.replace(/\s/g, "")
    if (!lead.converted_patient_id && existingPatientPhones.has(compactLeadPhone)) {
      showToast(t.convertWarn, "error")
      return
    }

    const name = splitName(lead.name)
    const patient = await createPatient({
      ...name,
      phone: lead.phone,
      email: lead.email ?? undefined,
      source: lead.source,
    })
    await updateLead(lead.id, {
      status: "converted",
      converted_patient_id: patient.id,
      last_contacted_at: new Date().toISOString().slice(0, 10),
    })
    await refresh()
    setDetailLead(null)
    showToast(t.convertToast, "success")
  }

  return (
    <div className="app-page">
      <header className="app-page-header">
        <div className="app-page-header__text">
          <h1 className="app-page-title">{t.title}</h1>
        </div>
        <PageHeaderAction icon={RiUserAddLine} onClick={() => setAddOpen(true)}>
          {t.add}
        </PageHeaderAction>
      </header>

      <LeadsFilterBar
        lang={lang}
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        coldCount={coldCount}
        labels={{ searchPlaceholder: t.searchPlaceholder, all: t.all, cold: t.cold }}
      />

      <LeadsList
        leads={filtered}
        lang={lang}
        coldAfterDays={coldAfterDays}
        getAssignedToName={getAssignedToName}
        labels={{
          empty: t.empty,
          coldHint: t.coldHint,
          convert: t.convert,
          followUp: t.followUp,
          viewDetails: t.viewDetails,
          noActions: t.noActions,
        }}
        onConvert={handleConvert}
        onFollowUp={handleFollowUp}
        onOpenDetails={setDetailLead}
      />

      <AddLeadDrawer
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleCreateLead}
        labels={{
          title: t.drawer.addTitle,
          name: t.drawer.name,
          phone: t.drawer.phone,
          email: t.drawer.email,
          source: t.drawer.source,
          assignedTo: t.drawer.assignedTo,
          notes: t.drawer.notes,
          unassigned: t.drawer.unassigned,
          cancel: t.drawer.cancel,
          save: t.drawer.save,
        }}
      />

      <LeadDetailDrawer
        open={detailLead !== null}
        lead={detailLead}
        onOpenChange={(open) => {
          if (!open) setDetailLead(null)
        }}
        onSubmit={handleUpdateLead}
        onConvert={handleConvert}
        onFollowUp={handleFollowUp}
        labels={{
          title: t.drawer.detailTitle,
          status: t.drawer.status,
          assignedTo: t.drawer.assignedTo,
          notes: t.drawer.notes,
          unassigned: t.drawer.unassigned,
          cancel: t.drawer.cancel,
          save: t.drawer.save,
          convert: t.convert,
          followUp: t.followUp,
        }}
      />
    </div>
  )
}
