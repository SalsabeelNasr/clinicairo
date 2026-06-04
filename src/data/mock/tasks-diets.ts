// Tasks and diet plans mock data

interface Task {
  id: string
  patient_id: string
  title: string
  description: string | null
  type: string
  status: string
  due_date: string
  completed_at: string | null
  ignored_at: string | null
  created_at: string
  updated_at: string | null
}

export const mockTasks: Task[] = [
  {
    id: "task-p1-001",
    patient_id: "patient-001",
    title: "Upload Blood Test Results",
    description: "Please upload your latest CBC and Lipid panel results for review.",
    type: "lab_test",
    status: "pending",
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    ignored_at: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: "task-p1-002",
    patient_id: "patient-001",
    title: "Daily Weight Log",
    description: "Record your weight every morning before breakfast.",
    type: "follow_up",
    status: "pending",
    due_date: new Date().toISOString().split("T")[0],
    completed_at: null,
    ignored_at: null,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: "task-p1-003",
    patient_id: "patient-001",
    title: "Review New Diet Plan",
    description: "Review the updated high-protein diet plan shared by the nutritionist.",
    type: "diet_review",
    status: "completed",
    due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    ignored_at: null,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: "task-001",
    patient_id: "patient-001",
    title: "Verify Payment: Sarah Al-Mabrouk",
    description: "Confirm receipt of Tier 1 subscription payment via bank transfer",
    type: "payment_verify",
    status: "pending",
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    ignored_at: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: "task-002",
    patient_id: "patient-002",
    title: "Reschedule: Khalid Al-Warfali",
    description: "Patient was a no-show for the consultation on Tuesday. Call to reschedule.",
    type: "no_show",
    status: "pending",
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    ignored_at: null,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: "task-003",
    patient_id: "patient-003",
    title: "Follow up: Mona A.",
    description: "Cold lead from Facebook. Interested in the nutrition program.",
    type: "cold_lead",
    status: "completed",
    due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ignored_at: null,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "task-004",
    patient_id: "patient-004",
    title: "Renewal Reminder: Halah Bin Omar",
    description: "Monthly fitness coaching package expires in 5 days.",
    type: "renewal",
    status: "pending",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    ignored_at: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
  },
  {
    id: "task-005",
    patient_id: "patient-005",
    title: "Chase Labs: Fatima Al-Zarrouq",
    description: "Blood test results pending from Al-Borg lab.",
    type: "lab_chase",
    status: "pending",
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    ignored_at: null,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
  },
]

import type { PatientDiet } from "@/features/patients/detail/patient-diet.types"
import type { PatientTrainingPlan } from "@/features/patients/detail/patient-training-plan.types"

const DEMO_DIET_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

export const mockPatientDiets: PatientDiet[] = [
  {
    id: "diet-p1-001",
    patient_id: "patient-001",
    file_name: "high-protein-hypertension-plan-v3.pdf",
    file_url: DEMO_DIET_PDF_URL,
    file_size: 245_000,
    mime_type: "application/pdf",
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    version: 3,
    is_active: true,
  },
  {
    id: "diet-p1-000",
    patient_id: "patient-001",
    file_name: "initial-weight-loss-plan-v2.pdf",
    file_url: DEMO_DIET_PDF_URL,
    file_size: 198_400,
    mime_type: "application/pdf",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2,
    is_active: false,
  },
  {
    id: "diet-001",
    patient_id: "patient-002",
    file_name: "diabetes-management-plan-v2.pdf",
    file_url: DEMO_DIET_PDF_URL,
    file_size: 312_000,
    mime_type: "application/pdf",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2,
    is_active: true,
  },
  {
    id: "diet-002",
    patient_id: "patient-005",
    file_name: "gerd-management-plan-v1.pdf",
    file_url: DEMO_DIET_PDF_URL,
    file_size: 176_500,
    mime_type: "application/pdf",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
    is_active: true,
  },
]

export const mockPatientTrainingPlans: PatientTrainingPlan[] = [
  {
    id: "training-p1-001",
    patient_id: "patient-001",
    file_name: "strength-conditioning-plan-v2.pdf",
    file_url: DEMO_DIET_PDF_URL,
    file_size: 284_000,
    mime_type: "application/pdf",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2,
    is_active: true,
  },
  {
    id: "training-p1-000",
    patient_id: "patient-001",
    file_name: "intro-mobility-plan-v1.pdf",
    file_url: DEMO_DIET_PDF_URL,
    file_size: 156_200,
    mime_type: "application/pdf",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
    is_active: false,
  },
  {
    id: "training-001",
    patient_id: "patient-004",
    file_name: "monthly-coaching-plan-v1.pdf",
    file_url: DEMO_DIET_PDF_URL,
    file_size: 221_800,
    mime_type: "application/pdf",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
    is_active: true,
  },
]

// Lab Files
interface LabFile {
  id: string
  filename: string
  original_filename: string
  file_size: number
  mime_type: string
  blob_url: string | null
  uploaded_at: string
  patient_id: string
}

