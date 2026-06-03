"use client"

import { SearchInput } from "@/components/SearchInput"
import { useAppTranslations } from "@/lib/useAppTranslations"

interface PatientsToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalPatients: number
  filteredCount?: number
  onAddPatient?: () => void
}

export function PatientsToolbar({
  searchQuery,
  onSearchChange,
  totalPatients,
  filteredCount,
}: PatientsToolbarProps) {
  const t = useAppTranslations()

  return (
    <div className="app-toolbar">
      <SearchInput
        placeholder={t.patients.searchPlaceholder}
        value={searchQuery}
        onSearchChange={onSearchChange}
      />

      {searchQuery && (
        <p className="app-toolbar__hint">
          {filteredCount !== undefined
            ? (filteredCount !== 1
                ? t.patients.patientsFoundPlural
                : t.patients.patientsFound
              ).replace("{count}", String(filteredCount))
            : (totalPatients !== 1
                ? t.patients.totalPatients
                : t.patients.totalPatientsSingular
              ).replace("{count}", String(totalPatients))}
        </p>
      )}
    </div>
  )
}
