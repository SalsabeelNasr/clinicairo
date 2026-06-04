"use client"

import { useEffect, useRef, useState } from "react"
import { RiAttachmentLine, RiFlaskLine, RiUploadLine } from "@remixicon/react"
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
import { Select } from "@/components/Select"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import { cn } from "@/lib/utils"
import type {
  LabMetricFormPayload,
  LabResultFormPayload,
  PatientLabResult,
} from "../lab-result.types"
import {
  formatLabFileSize,
  getLabFileName,
  isAcceptedLabFile,
  isLabFileEntry,
  labFileFromUpload,
  LAB_FILE_ACCEPT,
} from "../lab-file.utils"

type LabInputMode = "metric" | "file"

interface LabResultDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lab: PatientLabResult | null
  onSubmit: (payload: LabResultFormPayload) => Promise<void>
}

const EMPTY_METRIC: Omit<LabMetricFormPayload, "entry_type"> = {
  test_name: "",
  value: "",
  unit: "",
  normal_range: "",
  status: "normal",
  test_date: new Date().toISOString().split("T")[0],
  notes: null,
}

export function LabResultDrawer({ open, onOpenChange, lab, onSubmit }: LabResultDrawerProps) {
  const t = useAppTranslations()
  const { isRtl } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<LabInputMode>("metric")
  const [metric, setMetric] = useState(EMPTY_METRIC)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setFileError(null)
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ""

    if (lab) {
      if (isLabFileEntry(lab)) {
        setMode("file")
        setMetric({
          ...EMPTY_METRIC,
          test_date: lab.test_date,
          notes: lab.notes,
        })
      } else {
        setMode("metric")
        setMetric({
          test_name: lab.test_name,
          value: lab.value,
          unit: lab.unit,
          normal_range: lab.normal_range,
          status: (lab.status as LabMetricFormPayload["status"]) || "normal",
          test_date: lab.test_date,
          notes: lab.notes,
        })
      }
    } else {
      setMode("metric")
      setMetric({
        ...EMPTY_METRIC,
        test_date: new Date().toISOString().split("T")[0],
      })
    }
  }, [open, lab])

  const handleModeChange = (next: LabInputMode) => {
    setMode(next)
    setFileError(null)
    if (next === "metric") {
      setSelectedFile(null)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      setSelectedFile(null)
      setFileError(null)
      return
    }
    if (!isAcceptedLabFile(file)) {
      setSelectedFile(null)
      setFileError(t.profile.labFileTypesHint)
      return
    }
    setFileError(null)
    setSelectedFile(file)
  }

  const handleSubmit = async () => {
    if (mode === "metric") {
      if (!metric.test_name.trim() || !metric.value.trim()) return
      setSaving(true)
      try {
        await onSubmit({
          entry_type: "metric",
          test_name: metric.test_name.trim(),
          value: metric.value.trim(),
          unit: metric.unit.trim(),
          normal_range: metric.normal_range.trim(),
          status: metric.status,
          test_date: metric.test_date,
          notes: metric.notes?.trim() || null,
        })
        onOpenChange(false)
      } finally {
        setSaving(false)
      }
      return
    }

    if (selectedFile) {
      setSaving(true)
      try {
        const file = labFileFromUpload(selectedFile)
        await onSubmit({
          entry_type: "file",
          test_date: metric.test_date,
          notes: metric.notes?.trim() || null,
          ...file,
        })
        onOpenChange(false)
      } finally {
        setSaving(false)
      }
      return
    }

    if (lab && isLabFileEntry(lab)) {
      setSaving(true)
      try {
        await onSubmit({
          entry_type: "file",
          test_date: metric.test_date,
          notes: metric.notes?.trim() || null,
          file_name: lab.file_name ?? getLabFileName(lab),
          file_url: lab.pdf_url ?? "",
          file_size: lab.file_size ?? 0,
          mime_type: lab.mime_type ?? "application/pdf",
        })
        onOpenChange(false)
      } finally {
        setSaving(false)
      }
    }
  }

  const canSubmit =
    mode === "metric"
      ? Boolean(metric.test_name.trim() && metric.value.trim())
      : Boolean(selectedFile || (lab && isLabFileEntry(lab)))

  const isEdit = !!lab

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>{isEdit ? t.profile.editLabTitle : t.profile.addLabTitle}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-4">
          <div>
            <Label>{t.profile.labInputType}</Label>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => handleModeChange("metric")}
                className={cn(
                  "app-pill flex flex-1 items-center justify-center gap-1.5",
                  mode === "metric" ? "app-pill--primary" : "app-pill--muted",
                )}
              >
                <RiFlaskLine className="size-3.5" aria-hidden />
                {t.profile.labModeMetric}
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("file")}
                className={cn(
                  "app-pill flex flex-1 items-center justify-center gap-1.5",
                  mode === "file" ? "app-pill--primary" : "app-pill--muted",
                )}
              >
                <RiAttachmentLine className="size-3.5" aria-hidden />
                {t.profile.labModeFile}
              </button>
            </div>
          </div>

          <div>
            <Label>{t.table.date}</Label>
            <Input
              type="date"
              value={metric.test_date}
              onChange={(e) => setMetric((m) => ({ ...m, test_date: e.target.value }))}
              dir="ltr"
            />
          </div>

          {mode === "metric" ? (
            <>
              <div>
                <Label>{t.table.testName}</Label>
                <Input
                  value={metric.test_name}
                  onChange={(e) => setMetric((m) => ({ ...m, test_name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t.table.value}</Label>
                  <Input
                    value={metric.value}
                    onChange={(e) => setMetric((m) => ({ ...m, value: e.target.value }))}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>{t.table.unit}</Label>
                  <Input
                    value={metric.unit}
                    onChange={(e) => setMetric((m) => ({ ...m, unit: e.target.value }))}
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <Label>{t.table.normalRange}</Label>
                <Input
                  value={metric.normal_range}
                  onChange={(e) => setMetric((m) => ({ ...m, normal_range: e.target.value }))}
                  dir="ltr"
                />
              </div>
              <div>
                <Label>{t.table.status}</Label>
                <Select
                  value={metric.status}
                  onChange={(e) =>
                    setMetric((m) => ({
                      ...m,
                      status: e.target.value as LabMetricFormPayload["status"],
                    }))
                  }
                >
                  <option value="normal">{t.profile.labStatusNormal}</option>
                  <option value="borderline">{t.profile.labStatusBorderline}</option>
                  <option value="abnormal">{t.profile.labStatusAbnormal}</option>
                </Select>
              </div>
            </>
          ) : (
            <div>
              {lab && isLabFileEntry(lab) && !selectedFile && (
                <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3">
                  <p className="text-sm font-medium text-gray-800">{getLabFileName(lab)}</p>
                  {lab.file_size != null && (
                    <p className="mt-0.5 text-theme-xs text-gray-500" dir="ltr">
                      {formatLabFileSize(lab.file_size)}
                    </p>
                  )}
                  <p className="mt-1 text-theme-xs text-gray-500">{t.profile.labReplaceFileHint}</p>
                </div>
              )}
              <Label>{t.profile.labFileUploadLabel}</Label>
              <input
                ref={inputRef}
                type="file"
                accept={LAB_FILE_ACCEPT}
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
                  {selectedFile ? selectedFile.name : t.profile.labChooseFile}
                </span>
                {selectedFile && (
                  <span className="text-theme-xs text-gray-500" dir="ltr">
                    {formatLabFileSize(selectedFile.size)}
                  </span>
                )}
                <span className="text-theme-xs text-gray-500">{t.profile.labFileTypesHint}</span>
              </button>
              {fileError && <p className="mt-2 text-theme-xs text-red-600">{fileError}</p>}
            </div>
          )}

          <div>
            <Label>{t.table.notes}</Label>
            <Textarea
              value={metric.notes ?? ""}
              onChange={(e) => setMetric((m) => ({ ...m, notes: e.target.value }))}
              rows={2}
            />
          </div>
        </DrawerBody>
        <DrawerFooter className="sticky bottom-0 border-t border-gray-100 bg-white pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !canSubmit}>
            {saving ? t.profile.savingLab : isEdit ? t.profile.saveLab : t.profile.addLabBtn}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
