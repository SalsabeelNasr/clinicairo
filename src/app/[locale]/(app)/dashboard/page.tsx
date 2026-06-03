"use client"

import { useMemo } from "react"
import {
  RiVideoChatLine,
  RiCheckLine,
  RiCheckboxBlankCircleLine,
} from "@remixicon/react"
import { Badge } from "@/components/Badge"
import { useLocale } from "@/contexts/locale-context"
import { useUserClinic } from "@/contexts/user-clinic-context"
import { HomeQueue } from "@/features/home/HomeQueue"
import { cn } from "@/lib/utils"

// ---- Mock data (wired to Supabase in the appointments/tasks phases) ----
type Track = "consultation" | "nutrition" | "coaching"
interface ApptItem {
  id: string
  start: string // HH:MM, today
  end: string // HH:MM, today
  patient: string
  type: Track
  providerId: string
  providerName: string
  meetUrl: string
}
interface TaskItem {
  id: string
  kind: "payment_verify" | "no_show" | "cold_lead" | "renewal" | "doctor_request"
  title: string
  subject: string
  assigneeId: string
}

const APPTS: ApptItem[] = [
  { id: "a1", start: "09:00", end: "09:30", patient: "سارة المبروك", type: "consultation", providerId: "user-001", providerName: "د. أحمد", meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "a2", start: "10:30", end: "11:00", patient: "خالد الورفلي", type: "consultation", providerId: "user-001", providerName: "د. أحمد", meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "a3", start: "11:15", end: "11:45", patient: "فاطمة الزروق", type: "nutrition", providerId: "user-003", providerName: "أ. ليلى", meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "a4", start: "13:00", end: "13:30", patient: "هالة بن عمر", type: "coaching", providerId: "user-002", providerName: "كابتن يوسف", meetUrl: "https://meet.google.com/abc-defg-hij" },
]

const TASKS: TaskItem[] = [
  { id: "t1", kind: "payment_verify", title: "", subject: "سارة المبروك", assigneeId: "user-001" },
  { id: "t2", kind: "no_show", title: "", subject: "عبد السلام القذافي", assigneeId: "user-001" },
  { id: "t3", kind: "cold_lead", title: "", subject: "ليد: منى ا.", assigneeId: "user-003" },
  { id: "t4", kind: "renewal", title: "", subject: "خالد الورفلي", assigneeId: "user-002" },
]

const T = {
  ar: {
    home: "الرئيسية",
    today: "مواعيد اليوم",
    myTasks: "مهامي",
    mine: "مهامي", all: "الكل",
    emptyAppts: "لا مواعيد اليوم.",
    emptyTasks: "لا مهام حالياً.",
    join: "انضمام",
    track: { consultation: "كشف", nutrition: "تغذية", coaching: "لياقة" } as Record<Track, string>,
    taskKind: {
      payment_verify: "تأكيد دفعة",
      no_show: "إعادة جدولة (لم يحضر)",
      cold_lead: "متابعة عميل بارد",
      renewal: "تذكير تجديد",
      doctor_request: "طلب طبيب",
    } as Record<TaskItem["kind"], string>,
  },
  en: {
    home: "Home",
    today: "Today's appointments",
    myTasks: "My tasks",
    mine: "Mine", all: "All",
    emptyAppts: "No appointments today.",
    emptyTasks: "No tasks right now.",
    join: "Join",
    track: { consultation: "Consult", nutrition: "Nutrition", coaching: "Fitness" } as Record<Track, string>,
    taskKind: {
      payment_verify: "Verify payment",
      no_show: "Reschedule (no-show)",
      cold_lead: "Follow up cold lead",
      renewal: "Renewal reminder",
      doctor_request: "Doctor request",
    } as Record<TaskItem["kind"], string>,
  },
}

const trackPill: Record<Track, string> = {
  consultation: "app-pill--info",
  nutrition: "app-pill--success",
  coaching: "app-pill--warning",
}

const taskPill: Record<TaskItem["kind"], string> = {
  payment_verify: "app-pill--warning",
  no_show: "app-pill--error",
  cold_lead: "app-pill--info",
  renewal: "app-pill--indigo",
  doctor_request: "app-pill--muted",
}

export default function HomePage() {
  const { lang } = useLocale()
  const { currentUser } = useUserClinic()
  const t = T[lang]

  // Role default: assistant + owner/manager → all; doctor/nutritionist/coach → mine (§3.5)
  const defaultFilter: "mine" | "all" =
    currentUser.role === "assistant" || currentUser.role === "manager" ? "all" : "mine"

  const appts = useMemo(() => [...APPTS].sort((a, b) => a.start.localeCompare(b.start)), [])

  return (
    <div className="app-page">
      <h1 className="app-page-title">{t.home}</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Today's appointments */}
        <HomeQueue<ApptItem>
          title={t.today}
          items={appts}
          currentUserId={currentUser.id}
          getOwnerId={(a) => a.providerId}
          defaultFilter={defaultFilter}
          labels={{ mine: t.mine, all: t.all, empty: t.emptyAppts }}
          renderCard={(a) => (
            <article key={a.id} className="app-row app-row--widget">
              <div className="app-row__main">
                <div className="app-row__time">
                  <span className="app-row__time-start">{a.start}</span>
                </div>
                <div className="app-row__divider" aria-hidden />
                <div className="app-row__info">
                  <div className="app-row__title-row">
                    <h3 className="app-row__info-title">{a.patient}</h3>
                    <span className={cn("app-pill", trackPill[a.type])}>{t.track[a.type]}</span>
                  </div>
                  <p className="app-row__info-subtitle">{a.providerName}</p>
                </div>
              </div>
              <div className="app-row__actions">
                <a
                  href={a.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-btn--join"
                >
                  <RiVideoChatLine className="app-btn--join__icon" />
                  {t.join}
                </a>
              </div>
            </article>
          )}
        />

        {/* My tasks */}
        <HomeQueue<TaskItem>
          title={t.myTasks}
          items={TASKS}
          currentUserId={currentUser.id}
          getOwnerId={(task) => task.assigneeId}
          defaultFilter={defaultFilter}
          labels={{ mine: t.mine, all: t.all, empty: t.emptyTasks }}
          renderCard={(task) => {
            return (
              <article key={task.id} className="app-row app-row--widget">
                <div className="app-row__main">
                  <div className="app-row__check app-row__check--pending">
                    <RiCheckboxBlankCircleLine className="size-4" />
                  </div>
                  <div className="app-row__divider" aria-hidden />
                  <div className="app-row__info">
                    <div className="app-row__title-row">
                      <h3 className="app-row__info-title">{task.subject}</h3>
                      <span className={cn("app-pill", taskPill[task.kind])}>{t.taskKind[task.kind]}</span>
                    </div>
                    <p className="app-row__info-subtitle">
                      {task.title || t.taskKind[task.kind]}
                    </p>
                  </div>
                </div>
                <div className="app-row__actions">
                  <button
                    type="button"
                    className="app-icon-btn text-success-600 hover:bg-success-50"
                    title={t.join}
                  >
                    <RiCheckLine className="size-5" />
                  </button>
                </div>
              </article>
            )
          }}
        />
      </div>
    </div>
  )
}
