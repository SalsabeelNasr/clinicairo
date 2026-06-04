"use client"

import { useEffect, useState } from "react"
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
import { Textarea } from "@/components/Textarea"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { InjectionFormPayload, PatientInjection } from "../injection.types"

interface InjectionDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  injection: PatientInjection | null
  onSubmit: (payload: InjectionFormPayload) => Promise<void>
}

export function InjectionDrawer({
  open,
  onOpenChange,
  injection,
  onSubmit,
}: InjectionDrawerProps) {
  const t = useAppTranslations()
  const { isRtl } = useLocale()
  const [form, setForm] = useState<InjectionFormPayload>({
    medication_name: "",
    dose: "",
    injection_date: new Date().toISOString().split("T")[0],
    notes: null,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (injection) {
      setForm({
        medication_name: injection.medication_name,
        dose: injection.dose,
        injection_date: injection.injection_date,
        notes: injection.notes,
      })
    } else {
      setForm({
        medication_name: "",
        dose: "",
        injection_date: new Date().toISOString().split("T")[0],
        notes: null,
      })
    }
  }, [open, injection])

  const handleSubmit = async () => {
    if (!form.medication_name.trim() || !form.dose.trim()) return
    setSaving(true)
    try {
      await onSubmit({
        medication_name: form.medication_name.trim(),
        dose: form.dose.trim(),
        injection_date: form.injection_date,
        notes: form.notes?.trim() || null,
      })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>
            {injection ? t.profile.editDoseTitle : t.profile.addDoseTitle}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-4">
          <div>
            <Label>{t.profile.medicationName}</Label>
            <Input
              value={form.medication_name}
              onChange={(e) => setForm((f) => ({ ...f, medication_name: e.target.value }))}
            />
          </div>
          <div>
            <Label>{t.profile.strength}</Label>
            <Input
              value={form.dose}
              onChange={(e) => setForm((f) => ({ ...f, dose: e.target.value }))}
              dir="ltr"
            />
          </div>
          <div>
            <Label>{t.table.date}</Label>
            <Input
              type="date"
              value={form.injection_date}
              onChange={(e) => setForm((f) => ({ ...f, injection_date: e.target.value }))}
              dir="ltr"
            />
          </div>
          <div>
            <Label>{t.table.notes}</Label>
            <Textarea
              value={form.notes ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
            />
          </div>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? t.profile.savingLab : injection ? t.profile.saveDose : t.profile.logNewDose}
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
