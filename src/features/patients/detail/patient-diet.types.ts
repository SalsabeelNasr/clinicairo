export interface PatientDiet {
  id: string
  patient_id: string
  file_name: string
  file_url: string
  file_size: number | null
  mime_type: string | null
  created_at: string
  updated_at: string
  version: number
  is_active: boolean
}

export interface DietFormPayload {
  file_name: string
  file_url: string
  file_size: number | null
  mime_type: string | null
}
