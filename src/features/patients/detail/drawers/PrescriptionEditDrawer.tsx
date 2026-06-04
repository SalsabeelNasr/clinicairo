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
import { Label } from "@/components/Label"
import { Textarea } from "@/components/Textarea"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { Prescription } from "@/features/prescriptions/prescriptions.types"

interface PrescriptionEditDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescription: Prescription | null
  onSubmit: (payload: { diagnosisText: string; notesToPatient?: string }) => Promise<void>
}

export function PrescriptionEditDrawer({
  open,
  onOpenChange,
  prescription,
  onSubmit,
}: PrescriptionEditDrawerProps) {
  const t = useAppTranslations()
  const { isRtl } = useLocale()
  const [diagnosisText, setDiagnosisText] = useState("")
  const [notesToPatient, setNotesToPatient] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setDiagnosisText(prescription?.diagnosisText ?? "")
    setNotesToPatient(prescription?.notesToPatient ?? "")
  }, [open, prescription])

  const handleSubmit = async () => {
    if (!diagnosisText.trim()) return
    setSaving(true)
    try {
      await onSubmit({
        diagnosisText: diagnosisText.trim(),
        notesToPatient: notesToPatient.trim() || undefined,
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
          <DrawerTitle>{t.profile.editPrescriptionTitle}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-4">
          <div>
            <Label>{t.profile.diagnosisLabel}</Label>
            <Textarea
              value={diagnosisText}
              onChange={(e) => setDiagnosisText(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label>{t.profile.notesToPatient}</Label>
            <Textarea
              value={notesToPatient}
              onChange={(e) => setNotesToPatient(e.target.value)}
              rows={2}
            />
          </div>
          <Button onClick={handleSubmit} disabled={saving || !prescription}>
            {saving ? t.profile.savingLab : t.profile.savePrescriptionSummary}
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
