// Mock users and single-clinic data for the frontend-only CliniCairo build.

export interface MockUser {
  id: string
  email: string
  full_name: string
  first_name: string
  last_name: string
  role: StaffRole
  specialization?: string
  avatar_initials: string
  isOwner?: boolean
}

export type StaffRole = "owner" | "assistant" | "doctor" | "nutritionist" | "coach"

export const STAFF_ROLE_LABELS: Record<StaffRole, { en: string; ar: string }> = {
  owner: { en: "Owner", ar: "المالك" },
  assistant: { en: "Assistant", ar: "مساعد" },
  doctor: { en: "Doctor", ar: "طبيب" },
  nutritionist: { en: "Nutritionist", ar: "أخصائي تغذية" },
  coach: { en: "Coach", ar: "مدرب" },
}

export interface MockClinic {
  id: string
  name: string // Name is the location
  location: string
  address: string
  phone: string
}

export const mockUsers: MockUser[] = [
  {
    id: "user-001",
    email: "salsabeel@clinicairo.com",
    full_name: "Salsabeel Khaleel",
    first_name: "Salsabeel",
    last_name: "Khaleel",
    role: "owner",
    specialization: "Clinic Owner",
    avatar_initials: "SK",
    isOwner: true,
  },
  {
    id: "user-002",
    email: "ahmed.kady@clinicairo.com",
    full_name: "Dr. Ahmed El Kady",
    first_name: "Ahmed",
    last_name: "El Kady",
    role: "doctor",
    specialization: "Obesity Medicine",
    avatar_initials: "AK",
  },
  {
    id: "user-003",
    email: "mariam.mohamed@clinicairo.com",
    full_name: "Mariam Mohamed",
    first_name: "Mariam",
    last_name: "Mohamed",
    role: "assistant",
    specialization: "Patient Operations",
    avatar_initials: "MM",
  },
  {
    id: "user-004",
    email: "layla.mansour@clinicairo.com",
    full_name: "Layla Mansour",
    first_name: "Layla",
    last_name: "Mansour",
    role: "nutritionist",
    specialization: "Clinical Nutrition",
    avatar_initials: "LM",
  },
  {
    id: "user-005",
    email: "youssef.salem@clinicairo.com",
    full_name: "Youssef Salem",
    first_name: "Youssef",
    last_name: "Salem",
    role: "coach",
    specialization: "Fitness Coaching",
    avatar_initials: "YS",
  },
]

export const mockClinics: MockClinic[] = [
  {
    id: "clinic-001",
    name: "CliniCairo",
    location: "Online",
    address: "Remote GLP-1 weight-loss teleclinic serving Libya",
    phone: "+201140988255",
  },
]

// Get user by ID
export function getMockUserById(userId: string): MockUser | undefined {
  return mockUsers.find((user) => user.id === userId)
}

// Get clinic by ID
export function getMockClinicById(clinicId: string): MockClinic | undefined {
  return mockClinics.find((clinic) => clinic.id === clinicId)
}

// Get users by role
export function getMockUsersByRole(role: StaffRole): MockUser[] {
  return mockUsers.filter((user) => user.role === role)
}

// Default current user
export const DEFAULT_CURRENT_USER_ID = "user-002"
export const DEFAULT_CURRENT_CLINIC_ID = "clinic-001"
