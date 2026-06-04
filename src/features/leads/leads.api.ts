import { mockLeads } from "@/data/mock/leads"
import type { Lead, LeadSource, LeadStatus } from "./leads.types"

let leadsStore: Lead[] = [...mockLeads]

export interface CreateLeadInput {
  name: string
  phone: string
  email?: string | null
  source: LeadSource
  assigned_to?: string | null
  notes?: string | null
}

export interface UpdateLeadInput {
  status?: LeadStatus
  assigned_to?: string | null
  notes?: string | null
  last_contacted_at?: string | null
  converted_patient_id?: string | null
}

export async function listLeads(): Promise<Lead[]> {
  return [...leadsStore]
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const lead: Lead = {
    id: `lead-${Date.now()}`,
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    source: input.source,
    status: "new",
    assigned_to: input.assigned_to ?? null,
    notes: input.notes ?? null,
    created_at: new Date().toISOString().slice(0, 10),
    last_contacted_at: null,
    converted_patient_id: null,
  }
  leadsStore = [lead, ...leadsStore]
  return lead
}

export async function updateLead(id: string, input: UpdateLeadInput): Promise<Lead> {
  const index = leadsStore.findIndex((lead) => lead.id === id)
  if (index === -1) throw new Error("Lead not found")

  const updated = {
    ...leadsStore[index],
    ...input,
  }
  leadsStore[index] = updated
  return updated
}

export async function touchLead(id: string): Promise<Lead> {
  return updateLead(id, { last_contacted_at: new Date().toISOString().slice(0, 10) })
}
