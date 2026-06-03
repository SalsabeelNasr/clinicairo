"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { Calendar } from "@/components/Calendar"
import { RiArrowLeftSLine, RiArrowRightSLine, RiCalendarLine } from "@remixicon/react"
import { format, isBefore, startOfDay } from "date-fns"
import { useLocale } from "@/contexts/locale-context"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { DATEPICKER_LOCALE } from "@/lib/date-utils"

interface DayNavigationProps {
  currentDate: Date
  onDateChange: (date: Date) => void
}

function isBeforeToday(date: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(new Date()))
}

export function DayNavigation({ currentDate, onDateChange }: DayNavigationProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const t = useAppTranslations()
  // Datepicker always uses English (no translation of month/day names)
  
  const goToPreviousDay = () => {
    const prev = new Date(currentDate)
    prev.setDate(prev.getDate() - 1)
    onDateChange(prev)
  }
  
  const goToNextDay = () => {
    const next = new Date(currentDate)
    next.setDate(next.getDate() + 1)
    onDateChange(next)
  }
  
  const goToToday = () => {
    onDateChange(new Date())
  }
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isBeforeToday(date)) {
      onDateChange(date)
      setIsCalendarOpen(false)
    }
  }
  
  const isToday = format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  const cannotGoToPast = isToday
  
  return (
    <nav className="app-nav-bar mb-0" aria-label="Day navigation">
      <button
        type="button"
        onClick={goToPreviousDay}
        disabled={cannotGoToPast}
        className="app-nav-bar__btn disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous day"
      >
        <RiArrowRightSLine className="size-5" />
      </button>

      <div className="app-nav-bar__content">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-gray-100"
            >
              <RiCalendarLine className="size-4 text-gray-500" />
              <span className="app-nav-bar__date">
                <span className="sm:hidden">{format(currentDate, "MMM d, yyyy", { locale: DATEPICKER_LOCALE })}</span>
                <span className="hidden sm:inline">{format(currentDate, "EEEE, MMMM d, yyyy", { locale: DATEPICKER_LOCALE })}</span>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleDateSelect}
              disabled={isBeforeToday}
              fromDate={startOfDay(new Date())}
              initialFocus
              enableYearNavigation
              locale={DATEPICKER_LOCALE}
              weekStartsOn={0}
            />
          </PopoverContent>
        </Popover>
        {isToday && <span className="app-pill app-pill--primary">{t.appointments.today}</span>}
        {!isToday && (
          <button
            type="button"
            onClick={goToToday}
            className="app-btn--secondary px-3 py-1 text-xs"
          >
            {t.appointments.today}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={goToNextDay}
        className="app-nav-bar__btn"
        aria-label="Next day"
      >
        <RiArrowLeftSLine className="size-5" />
      </button>
    </nav>
  )
}
