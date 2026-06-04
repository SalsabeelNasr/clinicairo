"use client"

import { useEffect, useState } from "react"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Textarea } from "@/components/Textarea"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type {
  CreatePastProcedurePayload,
  PastProcedure,
} from "@/features/prescriptions/prescriptions.types"

interface PastProcedureDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  procedure: PastProcedure | null
  patientId: string
  onSubmit: (payload: CreatePastProcedurePayload) => Promise<void>
}

export function PastProcedureDrawer({
  open,
  onOpenChange,
  procedure,
  patientId,
  onSubmit,
}: PastProcedureDrawerProps) {
  const t = useAppTranslations()
  const { isRtl } = useLocale()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [procedureDate, setProcedureDate] = useState(
    new Date().toISOString().split("T")[0],
  )
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!open) return
    if (procedure) {
      setName(procedure.name)
      setProcedureDate(procedure.procedureDate.split("T")[0])
      setNotes(procedure.notes ?? "")
    } else {
      setName("")
      setProcedureDate(new Date().toISOString().split("T")[0])
      setNotes("")
    }
  }, [open, procedure])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await onSubmit({
        patientId,
        name: name.trim(),
        procedureDate,
        notes: notes.trim() || undefined,
      })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <DrawerHeader>
            <DrawerTitle>
              {procedure ? t.profile.editPastProcedureTitle : t.profile.addPastProcedure}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="space-y-4">
            <div>
              <Label>{t.profile.procedureName}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>{t.profile.procedureDate}</Label>
              <Input
                type="date"
                value={procedureDate}
                onChange={(e) => setProcedureDate(e.target.value)}
                dir="ltr"
              />
            </div>
            <div>
              <Label>{t.table.notes}</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving
                ? t.profile.savingLab
                : procedure
                  ? t.profile.savePastProcedure
                  : t.profile.addPastProcedure}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
