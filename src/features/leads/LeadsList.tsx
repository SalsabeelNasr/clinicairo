"use client"

import type { Lead } from "./leads.types"
import { LeadsRow } from "./LeadsRow"

interface LeadsListProps {
  leads: Lead[]
  lang: "ar" | "en"
  coldAfterDays: number
  getAssignedToName: (staffId: string | null) => string | undefined
  labels: {
    empty: string
    coldHint: string
    convert: string
    followUp: string
    viewDetails: string
    noActions: string
  }
  onConvert: (lead: Lead) => void
  onFollowUp: (lead: Lead) => void
  onOpenDetails: (lead: Lead) => void
}

export function LeadsList({
  leads,
  lang,
  coldAfterDays,
  getAssignedToName,
  labels,
  onConvert,
  onFollowUp,
  onOpenDetails,
}: LeadsListProps) {
  if (leads.length === 0) {
    return <div className="app-empty-state">{labels.empty}</div>
  }

  return (
    <div className="app-list">
      {leads.map((lead) => (
        <LeadsRow
          key={lead.id}
          lead={lead}
          lang={lang}
          coldAfterDays={coldAfterDays}
          assignedToName={getAssignedToName(lead.assigned_to)}
          labels={labels}
          onConvert={onConvert}
          onFollowUp={onFollowUp}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  )
}
