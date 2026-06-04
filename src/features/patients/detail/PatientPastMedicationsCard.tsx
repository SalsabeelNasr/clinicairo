"use client"

import { RiCapsuleLine, RiSurgicalMaskLine } from "@remixicon/react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import { cn } from "@/lib/utils"
import { ProfileCardActionsMenu } from "./components/ProfileCardActionsMenu"
import { ProfileCollapsibleList } from "./components/ProfileExpandable"
import { ProfileRowActions } from "./components/ProfileRowActions"
import type { PastHistoryItem } from "./past-history.types"
import { formatProfileDate } from "./patient-profile.utils"

interface PatientPastMedicationsCardProps {
  items: PastHistoryItem[]
  onAddMedication: () => void
  onAddProcedure: () => void
  onEdit: (item: PastHistoryItem) => void
  onDelete: (item: PastHistoryItem) => void
}

export function PatientPastMedicationsCard({
  items,
  onAddMedication,
  onAddProcedure,
  onEdit,
  onDelete,
}: PatientPastMedicationsCardProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const title = t.profile.section.pastMedications

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiCapsuleLine className="size-4 shrink-0 text-primary-600" aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={title}
            addActions={[
              { label: t.profile.logNewPastMedication, onClick: onAddMedication },
              { label: t.profile.logNewPastProcedure, onClick: onAddProcedure },
            ]}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <p className="p-3 text-theme-sm text-gray-500">—</p>
      ) : (
        <ProfileCollapsibleList
          items={items}
          getKey={(item) => `${item.kind}-${item.data.id}`}
          renderItem={(item) => (
            <div className="flex items-start gap-2 px-3 py-2.5 rtl:flex-row-reverse">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "app-pill text-[10px]",
                      item.kind === "medication"
                        ? "app-pill--muted"
                        : "app-pill--primary",
                    )}
                  >
                    {item.kind === "medication" ? (
                      <span className="inline-flex items-center gap-1">
                        <RiCapsuleLine className="size-3" aria-hidden />
                        {t.profile.pastHistoryMedication}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <RiSurgicalMaskLine className="size-3" aria-hidden />
                        {t.profile.pastHistoryProcedure}
                      </span>
                    )}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-800">{item.data.name}</p>
                <p className="mt-0.5 text-theme-xs text-gray-500">
                  {item.kind === "medication"
                    ? item.data.duration
                    : formatProfileDate(item.data.procedureDate, lang)}
                </p>
                {item.data.notes && (
                  <p className="mt-0.5 text-theme-xs text-gray-600">{item.data.notes}</p>
                )}
              </div>
              <ProfileRowActions
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
                deleteLabel={
                  item.kind === "medication"
                    ? t.profile.deletePastMedication
                    : t.profile.deletePastProcedure
                }
              />
            </div>
          )}
        />
      )}
    </section>
  )
}
