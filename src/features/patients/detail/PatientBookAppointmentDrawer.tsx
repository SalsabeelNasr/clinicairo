"use client"

import { useUserClinic } from "@/contexts/user-clinic-context"
import { BookAppointmentDrawer } from "@/features/appointments/components/BookAppointmentDrawer"
import { toBookAppointmentInitialPatient } from "@/features/appointments/book-appointment-patient.utils"
import { DEMO_CLINIC_ID } from "@/lib/constants"
import type { Patient } from "@/features/patients/patients.types"

interface PatientBookAppointmentDrawerProps {
  open: boolean
  onClose: () => void
  patient: Patient
  canBook?: boolean
  onBookingComplete?: () => void
}

/** BookAppointmentDrawer with patient pre-selected; gated by verified prepay rules. */
export function PatientBookAppointmentDrawer({
  open,
  onClose,
  patient,
  canBook = true,
  onBookingComplete,
}: PatientBookAppointmentDrawerProps) {
  const { currentUser, currentClinic } = useUserClinic()

  if (!canBook) return null

  return (
    <BookAppointmentDrawer
      open={open && canBook}
      onClose={onClose}
      initialPatient={toBookAppointmentInitialPatient(patient)}
      clinicId={currentClinic?.id ?? DEMO_CLINIC_ID}
      doctorId={patient.doctor_id ?? currentUser.id}
      onBookingComplete={onBookingComplete}
    />
  )
}
