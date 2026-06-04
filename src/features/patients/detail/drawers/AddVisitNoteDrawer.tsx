"use client"

import { useEffect, useRef, useState } from "react"
import { RiAttachmentLine, RiFileTextLine, RiUploadLine } from "@remixicon/react"
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
import { Select } from "@/components/Select"
import { Textarea } from "@/components/Textarea"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import { cn } from "@/lib/utils"
import type { MockVisitNote, VisitNoteTrack } from "@/data/mock/visit-notes"
import type { VisitNoteSubmitPayload } from "../visit-notes.api"
import {
  formatNoteFileSize,
  getVisitNoteFileName,
  hasVisitNoteFile,
  isAcceptedVisitNoteFile,
  visitNoteFileFromUpload,
  VISIT_NOTE_FILE_ACCEPT,
} from "../visit-note-file.utils"

type NoteInputMode = "text" | "file"

interface AddVisitNoteDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTrack?: VisitNoteTrack
  note?: MockVisitNote | null
  onSubmit: (payload: VisitNoteSubmitPayload) => Promise<void>
}

export function AddVisitNoteDrawer({
  open,
  onOpenChange,
  defaultTrack = "consultation",
  note,
  onSubmit,
}: AddVisitNoteDrawerProps) {
  const t = useAppTranslations()
  const { isRtl, lang } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const [track, setTrack] = useState<VisitNoteTrack>(defaultTrack)
  const [mode, setMode] = useState<NoteInputMode>("text")
  const [text, setText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setFileError(null)
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ""

    if (note) {
      setTrack(note.track)
      if (hasVisitNoteFile(note)) {
        setMode("file")
        setText("")
      } else {
        setMode("text")
        setText(note.note_text ?? "")
      }
    } else {
      setTrack(defaultTrack)
      setMode("text")
      setText("")
    }
  }, [open, note, defaultTrack])

  const handleModeChange = (next: NoteInputMode) => {
    setMode(next)
    setFileError(null)
    if (next === "text") {
      setSelectedFile(null)
      if (inputRef.current) inputRef.current.value = ""
    } else {
      setText("")
    }
  }

  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      setSelectedFile(null)
      setFileError(null)
      return
    }
    if (!isAcceptedVisitNoteFile(file)) {
      setSelectedFile(null)
      setFileError(t.profile.visitNoteFileTypesHint)
      return
    }
    setFileError(null)
    setSelectedFile(file)
  }

  const handleSubmit = async () => {
    if (mode === "text") {
      if (!text.trim()) return
      setSaving(true)
      try {
        await onSubmit({ track, noteText: text.trim(), file: null })
        onOpenChange(false)
      } finally {
        setSaving(false)
      }
      return
    }

    if (selectedFile) {
      setSaving(true)
      try {
        await onSubmit({ track, noteText: null, file: visitNoteFileFromUpload(selectedFile) })
        onOpenChange(false)
      } finally {
        setSaving(false)
      }
      return
    }

    if (note && hasVisitNoteFile(note)) {
      setSaving(true)
      try {
        await onSubmit({
          track,
          noteText: null,
          file: {
            file_name: note.note_file_name ?? getVisitNoteFileName(note),
            file_url: note.note_file_url ?? note.note_photo_ref ?? "",
            file_size: note.note_file_size,
            mime_type: note.note_mime_type,
          },
        })
        onOpenChange(false)
      } finally {
        setSaving(false)
      }
    }
  }

  const canSubmit =
    mode === "text"
      ? Boolean(text.trim())
      : Boolean(selectedFile || (note && hasVisitNoteFile(note)))

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>
            {note ? t.profile.editVisitNoteTitle : t.profile.visitNote.title}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-4">
          <div>
            <Label>{t.profile.visitNote.track}</Label>
            <Select value={track} onChange={(e) => setTrack(e.target.value as VisitNoteTrack)}>
              <option value="consultation">{lang === "ar" ? "الطبيب" : "Consultation"}</option>
              <option value="nutrition">{lang === "ar" ? "التغذية" : "Nutrition"}</option>
              <option value="coaching">{lang === "ar" ? "اللياقة" : "Coaching"}</option>
              <option value="ad-hoc">{lang === "ar" ? "عام" : "Ad-hoc"}</option>
            </Select>
          </div>

          <div>
            <Label>{t.profile.visitNoteInputType}</Label>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => handleModeChange("text")}
                className={cn(
                  "app-pill flex flex-1 items-center justify-center gap-1.5",
                  mode === "text" ? "app-pill--primary" : "app-pill--muted",
                )}
              >
                <RiFileTextLine className="size-3.5" aria-hidden />
                {t.profile.visitNoteModeText}
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
                {t.profile.visitNoteModeFile}
              </button>
            </div>
          </div>

          {mode === "text" ? (
            <div>
              <Label>{t.profile.note}</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.profile.visitNote.placeholder}
                rows={5}
              />
            </div>
          ) : (
            <div>
              {note && hasVisitNoteFile(note) && !selectedFile && (
                <div className="mb-3 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 rtl:flex-row-reverse">
                  <RiAttachmentLine className="size-6 shrink-0 text-primary-600" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {getVisitNoteFileName(note)}
                    </p>
                    {note.note_file_size != null && (
                      <p className="mt-0.5 text-theme-xs text-gray-500" dir="ltr">
                        {formatNoteFileSize(note.note_file_size)}
                      </p>
                    )}
                    <p className="mt-1 text-theme-xs text-gray-500">
                      {t.profile.visitNoteReplaceFileHint}
                    </p>
                  </div>
                </div>
              )}
              <Label>{t.profile.visitNoteUploadLabel}</Label>
              <input
                ref={inputRef}
                type="file"
                accept={VISIT_NOTE_FILE_ACCEPT}
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
                  {selectedFile ? selectedFile.name : t.profile.visitNoteChooseFile}
                </span>
                {selectedFile && (
                  <span className="text-theme-xs text-gray-500" dir="ltr">
                    {formatNoteFileSize(selectedFile.size)}
                  </span>
                )}
                <span className="text-theme-xs text-gray-500">
                  {t.profile.visitNoteFileTypesHint}
                </span>
              </button>
              {fileError && <p className="mt-2 text-theme-xs text-red-600">{fileError}</p>}
            </div>
          )}
        </DrawerBody>
        <DrawerFooter className="sticky bottom-0 border-t border-gray-100 bg-white pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={saving || !canSubmit}>
            {note ? t.profile.saveVisitNote : t.profile.visitNote.save}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
