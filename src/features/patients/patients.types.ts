export type PatientStatus = "inactive" | "active" | "lost"

export interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  age: number | null
  gender: string
  phone: string
  email: string | null
  address: string | null
  height: number | null
  complaint: string | null
  job: string | null
  social_status?: string | null
  source?: string | null
  source_other?: string | null
  doctor_id: string | null
  nutritionist_id?: string | null
  coach_id?: string | null
  subscription_tier?: "assessment" | "tier_1" | "tier_2" | null
  subscription_status?: "active" | "paused" | "grace" | "lapsed" | "cancelled" | null
  is_diabetic?: boolean | null
  is_hypertensive?: boolean | null
  has_pancreatitis?: boolean | null
  is_pregnant?: boolean | null
  is_breastfeeding?: boolean | null
  thyroid_status?: string | null
  glp1a_previous_exposure?: boolean | null
  has_rheumatoid?: boolean | null
  has_ihd?: boolean | null
  has_heart_failure?: boolean | null
  has_gerd?: boolean | null
  has_gastritis?: boolean | null
  has_hepatic?: boolean | null
  has_anaemia?: boolean | null
  has_bronchial_asthma?: boolean | null
  history_of_operation?: unknown
  status: PatientStatus
  first_visit_at: string | null
  last_visit_at: string | null
  last_activity_at?: string | null
  is_cold?: boolean
  created_at: string
  updated_at: string
}

export interface PatientListItem extends Patient {
  lastAppointmentDate: string | null
}

export interface ListPatientsParams {
  clinicId?: string
  page: number
  pageSize: number
  query?: string
  status?: PatientStatus
}

export interface ListPatientsResponse {
  patients: PatientListItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface CreatePatientInput {
  first_name: string
  last_name: string
  phone: string
  email?: string
  gender?: string
  source?: string
  source_other?: string
  address?: string
  complaint?: string
  social_status?: string
}
