"use client"

import type { ComponentType, ReactNode } from "react"
import { ProfileCardActionsMenu } from "./ProfileCardActionsMenu"

interface ProfileFlatSectionProps {
  title: string
  icon?: ComponentType<{ className?: string }>
  children: ReactNode
  menuAriaLabel: string
  onAdd?: () => void
  onEdit?: () => void
  canEdit?: boolean
  addLabel?: string
  editLabel?: string
}

export function ProfileFlatSection({
  title,
  icon: Icon,
  children,
  menuAriaLabel,
  onAdd,
  onEdit,
  canEdit,
  addLabel,
  editLabel,
}: ProfileFlatSectionProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs">
      <div className="shrink-0 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <div className="flex items-center justify-between gap-2 rtl:flex-row-reverse">
          <div className="flex min-w-0 items-center gap-2 rtl:flex-row-reverse">
            {Icon && (
              <Icon className="size-4 shrink-0 text-primary-600" aria-hidden />
            )}
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
          </div>
          <ProfileCardActionsMenu
            ariaLabel={menuAriaLabel}
            onAdd={onAdd}
            onEdit={onEdit}
            canEdit={canEdit}
            addLabel={addLabel}
            editLabel={editLabel}
          />
        </div>
      </div>
      <div className="px-4 py-4">{children}</div>
    </section>
  )
}
