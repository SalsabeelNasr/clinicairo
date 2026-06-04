"use client"

import { RiDownloadLine, RiExternalLinkLine } from "@remixicon/react"
import { Button } from "@/components/Button"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { downloadDietFile, formatDietFileSize, viewDietFile } from "../diet-file.utils"
import type { PatientPageData } from "../usePatientPageData"

interface DietTabProps {
  data: PatientPageData
}

export function DietTab({ data }: DietTabProps) {
  const t = useAppTranslations()
  const activeDiet = data.patientDiets[0]

  if (!activeDiet) {
    return <p className="text-theme-sm text-gray-500">{t.profile.emptyDiet}</p>
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{activeDiet.file_name}</p>
        {activeDiet.file_size != null && (
          <p className="mt-0.5 text-theme-xs text-gray-500" dir="ltr">
            {formatDietFileSize(activeDiet.file_size)}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
            onClick={() => viewDietFile(activeDiet)}
          >
            <RiExternalLinkLine className="size-3.5" aria-hidden />
            {t.profile.viewDietPdf}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-theme-xs font-semibold text-primary-600"
            onClick={() => downloadDietFile(activeDiet)}
          >
            <RiDownloadLine className="size-3.5" aria-hidden />
            {t.profile.downloadDietPdf}
          </Button>
        </div>
      </div>
    </div>
  )
}
