export type LabResultStatus = "normal" | "abnormal" | "borderline"

export type LabEntryType = "metric" | "file"

export interface PatientLabResult {
  id: string
  patient_id: string
  entry_type: LabEntryType
  test_name: string
  value: string
  unit: string
  normal_range: string
  status: string
  test_date: string
  pdf_url: string | null
  file_name: string | null
  file_size: number | null
  mime_type: string | null
  notes: string | null
  lab_file_id: string | null
}

export interface LabMetricFormPayload {
  entry_type: "metric"
  test_name: string
  value: string
  unit: string
  normal_range: string
  status: LabResultStatus
  test_date: string
  notes: string | null
}

export interface LabFileFormPayload {
  entry_type: "file"
  test_date: string
  notes: string | null
  file_name: string
  file_url: string
  file_size: number
  mime_type: string
}

export type LabResultFormPayload = LabMetricFormPayload | LabFileFormPayload
