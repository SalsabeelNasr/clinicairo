"use client"

import { SearchInput } from "@/components/SearchInput"
import { LEAD_STAGES, type LeadStatus } from "./leads.types"
import { LEAD_STATUS_LABELS } from "./leads.utils"
import { cn } from "@/lib/utils"

interface LeadsFilterBarProps {
  lang: "ar" | "en"
  query: string
  onQueryChange: (query: string) => void
  filter: LeadStatus | "all" | "cold"
  onFilterChange: (filter: LeadStatus | "all" | "cold") => void
  coldCount: number
  labels: {
    searchPlaceholder: string
    all: string
    cold: string
  }
}

export function LeadsFilterBar({
  lang,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  coldCount,
  labels,
}: LeadsFilterBarProps) {
  const chips: Array<{ key: LeadStatus | "all" | "cold"; label: string }> = [
    { key: "all", label: labels.all },
    { key: "cold", label: `${labels.cold} (${coldCount})` },
    ...LEAD_STAGES.map((status) => ({
      key: status,
      label: LEAD_STATUS_LABELS[status][lang],
    })),
  ]

  return (
    <div className="space-y-4">
      <nav className="app-tabs overflow-x-auto" aria-label="Lead filters">
        <div className="flex min-w-max items-center">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onFilterChange(chip.key)}
              className={cn(
                "app-tabs__btn",
                filter === chip.key && "app-tabs__btn--active",
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="app-toolbar">
        <SearchInput
          placeholder={labels.searchPlaceholder}
          value={query}
          onSearchChange={onQueryChange}
          className="max-w-md"
        />
      </div>
    </div>
  )
}
