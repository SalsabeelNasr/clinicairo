"use client"

import { useEffect, useRef, useState } from "react"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import { mockClinicSettings } from "@/data/mock/clinic-settings"
import type { CurrencyCode } from "@/data/mock/clinic-settings"
import type { SubscriptionTier } from "@/data/mock/subscriptions"
import type { RecordPaymentPayload } from "../payments-profile.api"
import type { ProfileAppointment } from "../usePatientPageData"

interface RecordPaymentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  doctorId: string | null
  uploadedBy: string
  appointments: ProfileAppointment[]
  onSubmit: (payload: RecordPaymentPayload) => Promise<void>
}

export function RecordPaymentDrawer({
  open,
  onOpenChange,
  patientId,
  doctorId,
  uploadedBy,
  appointments,
  onSubmit,
}: RecordPaymentDrawerProps) {
  const t = useAppTranslations()
  const { isRtl } = useLocale()
  const fileRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [type, setType] = useState<SubscriptionTier>("assessment")
  const [currency, setCurrency] = useState<CurrencyCode>("USD")
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState(mockClinicSettings.payment_methods[0] ?? "transfer")
  const [appointmentId, setAppointmentId] = useState("")
  const [receiptName, setReceiptName] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setType("assessment")
    setCurrency("USD")
    const prices = mockClinicSettings.tier_prices.assessment
    setAmount(String(prices.usd))
    setMethod(mockClinicSettings.payment_methods[0] ?? "transfer")
    setAppointmentId("")
    setReceiptName(null)
  }, [open])

  useEffect(() => {
    const prices = mockClinicSettings.tier_prices[type]
    if (!prices) return
    const value =
      currency === "LYD" ? prices.lyd : currency === "EGP" ? prices.egp : prices.usd
    setAmount(String(value))
  }, [type, currency])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    setSaving(true)
    try {
      await onSubmit({
        patientId,
        doctorId,
        type,
        amount: parsed,
        currency,
        method,
        receiptRef: receiptName ? `/attachments/${receiptName}` : null,
        uploadedBy,
        appointmentId: type === "assessment" && appointmentId ? appointmentId : null,
      })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const upcoming = appointments.filter(
    (a) => new Date(a.scheduled_at).getTime() >= Date.now(),
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <DrawerHeader>
            <DrawerTitle>{t.profile.recordPaymentTitle}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="space-y-4">
            <div>
              <Label>{t.profile.subscriptionTier}</Label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as SubscriptionTier)}
              >
                <option value="assessment">{t.profile.tierAssessment}</option>
                <option value="tier_1">{t.profile.tier1}</option>
                <option value="tier_2">{t.profile.tier2}</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.profile.paymentAmount}</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div>
                <Label>{t.profile.paymentCurrency}</Label>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                >
                  {mockClinicSettings.accepted_currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label>{t.profile.paymentMethod}</Label>
              <Select value={method} onChange={(e) => setMethod(e.target.value)}>
                {mockClinicSettings.payment_methods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </div>
            {type === "assessment" && upcoming.length > 0 && (
              <div>
                <Label>{t.profile.linkAppointmentOptional}</Label>
                <Select
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                >
                  <option value="">{t.profile.noAppointmentLink}</option>
                  {upcoming.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.type} · {a.scheduled_at}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <div>
              <Label>{t.profile.receiptUpload}</Label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  setReceiptName(file?.name ?? null)
                }}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileRef.current?.click()}
              >
                {receiptName ?? t.profile.receiptChoose}
              </Button>
            </div>
          </DrawerBody>
          <DrawerFooter className="sticky bottom-0 border-t border-gray-100 bg-white pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t.common.saving : t.profile.recordPayment}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
