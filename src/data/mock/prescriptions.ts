import type {
  Prescription,
  PastMedication,
  PastProcedure,
} from "@/features/prescriptions/prescriptions.types"
import type { PatientPrescription } from "@/features/patients/detail/patient-prescription.types"

const DEMO_PRESCRIPTION_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

export const mockPatientPrescriptionFiles: PatientPrescription[] = [
  {
    id: "rx-file-p1-002",
    patient_id: "patient-001",
    clinic_id: "clinic-001",
    doctor_id: "user-001",
    file_name: "prescription-hypertension-v2.pdf",
    file_url: DEMO_PRESCRIPTION_PDF_URL,
    file_size: 268_000,
    mime_type: "application/pdf",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2,
    is_active: true,
  },
  {
    id: "rx-file-p1-001",
    patient_id: "patient-001",
    clinic_id: "clinic-001",
    doctor_id: "user-001",
    file_name: "prescription-uri-v1.pdf",
    file_url: DEMO_PRESCRIPTION_PDF_URL,
    file_size: 198_500,
    mime_type: "application/pdf",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
    is_active: false,
  },
  {
    id: "rx-file-002",
    patient_id: "patient-002",
    clinic_id: "clinic-001",
    doctor_id: "user-002",
    file_name: "prescription-diabetes-mgmt-v1.pdf",
    file_url: DEMO_PRESCRIPTION_PDF_URL,
    file_size: 312_000,
    mime_type: "application/pdf",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
    is_active: true,
  },
]

export const mockPrescriptions: Prescription[] = [
  {
    id: "prescription-p1-001",
    clinicId: "clinic-001",
    patientId: "patient-001",
    doctorId: "user-001",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    visitType: "in_clinic",
    diagnosisText: "Hypertension and Obesity",
    notesToPatient: "Focus on low sodium diet and increasing daily activity.",
    items: [
      {
        id: "item-p1-001",
        name: "Amlodipine 5mg",
        strength: "5mg",
        form: "Tablets",
        sig: "Take 1 tablet daily in the morning",
        duration: "90 days",
      },
      {
        id: "item-p1-002",
        name: "Omega-3",
        strength: "1000mg",
        form: "Capsules",
        sig: "Take 1 capsule twice daily with meals",
        duration: "60 days",
      },
    ],
  },
  {
    id: "prescription-001",
    clinicId: "clinic-001",
    patientId: "patient-001",
    doctorId: "doctor-001",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    visitType: "in_clinic",
    diagnosisText: "Upper respiratory tract infection",
    notesToPatient: "Take medications as prescribed. Rest and drink plenty of fluids.",
    items: [
      {
        id: "item-001",
        name: "Amoxicillin 500mg",
        strength: "500mg",
        form: "Tablets",
        sig: "Take 1 tablet three times daily after meals",
        duration: "7 days",
      },
      {
        id: "item-002",
        name: "Paracetamol 500mg",
        strength: "500mg",
        form: "Tablets",
        sig: "Take 1-2 tablets every 6 hours as needed for fever or pain",
        duration: "5 days",
      },
      {
        id: "item-003",
        name: "Cough Syrup",
        form: "Syrup",
        sig: "Take 10ml three times daily",
        duration: "7 days",
      },
    ],
  },
  {
    id: "prescription-002",
    clinicId: "clinic-001",
    patientId: "patient-001",
    doctorId: "doctor-001",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    visitType: "in_clinic",
    diagnosisText: "Hypertension follow-up",
    notesToPatient: "Continue monitoring blood pressure. Follow up in 2 weeks.",
    items: [
      {
        id: "item-004",
        name: "Amlodipine 5mg",
        strength: "5mg",
        form: "Tablets",
        sig: "Take 1 tablet once daily in the morning",
        duration: "30 days",
      },
      {
        id: "item-005",
        name: "Lisinopril 10mg",
        strength: "10mg",
        form: "Tablets",
        sig: "Take 1 tablet once daily",
        duration: "30 days",
      },
    ],
  },
  {
    id: "prescription-003",
    clinicId: "clinic-001",
    patientId: "patient-002",
    doctorId: "doctor-001",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    visitType: "in_clinic",
    diagnosisText: "Diabetes management",
    notesToPatient: "Monitor blood sugar levels regularly. Maintain healthy diet.",
    items: [
      {
        id: "item-006",
        name: "Metformin 500mg",
        strength: "500mg",
        form: "Tablets",
        sig: "Take 1 tablet twice daily with meals",
        duration: "30 days",
        notes: "Start with lower dose",
      },
    ],
  },
  {
    id: "prescription-004",
    clinicId: "clinic-001",
    patientId: "patient-002",
    doctorId: "doctor-001",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    visitType: "online",
    diagnosisText: "Acute gastritis",
    notesToPatient: "Avoid spicy foods and take medications with food.",
    items: [
      {
        id: "item-007",
        name: "Omeprazole 20mg",
        strength: "20mg",
        form: "Capsules",
        sig: "Take 1 capsule once daily before breakfast",
        duration: "14 days",
      },
      {
        id: "item-008",
        name: "Antacid",
        form: "Tablets",
        sig: "Take 1-2 tablets after meals as needed",
        duration: "7 days",
      },
    ],
  },
]

export const mockPastMedications: PastMedication[] = [
  {
    id: "past-med-001",
    patientId: "patient-001",
    name: "Metformin 500mg",
    duration: "6 months",
    takenFrom: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    takenTo: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Discontinued due to improved glucose control",
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "past-med-002",
    patientId: "patient-001",
    name: "Amlodipine 5mg",
    duration: "3 months",
    takenFrom: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    takenTo: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Switched to different medication",
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "past-med-003",
    patientId: "patient-002",
    name: "Levothyroxine 50mcg",
    duration: "1 year",
    takenFrom: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    takenTo: null,
    notes: "Ongoing medication",
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockPastProcedures: PastProcedure[] = [
  {
    id: "past-proc-001",
    patientId: "patient-001",
    name: "Gallbladder removal (laparoscopic)",
    procedureDate: new Date(Date.now() - 2555 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "2018 — no complications",
    createdAt: new Date(Date.now() - 2555 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "past-proc-002",
    patientId: "patient-001",
    name: "C-section",
    procedureDate: new Date(Date.now() - 2000 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "2012, 2015, 2019",
    createdAt: new Date(Date.now() - 2000 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "past-proc-003",
    patientId: "patient-002",
    name: "Appendectomy",
    procedureDate: new Date(Date.now() - 7300 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "2005",
    createdAt: new Date(Date.now() - 7300 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
