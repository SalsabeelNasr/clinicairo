"use client"

import { RiRunLine } from "@remixicon/react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import type { PatientPageData } from "../usePatientPageData"
import { ProfileSectionCard } from "../components/ProfileSectionCard"
import { FitnessTab } from "../tabs/FitnessTab"

interface FitnessSectionCardProps {
  data: PatientPageData
  defaultExpanded?: boolean
}

export function FitnessSectionCard({ data, defaultExpanded }: FitnessSectionCardProps) {
  const t = useAppTranslations()
  const tabs = t.profile.tabs
  const activePlan = data.patientTrainingPlans[0] ?? null

  const summary = activePlan
    ? activePlan.file_name
    : t.profile.emptyFitness

  return (
    <ProfileSectionCard
      title={tabs.fitness}
      icon={RiRunLine}
      summary={summary}
      defaultExpanded={defaultExpanded}
    >
      <FitnessTab data={data} />
    </ProfileSectionCard>
  )
}
