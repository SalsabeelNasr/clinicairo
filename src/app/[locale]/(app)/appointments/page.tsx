"use client"

import { useMemo, useState } from "react"
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAddLine,
  RiMore2Fill,
  RiVideoChatLine,
} from "@remixicon/react"
import { PageHeaderAction } from "@/components/shared/PageHeaderAction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import { useLocale } from "@/contexts/locale-context"
import { useToast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import {
  CancelAppointmentModal,
  cancelReasonToStatus,
  type AppointmentCancelReason,
} from "@/features/appointments/components/CancelAppointmentModal"

type Track = "consultation" | "nutrition" | "coaching" | "follow-up"
type Status = "scheduled" | "completed" | "no_show" | "cancelled" | "rescheduled"

interface Appt {
  id: string
  date: string
  start: string
  end: string
  patient: string
  type: Track
  providerName: string
  status: Status
  meetUrl: string
}

const TODAY = "2026-06-03"
const TOMORROW = "2026-06-04"

const SEED: Appt[] = [
  { id: "a1", date: TODAY, start: "09:00", end: "09:30", patient: "سارة المبروك", type: "consultation", providerName: "د. أحمد القاضي", status: "scheduled", meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "a2", date: TODAY, start: "10:30", end: "11:00", patient: "خالد الورفلي", type: "consultation", providerName: "د. أحمد القاضي", status: "scheduled", meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "a3", date: TODAY, start: "11:15", end: "11:45", patient: "فاطمة الزروق", type: "nutrition", providerName: "أ. ليلى منصور", status: "completed", meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "a4", date: TODAY, start: "13:00", end: "13:30", patient: "هالة بن عمر", type: "coaching", providerName: "كابتن يوسف", status: "scheduled", meetUrl: "https://meet.google.com/abc-defg-hij" },
  { id: "a5", date: TOMORROW, start: "10:00", end: "10:30", patient: "عبد السلام القذافي", type: "follow-up", providerName: "د. أحمد القاضي", status: "scheduled", meetUrl: "https://meet.google.com/abc-defg-hij" },
]

const TT = {
  ar: {
    title: "المواعيد", book: "حجز موعد", empty: "لا مواعيد في هذا اليوم.",
    join: "انضمام", reschedule: "إعادة جدولة", cancel: "إلغاء", noActions: "لا توجد إجراءات",
    cancelled: "تم إلغاء الموعد.", rescheduleToast: "افتح حجز موعد جديد لإعادة الجدولة.",
    today: "اليوم",
    track: { consultation: "كشف", nutrition: "تغذية", coaching: "لياقة", "follow-up": "متابعة" } as Record<Track, string>,
    status: { scheduled: "مجدول", completed: "اكتمل", no_show: "تغيب", cancelled: "ملغي", rescheduled: "أعيد جدولته" } as Record<Status, string>,
  },
  en: {
    title: "Appointments", book: "Book", empty: "No appointments on this day.",
    join: "Join", reschedule: "Reschedule", cancel: "Cancel", noActions: "No actions",
    cancelled: "Appointment cancelled.", rescheduleToast: "Open a new booking to reschedule.",
    today: "Today",
    track: { consultation: "Consult", nutrition: "Nutrition", coaching: "Fitness", "follow-up": "Follow-up" } as Record<Track, string>,
    status: { scheduled: "Scheduled", completed: "Completed", no_show: "No-show", cancelled: "Cancelled", rescheduled: "Rescheduled" } as Record<Status, string>,
  },
}

const TRACK_ACCENT: Record<Track, string> = {
  consultation: "app-row--accent-primary",
  nutrition: "app-row--accent-success",
  coaching: "app-row--accent-warning",
  "follow-up": "app-row--accent-muted",
}

const TRACK_PILL: Record<Track, string> = {
  consultation: "app-pill--info",
  nutrition: "app-pill--success",
  coaching: "app-pill--warning",
  "follow-up": "app-pill--muted",
}

const STATUS_PILL: Record<Status, string> = {
  scheduled: "app-pill--muted",
  completed: "app-pill--success",
  no_show: "app-pill--warning",
  cancelled: "app-pill--muted",
  rescheduled: "app-pill--info",
}

function shiftDate(date: string, days: number): string {
  const d = new Date(date + "T00:00:00")
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function AppointmentsPage() {
  const { lang } = useLocale()
  const t = TT[lang]
  const { showToast } = useToast()
  const [day, setDay] = useState(TODAY)
  const [appts, setAppts] = useState<Appt[]>(SEED)
  const [cancelTarget, setCancelTarget] = useState<Appt | null>(null)

  const dayAppts = useMemo(
    () => appts.filter((a) => a.date === day).sort((a, b) => a.start.localeCompare(b.start)),
    [appts, day],
  )

  const dateLabel = new Date(day + "T00:00:00").toLocaleDateString(lang === "ar" ? "ar-LY-u-nu-latn" : "en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  const setStatus = (id: string, status: Status) =>
    setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))

  const handleCancelConfirm = (reason: AppointmentCancelReason) => {
    if (!cancelTarget) return
    const status = cancelReasonToStatus(reason)
    setStatus(cancelTarget.id, status)
    setCancelTarget(null)
    showToast(t.cancelled, "info")
  }

  return (
    <div className="app-page">
      <header className="app-page-header">
        <h1 className="app-page-title">{t.title}</h1>
        <PageHeaderAction icon={RiAddLine} onClick={() => showToast(t.rescheduleToast, "info")}>
          {t.book}
        </PageHeaderAction>
      </header>

      <nav className="app-nav-bar" aria-label={t.title}>
        <button
          type="button"
          onClick={() => setDay(shiftDate(day, -1))}
          className="app-nav-bar__btn"
          aria-label="Previous day"
        >
          <RiArrowRightSLine className="size-5" />
        </button>
        <div className="app-nav-bar__content">
          <span className="app-nav-bar__date">{dateLabel}</span>
          {day === TODAY && <span className="app-pill app-pill--primary">{t.today}</span>}
        </div>
        <button
          type="button"
          onClick={() => setDay(shiftDate(day, 1))}
          className="app-nav-bar__btn"
          aria-label="Next day"
        >
          <RiArrowLeftSLine className="size-5" />
        </button>
      </nav>

      {dayAppts.length === 0 ? (
        <div className="app-empty-state">{t.empty}</div>
      ) : (
        <div className="app-list">
          {dayAppts.map((a) => {
            const isScheduled = a.status === "scheduled"

            return (
              <article key={a.id} className="app-row">
                <div className="app-row__main">
                  <div className="app-row__time">
                    <p className="app-row__time-start">{a.start}</p>
                  </div>
                  <div className="app-row__divider" aria-hidden />
                  <div className="app-row__info">
                    <div className="app-row__title-row">
                      <h3 className="app-row__info-title">{a.patient}</h3>
                      <div className="app-row__chips">
                        <span className={cn("app-pill", TRACK_PILL[a.type])}>
                          {t.track[a.type]}
                        </span>
                        <span className={cn("app-pill", STATUS_PILL[a.status])}>
                          {t.status[a.status]}
                        </span>
                      </div>
                    </div>
                    <p className="app-row__info-subtitle">{a.providerName}</p>
                  </div>
                </div>

                <div className="app-row__actions">
                  {isScheduled ? (
                    <>
                      <a
                        href={a.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="app-btn--join"
                      >
                        <RiVideoChatLine className="app-btn--join__icon" aria-hidden />
                        {t.join}
                      </a>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="app-icon-btn"
                            aria-label="Actions"
                          >
                            <RiMore2Fill className="size-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => showToast(t.rescheduleToast, "info")}
                          >
                            {t.reschedule}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-error-600 focus:bg-error-50 focus:text-error-600"
                            onClick={() => setCancelTarget(a)}
                          >
                            {t.cancel}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    <span className="app-row__no-actions">{t.noActions}</span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      <CancelAppointmentModal
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        patientName={cancelTarget?.patient}
        appointmentTime={
          cancelTarget ? `${cancelTarget.start} – ${cancelTarget.end}` : undefined
        }
      />
    </div>
  )
}
