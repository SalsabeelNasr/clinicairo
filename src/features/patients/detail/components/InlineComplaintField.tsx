"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface InlineComplaintFieldProps {
  value: string | null
  placeholder: string
  onSave: (complaint: string | null) => Promise<void>
  isRtl?: boolean
  className?: string
}

export function InlineComplaintField({
  value,
  placeholder,
  onSave,
  isRtl = false,
  className,
}: InlineComplaintFieldProps) {
  const [draft, setDraft] = useState(value ?? "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(value ?? "")
  }, [value])

  const save = async () => {
    const trimmed = draft.trim()
    const current = (value ?? "").trim()
    if (trimmed === current) return
    setSaving(true)
    try {
      await onSave(trimmed || null)
    } catch {
      setDraft(value ?? "")
    } finally {
      setSaving(false)
    }
  }

  return (
    <input
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
      placeholder={placeholder}
      disabled={saving}
      dir={isRtl ? "rtl" : "ltr"}
      aria-label={placeholder}
      className={cn(
        "m-0 block w-full min-w-0 truncate border-0 bg-transparent p-0 text-start shadow-none outline-none",
        "placeholder:text-gray-400 focus:outline-none focus:ring-0",
        "disabled:cursor-wait disabled:opacity-60",
        className,
      )}
    />
  )
}
