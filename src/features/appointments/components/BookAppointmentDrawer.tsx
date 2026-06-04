"use client"

import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import type { BookAppointmentInitialPatient } from "../book-appointment-patient.utils"
import { BookAppointmentFlow } from "./book-flow/BookAppointmentFlow"

interface PreSelectedSlot {
  clinicId: string
  doctorId: string
  startAt: string
  endAt: string
  appointmentType?: string
}

interface BookAppointmentDrawerProps {
  open: boolean
  onClose: () => void
  onBookingComplete?: () => void
  preSelectedSlot?: PreSelectedSlot | null
  initialPatient?: BookAppointmentInitialPatient | null
  rescheduleAppointmentId?: string | null
  clinicId?: string
  doctorId?: string
}

export function BookAppointmentDrawer({
  open,
  onClose,
  onBookingComplete,
  preSelectedSlot = null,
  initialPatient = null,
  rescheduleAppointmentId = null,
  clinicId,
  doctorId,
}: BookAppointmentDrawerProps) {
  const t = useAppTranslations()
  const { isRtl } = useLocale()
  const handleBookingComplete = () => {
    if (onBookingComplete) {
      onBookingComplete()
    }
    onClose()
  }

  const title = preSelectedSlot
    ? t.appointments.fillSlot
    : rescheduleAppointmentId
      ? t.appointments.rescheduleAppointment
      : t.appointments.bookAppointment

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          {open && (
            <BookAppointmentFlow
              showBackButton={false}
              showTitle={false}
              showHeader={false}
              isEmbedded={true}
              initialPatient={initialPatient}
              preSelectedSlot={preSelectedSlot}
              rescheduleAppointmentId={rescheduleAppointmentId}
              clinicId={clinicId}
              doctorId={doctorId}
              onCancel={onClose}
              onBookingComplete={handleBookingComplete}
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
