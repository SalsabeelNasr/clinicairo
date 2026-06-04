"use client"

import { useAppTranslations } from "@/lib/useAppTranslations"
import { cn } from "@/lib/utils"
import type { ProfileMainTab } from "./patient-profile.types"

const MAIN_TABS: ProfileMainTab[] = ["profile", "treatment", "dietFitness", "bookings"]

interface PatientProfileMainNavProps {
  activeTab: ProfileMainTab
  onTabChange: (tab: ProfileMainTab) => void
}

export function PatientProfileMainNav({ activeTab, onTabChange }: PatientProfileMainNavProps) {
  const t = useAppTranslations()
  const labels = t.profile.mainTabs

  return (
    <nav
      className="-mx-1 flex gap-2 overflow-x-auto border-b border-gray-200 px-1 pb-3 overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label={labels.profile}
    >
      {MAIN_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={cn(
            "app-pill shrink-0 text-sm",
            activeTab === tab ? "app-pill--primary" : "app-pill--muted",
          )}
        >
          {labels[tab]}
        </button>
      ))}
    </nav>
  )
}
