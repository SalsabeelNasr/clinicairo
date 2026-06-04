"use client"

import {
  RiMore2Fill,
  RiUserSharedLine,
  RiEyeLine,
  RiTimeLine,
} from "@remixicon/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import type { Lead } from "./leads.types"
import {
  compactPhone,
  formatLeadDate,
  isColdLead,
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  SOURCE_PILL,
  STATUS_PILL,
} from "./leads.utils"
import { cn } from "@/lib/utils"

interface LeadsRowProps {
  lead: Lead
  lang: "ar" | "en"
  coldAfterDays: number
  assignedToName?: string
  labels: {
    coldHint: string
    convert: string
    followUp: string
    viewDetails: string
    noActions: string
  }
  onConvert: (lead: Lead) => void
  onFollowUp: (lead: Lead) => void
  onOpenDetails: (lead: Lead) => void
}

export function LeadsRow({
  lead,
  lang,
  coldAfterDays,
  assignedToName,
  labels,
  onConvert,
  onFollowUp,
  onOpenDetails,
}: LeadsRowProps) {
  const cold = isColdLead(lead, coldAfterDays, new Date("2026-06-03T12:00:00"))
  const canConvert = lead.status === "qualified" || lead.status === "booked"
  const hasActions = lead.status !== "converted" && lead.status !== "lost"
  const dateLabel = lead.last_contacted_at ?? lead.created_at

  return (
    <article className="app-row">
      <div className="app-row__main">
        <div className="app-row__info">
          <div className="app-row__title-row">
            <h3 className="app-row__info-title">{lead.name}</h3>
            <div className="app-row__chips">
              <span className={cn("app-pill", STATUS_PILL[lead.status])}>
                {LEAD_STATUS_LABELS[lead.status][lang]}
              </span>
              <span className={cn("app-pill", SOURCE_PILL[lead.source])}>
                {LEAD_SOURCE_LABELS[lead.source][lang]}
              </span>
              {cold && (
                <span className="app-pill app-pill--error">{labels.coldHint}</span>
              )}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <p dir="ltr">{compactPhone(lead.phone)}</p>
            {assignedToName && (
              <>
                <span className="text-slate-300">·</span>
                <p>{assignedToName}</p>
              </>
            )}
            <span className="text-slate-300">·</span>
            <p className="flex items-center gap-1">
              <span className="font-medium text-slate-600">{formatLeadDate(dateLabel)}</span>
              <span className="text-xs text-slate-400">
                ({lead.last_contacted_at ? (lang === "ar" ? "اتصال" : "contact") : (lang === "ar" ? "إنشاء" : "created")})
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="app-row__actions">
        {hasActions ? (
          <>
            {/* Desktop: show primary button + 3-dot menu */}
            <div className="hidden lg:flex items-center gap-2">
              {canConvert && (
                <button
                  type="button"
                  className="app-btn--join"
                  onClick={() => onConvert(lead)}
                  title={labels.convert}
                >
                  <RiUserSharedLine className="app-btn--join__icon" aria-hidden />
                  <span>{labels.convert}</span>
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="app-icon-btn" aria-label="Lead actions">
                    <RiMore2Fill className="size-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem onClick={() => onOpenDetails(lead)} className="flex items-center gap-2">
                    <RiEyeLine className="size-4 text-slate-400" />
                    <span>{labels.viewDetails}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFollowUp(lead)} className="flex items-center gap-2">
                    <RiTimeLine className="size-4 text-slate-400" />
                    <span>{labels.followUp}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile: group everything in 3-dot menu */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="app-icon-btn" aria-label="Lead actions">
                    <RiMore2Fill className="size-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  {canConvert && (
                    <DropdownMenuItem onClick={() => onConvert(lead)} className="flex items-center gap-2">
                      <RiUserSharedLine className="size-4 text-primary-600" aria-hidden />
                      <span>{labels.convert}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onOpenDetails(lead)} className="flex items-center gap-2">
                    <RiEyeLine className="size-4 text-slate-400" />
                    <span>{labels.viewDetails}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFollowUp(lead)} className="flex items-center gap-2">
                    <RiTimeLine className="size-4 text-slate-400" />
                    <span>{labels.followUp}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <span className="app-row__no-actions">{labels.noActions}</span>
        )}
      </div>
    </article>
  )
}
