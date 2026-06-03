"use client"

import { useState, type ReactNode } from "react"
import { cx } from "@/lib/utils"

interface HomeQueueProps<T> {
  title: string
  items: T[]
  currentUserId: string
  /** Returns the owning staff id for an item (provider for appts, assignee for tasks). */
  getOwnerId: (item: T) => string
  defaultFilter: "mine" | "all"
  renderCard: (item: T) => ReactNode
  labels: { mine: string; all: string; empty: string }
}

/**
 * Reusable filtered-queue widget for the Home page (spec §3.5).
 * Card-based list (NOT a table), mobile-first, with a mine/all filter whose
 * default is role-driven. Used for both Today's appointments and My tasks.
 */
export function HomeQueue<T>({
  title,
  items,
  currentUserId,
  getOwnerId,
  defaultFilter,
  renderCard,
  labels,
}: HomeQueueProps<T>) {
  const [filter, setFilter] = useState<"mine" | "all">(defaultFilter)

  const shown =
    filter === "mine"
      ? items.filter((i) => getOwnerId(i) === currentUserId)
      : items

  return (
    <section className="app-widget">
      <header className="app-widget__header">
        <h2 className="app-widget__title">{title}</h2>
        <div className="app-toggle">
          {(["mine", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cx(
                "app-toggle__btn",
                filter === f && "app-toggle__btn--active"
              )}
            >
              {labels[f]}
            </button>
          ))}
        </div>
      </header>

      <div className="app-widget__body">
        {shown.length === 0 ? (
          <p className="app-widget__empty">{labels.empty}</p>
        ) : (
          shown.map(renderCard)
        )}
      </div>
    </section>
  )
}
