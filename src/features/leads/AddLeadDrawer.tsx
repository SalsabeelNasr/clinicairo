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
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
import { Textarea } from "@/components/Textarea"
import { useLocale } from "@/contexts/locale-context"
import { mockUsers } from "@/data/mock/users-clinics"
import type { LeadSource } from "./leads.types"
import type { CreateLeadInput } from "./leads.api"
import { LEAD_SOURCE_LABELS } from "./leads.utils"

interface AddLeadDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateLeadInput) => Promise<void>
  labels: {
    title: string
    name: string
    phone: string
    email: string
    source: string
    assignedTo: string
    notes: string
    unassigned: string
    cancel: string
    save: string
  }
}

const SOURCES: LeadSource[] = ["meta_ad", "instagram", "referral", "website", "walk_in", "other"]

export function AddLeadDrawer({ open, onOpenChange, onSubmit, labels }: AddLeadDrawerProps) {
  const { isRtl, lang } = useLocale()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [source, setSource] = useState<LeadSource>("meta_ad")
  const [assignedTo, setAssignedTo] = useState("user-003")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setName("")
    setPhone("")
    setEmail("")
    setSource("meta_ad")
    setAssignedTo("user-003")
    setNotes("")
    setSubmitting(false)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !phone.trim()) return

    setSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        source,
        assigned_to: assignedTo || null,
        notes: notes.trim() || null,
      })
      resetForm()
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-xl">
        <DrawerHeader>
          <DrawerTitle>{labels.title}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="lead-name">{labels.name}</Label>
              <Input id="lead-name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-phone">{labels.phone}</Label>
              <Input id="lead-phone" value={phone} onChange={(event) => setPhone(event.target.value)} required dir="ltr" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-email">{labels.email}</Label>
              <Input id="lead-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} dir="ltr" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-source">{labels.source}</Label>
              <Select id="lead-source" value={source} onChange={(event) => setSource(event.target.value as LeadSource)}>
                {SOURCES.map((item) => (
                  <option key={item} value={item}>
                    {LEAD_SOURCE_LABELS[item][lang]}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-assigned-to">{labels.assignedTo}</Label>
              <Select id="lead-assigned-to" value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}>
                <option value="">{labels.unassigned}</option>
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-notes">{labels.notes}</Label>
              <Textarea id="lead-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} />
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
