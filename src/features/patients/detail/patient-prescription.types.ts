export interface PatientPrescription {
  id: string
  patient_id: string
  clinic_id: string
  doctor_id: string | null
  file_name: string
  file_url: string
  file_size: number | null
  mime_type: string | null
  created_at: string
  updated_at: string
  version: number
  is_active: boolean
}

export interface PrescriptionFormPayload {
  file_name: string
  file_url: string
  file_size: number | null
  mime_type: string | null
}
