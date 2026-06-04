"use client"

import { RiDownloadLine, RiExternalLinkLine, RiRestaurantLine } from "@remixicon/react"
import { Button } from "@/components/Button"
import { ProfileCardActionsMenu } from "./components/ProfileCardActionsMenu"
import { ProfileExpandToggle, useProfileExpanded } from "./components/ProfileExpandable"
import { ProfileRowActions } from "./components/ProfileRowActions"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import { cn } from "@/lib/utils"
import type { PatientDiet } from "./patient-diet.types"
import { downloadDietFile, formatDietFileSize, viewDietFile } from "./diet-file.utils"
import { formatProfileDate } from "./patient-profile.utils"

function DietFileRow({
  diet,
  lang,
  isLatest,
  onEdit,
  onDelete,
}: {
  diet: PatientDiet
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
            {t.profile.currentDiet}
          </span>
        )}
        <p className="text-sm font-medium text-gray-800">{diet.file_name}</p>
        <p className="mt-0.5 text-theme-xs text-gray-500">
          {t.profile.dietVersion.replace("{n}", String(diet.version))}
          {" · "}
          {formatProfileDate(diet.updated_at, lang)}
          {diet.file_size != null && (
            <>
              {" · "}
              <span dir="ltr">{formatDietFileSize(diet.file_size)}</span>
            </>
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
            onClick={() => viewDietFile(diet)}
          >
            <RiExternalLinkLine className="size-3.5" aria-hidden />
            {t.profile.viewDietPdf}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
            onClick={() => downloadDietFile(diet)}
          >
            <RiDownloadLine className="size-3.5" aria-hidden />
            {t.profile.downloadDietPdf}
          </Button>
        </div>
      </div>
      <ProfileRowActions
        onEdit={onEdit}
        onDelete={onDelete}
        deleteLabel={t.profile.deleteDiet}
      />
    </div>
  )
}

interface PatientDietCardProps {
  diets: PatientDiet[]
  onAdd: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function PatientDietCard({ diets, onAdd, onEdit, onDelete }: PatientDietCardProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const title = t.profile.tabs.diet
  const { expanded: historyExpanded, toggle: toggleHistory } = useProfileExpanded()

  const latest = diets[0] ?? null
  const history = diets.slice(1)
  const hasHistory = history.length > 0

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiRestaurantLine className="size-4 shrink-0 text-primary-600" aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={title}
            onAdd={onAdd}
            addLabel={t.profile.logNewDiet}
          />
        </div>
      </div>

      {!latest ? (
        <div className="space-y-1 p-4">
          <p className="text-theme-sm font-medium text-gray-700">{t.profile.emptyDiet}</p>
          <p className="text-theme-sm text-gray-500">{t.profile.addDietDesc}</p>
        </div>
      ) : (
        <>
          <DietFileRow
            diet={latest}
            lang={lang}
            isLatest
            onEdit={() => onEdit(latest.id)}
            onDelete={() => onDelete(latest.id)}
          />

          {hasHistory && (
            <>
              <div
                className={cn(
                  historyExpanded && "max-h-64 divide-y divide-gray-100 overflow-y-auto overscroll-contain",
                )}
              >
                {historyExpanded &&
                  history.map((diet) => (
                    <DietFileRow
                      key={diet.id}
                      diet={diet}
                      lang={lang}
                      onEdit={() => onEdit(diet.id)}
                      onDelete={() => onDelete(diet.id)}
                    />
                  ))}
              </div>

              <ProfileExpandToggle
                expanded={historyExpanded}
                onToggle={toggleHistory}
                expandLabel={t.profile.showDietHistory.replace("{n}", String(history.length))}
              />
            </>
          )}
        </>
      )}
    </section>
  )
}
