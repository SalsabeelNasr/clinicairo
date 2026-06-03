"use client"

import { useState } from "react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { getAppointmentTypeLabel } from "../appointmentTypes"
import Link from "next/link"
import { RiPhoneLine, RiCalendarLine, RiCloseLine, RiMore2Fill } from "@remixicon/react"
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
import { cn } from "@/lib/utils"
import type { Slot } from "../types"

interface SlotRowProps {
  slot: Slot
  onReschedule?: (slot: Slot) => void
  onCancel?: () => void
}

const STATUS_PILL: Record<string, string> = {
  booked: "app-pill--muted",
  scheduled: "app-pill--muted",
  completed: "app-pill--success",
  cancelled: "app-pill--muted",
}

export function SlotRow({ slot, onReschedule, onCancel }: SlotRowProps) {
  const t = useAppTranslations()
  const { showToast } = useToast()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const startTime = formatSlotTime(slot.startAt)
  const endTime = formatSlotTime(slot.endAt)

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
    <article className="app-row">
      <div className="app-row__main">
        <div className="app-row__time">
          <p className="app-row__time-start">{startTime}</p>
        </div>
        <div className="app-row__divider" aria-hidden />
        <div className="app-row__info">
          <div className="app-row__title-row">
            {slot.patientId ? (
              <Link
                href={`/patients/${slot.patientId}`}
                className="app-row__info-title hover:text-primary-600"
              >
                {slot.patientName}
              </Link>
            ) : (
              <h3 className="app-row__info-title">
                {slot.patientName ?? startTime}
              </h3>
            )}
            <div className="app-row__chips">
              {slot.appointmentType && slot.appointmentType !== "flexible" && (
                <span className="app-pill app-pill--info">
                  {getAppointmentTypeLabel(slot.appointmentType, t.appointments)}
                </span>
              )}
              <span
                className={cn("app-pill", STATUS_PILL[slot.state] || "app-pill--muted")}
              >
                {t.appointments.scheduled}
              </span>
            </div>
          </div>
          {slot.patientPhone && (
            <p className="app-row__info-subtitle">
              <span className="inline-flex items-center gap-1" dir="ltr">
                <RiPhoneLine className="size-3.5 text-slate-400" aria-hidden />
                {slot.patientPhone.replace(/\s/g, "")}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="app-row__actions">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="app-icon-btn" aria-label="Actions">
              <RiMore2Fill className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            {onReschedule && slot.appointmentId && (
              <DropdownMenuItem onClick={handleReschedule}>
                <RiCalendarLine className="me-2 size-4" />
                {t.appointments.rescheduleAppointment}
              </DropdownMenuItem>
            )}
            {slot.appointmentId && (
              <DropdownMenuItem
                className="text-error-600 focus:bg-error-50 focus:text-error-600"
                onClick={() => setShowCancelModal(true)}
              >
                <RiCloseLine className="me-2 size-4" />
                  {t.common.cancel}
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
        appointmentTime={`${startTime} - ${endTime}`}
        isLoading={isCancelling}
      />
    </article>
  )
}
