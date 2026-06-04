"use client"

import { useState, useEffect } from "react"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { PageHeader } from "@/components/shared/PageHeader"
import { PageHeaderAction } from "@/components/shared/PageHeaderAction"
import { Skeleton } from "@/components/Skeleton"
import { RiTaskLine, RiAddLine } from "@remixicon/react"
import { useDebounce } from "@/lib/useDebounce"
import { TasksToolbar } from "./TasksToolbar"
import { TasksCards } from "./TasksCards"
import { AddTaskDrawer } from "./AddTaskDrawer"
import { AssignModal } from "./TaskModals"
import {
  listTasks,
  createTask,
  updateTaskStatus,
  assignTask,
  snoozeTask,
  createFollowUpTask,
} from "./tasks.api"
import { updateLastActivity, markPatientCold } from "@/api/patients.api"
import { getFollowUpRules } from "@/api/settings.api"
import {
  TASK_STATUS_KEYS,
} from "./tasks.utils"
import type {
  TaskListItem,
  TaskSource,
  TaskStatus,
  CreateTaskPayload,
} from "./tasks.types"
import type { StaffRole } from "@/data/mock/users-clinics"
import { cn } from "@/lib/utils"

interface TasksPageProps {
  role: StaffRole
  currentUserId: string
  clinicId: string
  defaultSourceFilter?: TaskSource | "all"
  pageTitle?: string
}

export function TasksPage({
  role,
  currentUserId,
  clinicId,
  pageTitle,
}: TasksPageProps) {
  const t = useAppTranslations()
  const [tasks, setTasks] = useState<TaskListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 250)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [assignTaskData, setAssignTaskData] = useState<TaskListItem | null>(null)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("pending")
  const [scope, setScope] = useState<"mine" | "all">(
    role === "assistant" || role === "owner" ? "all" : "mine"
  )

  const pageSize = 20

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await listTasks({
        clinicId,
        status: statusFilter,
        assignedToUserId: scope === "mine" ? currentUserId : undefined,
        query: debouncedSearch,
        page,
        pageSize,
      })
      if (page === 1) {
        setTasks(response.tasks)
      } else {
        setTasks((prev) => [...prev, ...response.tasks])
      }
      setTotal(response.total)
      setHasMore(response.hasMore)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, clinicId, statusFilter, scope])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter, scope])

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    await createTask(payload)
    await fetchTasks()
  }

  const handleMarkDone = async (task: TaskListItem) => {
    await updateTaskStatus({ id: task.id, status: "done" })
    
    if (task.patientId) {
      try {
        await updateLastActivity(task.patientId)
      } catch (error) {
        console.warn("Failed to update patient last activity:", error)
      }
    }
    
    await fetchTasks()
  }

  const handleSnooze = async (task: TaskListItem, days: number) => {
    const snoozeDate = new Date()
    snoozeDate.setDate(snoozeDate.getDate() + days)
    await snoozeTask(task.id, snoozeDate.toISOString())
    await fetchTasks()
  }

  const handleNextAttempt = async (task: TaskListItem) => {
    if (!task.follow_up_kind || !task.entity_id || !task.patientId) {
      return
    }

    try {
      const rules = await getFollowUpRules(clinicId)
      const nextAttempt = (task.attempt || 1) + 1

      if (nextAttempt > rules.maxAttempts) {
        if (rules.markColdAfterMaxAttempts) {
          await markPatientCold(task.patientId)
        }
        await updateTaskStatus({ id: task.id, status: "done" })
        await fetchTasks()
        return
      }

      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + rules.daysBetweenAttempts)

      await createFollowUpTask({
        clinicId,
        patientId: task.patientId,
        appointmentId: task.entity_id,
        kind: task.follow_up_kind as "cancelled" | "no_show",
        dueAt: dueDate.toISOString(),
        attempt: nextAttempt,
      })

      await updateTaskStatus({ id: task.id, status: "done" })
      await fetchTasks()
    } catch (error) {
      console.error("Failed to create next attempt:", error)
    }
  }

  const handleAssign = async (assignedToUserId: string | undefined) => {
    if (!assignTaskData) return
    await assignTask({ id: assignTaskData.id, assignedToUserId })
    await fetchTasks()
  }

  const defaultAssignedTo = role === "assistant" ? currentUserId : undefined

  const statusChips: Array<TaskStatus | "all"> = ["all", "pending", "done", "cancelled"]

  return (
    <div className="app-page">
      <header className="app-page-header">
        <div className="app-page-header__text">
          <h1 className="app-page-title">{pageTitle ?? t.nav.tasks}</h1>
        </div>
        <PageHeaderAction icon={RiAddLine} onClick={() => setShowNewTaskModal(true)}>
          {t.tasks.addNewTask}
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
            {s === "mine" ? t.tasks.mine : t.tasks.all}
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
            {s === "all" ? t.tasks.all : (t.tasks[TASK_STATUS_KEYS[s] as keyof typeof t.tasks] ?? s)}
          </button>
        ))}
      </div>

      <TasksToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewTask={() => setShowNewTaskModal(true)}
      />

      {loading && tasks.length === 0 ? (
        <div className="app-list">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="app-row">
              <div className="app-row__main">
                <Skeleton className="app-row__check rounded-full" />
                <div className="app-row__divider" aria-hidden />
                <div className="app-row__skeleton-body">
                  <div className="app-row__title-row">
                    <Skeleton className="app-skeleton-title" />
                    <Skeleton className="app-skeleton-chip" />
                  </div>
                  <Skeleton className="app-skeleton-subtitle" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="app-empty-state">
          <RiTaskLine className="mx-auto size-12 text-slate-300" />
          <p className="app-empty-state__text mt-4">
            {searchQuery ? t.tasks.noTasksMatch : t.tasks.noTasksYet}
          </p>
        </div>
      ) : (
        <>
          <TasksCards
            tasks={tasks}
            onMarkDone={handleMarkDone}
            onAssign={(task) => setAssignTaskData(task)}
            onSnooze={handleSnooze}
            onNextAttempt={handleNextAttempt}
            role={role}
          />

          {hasMore && (
            <div className="app-load-more">
              <PageHeaderAction
                pinToMobileTopbar={false}
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
              >
                {loading ? t.common.loading : t.archive.loadMore}
              </PageHeaderAction>
            </div>
          )}
        </>
      )}

      {/* Drawers & Modals */}
      <AddTaskDrawer
        open={showNewTaskModal}
        onOpenChange={setShowNewTaskModal}
        onSubmit={handleCreateTask}
        defaultAssignedToUserId={defaultAssignedTo}
        currentUserId={currentUserId}
        clinicId={clinicId}
      />

      <AssignModal
        isOpen={!!assignTaskData}
        onClose={() => setAssignTaskData(null)}
        onSubmit={handleAssign}
        task={assignTaskData}
      />
    </div>
  )
}
