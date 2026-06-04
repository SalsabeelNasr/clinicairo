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

interface WeightEntry {
  weight: number
  recorded_date: string
  notes: string | null
}

interface AddWeightDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: WeightEntry | null
  onSubmit: (payload: { weight: number; recordedDate: string; notes?: string }) => Promise<void>
}

export function AddWeightDrawer({ open, onOpenChange, entry, onSubmit }: AddWeightDrawerProps) {
  const t = useAppTranslations()
  const { isRtl } = useLocale()
  const [weight, setWeight] = useState("")
  const [notes, setNotes] = useState("")
  const [recordedDate, setRecordedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (entry) {
      setWeight(String(entry.weight))
      setNotes(entry.notes ?? "")
      setRecordedDate(entry.recorded_date)
    } else {
      setWeight("")
      setNotes("")
      setRecordedDate(new Date().toISOString().split("T")[0])
    }
  }, [open, entry])

  const handleSubmit = async () => {
    const w = parseFloat(weight)
    if (Number.isNaN(w) || w <= 0) return
    setSaving(true)
    try {
      await onSubmit({
        weight: w,
        recordedDate,
        notes: notes.trim() || undefined,
      })
      setWeight("")
      setNotes("")
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
            {entry ? t.profile.editWeightTitle : t.profile.addWeightTitle}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-4">
          <div>
            <Label>{t.profile.weightKg}</Label>
            <Input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={t.profile.weightPlaceholder}
              dir="ltr"
            />
          </div>
          <div>
            <Label>{t.table.date}</Label>
            <Input
              type="date"
              value={recordedDate}
              onChange={(e) => setRecordedDate(e.target.value)}
              dir="ltr"
            />
          </div>
          <div>
            <Label>{t.profile.notesOptional}</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving
              ? t.profile.addingWeight
              : entry
                ? t.profile.saveWeight
                : t.profile.addWeightBtn}
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
