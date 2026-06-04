import type { MockVisitNote } from "@/data/mock/visit-notes"

export const VISIT_NOTE_FILE_ACCEPT =
  "application/pdf,image/*,.pdf,.png,.jpg,.jpeg,.webp"

const DEMO_NOTE_FILE_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

export function formatNoteFileSize(bytes: number | null): string {
  if (bytes == null || bytes <= 0) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toLocaleString("en-US", { maximumFractionDigits: 1 })} KB`
  }
  return `${(bytes / (1024 * 1024)).toLocaleString("en-US", { maximumFractionDigits: 1 })} MB`
}

export function hasVisitNoteFile(note: MockVisitNote): boolean {
  return Boolean(note.note_file_url ?? note.note_photo_ref)
}

export function getVisitNoteFileName(note: MockVisitNote): string {
  if (note.note_file_name) return note.note_file_name
  if (note.note_photo_ref) return note.note_photo_ref.split("/").pop() ?? "attachment"
  return "file"
}

export function getVisitNoteFileUrl(note: MockVisitNote): string | null {
  return note.note_file_url ?? note.note_photo_ref
}

export function isAcceptedVisitNoteFile(file: File): boolean {
  if (file.type.startsWith("image/") || file.type === "application/pdf") return true
  const lower = file.name.toLowerCase()
  return [".pdf", ".png", ".jpg", ".jpeg", ".webp"].some((ext) => lower.endsWith(ext))
}

export function visitNoteFileFromUpload(file: File): {
  file_name: string
  file_url: string
  file_size: number
  mime_type: string
} {
  return {
    file_name: file.name,
    file_url: URL.createObjectURL(file),
    file_size: file.size,
    mime_type: file.type || "application/octet-stream",
  }
}

export function downloadVisitNoteFile(note: MockVisitNote): void {
  const fileUrl = getVisitNoteFileUrl(note)
  if (!fileUrl) return

  const url =
    fileUrl.startsWith("blob:") ||
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://")
      ? fileUrl
      : DEMO_NOTE_FILE_URL

  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = getVisitNoteFileName(note)
  anchor.rel = "noopener noreferrer"
  if (url.startsWith("http")) {
    anchor.target = "_blank"
  }
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
