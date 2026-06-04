"use client"

import { useEffect, useMemo } from "react"
import { RiAttachmentLine, RiDownloadLine, RiFileTextLine } from "@remixicon/react"
import { Button } from "@/components/Button"
import { ProfileCardActionsMenu } from "./components/ProfileCardActionsMenu"
import { ProfileExpandToggle, useProfileExpanded } from "./components/ProfileExpandable"
import { ProfileRowActions } from "./components/ProfileRowActions"
import { useLocale } from "@/contexts/locale-context"
import type { MockVisitNote } from "@/data/mock/visit-notes"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { cn } from "@/lib/utils"
import type { VisitNoteTrackFilter } from "./patient-profile.types"
import {
  downloadVisitNoteFile,
  formatNoteFileSize,
  getVisitNoteFileName,
  hasVisitNoteFile,
} from "./visit-note-file.utils"
import {
  formatProfileDate,
  trackLabel,
  VISIT_NOTE_TRACK_FILTERS,
} from "./patient-profile.utils"

interface VisitNotesHistoryProps {
  notes: MockVisitNote[]
  trackFilter: VisitNoteTrackFilter
  onTrackFilterChange?: (track: VisitNoteTrackFilter) => void
  onAddNote: () => void
  onEditNote: (id: string) => void
  onDeleteNote: (id: string) => void
}

function VisitNotePreview({ note }: { note: MockVisitNote }) {
  const t = useAppTranslations()

  if (hasVisitNoteFile(note)) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <RiAttachmentLine className="size-4 shrink-0 text-primary-600" aria-hidden />
          <span className="truncate">{getVisitNoteFileName(note)}</span>
        </div>
        {note.note_file_size != null && (
          <p className="text-theme-xs text-gray-500" dir="ltr">
            {formatNoteFileSize(note.note_file_size)}
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
          onClick={() => downloadVisitNoteFile(note)}
        >
          <RiDownloadLine className="size-3.5" aria-hidden />
          {t.profile.downloadVisitNoteFile}
        </Button>
      </div>
    )
  }

  if (note.note_text?.trim()) {
    return (
      <p className="line-clamp-3 text-sm font-medium text-gray-900" dir="auto">
        {note.note_text.trim()}
      </p>
    )
  }

  return <p className="text-sm text-gray-500">—</p>
}

function VisitNoteRow({
  note,
  lang,
  t,
  showTrackFilters,
  isLatest,
  onEdit,
  onDelete,
}: {
  note: MockVisitNote
  lang: "ar" | "en"
  t: ReturnType<typeof useAppTranslations>
  showTrackFilters: boolean
  isLatest?: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return t.common.today
    if (diffDays === 1) return t.common.yesterday
    if (diffDays < 7) return t.common.daysAgo.replace("{n}", String(diffDays))
    if (diffDays < 30) return t.common.weeksAgo.replace("{n}", String(Math.floor(diffDays / 7)))
    if (diffDays < 365) return t.common.monthsAgo.replace("{n}", String(Math.floor(diffDays / 30)))
    return formatProfileDate(dateString, lang)
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2 px-3 py-3 rtl:flex-row-reverse",
        isLatest && "border-b border-gray-100",
      )}
    >
      <div className="min-w-0 flex-1">
        {isLatest && (
          <span className="app-pill app-pill--primary mb-2 inline-block text-[10px]">
            {t.profile.currentVisitNote}
          </span>
        )}
        <VisitNotePreview note={note} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {showTrackFilters && (
            <span className="app-pill app-pill--muted text-[10px]">
              {trackLabel(note.track, lang, t.profile.trackFilterAll)}
            </span>
          )}
          {hasVisitNoteFile(note) ? (
            <span className="app-pill app-pill--primary text-[10px]">
              {t.profile.visitNoteModeFile}
            </span>
          ) : (
            <span className="app-pill app-pill--muted text-[10px]">
              {t.profile.visitNoteModeText}
            </span>
          )}
          <span className="text-xs font-medium text-gray-600">
            {formatProfileDate(note.created_at, lang)}
          </span>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
            {formatRelativeTime(note.created_at)}
          </span>
        </div>
      </div>
      <ProfileRowActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}

export function VisitNotesHistory({
  notes,
  trackFilter,
  onTrackFilterChange,
  onAddNote,
  onEditNote,
  onDeleteNote,
}: VisitNotesHistoryProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const { expanded: historyExpanded, toggle: toggleHistory, setExpanded } =
    useProfileExpanded()

  const showTrackFilters = trackFilter === "all" && !!onTrackFilterChange

  const filteredNotes = useMemo(() => {
    const sorted = [...notes].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    if (trackFilter === "all") return sorted
    if (trackFilter === "consultation") {
      return sorted.filter((n) => n.track === "consultation" || n.track === "ad-hoc")
    }
    return sorted.filter((n) => n.track === trackFilter)
  }, [notes, trackFilter])

  const latest = filteredNotes[0] ?? null
  const history = filteredNotes.slice(1)
  const hasHistory = history.length > 0

  useEffect(() => {
    setExpanded(false)
  }, [trackFilter, setExpanded])

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="shrink-0 flex flex-col gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiFileTextLine className="size-4 shrink-0 text-primary-500/70" aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {t.profile.visitNotesHistory}
            </h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={t.profile.visitNotesHistory}
            onAdd={onAddNote}
            addLabel={t.profile.logNewNote}
          />
        </div>
        {showTrackFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {VISIT_NOTE_TRACK_FILTERS.map((track) => (
              <button
                key={track}
                type="button"
                onClick={() => onTrackFilterChange?.(track)}
                className={cn(
                  "app-pill",
                  trackFilter === track ? "app-pill--primary" : "app-pill--muted",
                )}
              >
                {trackLabel(track, lang, t.profile.trackFilterAll)}
              </button>
            ))}
          </div>
        )}
      </div>

      {!latest ? (
        <div className="app-empty-state p-8">
          <RiFileTextLine className="mx-auto mb-2 size-8 text-gray-300" aria-hidden />
          <p className="font-medium text-gray-700">{t.profile.noVisitNotesYet}</p>
          <p className="mt-1 text-theme-sm text-gray-500">{t.profile.addVisitNotesDesc}</p>
        </div>
      ) : (
        <>
          <VisitNoteRow
            note={latest}
            lang={lang}
            t={t}
            showTrackFilters={showTrackFilters}
            isLatest
            onEdit={() => onEditNote(latest.id)}
            onDelete={() => onDeleteNote(latest.id)}
          />

          {hasHistory && (
            <>
              <div
                className={cn(
                  historyExpanded &&
                    "max-h-80 divide-y divide-gray-100 overflow-y-auto overscroll-contain",
                )}
              >
                {historyExpanded &&
                  history.map((note) => (
                    <VisitNoteRow
                      key={note.id}
                      note={note}
                      lang={lang}
                      t={t}
                      showTrackFilters={showTrackFilters}
                      onEdit={() => onEditNote(note.id)}
                      onDelete={() => onDeleteNote(note.id)}
                    />
                  ))}
              </div>

              <ProfileExpandToggle
                expanded={historyExpanded}
                onToggle={toggleHistory}
                expandLabel={t.profile.showVisitNoteHistory.replace(
                  "{n}",
                  String(history.length),
                )}
              />
            </>
          )}
        </>
      )}
    </section>
  )
}
