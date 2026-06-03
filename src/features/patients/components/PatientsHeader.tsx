"use client"

import { useAppTranslations } from "@/lib/useAppTranslations"
import { cn } from "@/lib/utils"

interface PatientsHeaderProps {
  activeTab: "active" | "inactive"
  onTabChange: (tab: "active" | "inactive") => void
}

export function PatientsHeader({
  activeTab,
  onTabChange,
}: PatientsHeaderProps) {
  const t = useAppTranslations()

  return (
    <nav className="app-tabs" aria-label="Patients tabs">
      <button
        type="button"
        onClick={() => onTabChange("active")}
        className={cn(
          "app-tabs__btn",
          activeTab === "active" && "app-tabs__btn--active",
        )}
      >
        {t.patients.activePatients}
      </button>
      <button
        type="button"
        onClick={() => onTabChange("inactive")}
        className={cn(
          "app-tabs__btn",
          activeTab === "inactive" && "app-tabs__btn--active",
        )}
      >
        {t.patients.inactivePatients}
      </button>
    </nav>
  )
}
