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
import { MedicationFormFields } from "@/features/prescriptions/MedicationFormFields"
import type { CreatePastMedicationPayload, PastMedication } from "@/features/prescriptions/prescriptions.types"

interface PastMedicationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medication: PastMedication | null
  patientId: string
  onSubmit: (payload: CreatePastMedicationPayload) => Promise<void>
}

export function PastMedicationDrawer({
  open,
  onOpenChange,
  medication,
  patientId,
  onSubmit,
}: PastMedicationDrawerProps) {
  const t = useAppTranslations()
  const { isRtl } = useLocale()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    strength: "",
    form: "",
    duration: "",
    notes: "",
    takenFrom: new Date().toISOString().split("T")[0],
    takenTo: "" as string,
  })

  useEffect(() => {
    if (!open) return
    if (medication) {
      setFormData({
        name: medication.name,
        strength: "",
        form: "",
        duration: medication.duration,
        notes: medication.notes ?? "",
        takenFrom: medication.takenFrom.split("T")[0],
        takenTo: medication.takenTo?.split("T")[0] ?? "",
      })
    } else {
      setFormData({
        name: "",
        strength: "",
        form: "",
        duration: "",
        notes: "",
        takenFrom: new Date().toISOString().split("T")[0],
        takenTo: "",
      })
    }
  }, [open, medication])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    setSaving(true)
    try {
      await onSubmit({
        patientId,
        name: formData.name.trim(),
        duration: formData.duration,
        takenFrom: formData.takenFrom,
        takenTo: formData.takenTo || null,
        notes: formData.notes.trim() || undefined,
      })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <DrawerHeader>
            <DrawerTitle>
              {medication ? t.profile.editPastMedicationTitle : t.profile.addPastMedication}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="space-y-6">
            <MedicationFormFields
              data={formData}
              onChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
              showInstructions={false}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t.profile.startedTaking}</Label>
                <Input
                  type="date"
                  value={formData.takenFrom}
                  onChange={(e) => setFormData((p) => ({ ...p, takenFrom: e.target.value }))}
                  dir="ltr"
                />
              </div>
              <div>
                <Label>{t.profile.stoppedTakingOptional}</Label>
                <Input
                  type="date"
                  value={formData.takenTo}
                  onChange={(e) => setFormData((p) => ({ ...p, takenTo: e.target.value }))}
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <Label>{t.table.notes}</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={saving || !formData.name.trim()}>
              {saving
                ? t.profile.savingLab
                : medication
                  ? t.profile.savePastMedication
                  : t.profile.addMedication}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
