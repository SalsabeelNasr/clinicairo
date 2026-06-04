"use client"

import { RiDownloadLine, RiExternalLinkLine } from "@remixicon/react"
import { Button } from "@/components/Button"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import type { PatientPageData } from "../usePatientPageData"
import {
  downloadTrainingPlanFile,
  formatTrainingPlanFileSize,
  viewTrainingPlanFile,
} from "../training-plan-file.utils"
import { formatProfileDate } from "../patient-profile.utils"

interface FitnessTabProps {
  data: PatientPageData
}

export function FitnessTab({ data }: FitnessTabProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()
  const activePlan = data.patientTrainingPlans[0] ?? null

  if (!activePlan) {
    return <p className="text-theme-sm text-gray-500">{t.profile.emptyFitness}</p>
  }

  return (
    <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{activePlan.file_name}</p>
        <p className="mt-0.5 text-theme-xs text-gray-500">
          {t.profile.trainingVersion.replace("{n}", String(activePlan.version))}
          {" · "}
          {formatProfileDate(activePlan.updated_at, lang)}
          {activePlan.file_size != null && (
            <>
              {" · "}
              <span dir="ltr">{formatTrainingPlanFileSize(activePlan.file_size)}</span>
            </>
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
            onClick={() => viewTrainingPlanFile(activePlan)}
          >
            <RiExternalLinkLine className="size-3.5" aria-hidden />
            {t.profile.viewTrainingPdf}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
            onClick={() => downloadTrainingPlanFile(activePlan)}
          >
            <RiDownloadLine className="size-3.5" aria-hidden />
            {t.profile.downloadTrainingPdf}
          </Button>
        </div>
      </div>
    </div>
  )
}
