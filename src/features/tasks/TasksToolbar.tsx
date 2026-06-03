"use client"

import { useAppTranslations } from "@/lib/useAppTranslations"
import { SearchInput } from "@/components/SearchInput"

interface TasksToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onNewTask: () => void
}

export function TasksToolbar({
  searchQuery,
  onSearchChange,
}: TasksToolbarProps) {
  const t = useAppTranslations()
  return (
    <div className="app-toolbar">
      <SearchInput
        placeholder={t.tasks.searchPlaceholder}
        value={searchQuery}
        onSearchChange={onSearchChange}
      />
    </div>
  )
}
