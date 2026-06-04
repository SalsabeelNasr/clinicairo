import type { PatientTrainingPlan } from "./patient-training-plan.types"

const MOCK_TRAINING_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

export function formatTrainingPlanFileSize(bytes: number | null): string {
  if (bytes == null || bytes <= 0) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toLocaleString("en-US", { maximumFractionDigits: 1 })} KB`
  }
  return `${(bytes / (1024 * 1024)).toLocaleString("en-US", { maximumFractionDigits: 1 })} MB`
}

export function trainingPlanFileFromUpload(file: File): {
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

export function viewTrainingPlanFile(plan: PatientTrainingPlan): void {
  const url =
    plan.file_url.startsWith("blob:") ||
    plan.file_url.startsWith("http://") ||
    plan.file_url.startsWith("https://")
      ? plan.file_url
      : MOCK_TRAINING_PDF_URL
  window.open(url, "_blank", "noopener,noreferrer")
}

export function downloadTrainingPlanFile(plan: PatientTrainingPlan): void {
  const url =
    plan.file_url.startsWith("blob:") ||
    plan.file_url.startsWith("http://") ||
    plan.file_url.startsWith("https://")
      ? plan.file_url
      : MOCK_TRAINING_PDF_URL

  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = plan.file_name
  anchor.rel = "noopener noreferrer"
  if (url.startsWith("http")) {
    anchor.target = "_blank"
  }
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
