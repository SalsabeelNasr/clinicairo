"use client"

import Link from "next/link"
import { Button } from "@/components/Button"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"
import {
  RiCheckLine,
  RiCheckboxBlankCircleLine,
  RiWhatsappLine,
  RiTimeLine,
  RiArrowRightLine,
} from "@remixicon/react"
import {
  formatTaskDateTranslated,
  isOverdue,
  TASK_STATUS_KEYS,
} from "./tasks.utils"
import type { TaskListItem } from "./tasks.types"
import { cn } from "@/lib/utils"

interface TasksCardsProps {
  tasks: TaskListItem[]
  onMarkDone: (task: TaskListItem) => void
  onAssign: (task: TaskListItem) => void
  onSnooze?: (task: TaskListItem, days: number) => void
  onNextAttempt?: (task: TaskListItem) => void
  role: "doctor" | "assistant" | "manager"
}

export function TasksCards({
  tasks,
  onMarkDone,
  onAssign,
  onSnooze,
  onNextAttempt,
  role,
}: TasksCardsProps) {
  const t = useAppTranslations()
  const { lang } = useLocale()

  return (
    <div className="app-list">
      {tasks.map((task) => {
        const overdue = isOverdue(task.dueDate)
        const isDone = task.status === "done"
        const canAssign = role === "doctor" || role === "assistant" || role === "manager"
        const waPhone = task.patientPhone ? task.patientPhone.replace(/[^\d]/g, "") : undefined
        const waHref = waPhone
          ? `https://wa.me/${waPhone}?text=${encodeURIComponent("Hello, this is CliniCairo clinic following up. When is a good time to talk?")}`
          : undefined
        
        return (
          <article
            key={task.id}
            className={cn(
              "app-row",
              isDone && "opacity-75"
            )}
          >
            <div className="app-row__main">
              {/* Status Circle / Mark Done Action */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isDone) onMarkDone(task);
                }}
                disabled={isDone}
                className={cn(
                  "app-row__check",
                  isDone ? "app-row__check--done" : "app-row__check--pending"
                )}
                aria-label={isDone ? t.tasks.statusDone : t.dashboard.markAsDone}
              >
                {isDone ? (
                  <RiCheckLine className="size-5" />
                ) : (
                  <RiCheckboxBlankCircleLine className="size-5" />
                )}
              </button>

              <div className="app-row__divider" aria-hidden />

              <div className="app-row__info">
                <div className="app-row__title-row">
                  <h3 className={cn(
                    "app-row__info-title",
                    isDone && "line-through text-slate-400"
                  )}>
                    {task.description || task.title}
                  </h3>
                  <div className="app-row__chips">
                    <span className={cn(
                      "app-pill",
                      isDone ? "app-pill--success" : overdue ? "app-pill--error" : "app-pill--muted"
                    )}>
                      {t.tasks[TASK_STATUS_KEYS[task.status] as keyof typeof t.tasks] ?? task.status}
                    </span>
                    {task.dueDate && (
                      <span className={cn(
                        "app-pill",
                        overdue && !isDone ? "app-pill--error" : "app-pill--muted"
                      )}>
                        {formatTaskDateTranslated(task.dueDate, t, lang)}
                      </span>
                    )}
                  </div>
                </div>
                {(task.patientName || task.assignedToName) && (
                  <p className="app-row__info-subtitle">
                    {task.patientName && (
                      <>
                        {t.table.patient}:{" "}
                        <Link
                          href={`/patients/${task.patientId}`}
                          className="font-medium text-primary-600 hover:underline"
                        >
                          {task.patientName}
                        </Link>
                      </>
                    )}
                    {task.patientName && task.assignedToName && " · "}
                    {task.assignedToName && (
                      <>
                        {t.tasks.assignedTo}{" "}
                        {canAssign ? (
                          <button
                            type="button"
                            onClick={() => onAssign(task)}
                            className="font-medium text-slate-700 hover:text-primary-600"
                          >
                            {task.assignedToName}
                          </button>
                        ) : (
                          <span>{task.assignedToName}</span>
                        )}
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="app-row__actions">
              {waHref && !isDone && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="app-icon-btn text-success-600 hover:bg-success-50"
                  title="Contact on WhatsApp"
                >
                  <RiWhatsappLine className="size-5" />
                </a>
              )}
              {task.follow_up_kind && onSnooze && !isDone && (
                <button
                  type="button"
                  className="app-icon-btn"
                  onClick={() => onSnooze(task, 1)}
                  title="Snooze 1 day"
                >
                  <RiTimeLine className="size-5" />
                </button>
              )}
              {task.follow_up_kind && onNextAttempt && !isDone && (
                <button
                  type="button"
                  className="app-icon-btn"
                  onClick={() => onNextAttempt(task)}
                  title={t.tasks.nextAttempt}
                >
                  <RiArrowRightLine className="size-5" />
                </button>
              )}
              {isDone && (
                <span className="app-row__no-actions">{t.common.noActions ?? "No actions"}</span>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
