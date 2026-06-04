import type { StaffRole } from "./users-clinics"

export interface MockCareTeamMember {
  patient_id: string
  staff_id: string
  role: Extract<StaffRole, "doctor" | "nutritionist" | "coach">
}

export const mockCareTeam: MockCareTeamMember[] = [
  { patient_id: "patient-001", staff_id: "user-002", role: "doctor" },
  { patient_id: "patient-001", staff_id: "user-004", role: "nutritionist" },
  { patient_id: "patient-002", staff_id: "user-002", role: "doctor" },
  { patient_id: "patient-002", staff_id: "user-004", role: "nutritionist" },
  { patient_id: "patient-002", staff_id: "user-005", role: "coach" },
  { patient_id: "patient-003", staff_id: "user-002", role: "doctor" },
  { patient_id: "patient-003", staff_id: "user-004", role: "nutritionist" },
  { patient_id: "patient-004", staff_id: "user-002", role: "doctor" },
  { patient_id: "patient-004", staff_id: "user-004", role: "nutritionist" },
  { patient_id: "patient-005", staff_id: "user-002", role: "doctor" },
  { patient_id: "patient-005", staff_id: "user-004", role: "nutritionist" },
  { patient_id: "patient-005", staff_id: "user-005", role: "coach" },
]
