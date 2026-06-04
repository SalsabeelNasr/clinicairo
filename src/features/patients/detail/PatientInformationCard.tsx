"use client"

import { useState } from "react"
import {
  RiBriefcaseLine,
  RiCalendarLine,
  RiInformationLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiSaveLine,
  RiUserLine,
  RiWhatsappLine,
  RiCloseLine,
} from "@remixicon/react"
import { ProfileCardActionsMenu } from "./components/ProfileCardActionsMenu"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { Patient } from "@/features/patients/patients.types"
import { cn } from "@/lib/utils"
import { formatProfileDate, whatsAppHref } from "./patient-profile.utils"

interface PatientInformationCardProps {
  patient: Patient
  onUpdate: (updates: Partial<Patient>) => Promise<void>
}

function InfoField({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="mb-1 flex items-center gap-1.5 text-theme-xs font-medium text-gray-500">
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {label}
      </p>
      {children}
    </div>
  )
}

function FieldValue({
  children,
  dirLtr,
}: {
  children: React.ReactNode
  dirLtr?: boolean
}) {
  return (
    <p
      className={cn(
        "text-sm font-medium text-gray-800",
        dirLtr && "dir-ltr",
      )}
    >
      {children}
    </p>
  )
}

export function PatientInformationCard({
  patient,
  onUpdate,
}: PatientInformationCardProps) {
  const t = useAppTranslations()
  const { lang, isRtl } = useLocale()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    first_name: patient.first_name,
    last_name: patient.last_name,
    phone: patient.phone,
    email: patient.email ?? "",
    address: patient.address ?? "",
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await onUpdate({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        address: form.address.trim() || null,
      })
      setIsEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const genderLabel =
    patient.gender === "male"
      ? t.profile.male
      : patient.gender === "female"
        ? t.profile.female
        : patient.gender || "—"

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-3 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiInformationLine className="size-4 shrink-0 text-primary-600" aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {t.profile.patientInfo}
            </h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={t.profile.patientInfo}
            canEdit
            onEdit={() => {
              setForm({
                first_name: patient.first_name,
                last_name: patient.last_name,
                phone: patient.phone,
                email: patient.email ?? "",
                address: patient.address ?? "",
              })
              setIsEditing(true)
            }}
            editLabel={t.profile.edit}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-5">
          <InfoField icon={RiPhoneLine} label={t.profile.phone}>
            {patient.phone ? (
              <div className="flex flex-wrap items-center gap-2">
                <FieldValue dirLtr>{patient.phone}</FieldValue>
                <a
                  href={whatsAppHref(patient.phone)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 hover:text-green-700"
                  title="WhatsApp"
                >
                  <RiWhatsappLine className="size-4" />
                </a>
              </div>
            ) : (
              <FieldValue>—</FieldValue>
            )}
          </InfoField>

          <InfoField icon={RiMailLine} label={t.profile.email}>
            <FieldValue dirLtr>
              <span className="break-all">{patient.email ?? "—"}</span>
            </FieldValue>
          </InfoField>

          {(patient.age != null || patient.gender) && (
            <>
              {patient.age != null && (
                <InfoField icon={RiUserLine} label={t.profile.age}>
                  <FieldValue dirLtr>{patient.age}</FieldValue>
                </InfoField>
              )}
              {patient.gender && (
                <InfoField icon={RiUserLine} label={t.profile.gender}>
                  <FieldValue>{genderLabel}</FieldValue>
                </InfoField>
              )}
            </>
          )}

          <InfoField
            icon={RiMapPinLine}
            label={t.profile.address}
            className="sm:col-span-2 lg:col-span-2"
          >
            <FieldValue>{patient.address ?? "—"}</FieldValue>
          </InfoField>

          {patient.job && (
            <InfoField icon={RiBriefcaseLine} label={t.profile.occupation}>
              <FieldValue>{patient.job}</FieldValue>
            </InfoField>
          )}

          {patient.social_status && (
            <InfoField icon={RiUserLine} label={t.profile.socialStatus}>
              <FieldValue>{patient.social_status}</FieldValue>
            </InfoField>
          )}

          <InfoField icon={RiCalendarLine} label={t.profile.registered}>
            <FieldValue>{formatProfileDate(patient.created_at, lang)}</FieldValue>
          </InfoField>
        </div>
      </section>

      <Drawer open={isEditing} onOpenChange={setIsEditing}>
        <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{t.profile.editPatientInfo}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>{t.profile.firstName}</Label>
                <Input
                  value={form.first_name}
                  onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>{t.profile.lastName}</Label>
                <Input
                  value={form.last_name}
                  onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>{t.profile.phone}</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  dir="ltr"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>{t.profile.email}</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  dir="ltr"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>{t.profile.address}</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                <RiSaveLine className="size-4 me-1" />
                {t.profile.saveChanges}
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                <RiCloseLine className="size-4 me-1" />
                {t.common.cancel}
              </Button>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
