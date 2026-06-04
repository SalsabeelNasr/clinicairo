import { mockData } from "@/data/mock/mock-data"
import type { MockVisitNote, VisitNoteTrack } from "@/data/mock/visit-notes"

export interface VisitNoteFilePayload {
  file_name: string
  file_url: string
  file_size: number | null
  mime_type: string | null
}

export interface VisitNoteSubmitPayload {
  track: VisitNoteTrack
  noteText?: string | null
  file?: VisitNoteFilePayload | null
}

export interface CreateVisitNotePayload extends VisitNoteSubmitPayload {
  patientId: string
  appointmentId?: string | null
  authorId: string
}

function normalizeNoteContent(payload: VisitNoteSubmitPayload): {
  note_text: string | null
  note_file_name: string | null
  note_file_url: string | null
  note_file_size: number | null
  note_mime_type: string | null
} {
  const text = payload.noteText?.trim() || null
  const file = payload.file ?? null

  if (file?.file_url) {
    return {
      note_text: null,
      note_file_name: file.file_name,
      note_file_url: file.file_url,
      note_file_size: file.file_size,
      note_mime_type: file.mime_type,
    }
  }

  return {
    note_text: text,
    note_file_name: null,
    note_file_url: null,
    note_file_size: null,
    note_mime_type: null,
  }
}

export function listVisitNotesByPatient(patientId: string): MockVisitNote[] {
  return mockData.visitNotes
    .filter((n) => n.patient_id === patientId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function createVisitNote(payload: CreateVisitNotePayload): Promise<MockVisitNote> {
  const content = normalizeNoteContent(payload)
  const note: MockVisitNote = {
    id: `note-${Date.now()}`,
    patient_id: payload.patientId,
    appointment_id: payload.appointmentId ?? null,
    track: payload.track,
    author_id: payload.authorId,
    ...content,
    note_photo_ref: null,
    created_at: new Date().toISOString(),
  }
  mockData.visitNotes.unshift(note)
  return note
}

export async function updateVisitNote(
  noteId: string,
  payload: VisitNoteSubmitPayload,
): Promise<void> {
  const idx = mockData.visitNotes.findIndex((n) => n.id === noteId)
  if (idx < 0) return
  const content = normalizeNoteContent(payload)
  mockData.visitNotes[idx] = {
    ...mockData.visitNotes[idx],
    track: payload.track,
    ...content,
    note_photo_ref: null,
  }
}

export async function deleteVisitNote(noteId: string): Promise<void> {
  const idx = mockData.visitNotes.findIndex((n) => n.id === noteId)
  if (idx < 0) return
  mockData.visitNotes.splice(idx, 1)
}
