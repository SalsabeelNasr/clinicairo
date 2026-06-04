"use client"

import { RiRestaurantLine } from "@remixicon/react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import type { PatientPageData } from "../usePatientPageData"
import { ProfileSectionCard } from "../components/ProfileSectionCard"
import { DietTab } from "../tabs/DietTab"

interface DietSectionCardProps {
  data: PatientPageData
  defaultExpanded?: boolean
}

export function DietSectionCard({ data, defaultExpanded }: DietSectionCardProps) {
  const t = useAppTranslations()
  const tabs = t.profile.tabs
  const activeDiet = data.patientDiets[0]
  const isEmpty = !activeDiet

  return (
    <ProfileSectionCard
      title={tabs.diet}
      icon={RiRestaurantLine}
      summary={isEmpty ? t.profile.emptyDiet : activeDiet.file_name}
      defaultExpanded={defaultExpanded}
    >
      <DietTab data={data} />
    </ProfileSectionCard>
  )
}
