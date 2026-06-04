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
  RiMore2Fill,
  RiAddLine,
  RiCloseLine,
} from "@remixicon/react"
import { useLocale } from "@/contexts/locale-context"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { useToast } from "@/hooks/useToast"
import { PageHeaderAction } from "@/components/shared/PageHeaderAction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import { AddTaskDrawer } from "@/features/tasks/AddTaskDrawer"
import { createTask } from "@/features/tasks/tasks.api"
import type { CreateTaskPayload, TaskType } from "@/features/tasks/tasks.types"
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

const TODAY_ISO = new Date().toISOString().slice(0, 10)
const TOMORROW_ISO = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)
const DAY3_ISO = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10)

const SEED: Task[] = [
  { id: "t1", kind: "payment_verify", subject: "تأكيد دفعة: سارة المبروك - اشتراك الفئة الأولى", assigneeId: "user-001", due: TODAY_ISO, status: "pending" },
  { id: "t2", kind: "no_show", subject: "إعادة جدولة: عبد السلام القذافي (تغيب عن الموعد)", assigneeId: "user-001", due: TODAY_ISO, status: "pending" },
  { id: "t3", kind: "cold_lead", subject: "متابعة ليد: سعاد التارقي - استفسار برنامج التغذية", assigneeId: "user-003", due: TOMORROW_ISO, status: "pending" },
  { id: "t4", kind: "renewal", subject: "تذكير تجديد: خالد الورفلي - باقة اللياقة البدنية", assigneeId: "user-002", due: DAY3_ISO, status: "pending" },
  { id: "t5", kind: "lab_chase", subject: "متابعة تحاليل: فاطمة الزروق - نتائج فحص الدم", assigneeId: "user-001", due: "2026-06-03", status: "completed" },
  { id: "t6", kind: "doctor_request", subject: "طلب طبيب: مراجعة ملاحظات زيارة هالة بن عمر", assigneeId: "user-001", due: "2026-06-02", status: "ignored" },
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
    noActions: "لا توجد إجراءات",
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
    noActions: "No actions",
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

function mapTaskTypeToKind(type: TaskType): Kind {
  if (type === "payment_verify") return "payment_verify"
  if (type === "no_show") return "no_show"
  if (type === "cold_lead") return "cold_lead"
  if (type === "renewal") return "renewal"
  if (type === "doctor_request") return "doctor_request"
  return "doctor_request"
}

export default function TasksPage() {
  const { lang } = useLocale()
  const t = TT[lang]
  const { currentUser } = useUserClinic()
  const { showToast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(SEED)
  const [addDrawerOpen, setAddDrawerOpen] = useState(false)
  const [scope, setScope] = useState<"mine" | "all">(
    currentUser.role === "assistant" || currentUser.role === "owner" ? "all" : "mine",
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

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    await createTask(payload)
    const due = payload.dueDate ? payload.dueDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
    const newTask: Task = {
      id: `ui-${Date.now()}`,
      kind: mapTaskTypeToKind(payload.type),
      subject: payload.title,
      assigneeId: payload.assignedToUserId || currentUser.id,
      due,
      status: "pending",
    }
    setTasks((prev) => [newTask, ...prev])
    showToast(t.add, "success")
  }

  const statusChips: Array<Status | "all"> = ["all", "pending", "completed", "ignored"]

  return (
    <div className="app-page">
      <header className="app-page-header">
        <div className="app-page-header__text">
          <h1 className="app-page-title">{t.title}</h1>
        </div>
        <PageHeaderAction icon={RiAddLine} onClick={() => setAddDrawerOpen(true)}>
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
            const overdue = !isDone && task.due < TODAY_ISO

            return (
              <article key={task.id} className={cn("app-row app-row--task", isDone && "opacity-75")}>
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
                    <div className="mb-1">
                      <span className={cn(
                        "text-xs font-bold tabular-nums",
                        overdue ? "text-error-600" : "text-slate-400"
                      )}>
                        {task.due}
                      </span>
                    </div>
                    <div className="app-row__title-row">
                      <h3 className={cn("app-row__info-title", isDone && "line-through text-slate-400")}>
                        {task.subject}
                      </h3>
                      <div className="app-row__chips">
                        <span className={cn("app-pill", kindPill[task.kind])}>
                          {t.kind[task.kind]}
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
                  {isDone ? (
                    <span className="app-row__no-actions">{t.statusLabel.completed}</span>
                  ) : (
                    <span className="app-row__no-actions">{t.noActions}</span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      <AddTaskDrawer
        open={addDrawerOpen}
        onOpenChange={setAddDrawerOpen}
        onSubmit={handleCreateTask}
        currentUserId={currentUser.id}
        clinicId="clinic-001"
      />
    </div>
  )
}
