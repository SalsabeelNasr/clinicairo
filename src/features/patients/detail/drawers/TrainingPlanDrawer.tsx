"use client"

import { useEffect, useRef, useState } from "react"
import { RiUploadLine } from "@remixicon/react"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Button } from "@/components/Button"
import { Label } from "@/components/Label"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { PatientTrainingPlan, TrainingPlanFormPayload } from "../patient-training-plan.types"
import {
  formatTrainingPlanFileSize,
  trainingPlanFileFromUpload,
} from "../training-plan-file.utils"

interface TrainingPlanDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: PatientTrainingPlan | null
  onSubmit: (payload: TrainingPlanFormPayload) => Promise<void>
}

export function TrainingPlanDrawer({
  open,
  onOpenChange,
  plan,
  onSubmit,
}: TrainingPlanDrawerProps) {
  const t = useAppTranslations()
  const { isRtl } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setSelectedFile(null)
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ""
  }, [open, plan])

  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      setSelectedFile(null)
      setFileError(null)
      return
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setSelectedFile(null)
      setFileError(t.profile.trainingPdfOnly)
      return
    }
    setFileError(null)
    setSelectedFile(file)
  }

  const handleSubmit = async () => {
    if (selectedFile) {
      setSaving(true)
      try {
        await onSubmit(trainingPlanFileFromUpload(selectedFile))
        onOpenChange(false)
      } finally {
        setSaving(false)
      }
      return
    }

    if (plan) {
      setSaving(true)
      try {
        await onSubmit({
          file_name: plan.file_name,
          file_url: plan.file_url,
          file_size: plan.file_size,
          mime_type: plan.mime_type,
        })
        onOpenChange(false)
      } finally {
        setSaving(false)
      }
    }
  }

  const canSubmit = plan ? Boolean(selectedFile || plan) : Boolean(selectedFile)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>
            {plan ? t.profile.editTrainingTitle : t.profile.addTrainingTitle}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-4">
          {plan && !selectedFile && (
            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">{plan.file_name}</p>
                {plan.file_size != null && (
                  <p className="mt-0.5 text-theme-xs text-gray-500" dir="ltr">
                    {formatTrainingPlanFileSize(plan.file_size)}
                  </p>
                )}
                <p className="mt-1 text-theme-xs text-gray-500">{t.profile.trainingReplaceFileHint}</p>
              </div>
            </div>
          )}

          <div>
            <Label>{t.profile.trainingPdfUploadLabel}</Label>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-2 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-8 transition-colors hover:border-primary-300 hover:bg-primary-50/30"
            >
              <RiUploadLine className="size-6 text-gray-400" aria-hidden />
              <span className="text-theme-sm font-medium text-gray-700">
                {selectedFile ? selectedFile.name : t.profile.trainingChoosePdf}
              </span>
              {selectedFile && (
                <span className="text-theme-xs text-gray-500" dir="ltr">
                  {formatTrainingPlanFileSize(selectedFile.size)}
                </span>
              )}
              <span className="text-theme-xs text-gray-500">{t.profile.trainingPdfOnly}</span>
            </button>
            {fileError && (
              <p className="mt-2 text-theme-xs text-red-600">{fileError}</p>
            )}
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !canSubmit}>
            {saving
              ? t.profile.savingLab
              : plan
                ? t.profile.saveTraining
                : t.profile.logNewTraining}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
