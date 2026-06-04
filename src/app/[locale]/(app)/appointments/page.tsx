"use client"

import { useEffect, useRef, useState } from "react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { PageHeader } from "@/components/shared/PageHeader"
import {
  AppointmentsHeader,
  DoctorSelector,
} from "@/features/appointments/components/AppointmentsHeader"
import {
  DailyScheduleView,
  type DailyScheduleViewRef,
} from "@/features/appointments/components/DailyScheduleView"
import { WaitlistTab } from "@/features/appointments/components/WaitlistTab"
import { BookAppointmentDrawer } from "@/features/appointments/components/BookAppointmentDrawer"
import { AddToWaitlistDrawer } from "@/features/appointments/waitlist/AddToWaitlistDrawer"
import {
  toBookAppointmentInitialPatientFromSlot,
  toBookAppointmentInitialPatientFromWaitlist,
} from "@/features/appointments/book-appointment-patient.utils"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useDemo } from "@/contexts/demo-context"
import { useToast } from "@/hooks/useToast"
import { DEMO_CLINIC_ID, DEMO_DOCTOR_ID } from "@/lib/constants"
import type { Slot, WaitlistEntry } from "@/features/appointments/types"

export default function AppointmentsPage() {
  const t = useAppTranslations()
  const { showToast } = useToast()
  const { currentUser, currentClinic } = useUserClinic()
  useDemo()

  const clinicId = currentClinic?.id || DEMO_CLINIC_ID

  const getInitialDoctorId = () => {
    if (currentUser.role === "doctor") {
      return currentUser.id
    }
    return DEMO_DOCTOR_ID
  }

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(getInitialDoctorId())
  const [activeTab, setActiveTab] = useState<"appointments" | "waitlist">("appointments")
  const scheduleViewRef = useRef<DailyScheduleViewRef>(null)
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false)
  const [selectedSlotForFill, setSelectedSlotForFill] = useState<Slot | null>(null)
  const [rescheduleSlot, setRescheduleSlot] = useState<Slot | null>(null)
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null)
  const [waitlistEntryToBook, setWaitlistEntryToBook] = useState<WaitlistEntry | null>(null)
  const [showAddToWaitlistDrawer, setShowAddToWaitlistDrawer] = useState(false)

  const effectiveDoctorId =
    selectedDoctorId || (currentUser.role === "doctor" ? currentUser.id : DEMO_DOCTOR_ID)

  const handleFillSlot = (slot: Slot) => {
    setSelectedSlotForFill(slot)
    setRescheduleSlot(null)
    setRescheduleAppointmentId(null)
    setWaitlistEntryToBook(null)
    setIsBookingDrawerOpen(true)
  }

  const handleReschedule = (slot: Slot) => {
    setRescheduleSlot(slot)
    setRescheduleAppointmentId(slot.appointmentId || null)
    setSelectedSlotForFill(null)
    setWaitlistEntryToBook(null)
    setIsBookingDrawerOpen(true)
  }

  const handleBookFromWaitlist = (entry: WaitlistEntry) => {
    setWaitlistEntryToBook(entry)
    setRescheduleSlot(null)
    setRescheduleAppointmentId(null)
    setSelectedSlotForFill(null)
    setIsBookingDrawerOpen(true)
  }

  const handleBookingComplete = async () => {
    if (scheduleViewRef.current) {
      await scheduleViewRef.current.refetch()
    }
    setSelectedSlotForFill(null)
    setRescheduleSlot(null)
    setRescheduleAppointmentId(null)
    setWaitlistEntryToBook(null)
    showToast(t.profile.appointmentBooked, "success")
  }

  const handleDrawerClose = () => {
    setIsBookingDrawerOpen(false)
    setSelectedSlotForFill(null)
    setRescheduleSlot(null)
    setRescheduleAppointmentId(null)
    setWaitlistEntryToBook(null)
  }

  useEffect(() => {
    if (currentUser.role !== "doctor") {
      setSelectedDoctorId(DEMO_DOCTOR_ID)
    } else {
      setSelectedDoctorId(currentUser.id)
    }
  }, [clinicId, currentUser])

  const initialPatient = waitlistEntryToBook
    ? toBookAppointmentInitialPatientFromWaitlist(waitlistEntryToBook)
    : rescheduleSlot
      ? toBookAppointmentInitialPatientFromSlot(rescheduleSlot)
      : null

  return (
    <div className="app-page">
      <PageHeader
        title={t.nav.appointments}
        actions={
          <DoctorSelector
            clinicId={clinicId}
            selectedDoctorId={effectiveDoctorId}
            onDoctorChange={setSelectedDoctorId}
          />
        }
      />
      <AppointmentsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "appointments" ? (
        <DailyScheduleView
          ref={scheduleViewRef}
          clinicId={clinicId}
          doctorId={effectiveDoctorId}
          onFillSlot={handleFillSlot}
          onReschedule={handleReschedule}
        />
      ) : (
        <WaitlistTab
          clinicId={clinicId}
          doctorId={effectiveDoctorId}
          onBook={handleBookFromWaitlist}
          onAddToWaitlist={() => setShowAddToWaitlistDrawer(true)}
        />
      )}

      <BookAppointmentDrawer
        open={isBookingDrawerOpen}
        onClose={handleDrawerClose}
        onBookingComplete={handleBookingComplete}
        preSelectedSlot={
          selectedSlotForFill
            ? {
                clinicId: selectedSlotForFill.clinicId,
                doctorId: selectedSlotForFill.doctorId,
                startAt: selectedSlotForFill.startAt,
                endAt: selectedSlotForFill.endAt,
                appointmentType: selectedSlotForFill.appointmentType,
              }
            : null
        }
        initialPatient={initialPatient}
        rescheduleAppointmentId={rescheduleAppointmentId}
        waitlistEntry={waitlistEntryToBook}
        clinicId={rescheduleSlot?.clinicId || clinicId}
        doctorId={rescheduleSlot?.doctorId || effectiveDoctorId}
      />

      <AddToWaitlistDrawer
        open={showAddToWaitlistDrawer}
        onClose={() => setShowAddToWaitlistDrawer(false)}
        onComplete={() => setShowAddToWaitlistDrawer(false)}
      />
    </div>
  )
}
