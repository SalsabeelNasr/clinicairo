"use client"

import { RiSyringeLine } from "@remixicon/react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import { ProfileCardActionsMenu } from "./components/ProfileCardActionsMenu"
import { ProfileCollapsibleList } from "./components/ProfileExpandable"
import { ProfileRowActions } from "./components/ProfileRowActions"
import type { PatientPageData } from "./usePatientPageData"
import { formatProfileDate } from "./patient-profile.utils"

interface PatientInjectionsCardProps {
  injections: PatientPageData["injections"]
  onAdd: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function PatientInjectionsCard({
  injections,
  onAdd,
  onEdit,
  onDelete,
}: PatientInjectionsCardProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const title = t.profile.section.injections

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiSyringeLine className="size-4 shrink-0 text-primary-600" aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={title}
            onAdd={onAdd}
            addLabel={t.profile.logNewDose}
          />
        </div>
      </div>

      {injections.length === 0 ? (
        <p className="p-3 text-theme-sm text-gray-500">—</p>
      ) : (
        <ProfileCollapsibleList
          items={injections}
          getKey={(item) => item.id}
          renderItem={(item) => (
            <div className="flex items-start gap-2 px-3 py-2.5 rtl:flex-row-reverse">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {item.medication_name} · <span dir="ltr">{item.dose}</span>
                </p>
                <p className="mt-0.5 text-theme-xs text-gray-500">
                  {formatProfileDate(item.injection_date, lang)}
                </p>
                {item.notes && (
                  <p className="mt-1 text-theme-xs text-gray-600">{item.notes}</p>
                )}
              </div>
              <ProfileRowActions
                onEdit={() => onEdit(item.id)}
                onDelete={() => onDelete(item.id)}
                deleteLabel={t.profile.deleteDose}
              />
            </div>
          )}
        />
      )}
    </section>
  )
}
