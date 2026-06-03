"use client"

import { Button } from "@/components/Button"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { RiUserAddLine } from "@remixicon/react"

interface EmptyPatientsStateProps {
  hasSearchQuery: boolean
  onAddPatient: () => void
}

export function EmptyPatientsState({
  hasSearchQuery,
  onAddPatient,
}: EmptyPatientsStateProps) {
  const t = useAppTranslations()
  return (
    <div className="app-empty-state">
      <p className="app-empty-state__text">
        {hasSearchQuery ? t.patients.noPatientsMatch : t.patients.noPatientsYet}
      </p>
      {!hasSearchQuery && (
        <Button
          variant="primary"
          onClick={onAddPatient}
          className="app-empty-state__action"
        >
          <RiUserAddLine className="app-empty-state__icon" />
          {t.patients.addFirstPatient}
        </Button>
      )}
    </div>
  )
}
