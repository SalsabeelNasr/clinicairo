export interface PatientInjection {
  id: string
  patient_id: string
  medication_name: string
  dose: string
  injection_date: string
  next_suggested_date: string | null
  next_suggested_dose: string | null
  notes: string | null
  appointment_id: string | null
}

export interface InjectionFormPayload {
  medication_name: string
  dose: string
  injection_date: string
  notes: string | null
}
