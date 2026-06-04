"use client"

import { RiDownloadLine, RiExternalLinkLine, RiFileList3Line } from "@remixicon/react"
import { Button } from "@/components/Button"
import { ProfileCardActionsMenu } from "./components/ProfileCardActionsMenu"
import { ProfileExpandToggle, useProfileExpanded } from "./components/ProfileExpandable"
import { ProfileRowActions } from "./components/ProfileRowActions"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import { cn } from "@/lib/utils"
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
    <div
      className={cn(
        "flex items-start gap-2 px-3 py-2.5 rtl:flex-row-reverse",
        isLatest && "border-b border-gray-100 py-3",
      )}
    >
      <div className="min-w-0 flex-1">
        {isLatest && (
          <span className="app-pill app-pill--primary mb-2 inline-block text-[10px]">
            {t.profile.currentPrescription}
          </span>
        )}
        <p className="text-sm font-medium text-gray-800">{prescription.file_name}</p>
        <p className="mt-0.5 text-theme-xs text-gray-500">
          {t.profile.prescriptionVersion.replace("{n}", String(prescription.version))}
          {" · "}
          {formatProfileDate(prescription.updated_at, lang)}
          {prescription.file_size != null && (
            <>
              {" · "}
              <span dir="ltr">{formatPrescriptionFileSize(prescription.file_size)}</span>
            </>
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
            onClick={() => viewPrescriptionFile(prescription)}
          >
            <RiExternalLinkLine className="size-3.5" aria-hidden />
            {t.profile.viewPrescriptionPdf}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
            onClick={() => downloadPrescriptionFile(prescription)}
          >
            <RiDownloadLine className="size-3.5" aria-hidden />
            {t.profile.downloadPrescriptionPdf}
          </Button>
        </div>
      </div>
      <ProfileRowActions
        onEdit={onEdit}
        onDelete={onDelete}
        deleteLabel={t.profile.deletePrescription}
      />
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
  const { expanded: historyExpanded, toggle: toggleHistory } = useProfileExpanded()

  const latest = prescriptions[0] ?? null
  const history = prescriptions.slice(1)
  const hasHistory = history.length > 0

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiFileList3Line className="size-4 shrink-0 text-primary-600" aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={title}
            onAdd={onAdd}
            addLabel={t.profile.logNewPrescription}
          />
        </div>
      </div>

      {!latest ? (
        <div className="space-y-1 p-4">
          <p className="text-theme-sm font-medium text-gray-700">{t.profile.noPrescriptions}</p>
          <p className="text-theme-sm text-gray-500">{t.profile.addPrescriptionDesc}</p>
        </div>
      ) : (
        <>
          <PrescriptionFileRow
            prescription={latest}
            lang={lang}
            isLatest
            onEdit={() => onEdit(latest.id)}
            onDelete={() => onDelete(latest.id)}
          />

          {hasHistory && (
            <>
              <div
                className={cn(
                  historyExpanded &&
                    "max-h-64 divide-y divide-gray-100 overflow-y-auto overscroll-contain",
                )}
              >
                {historyExpanded &&
                  history.map((prescription) => (
                    <PrescriptionFileRow
                      key={prescription.id}
                      prescription={prescription}
                      lang={lang}
                      onEdit={() => onEdit(prescription.id)}
                      onDelete={() => onDelete(prescription.id)}
                    />
                  ))}
              </div>

              <ProfileExpandToggle
                expanded={historyExpanded}
                onToggle={toggleHistory}
                expandLabel={t.profile.showPrescriptionHistory.replace(
                  "{n}",
                  String(history.length),
                )}
              />
            </>
          )}
        </>
      )}
    </section>
  )
}
