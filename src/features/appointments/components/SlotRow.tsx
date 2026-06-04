"use client"

import { useState } from "react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { getAppointmentTypeLabel } from "../appointmentTypes"
import Link from "next/link"
import { Badge } from "@/components/Badge"
import { RiPhoneLine, RiCalendarLine, RiCloseLine, RiMore2Fill, RiUserLine } from "@remixicon/react"
import { formatSlotTime } from "../utils/slotFormatters"
import { updateStatus } from "../appointments.api"
import { useToast } from "@/hooks/useToast"
import { CancelAppointmentModal, cancelReasonToStatus, type AppointmentCancelReason } from "./CancelAppointmentModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import type { Slot } from "../types"

interface SlotRowProps {
  slot: Slot
  onReschedule?: (slot: Slot) => void
  onCancel?: () => void
}

export function SlotRow({ slot, onReschedule, onCancel }: SlotRowProps) {
  const t = useAppTranslations()
  const { showToast } = useToast()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const startTime = formatSlotTime(slot.startAt)
  const endTime = formatSlotTime(slot.endAt)
  const timeRange = `${startTime} - ${endTime}`

  const handleConfirmCancel = async (reason: AppointmentCancelReason) => {
    if (!slot.appointmentId) return

    setIsCancelling(true)
    try {
      const status = cancelReasonToStatus(reason)
      await updateStatus(slot.appointmentId, status)
      showToast(t.appointments.appointmentCancelled, "success")
      setShowCancelModal(false)
      if (onCancel) {
        await onCancel()
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error)
      showToast("Failed to cancel appointment", "error")
    } finally {
      setIsCancelling(false)
    }
  }

  const handleReschedule = () => {
    if (onReschedule && slot.appointmentId) {
      onReschedule(slot)
    }
  }

  if (slot.state !== "booked") {
    return null
  }

  return (
    <article className="schedule-slot">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50">
        <RiUserLine className="size-5 text-primary-600" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {slot.patientId ? (
            <Link href={`/patients/${slot.patientId}`} className="app-entity-name hover:text-primary-600">
              {slot.patientName}
            </Link>
          ) : (
            <span className="app-entity-name">{slot.patientName ?? timeRange}</span>
          )}
          <Badge color="indigo" size="xs">
            {t.appointments.scheduled}
          </Badge>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span>{timeRange}</span>
          {slot.appointmentType && slot.appointmentType !== "flexible" && (
            <>
              <span className="text-gray-300">·</span>
              <span>{getAppointmentTypeLabel(slot.appointmentType, t.appointments)}</span>
            </>
          )}
        </div>
        {slot.patientPhone && (
          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-600">
            <RiPhoneLine className="size-4 shrink-0" aria-hidden />
            <span dir="ltr">{slot.patientPhone.replace(/\s/g, "")}</span>
          </div>
        )}
      </div>
      <div className="shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="app-icon-btn" aria-label="Actions">
              <RiMore2Fill className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            {slot.patientId && (
              <DropdownMenuItem asChild>
                <Link href={`/patients/${slot.patientId}`} className="flex items-center gap-2">
                  <RiUserLine className="size-4" />
                  <span>{t.common.view}</span>
                </Link>
              </DropdownMenuItem>
            )}
            {onReschedule && slot.appointmentId && (
              <DropdownMenuItem onClick={handleReschedule} className="flex items-center gap-2">
                <RiCalendarLine className="size-4 shrink-0" />
                <span>{t.appointments.rescheduleAppointment}</span>
              </DropdownMenuItem>
            )}
            {slot.appointmentId && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-error-600 focus:bg-error-50 focus:text-error-600"
                onClick={() => setShowCancelModal(true)}
              >
                <RiCloseLine className="size-4 shrink-0" />
                <span>{t.common.cancel}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CancelAppointmentModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        patientName={slot.patientName}
        appointmentTime={timeRange}
        isLoading={isCancelling}
      />
    </article>
  )
}
