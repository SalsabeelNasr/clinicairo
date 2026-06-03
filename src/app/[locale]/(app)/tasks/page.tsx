"use client"

import { useMemo, useState } from "react"
import type { RemixiconComponentType } from "@remixicon/react"
import {
  RiMoneyDollarCircleLine,
  RiCalendarCloseLine,
  RiUserStarLine,
  RiRefreshLine,
  RiFlaskLine,
  RiStethoscopeLine,
  RiCheckLine,
  RiCheckboxBlankCircleLine,
  RiAddLine,
  RiCloseLine,
} from "@remixicon/react"
import { useLocale } from "@/contexts/locale-context"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useToast } from "@/hooks/useToast"
import { PageHeaderAction } from "@/components/shared/PageHeaderAction"
import { cn } from "@/lib/utils"

type Kind = "payment_verify" | "no_show" | "cold_lead" | "renewal" | "lab_chase" | "doctor_request"
type Status = "pending" | "completed" | "ignored"

interface Task {
  id: string
  kind: Kind
  subject: string
  assigneeId: string
  due: string
  status: Status
}

const SEED: Task[] = [
  { id: "t1", kind: "payment_verify", subject: "سارة المبروك", assigneeId: "user-001", due: "2026-06-04", status: "pending" },
  { id: "t2", kind: "no_show", subject: "عبد السلام القذافي", assigneeId: "user-001", due: "2026-06-04", status: "pending" },
  { id: "t3", kind: "cold_lead", subject: "ليد: سعاد التارقي", assigneeId: "user-003", due: "2026-06-05", status: "pending" },
  { id: "t4", kind: "renewal", subject: "خالد الورفلي", assigneeId: "user-002", due: "2026-06-06", status: "pending" },
  { id: "t5", kind: "lab_chase", subject: "فاطمة الزروق", assigneeId: "user-001", due: "2026-06-03", status: "completed" },
  { id: "t6", kind: "doctor_request", subject: "هالة بن عمر", assigneeId: "user-001", due: "2026-06-02", status: "ignored" },
]

const TT = {
  ar: {
    title: "المهام",
    add: "إضافة مهمة",
    mine: "مهامي",
    all: "الكل",
    fAll: "الكل",
    pending: "قيد التنفيذ",
    completed: "مكتملة",
    ignored: "متجاهلة",
    done: "إنجاز",
    ignore: "تجاهل",
    doneToast: "تم إنجاز المهمة.",
    ignoreToast: "تم تجاهل المهمة.",
    due: "الاستحقاق",
    empty: "لا مهام مطابقة.",
    kind: {
      payment_verify: "تأكيد دفعة",
      no_show: "إعادة جدولة (لم يحضر)",
      cold_lead: "متابعة عميل بارد",
      renewal: "تذكير تجديد",
      lab_chase: "متابعة تحاليل",
      doctor_request: "طلب طبيب",
    } as Record<Kind, string>,
    statusLabel: { pending: "قيد التنفيذ", completed: "مكتملة", ignored: "متجاهلة" } as Record<Status, string>,
  },
  en: {
    title: "Tasks",
    add: "Add Task",
    mine: "Mine",
    all: "All",
    fAll: "All",
    pending: "Pending",
    completed: "Completed",
    ignored: "Ignored",
    done: "Done",
    ignore: "Ignore",
    doneToast: "Task completed.",
    ignoreToast: "Task ignored.",
    due: "Due",
    empty: "No matching tasks.",
    kind: {
      payment_verify: "Verify payment",
      no_show: "Reschedule (no-show)",
      cold_lead: "Follow up cold lead",
      renewal: "Renewal reminder",
      lab_chase: "Chase labs",
      doctor_request: "Doctor request",
    } as Record<Kind, string>,
    statusLabel: { pending: "Pending", completed: "Completed", ignored: "Ignored" } as Record<Status, string>,
  },
}

const kindPill: Record<Kind, string> = {
  payment_verify: "app-pill--warning",
  no_show: "app-pill--error",
  cold_lead: "app-pill--info",
  renewal: "app-pill--indigo",
  lab_chase: "app-pill--success",
  doctor_request: "app-pill--muted",
}

