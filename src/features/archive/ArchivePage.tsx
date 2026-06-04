"use client"

import { useEffect, useMemo, useState } from "react"
import { SearchInput } from "@/components/SearchInput"
import { cn } from "@/lib/utils"
import type { ArchiveTab, ArchiveItem } from "./archive.api"
import {
  listArchivedAppointments,
  listArchivedLeads,
  listArchivedTasks,
} from "./archive.api"
import { useLocale } from "@/contexts/locale-context"

const T = {
  ar: {
    title: "الأرشيف",
    empty: "لا توجد عناصر أرشيف.",
    tabs: {
      appointments: "المواعيد",
      tasks: "المهام",
      leads: "الليدز",
    } as Record<ArchiveTab, string>,
    ranges: {
      all: "الكل",
      "30": "30 يوم",
      "90": "90 يوم",
    } as Record<string, string>,
  },
  en: {
    title: "Archive",
    empty: "No archived items.",
    tabs: {
      appointments: "Appointments",
      tasks: "Tasks",
      leads: "Leads",
    } as Record<ArchiveTab, string>,
    ranges: {
      all: "All",
      "30": "30 days",
      "90": "90 days",
    } as Record<string, string>,
  },
}

function formatDate(dateString: string, lang: "ar" | "en"): string {
  return new Date(dateString).toLocaleDateString(lang === "ar" ? "ar-LY-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function ArchivePage() {
  const { lang } = useLocale()
  const t = T[lang]
  const [tab, setTab] = useState<ArchiveTab>("appointments")
  const [range, setRange] = useState<"all" | "30" | "90">("90")
  const [query, setQuery] = useState("")
  const [items, setItems] = useState<ArchiveItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const days = range === "all" ? 0 : Number(range)
      const next =
        tab === "appointments"
          ? await listArchivedAppointments(query, days)
          : tab === "tasks"
            ? await listArchivedTasks(query, days)
            : await listArchivedLeads(query, days)
      setItems(next)
      setLoading(false)
    }
    void load()
  }, [tab, range, query])

  const countByTab = useMemo(() => {
    return {
      appointments: items.filter((item) => item.tab === "appointments").length,
      tasks: items.filter((item) => item.tab === "tasks").length,
      leads: items.filter((item) => item.tab === "leads").length,
    }
  }, [items])

  return (
    <div className="app-page">
      <header className="app-page-header">
        <h1 className="app-page-title">{t.title}</h1>
      </header>

      <div className="app-toolbar flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          {(Object.keys(t.tabs) as ArchiveTab[]).map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setTab(entry)}
              className={cn(
                "app-pill transition-colors",
                tab === entry ? "app-pill--primary" : "app-pill--muted hover:bg-slate-200"
              )}
            >
              {t.tabs[entry]} {countByTab[entry] > 0 ? `(${countByTab[entry]})` : ""}
            </button>
          ))}
        </div>

        <div className="hidden h-6 w-px bg-slate-200 md:block" />

        <div className="flex items-center gap-2">
          {(["all", "30", "90"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value)}
              className={cn(
                "app-pill transition-colors",
                range === value ? "app-pill--primary" : "app-pill--muted hover:bg-slate-200"
              )}
            >
              {t.ranges[value]}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-[200px] md:max-w-xs md:ms-auto">
          <SearchInput
            value={query}
            onSearchChange={setQuery}
            placeholder={lang === "ar" ? "بحث..." : "Search..."}
          />
        </div>
      </div>

      {loading ? (
        <div className="app-empty-state">{lang === "ar" ? "جاري التحميل..." : "Loading..."}</div>
      ) : items.length === 0 ? (
        <div className="app-empty-state">{t.empty}</div>
      ) : (
        <div className="app-list">
          {items.map((item) => (
            <article key={item.id} className="app-row">
              <div className="app-row__main">
                <div className="app-row__info">
                  <div className="app-row__title-row">
                    <h3 className="app-row__info-title">{item.title}</h3>
                    <div className="app-row__chips">
                      <span className="app-pill app-pill--muted">{item.status}</span>
                    </div>
                  </div>
                  <p className="app-row__info-subtitle">{item.subtitle || "—"}</p>
                </div>
              </div>
              <div className="app-row__actions">
                <span className="app-row__meta-secondary">{formatDate(item.at, lang)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
