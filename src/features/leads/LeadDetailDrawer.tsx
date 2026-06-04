"use client"

import { useState, type FormEvent } from "react"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Button } from "@/components/Button"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
import { Textarea } from "@/components/Textarea"
import { useLocale } from "@/contexts/locale-context"
import { mockUsers } from "@/data/mock/users-clinics"
import { LEAD_STAGES, type Lead, type LeadStatus } from "./leads.types"
import type { UpdateLeadInput } from "./leads.api"
import { LEAD_STATUS_LABELS } from "./leads.utils"

interface LeadDetailDrawerProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (leadId: string, input: UpdateLeadInput) => Promise<void>
  onConvert: (lead: Lead) => void
  onFollowUp: (lead: Lead) => void
  labels: {
    title: string
    status: string
    assignedTo: string
    notes: string
    unassigned: string
    cancel: string
    save: string
    convert: string
    followUp: string
  }
}

export function LeadDetailDrawer({
  lead,
  open,
  onOpenChange,
  onSubmit,
  onConvert,
  onFollowUp,
  labels,
}: LeadDetailDrawerProps) {
  const { isRtl, lang } = useLocale()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!lead) return
    const formData = new FormData(event.currentTarget as HTMLFormElement)

    setSubmitting(true)
    try {
      await onSubmit(lead.id, {
        status: formData.get("status") as LeadStatus,
        assigned_to: (formData.get("assigned_to") as string) || null,
        notes: ((formData.get("notes") as string) || "").trim() || null,
      })
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  const canConvert = lead?.status === "qualified" || lead?.status === "booked"

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-xl">
        <DrawerHeader>
          <DrawerTitle>{lead ? `${labels.title}: ${lead.name}` : labels.title}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          {lead && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-theme-sm text-gray-600">
                <p className="font-medium text-gray-800">{lead.phone}</p>
                {lead.email && <p className="mt-1" dir="ltr">{lead.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-detail-status">{labels.status}</Label>
                <Select id="lead-detail-status" name="status" defaultValue={lead.status}>
                  {LEAD_STAGES.map((item) => (
                    <option key={item} value={item}>
                      {LEAD_STATUS_LABELS[item][lang]}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-detail-assigned-to">{labels.assignedTo}</Label>
                <Select id="lead-detail-assigned-to" name="assigned_to" defaultValue={lead.assigned_to ?? ""}>
                  <option value="">{labels.unassigned}</option>
                  {mockUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-detail-notes">{labels.notes}</Label>
                <Textarea id="lead-detail-notes" name="notes" defaultValue={lead.notes ?? ""} rows={5} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" variant="secondary" onClick={() => onFollowUp(lead)}>
                  {labels.followUp}
                </Button>
                <Button type="button" variant="secondary" disabled={!canConvert} onClick={() => onConvert(lead)}>
                  {labels.convert}
                </Button>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
                  {labels.cancel}
                </Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                  {labels.save}
                </Button>
              </div>
            </form>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