const kindIcon: Record<Kind, RemixiconComponentType> = {
  payment_verify: RiMoneyDollarCircleLine,
  no_show: RiCalendarCloseLine,
  cold_lead: RiUserStarLine,
  renewal: RiRefreshLine,
  lab_chase: RiFlaskLine,
  doctor_request: RiStethoscopeLine,
}

const statusPill: Record<Status, string> = {
  pending: "app-pill--warning",
  completed: "app-pill--success",
  ignored: "app-pill--muted",
}

export default function TasksPage() {
  const { lang } = useLocale()
  const t = TT[lang]
  const { currentUser } = useUserClinic()
  const { showToast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(SEED)
  const [scope, setScope] = useState<"mine" | "all">(
    currentUser.role === "assistant" || currentUser.role === "manager" ? "all" : "mine",
  )
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      if (scope === "mine" && task.assigneeId !== currentUser.id) return false
      if (statusFilter !== "all" && task.status !== statusFilter) return false
      return true
    })
  }, [tasks, scope, statusFilter, currentUser.id])

  const setStatus = (id: string, status: Status, msg: string) => {
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)))
    showToast(msg, status === "completed" ? "success" : "info")
  }

  const statusChips: Array<Status | "all"> = ["all", "pending", "completed", "ignored"]

  return (
    <div className="app-page">
      <header className="app-page-header">
        <div className="app-page-header__text">
          <h1 className="app-page-title">{t.title}</h1>
        </div>
        <PageHeaderAction icon={RiAddLine} onClick={() => showToast(t.add, "info")}>
          {t.add}
        </PageHeaderAction>
      </header>

      <nav className="app-tabs" aria-label="Task scope">
        {(["mine", "all"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScope(s)}
            className={cn(
              "app-tabs__btn",
              scope === s && "app-tabs__btn--active"
            )}
          >
            {t[s]}
          </button>
        ))}
      </nav>

      <div className="flex flex-wrap gap-2">
        {statusChips.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={cn(
              "app-pill",
              statusFilter === s
                ? "app-pill--primary"
                : "app-pill--muted hover:bg-slate-200",
            )}
          >
            {s === "all" ? t.fAll : t.statusLabel[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="app-empty-state">
          <p className="app-empty-state__text">{t.empty}</p>
        </div>
      ) : (
        <div className="app-list">
          {filtered.map((task) => {
            const Icon = kindIcon[task.kind]
            const isDone = task.status === "completed"

            return (
              <article key={task.id} className={cn("app-row", isDone && "opacity-75")}>
                <div className="app-row__main">
                  <button
                    type="button"
                    onClick={() => setStatus(task.id, isDone ? "pending" : "completed", t.doneToast)}
                    className={cn(
                      "app-row__check",
                      isDone ? "app-row__check--done" : "app-row__check--pending",
                    )}
                  >
                    {isDone ? <RiCheckLine className="size-5" /> : <RiCheckboxBlankCircleLine className="size-5" />}
                  </button>

                  <div className="app-row__divider" aria-hidden />

                  <div className="app-row__info">
                    <div className="app-row__title-row">
                      <h3 className={cn("app-row__info-title", isDone && "line-through text-slate-400")}>
                        {task.subject}
                      </h3>
                      <div className="app-row__chips">
                        <span className={cn("app-pill", kindPill[task.kind])}>
                          {t.kind[task.kind]}
                        </span>
                        <span className="app-pill app-pill--muted">
                          {t.due}: {task.due}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <Icon className="size-3.5" />
                      <span>{t.statusLabel[task.status]}</span>
                    </div>
                  </div>
                </div>

                <div className="app-row__actions">
                  {!isDone && (
                    <>
                      <button
                        type="button"
                        className="app-icon-btn text-success-600 hover:bg-success-50"
                        onClick={() => setStatus(task.id, "completed", t.doneToast)}
                        title={t.statusLabel.completed}
                      >
                        <RiCheckLine className="size-5" />
                      </button>
                      <button
                        type="button"
                        className="app-icon-btn text-slate-400 hover:bg-slate-100"
                        onClick={() => setStatus(task.id, "ignored", t.ignoreToast)}
                        title={t.statusLabel.ignored}
                      >
                        <RiCloseLine className="size-5" />
                      </button>
                    </>
                  )}
                  {isDone && <span className="app-row__no-actions">{t.completed}</span>}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
