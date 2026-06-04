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
  onBookingComplete?: () => void
}

/** BookAppointmentDrawer with patient pre-selected (TabibDesk patient-profile pattern). */
export function PatientBookAppointmentDrawer({
  open,
  onClose,
  patient,
  onBookingComplete,
}: PatientBookAppointmentDrawerProps) {
  const { currentUser, currentClinic } = useUserClinic()

  return (
    <BookAppointmentDrawer
      open={open}
      onClose={onClose}
      initialPatient={toBookAppointmentInitialPatient(patient)}
      clinicId={currentClinic?.id ?? DEMO_CLINIC_ID}
      doctorId={patient.doctor_id ?? currentUser.id}
      onBookingComplete={onBookingComplete}
    />
  )
}
