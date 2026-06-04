"use client"

import { Skeleton } from "@/components/Skeleton"

export function PatientsSkeleton() {
  return (
    <div className="app-list">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="app-row app-row--patient">
          <div className="app-row__main">
            <Skeleton className="app-row__avatar-skeleton" />
            <div className="app-row__divider" aria-hidden />
            <div className="app-row__skeleton-body">
              <div className="app-row__title-row">
                <Skeleton className="app-skeleton-title" />
                <Skeleton className="app-skeleton-chip" />
              </div>
              <Skeleton className="app-skeleton-subtitle" />
              <div className="mt-2 space-y-0.5 md:hidden">
                <Skeleton className="app-skeleton-phone" />
                <Skeleton className="app-skeleton-date" />
              </div>
            </div>
          </div>
          <div className="app-row__meta app-row__meta--skeleton hidden md:block">
            <Skeleton className="app-skeleton-phone" />
            <Skeleton className="app-skeleton-date" />
          </div>
          <div className="app-row__actions">
            <Skeleton className="app-skeleton-btn" />
          </div>
        </div>
      ))}
    </div>
  )
}
