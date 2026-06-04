"use client"

import { RiSyringeLine } from "@remixicon/react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import { ProfileCardActionsMenu } from "./components/ProfileCardActionsMenu"
import { ProfileExpandToggle, useProfileExpanded } from "./components/ProfileExpandable"
import { ProfileRowActions } from "./components/ProfileRowActions"
import type { PatientPageData } from "./usePatientPageData"
import { formatProfileDate } from "./patient-profile.utils"
import { cn } from "@/lib/utils"

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
  const { expanded, toggle } = useProfileExpanded()
  const visibleInjections = expanded ? injections : injections.slice(0, 2)
  const hasMore = injections.length > 2

  return (
    <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs">
      <div className="mb-6 shrink-0">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiSyringeLine className="size-4 shrink-0 text-primary-600" aria-hidden />
            <h2 className="text-sm font-bold text-gray-800">{title}</h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={title}
            onAdd={onAdd}
            addLabel={t.profile.logNewDose}
          />
        </div>
      </div>

      {injections.length === 0 ? (
        <div className="space-y-3">
          <p className="text-theme-sm text-gray-500">—</p>
          <button
            type="button"
            onClick={onAdd}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            {t.profile.logNewDose}
          </button>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "space-y-4",
              expanded && "max-h-72 overflow-y-auto overscroll-contain pe-1",
            )}
          >
            {visibleInjections.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 rtl:flex-row-reverse"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-800">
                    <span dir="ltr">{item.dose}</span> · {item.medication_name}
                  </p>
                  {item.notes && (
                    <p className="mt-1 text-theme-xs text-gray-500">{item.notes}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-start gap-2 rtl:flex-row-reverse">
                  <p className="text-end text-theme-xs text-gray-400">
                    {formatProfileDate(item.injection_date, lang)}
                  </p>
                  <ProfileRowActions
                    onEdit={() => onEdit(item.id)}
                    onDelete={() => onDelete(item.id)}
                    deleteLabel={t.profile.deleteDose}
                  />
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <ProfileExpandToggle
              expanded={expanded}
              onToggle={toggle}
              className="mt-4 border-t-0 p-0"
              expandLabel={t.profile.showDoseHistory.replace(
                "{n}",
                String(injections.length - 2),
              )}
            />
          )}
        </>
      )}
    </section>
  )
}
