"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ProfileExpandToggle, useProfileExpanded } from "./ProfileExpandable"

interface ProfileSectionCardProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  summary: ReactNode
  defaultExpanded?: boolean
  headerAction?: ReactNode
  children: ReactNode
}

export function ProfileSectionCard({
  title,
  icon: Icon,
  summary,
  defaultExpanded = false,
  headerAction,
  children,
}: ProfileSectionCardProps) {
  const { expanded, toggle } = useProfileExpanded(defaultExpanded)

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            <Icon className="size-4 shrink-0 text-primary-600" aria-hidden />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
          </div>
          {headerAction}
        </div>
      </div>

      <div className="px-4 py-3">
        <div className={cn(!expanded && "line-clamp-2 text-theme-sm text-gray-600")}>{summary}</div>
      </div>

      {expanded && (
        <div className="max-h-96 overflow-y-auto overscroll-contain border-t border-gray-100 px-4 py-3">
          {children}
        </div>
      )}

      <ProfileExpandToggle expanded={expanded} onToggle={toggle} />
    </section>
  )
}
