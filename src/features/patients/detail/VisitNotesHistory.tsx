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
      <div className="flex items-center gap-3 rtl:flex-row-reverse">
        <div className="shrink-0 text-primary-600">
          <RiAttachmentLine className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-800">{getVisitNoteFileName(note)}</p>
          {note.note_file_size != null && (
            <p className="mt-0.5 text-theme-xs text-gray-500" dir="ltr">
              {formatNoteFileSize(note.note_file_size)}
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-7 gap-1 px-0 text-xs font-bold text-primary-600 underline underline-offset-2"
            onClick={() => downloadVisitNoteFile(note)}
          >
            <RiDownloadLine className="size-3.5" aria-hidden />
            {t.profile.downloadVisitNoteFile}
          </Button>
        </div>
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
        "rounded-xl border border-gray-100 bg-white p-4 shadow-sm",
        isLatest && "border-primary-100 bg-primary-50/20",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3 rtl:flex-row-reverse">
        <div className="flex flex-wrap items-center gap-2">
          {isLatest ? (
            <span className="app-pill app-pill--primary text-[10px]">
              {t.profile.currentVisitNote}
            </span>
          ) : (
            <span className="text-theme-xs font-medium text-gray-400">
              {hasVisitNoteFile(note) ? t.profile.visitNoteModeFile : t.profile.visitNoteModeText}
            </span>
          )}
          {showTrackFilters && (
            <span className="app-pill app-pill--muted text-[10px]">
              {trackLabel(note.track, lang, t.profile.trackFilterAll)}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-start gap-2 rtl:flex-row-reverse">
          <span className="text-theme-xs text-gray-400">
            {formatProfileDate(note.created_at, lang)}
          </span>
          <ProfileRowActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
      <div className="min-w-0">
        <VisitNotePreview note={note} />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {formatRelativeTime(note.created_at)}
          </span>
        </div>
      </div>
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
    <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs">
      <div className="mb-6 flex shrink-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiFileTextLine className="size-4 shrink-0 text-primary-500/70" aria-hidden />
            <h2 className="text-sm font-bold text-gray-800">
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
        <div className="app-empty-state space-y-3 p-8">
          <RiFileTextLine className="mx-auto mb-2 size-8 text-gray-300" aria-hidden />
          <p className="font-medium text-gray-700">{t.profile.noVisitNotesYet}</p>
          <p className="mt-1 text-theme-sm text-gray-500">{t.profile.addVisitNotesDesc}</p>
          <Button variant="secondary" size="sm" className="mx-auto" onClick={onAddNote}>
            {t.profile.logNewNote}
          </Button>
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
                  "mt-4 space-y-4",
                  historyExpanded &&
                    "max-h-96 overflow-y-auto overscroll-contain pe-1",
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
