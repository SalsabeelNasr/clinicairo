"use client"

import { useState, type ReactNode } from "react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { cn } from "@/lib/utils"

export interface ProfileExpandToggleProps {
  expanded: boolean
  onToggle: () => void
  expandLabel?: string
  collapseLabel?: string
  className?: string
}

export function ProfileExpandToggle({
  expanded,
  onToggle,
  expandLabel,
  collapseLabel,
  className,
}: ProfileExpandToggleProps) {
  const t = useAppTranslations()

  return (
    <div className={cn("shrink-0 border-t border-gray-100 p-2", className)}>
      <button
        type="button"
        onClick={onToggle}
        className="h-8 w-full rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500 transition-colors hover:bg-primary-50/50 hover:text-primary-600"
      >
        {expanded
          ? (collapseLabel ?? t.profile.showLess)
          : (expandLabel ?? t.profile.showMoreConditions)}
      </button>
    </div>
  )
}

export function useProfileExpanded(defaultExpanded = false) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  return {
    expanded,
    toggle: () => setExpanded((v) => !v),
    setExpanded,
  }
}

interface ProfileCollapsibleListProps<T> {
  items: T[]
  collapsedCount?: number
  renderItem: (item: T) => ReactNode
  getKey: (item: T) => string
  expandLabel?: string
  listClassName?: string
  expandedMaxHeightClass?: string
}

export function ProfileCollapsibleList<T>({
  items,
  collapsedCount = 3,
  renderItem,
  getKey,
  expandLabel,
  listClassName,
  expandedMaxHeightClass = "max-h-64",
}: ProfileCollapsibleListProps<T>) {
  const { expanded, toggle } = useProfileExpanded()
  const hasMore = items.length > collapsedCount
  const visibleItems = expanded ? items : items.slice(0, collapsedCount)

  return (
    <>
      <div
        className={cn(
          "divide-y divide-gray-100",
          expanded && hasMore && `${expandedMaxHeightClass} overflow-y-auto overscroll-contain`,
          listClassName,
        )}
      >
        {visibleItems.map((item) => (
          <div key={getKey(item)}>{renderItem(item)}</div>
        ))}
      </div>
      {hasMore && (
        <ProfileExpandToggle expanded={expanded} onToggle={toggle} expandLabel={expandLabel} />
      )}
    </>
  )
}

interface ProfileExpandablePanelProps {
  expandLabel: string
  collapseLabel?: string
  panelHeader?: ReactNode
  children: ReactNode
  defaultExpanded?: boolean
  alwaysShowToggle?: boolean
}

export function ProfileExpandablePanel({
  expandLabel,
  collapseLabel,
  panelHeader,
  children,
  defaultExpanded = false,
  alwaysShowToggle = true,
}: ProfileExpandablePanelProps) {
  const { expanded, toggle } = useProfileExpanded(defaultExpanded)

  return (
    <>
      {expanded && (
        <div className="border-t border-gray-100">
          {panelHeader}
          {children}
        </div>
      )}
      {alwaysShowToggle && (
        <ProfileExpandToggle
          expanded={expanded}
          onToggle={toggle}
          expandLabel={expandLabel}
          collapseLabel={collapseLabel}
        />
      )}
    </>
  )
}

interface ProfileCollapsibleSliceProps {
  collapsedCount: number
  totalCount: number
  expandLabel?: string
  children: (expanded: boolean) => ReactNode
}

/** For custom content (e.g. contraindication toggles) that slices outside a simple list. */
export function ProfileCollapsibleSlice({
  collapsedCount,
  totalCount,
  expandLabel,
  children,
}: ProfileCollapsibleSliceProps) {
  const { expanded, toggle } = useProfileExpanded()
  const hasMore = totalCount > collapsedCount

  return (
    <>
      {children(expanded)}
      {hasMore && (
        <ProfileExpandToggle expanded={expanded} onToggle={toggle} expandLabel={expandLabel} />
      )}
    </>
  )
}
