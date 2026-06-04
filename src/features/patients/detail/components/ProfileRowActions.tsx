"use client"

import { RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import { Button } from "@/components/Button"
import { useAppTranslations } from "@/lib/useAppTranslations"

interface ProfileRowActionsProps {
  onEdit: () => void
  onDelete: () => void
  editLabel?: string
  deleteLabel?: string
}

export function ProfileRowActions({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: ProfileRowActionsProps) {
  const t = useAppTranslations()

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="size-8 p-0"
        title={editLabel ?? t.profile.cardMenuEdit}
        aria-label={editLabel ?? t.profile.cardMenuEdit}
      >
        <RiEditLine className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="size-8 p-0 text-gray-500 hover:text-red-600"
        title={deleteLabel ?? t.common.delete}
        aria-label={deleteLabel ?? t.common.delete}
      >
        <RiDeleteBinLine className="size-4" />
      </Button>
    </div>
  )
}
