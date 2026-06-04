"use client"

import { useMemo } from "react"
import {
  RiVideoChatLine,
  RiCheckLine,
  RiCheckboxBlankCircleLine,
  RiMore2Fill,
  RiUserLine,
} from "@remixicon/react"
import Link from "next/link"
import { Badge } from "@/components/Badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
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
  patientId: string
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
  due: string
}

const APPTS: ApptItem[] = [
  { id: "a1", start: "09:00", end: "09:30", patient: "سارة المبروك", patientId: "p1", type: "consultation", providerId: "user-001", providerName: "د. أحمد", meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "a2", start: "10:30", end: "11:00", patient: "خالد الورفلي", patientId: "p2", type: "consultation", providerId: "user-001", providerName: "د. أحمد", meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "a3", start: "11:15", end: "11:45", patient: "فاطمة الزروق", patientId: "p3", type: "nutrition", providerId: "user-003", providerName: "أ. ليلى", meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "a4", start: "13:00", end: "13:30", patient: "هالة بن عمر", patientId: "p4", type: "coaching", providerId: "user-002", providerName: "كابتن يوسف", meetUrl: "https://meet.google.com/abc-defg-hij" },
]

const _today = new Date()
const _fmt = (d: Date) => `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
const TODAY_MD = _fmt(_today)
const TOMORROW_MD = _fmt(new Date(_today.getTime() + 86_400_000))
const DAY3_MD = _fmt(new Date(_today.getTime() + 2 * 86_400_000))

const TASKS: TaskItem[] = [
  { id: "t1", kind: "payment_verify", title: "", subject: "تأكيد دفعة: سارة المبروك", assigneeId: "user-001", due: TODAY_MD },
  { id: "t2", kind: "no_show", title: "", subject: "إعادة جدولة: عبد السلام القذافي", assigneeId: "user-001", due: TODAY_MD },
  { id: "t3", kind: "cold_lead", title: "", subject: "متابعة ليد: منى ا.", assigneeId: "user-003", due: TOMORROW_MD },
  { id: "t4", kind: "renewal", title: "", subject: "تذكير تجديد: خالد الورفلي", assigneeId: "user-002", due: DAY3_MD },
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
    viewProfile: "عرض الملف الشخصي",
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
    viewProfile: "View Profile",
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
                <div className="hidden lg:flex items-center gap-2">
                  <a
                    href={a.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-btn--join"
                    title={t.join}
                  >
                    <RiVideoChatLine className="app-btn--join__icon" />
                    <span>{t.join}</span>
                  </a>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="app-icon-btn" aria-label="Actions">
                        <RiMore2Fill className="size-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem asChild>
                        <Link href={`/patients/${a.patientId}`} className="flex items-center gap-2">
                          <RiUserLine className="size-4" aria-hidden />
                          <span>{t.viewProfile}</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="lg:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="app-icon-btn" aria-label="Actions">
                        <RiMore2Fill className="size-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem asChild>
                        <Link href={`/patients/${a.patientId}`} className="flex items-center gap-2">
                          <RiUserLine className="size-4" aria-hidden />
                          <span>{t.viewProfile}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={a.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <RiVideoChatLine className="size-4 text-primary-600" aria-hidden />
                          <span>{t.join}</span>
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
          labels={{ mine: t.mine, all: t.all, empty: t.emptyTasks }}
          renderCard={(task) => {
            const overdue = task.due < TODAY_MD
            return (
              <article key={task.id} className="app-row app-row--widget">
                <div className="app-row__main">
                  <div className="app-row__check app-row__check--pending">
                    <RiCheckboxBlankCircleLine className="size-4" />
                  </div>
                  <div className="app-row__divider" aria-hidden />
                  <div className="app-row__info">
                    <div className="mb-0.5">
                      <span className={cn(
                        "text-[10px] font-bold tabular-nums uppercase tracking-wider",
                        overdue ? "text-error-600" : "text-slate-400"
                      )}>
                        {task.due}
                      </span>
                    </div>
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
