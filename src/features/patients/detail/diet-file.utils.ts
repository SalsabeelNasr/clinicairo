import type { PatientDiet } from "./patient-diet.types"

const MOCK_DIET_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

export function formatDietFileSize(bytes: number | null): string {
  if (bytes == null || bytes <= 0) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toLocaleString("en-US", { maximumFractionDigits: 1 })} KB`
  return `${(bytes / (1024 * 1024)).toLocaleString("en-US", { maximumFractionDigits: 1 })} MB`
}

export function dietFileFromUpload(file: File): {
  file_name: string
  file_url: string
  file_size: number
  mime_type: string
} {
  return {
    file_name: file.name,
    file_url: URL.createObjectURL(file),
    file_size: file.size,
    mime_type: file.type || "application/pdf",
  }
}

export function viewDietFile(diet: PatientDiet): void {
  const url =
    diet.file_url.startsWith("blob:") ||
    diet.file_url.startsWith("http://") ||
    diet.file_url.startsWith("https://")
      ? diet.file_url
      : MOCK_DIET_PDF_URL
  window.open(url, "_blank", "noopener,noreferrer")
}

export function downloadDietFile(diet: PatientDiet): void {
  const url =
    diet.file_url.startsWith("blob:") ||
    diet.file_url.startsWith("http://") ||
    diet.file_url.startsWith("https://")
      ? diet.file_url
      : MOCK_DIET_PDF_URL

  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = diet.file_name
  anchor.rel = "noopener noreferrer"
  if (url.startsWith("http")) {
    anchor.target = "_blank"
  }
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

export const DEMO_DIET_PDF_URL = MOCK_DIET_PDF_URL
