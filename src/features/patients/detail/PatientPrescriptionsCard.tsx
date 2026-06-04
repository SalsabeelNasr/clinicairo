"use client"

import { RiDownloadLine, RiExternalLinkLine, RiFileList3Line } from "@remixicon/react"
import { Button } from "@/components/Button"
import { ProfileCardActionsMenu } from "./components/ProfileCardActionsMenu"
import { ProfileRowActions } from "./components/ProfileRowActions"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { PatientPrescription } from "./patient-prescription.types"
import {
  downloadPrescriptionFile,
  formatPrescriptionFileSize,
  viewPrescriptionFile,
} from "./prescription-file.utils"
import { formatProfileDate } from "./patient-profile.utils"

function PrescriptionFileRow({
  prescription,
  lang,
  isLatest,
  onEdit,
  onDelete,
}: {
  prescription: PatientPrescription
  lang: "ar" | "en"
  isLatest?: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const t = useAppTranslations()

  return (
    <div className="w-48 flex-none rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <div className="mb-3 flex items-start justify-between gap-2 rtl:flex-row-reverse">
        <span className="app-pill app-pill--primary text-[10px]">
          {isLatest ? t.profile.currentPrescription : t.profile.prescriptions}
        </span>
        <ProfileRowActions
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLabel={t.profile.deletePrescription}
        />
      </div>
      <p className="line-clamp-2 text-xs font-bold text-gray-800" title={prescription.file_name}>
        {prescription.file_name}
      </p>
      <p className="mt-1 text-[10px] text-gray-500">
        {formatProfileDate(prescription.updated_at, lang)}
      </p>
      <p className="mt-1 text-[10px] text-gray-400">
          {t.profile.prescriptionVersion.replace("{n}", String(prescription.version))}
          {prescription.file_size != null && (
            <>
              {" · "}
              <span dir="ltr">{formatPrescriptionFileSize(prescription.file_size)}</span>
            </>
          )}
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-1.5 text-[11px] font-bold text-primary-600 underline underline-offset-2"
          onClick={() => viewPrescriptionFile(prescription)}
        >
          <RiExternalLinkLine className="size-3.5" aria-hidden />
          {t.profile.viewPrescriptionPdf}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-1.5 text-[11px] font-bold text-primary-600 underline underline-offset-2"
          onClick={() => downloadPrescriptionFile(prescription)}
        >
          <RiDownloadLine className="size-3.5" aria-hidden />
          {t.profile.downloadPrescriptionPdf}
        </Button>
      </div>
    </div>
  )
}

interface PatientPrescriptionsCardProps {
  prescriptions: PatientPrescription[]
  onAdd: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function PatientPrescriptionsCard({
  prescriptions,
  onAdd,
  onEdit,
  onDelete,
}: PatientPrescriptionsCardProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const title = t.profile.section.prescriptions

  const latest = prescriptions[0] ?? null

  return (
    <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs">
      <div className="mb-6 shrink-0">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiFileList3Line className="size-4 shrink-0 text-primary-600" aria-hidden />
            <h2 className="text-sm font-bold text-gray-800">{title}</h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={title}
            onAdd={onAdd}
            addLabel={t.profile.logNewPrescription}
          />
        </div>
      </div>

      {!latest ? (
        <div className="space-y-3">
          <p className="text-theme-sm font-medium text-gray-700">{t.profile.noPrescriptions}</p>
          <p className="text-theme-sm text-gray-500">{t.profile.addPrescriptionDesc}</p>
          <Button variant="secondary" size="sm" onClick={onAdd}>
            {t.profile.logNewPrescription}
          </Button>
        </div>
      ) : (
        <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-4 overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {prescriptions.map((prescription, index) => (
            <PrescriptionFileRow
              key={prescription.id}
              prescription={prescription}
              lang={lang}
              isLatest={index === 0}
              onEdit={() => onEdit(prescription.id)}
              onDelete={() => onDelete(prescription.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
