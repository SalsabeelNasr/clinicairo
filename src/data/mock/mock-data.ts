// Barrel: re-exports from split mock data modules
// This file preserves backward compatibility for imports from @/data/mock/mock-data

export {
  DEMO_DOCTOR_ID,
  DEMO_CLINIC_ID,
  mockDoctor,
  mockClinic,
  mockDoctors,
} from "./constants"
export { mockPatients } from "./patients"
export type { Patient } from "./patients"
export {
  mockWeightLogs,
  mockInjections,
  mockMedications,
  mockDoctorNotes,
  mockLabFiles,
  mockLabResults,
} from "./medical"
export { mockTasks, mockPatientDiets, mockPatientTrainingPlans } from "./tasks-diets"
export {
  mockAttachments,
} from "./records"
export { mockAppointments, mockDoctorAvailability } from "./appointments"
export {
  mockPrescriptions,
  mockPatientPrescriptionFiles,
  mockPastMedications,
  mockPastProcedures,
} from "./prescriptions"
export { mockLeads } from "./leads"
export { mockClinicSettings } from "./clinic-settings"
export { mockSubscriptions } from "./subscriptions"
export { mockPayments } from "./payments"
export { mockExpenses } from "./expenses"
export { mockPayouts } from "./payouts"
export { mockRefunds } from "./refunds"
export { mockCareTeam } from "./care-team"
export { mockVisitNotes } from "./visit-notes"

import { mockDoctors } from "./constants"
import { mockPatients } from "./patients"
import {
  mockWeightLogs,
  mockInjections,
  mockMedications,
  mockDoctorNotes,
  mockLabFiles,
  mockLabResults,
} from "./medical"
import { mockTasks, mockPatientDiets, mockPatientTrainingPlans } from "./tasks-diets"
import {
  mockAttachments,
} from "./records"
import { mockAppointments, mockDoctorAvailability } from "./appointments"
import {
  mockPrescriptions,
  mockPatientPrescriptionFiles,
  mockPastMedications,
  mockPastProcedures,
} from "./prescriptions"
import { mockLeads } from "./leads"
import { mockClinicSettings } from "./clinic-settings"
import { mockSubscriptions } from "./subscriptions"
import { mockPayments } from "./payments"
import { mockExpenses } from "./expenses"
import { mockPayouts } from "./payouts"
import { mockRefunds } from "./refunds"
import { mockCareTeam } from "./care-team"
import { mockVisitNotes } from "./visit-notes"

export const mockData = {
  doctors: mockDoctors,
  patients: mockPatients,
  appointments: mockAppointments,
  weightLogs: mockWeightLogs,
  injections: mockInjections,
  medications: mockMedications,
  doctorNotes: mockDoctorNotes,
  tasks: mockTasks,
  patientDiets: mockPatientDiets,
  patientTrainingPlans: mockPatientTrainingPlans,
  labFiles: mockLabFiles,
  labResults: mockLabResults,
  attachments: mockAttachments,
  leads: mockLeads,
  doctorAvailability: mockDoctorAvailability,
  prescriptions: mockPrescriptions,
  patientPrescriptionFiles: mockPatientPrescriptionFiles,
  pastMedications: mockPastMedications,
  pastProcedures: mockPastProcedures,
  clinicSettings: mockClinicSettings,
  subscriptions: mockSubscriptions,
  payments: mockPayments,
  expenses: mockExpenses,
  payouts: mockPayouts,
  refunds: mockRefunds,
  careTeam: mockCareTeam,
  visitNotes: mockVisitNotes,
}
