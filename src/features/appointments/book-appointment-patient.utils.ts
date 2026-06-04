import type { Patient } from "@/features/patients/patients.types"
import type { Slot, WaitlistEntry } from "./types"

/** Patient shape expected by BookAppointmentDrawer / PatientSelector */
export interface BookAppointmentInitialPatient {
  id: string
  first_name: string
  last_name: string
  phone: string
  email: string | null
}

export function toBookAppointmentInitialPatient(
  patient: Pick<Patient, "id" | "first_name" | "last_name" | "phone" | "email">,
): BookAppointmentInitialPatient {
  return {
    id: patient.id,
    first_name: patient.first_name,
    last_name: patient.last_name,
    phone: patient.phone,
    email: patient.email,
  }
}

export function toBookAppointmentInitialPatientFromWaitlist(
  entry: Pick<WaitlistEntry, "patientId" | "patientName" | "patientPhone">,
): BookAppointmentInitialPatient {
  const [first = "", ...rest] = entry.patientName.split(" ")
  return {
    id: entry.patientId,
    first_name: first,
    last_name: rest.join(" "),
    phone: entry.patientPhone,
    email: null,
  }
}

export function toBookAppointmentInitialPatientFromSlot(
  slot: Pick<Slot, "patientId" | "patientName" | "patientPhone">,
): BookAppointmentInitialPatient | null {
  if (!slot.patientId) return null
  const name = slot.patientName ?? ""
  const [first = "", ...rest] = name.split(" ")
  return {
    id: slot.patientId,
    first_name: first,
    last_name: rest.join(" "),
    phone: slot.patientPhone ?? "",
    email: null,
  }
}
