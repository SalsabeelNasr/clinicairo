"use client"

import { RiPulseLine } from "@remixicon/react"
import { ProfileCardActionsMenu } from "./components/ProfileCardActionsMenu"
import { ProfileExpandToggle, useProfileExpanded } from "./components/ProfileExpandable"
import { ProfileRowActions } from "./components/ProfileRowActions"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { Patient } from "@/features/patients/patients.types"
import type { PatientPageData } from "./usePatientPageData"
import { computeBmi, formatProfileDate } from "./patient-profile.utils"
import { WeightSparkline } from "./components/WeightSparkline"
import { cn } from "@/lib/utils"

type WeightEntry = PatientPageData["weights"][number]

function WeightLogRow({
  entry,
  lang,
  isLatest,
  onEdit,
  onDelete,
  deleteLabel,
}: {
  entry: WeightEntry
  lang: "ar" | "en"
  isLatest?: boolean
  onEdit: () => void
  onDelete: () => void
  deleteLabel: string
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 px-3 py-2.5 rtl:flex-row-reverse",
        isLatest && "border-t border-gray-100",
      )}
    >
      <div className="min-w-0 flex-1 text-theme-sm">
        <span className="font-medium text-gray-800" dir="ltr">
          {entry.weight} kg
        </span>
        <span className="text-theme-xs text-gray-500">
          {" "}
          · {formatProfileDate(entry.recorded_date, lang)}
        </span>
        {entry.notes && (
          <p className="mt-0.5 text-theme-xs text-gray-600">{entry.notes}</p>
        )}
      </div>
      <ProfileRowActions onEdit={onEdit} onDelete={onDelete} deleteLabel={deleteLabel} />
    </div>
  )
}

interface PatientVitalsCardProps {
  patient: Patient
  latestWeight: PatientPageData["latestWeight"]
  weightTrend: PatientPageData["weightTrend"]
  weights: PatientPageData["weights"]
  onAddWeight: () => void
  onEditWeightEntry: (id: string) => void
  onDeleteWeightEntry: (id: string) => void
}

export function PatientVitalsCard({
  patient,
  latestWeight,
  weightTrend,
  weights,
  onAddWeight,
  onEditWeightEntry,
  onDeleteWeightEntry,
}: PatientVitalsCardProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const ts = t.profile.teleStrip
  const { expanded: historyExpanded, toggle: toggleHistory } = useProfileExpanded()

  const weightPoints = weights.map((w) => w.weight)
  const heightCm = patient.height ?? null
  const bmi =
    latestWeight && heightCm ? computeBmi(latestWeight.weight, heightCm) : null
  const entriesNewestFirst = [...weights].reverse()
  const latestEntry = entriesNewestFirst[0] ?? null
  const historyEntries = entriesNewestFirst.slice(1)
  const hasHistory = historyEntries.length > 0

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <RiPulseLine className="size-4 shrink-0 text-primary-600" aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {t.profile.vitalsCard}
            </h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={t.profile.vitalsCard}
            onAdd={onAddWeight}
            addLabel={t.profile.logNewWeight}
          />
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 divide-x divide-gray-100 rtl:divide-x-reverse">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="text-theme-xs text-gray-500">{ts.weight}</p>
            <p className="mt-1 text-sm font-semibold text-gray-800" dir="ltr">
              {latestWeight ? `${latestWeight.weight} kg` : "—"}
            </p>
          </div>
          <div>
            <p className="text-theme-xs text-gray-500">{t.profile.height}</p>
            <p className="mt-1 text-sm font-semibold text-gray-800" dir="ltr">
              {heightCm != null ? `${heightCm} cm` : "—"}
            </p>
          </div>
          <div>
            <p className="text-theme-xs text-gray-500">{t.profile.bmi}</p>
            <p className="mt-1 text-sm font-semibold text-gray-800" dir="ltr">
              {bmi != null ? bmi.toLocaleString("en-US") : "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 p-4">
          <div>
            <p className="text-theme-xs text-gray-500">{ts.weightTrend}</p>
            <p className="mt-1 text-sm font-semibold text-gray-800" dir="ltr">
              {weightTrend !== null ? (
                <>
                  {weightTrend > 0 ? "+" : ""}
                  {weightTrend} kg
                </>
              ) : (
                "—"
              )}
            </p>
          </div>
          {weightPoints.length >= 2 && (
            <WeightSparkline points={weightPoints} className="w-full max-w-[8rem]" />
          )}
        </div>
      </div>

      {latestEntry && (
        <>
          <WeightLogRow
            entry={latestEntry}
            lang={lang}
            isLatest
            onEdit={() => onEditWeightEntry(latestEntry.id)}
            onDelete={() => onDeleteWeightEntry(latestEntry.id)}
            deleteLabel={t.profile.deleteWeight}
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
                  historyEntries.map((entry) => (
                    <WeightLogRow
                      key={entry.id}
                      entry={entry}
                      lang={lang}
                      onEdit={() => onEditWeightEntry(entry.id)}
                      onDelete={() => onDeleteWeightEntry(entry.id)}
                      deleteLabel={t.profile.deleteWeight}
                    />
                  ))}
              </div>

              <ProfileExpandToggle
                expanded={historyExpanded}
                onToggle={toggleHistory}
                expandLabel={t.profile.showWeightHistory.replace(
                  "{n}",
                  String(historyEntries.length),
                )}
              />
            </>
          )}
        </>
      )}
    </section>
  )
}
