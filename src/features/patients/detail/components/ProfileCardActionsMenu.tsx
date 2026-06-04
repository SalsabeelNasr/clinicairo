"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import { Button } from "@/components/Button"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { RiMore2Fill } from "@remixicon/react"

export interface ProfileCardAddAction {
  label: string
  onClick: () => void
}

interface ProfileCardActionsMenuProps {
  ariaLabel: string
  onAdd?: () => void
  addActions?: ProfileCardAddAction[]
  onEdit?: () => void
  canEdit?: boolean
  addLabel?: string
  editLabel?: string
}

export function ProfileCardActionsMenu({
  ariaLabel,
  onAdd,
  addActions,
  onEdit,
  canEdit = false,
  addLabel,
  editLabel,
}: ProfileCardActionsMenuProps) {
  const t = useAppTranslations()

  const hasAdd = Boolean(onAdd || (addActions && addActions.length > 0))
  if (!hasAdd && !onEdit) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 shrink-0 p-0"
          aria-label={ariaLabel}
        >
          <RiMore2Fill className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-xl">
        {addActions?.map((action) => (
          <DropdownMenuItem key={action.label} onClick={action.onClick}>
            {action.label}
          </DropdownMenuItem>
        ))}
        {!addActions?.length && onAdd && (
          <DropdownMenuItem onClick={onAdd}>
            {addLabel ?? t.profile.cardMenuAdd}
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} disabled={!canEdit}>
            {editLabel ?? t.profile.cardMenuEdit}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
