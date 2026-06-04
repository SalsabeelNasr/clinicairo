"use client"

import { useMemo, type ReactNode } from "react"
import { RiDownloadLine, RiExternalLinkLine, RiFlaskLine } from "@remixicon/react"
import { Button } from "@/components/Button"
import { ProfileCardActionsMenu } from "./components/ProfileCardActionsMenu"
import { ProfileCollapsibleList } from "./components/ProfileExpandable"
import { ProfileRowActions } from "./components/ProfileRowActions"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { PatientPageData } from "./usePatientPageData"
import type { PatientLabResult } from "./lab-result.types"
import {
  downloadLabFile,
  formatLabFileSize,
  getLabFileName,
  isLabFileEntry,
  viewLabFile,
} from "./lab-file.utils"
import { formatProfileDate } from "./patient-profile.utils"
import { labStatusClass, labStatusLabel, sortLabResults } from "./lab-result.utils"

function LabFieldRow({
  label,
  children,
  dir,
}: {
  label: string
  children: ReactNode
  dir?: "ltr" | "rtl" | "auto"
}) {
  return (
    <div className="flex gap-2 text-theme-xs rtl:flex-row-reverse">
      <span className="w-24 shrink-0 text-gray-500">{label}</span>
      <span className="min-w-0 flex-1 text-gray-800" dir={dir}>
        {children}
      </span>
    </div>
  )
}

function LabResultRow({
  lab,
  lang,
  onEdit,
  onDelete,
}: {
  lab: PatientLabResult
  lang: "ar" | "en"
  onEdit: () => void
  onDelete: () => void
}) {
  const t = useAppTranslations()
  const tbl = t.table
  const isFile = isLabFileEntry(lab)

  return (
    <div className="flex items-start gap-2 px-3 py-2.5 rtl:flex-row-reverse">
      <div className="min-w-0 flex-1 space-y-1.5">
        <span className="app-pill app-pill--muted text-[10px]">
          {isFile ? t.profile.labModeFile : t.profile.labModeMetric}
        </span>

        {isFile ? (
          <div className="space-y-1">
            <LabFieldRow label={t.profile.labFileUploadLabel} dir="ltr">
              {getLabFileName(lab)}
            </LabFieldRow>
            <LabFieldRow label={tbl.date}>{formatProfileDate(lab.test_date, lang)}</LabFieldRow>
            {lab.file_size != null && lab.file_size > 0 && (
              <LabFieldRow label={t.profile.labFileSize} dir="ltr">
                {formatLabFileSize(lab.file_size)}
              </LabFieldRow>
            )}
            {lab.notes && (
              <LabFieldRow label={tbl.notes}>{lab.notes}</LabFieldRow>
            )}
            <div className="flex flex-wrap gap-1 pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
                onClick={() => viewLabFile(lab)}
              >
                <RiExternalLinkLine className="size-3.5" aria-hidden />
                {t.profile.viewLabFile}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
                onClick={() => downloadLabFile(lab)}
              >
                <RiDownloadLine className="size-3.5" aria-hidden />
                {t.profile.downloadLabFile}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <LabFieldRow label={tbl.testName}>{lab.test_name}</LabFieldRow>
            <LabFieldRow label={tbl.value} dir="ltr">
              {lab.unit ? `${lab.value} ${lab.unit}` : lab.value}
            </LabFieldRow>
            {lab.normal_range.trim() && (
              <LabFieldRow label={tbl.normalRange} dir="ltr">
                {lab.normal_range}
              </LabFieldRow>
            )}
            <LabFieldRow label={tbl.status}>
              <span className={labStatusClass(lab.status)}>
                {labStatusLabel(lab.status, t)}
              </span>
            </LabFieldRow>
            <LabFieldRow label={tbl.date}>{formatProfileDate(lab.test_date, lang)}</LabFieldRow>
            {lab.notes && (
              <LabFieldRow label={tbl.notes}>{lab.notes}</LabFieldRow>
            )}
          </div>
        )}
      </div>
      <ProfileRowActions
        onEdit={onEdit}
        onDelete={onDelete}
        deleteLabel={t.profile.deleteLab}
      />
    </div>
  )
}

interface PatientLabResultsCardProps {
  labResults: PatientPageData["labResults"]
  onAdd: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function PatientLabResultsCard({
  labResults,
  onAdd,
  onEdit,
  onDelete,
}: PatientLabResultsCardProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const title = t.profile.section.labs
  const sorted = useMemo(() => sortLabResults(labResults), [labResults])

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiFlaskLine className="size-4 shrink-0 text-primary-600" aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={title}
            onAdd={onAdd}
            addLabel={t.profile.addLabBtn}
          />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="space-y-1 p-4">
          <p className="text-theme-sm font-medium text-gray-700">{t.profile.emptyLabs}</p>
          <p className="text-theme-sm text-gray-500">{t.profile.addLabDesc}</p>
        </div>
      ) : (
        <ProfileCollapsibleList
          items={sorted}
          getKey={(lab) => lab.id}
          renderItem={(lab) => (
            <LabResultRow
              lab={lab}
              lang={lang}
              onEdit={() => onEdit(lab.id)}
              onDelete={() => onDelete(lab.id)}
            />
          )}
        />
      )}
    </section>
  )
}
