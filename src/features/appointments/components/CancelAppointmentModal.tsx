"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog"
import { Button } from "@/components/Button"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { cn } from "@/lib/utils"
import { RiAlertLine } from "@remixicon/react"

export type AppointmentCancelReason =
  | "patient_requested"
  | "patient_no_show"
  | "scheduling_conflict"
  | "provider_unavailable"
  | "other"

const CANCEL_REASONS: AppointmentCancelReason[] = [
  "patient_requested",
  "patient_no_show",
  "scheduling_conflict",
  "provider_unavailable",
  "other",
]

interface CancelAppointmentModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason: AppointmentCancelReason) => void
  patientName?: string
  appointmentTime?: string
  isLoading?: boolean
}

export function CancelAppointmentModal({
  open,
  onClose,
  onConfirm,
  patientName,
  appointmentTime,
  isLoading = false,
}: CancelAppointmentModalProps) {
  const t = useAppTranslations()
  const [reason, setReason] = useState<AppointmentCancelReason | null>(null)

  useEffect(() => {
    if (!open) setReason(null)
  }, [open])

  const reasonLabels: Record<AppointmentCancelReason, string> = {
    patient_requested: t.appointments.cancelReasonPatientRequested,
    patient_no_show: t.appointments.cancelReasonNoShow,
    scheduling_conflict: t.appointments.cancelReasonScheduling,
    provider_unavailable: t.appointments.cancelReasonProvider,
    other: t.appointments.cancelReasonOther,
  }

  const handleConfirm = () => {
    if (!reason) return
    onConfirm(reason)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 rtl:flex-row-reverse">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100">
              <RiAlertLine className="size-6 text-red-600" />
            </div>
            <div className="min-w-0 text-start">
              <DialogTitle>{t.appointments.cancelAppointmentTitle}</DialogTitle>
              <DialogDescription>{t.appointments.cancelAppointmentDesc}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {patientName && (
            <div className="rounded-lg bg-slate-50 p-3 text-start">
              <p className="text-sm text-slate-600">
                {t.appointments.labelPatient}:{" "}
                <span className="font-semibold text-slate-900">{patientName}</span>
              </p>
              {appointmentTime && (
                <p className="mt-1 text-sm text-slate-600">
                  {t.appointments.labelTime}: {appointmentTime}
                </p>
              )}
            </div>
          )}

          <div className="app-cancel-reasons" role="radiogroup" aria-label={t.appointments.selectCancelReason}>
            {CANCEL_REASONS.map((key) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={reason === key}
                onClick={() => setReason(key)}
                className={cn(
                  "app-cancel-reason",
                  reason === key && "app-cancel-reason--selected",
                )}
              >
                {reasonLabels[key]}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button variant="secondary" disabled={isLoading}>
              {t.appointments.keepAppointment}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !reason}
          >
            {isLoading ? t.appointments.cancelling : t.appointments.confirmCancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function cancelReasonToStatus(reason: AppointmentCancelReason): "cancelled" | "no_show" {
  return reason === "patient_no_show" ? "no_show" : "cancelled"
}
