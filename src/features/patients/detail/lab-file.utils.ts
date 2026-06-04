import type { PatientLabResult } from "./lab-result.types"

export const LAB_FILE_ACCEPT =
  "application/pdf,image/*,.pdf,.png,.jpg,.jpeg,.webp"

const DEMO_LAB_FILE_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

export function formatLabFileSize(bytes: number | null): string {
  if (bytes == null || bytes <= 0) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toLocaleString("en-US", { maximumFractionDigits: 1 })} KB`
  }
  return `${(bytes / (1024 * 1024)).toLocaleString("en-US", { maximumFractionDigits: 1 })} MB`
}

export function isLabFileEntry(lab: PatientLabResult): boolean {
  return lab.entry_type === "file"
}

export function isLabMetricEntry(lab: PatientLabResult): boolean {
  return lab.entry_type === "metric"
}

export function getLabFileName(lab: PatientLabResult): string {
  return lab.file_name ?? lab.test_name ?? "lab-result"
}

export function getLabFileUrl(lab: PatientLabResult): string {
  return lab.pdf_url ?? DEMO_LAB_FILE_URL
}

export function isAcceptedLabFile(file: File): boolean {
  if (file.type.startsWith("image/") || file.type === "application/pdf") return true
  const lower = file.name.toLowerCase()
  return [".pdf", ".png", ".jpg", ".jpeg", ".webp"].some((ext) => lower.endsWith(ext))
}

export function labFileFromUpload(file: File): {
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

export function viewLabFile(lab: PatientLabResult): void {
  const url = getLabFileUrl(lab)
  window.open(url, "_blank", "noopener,noreferrer")
}

export function downloadLabFile(lab: PatientLabResult): void {
  const url = getLabFileUrl(lab)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = getLabFileName(lab)
  anchor.rel = "noopener noreferrer"
  if (url.startsWith("http")) {
    anchor.target = "_blank"
  }
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
