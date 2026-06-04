"use client"

import { useState, type ReactNode } from "react"
import { cx } from "@/lib/utils"

interface HomeQueueProps<T> {
  title: string
  items: T[]
  currentUserId: string
  /** Returns the owning staff id for an item (provider for appts, assignee for tasks). */
  getOwnerId: (item: T) => string
  renderCard: (item: T) => ReactNode
  labels: { mine: string; all: string; empty: string }
}

/**
 * Reusable filtered-queue widget for the Home page.
 * Card-based list with a mine/all filter; defaults to all for every role.
 */
export function HomeQueue<T>({
  title,
  items,
  currentUserId,
  getOwnerId,
  renderCard,
  labels,
}: HomeQueueProps<T>) {
  const [filter, setFilter] = useState<"mine" | "all">("all")

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
