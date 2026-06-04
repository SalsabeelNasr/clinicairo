import { RiArrowUpLine, RiArrowDownLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  delta?: { value: string; trend: "up" | "down" }
}

/** Compact metric card — matches accounting summary cards. */
export function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <div className="app-metric-card">
      <span className="app-metric-card__heading">{label}</span>
      <p className="app-metric-card__value" dir="ltr">
        {value}
      </p>
      {delta && (
        <span
          className={cn(
            "app-metric-card__delta",
            delta.trend === "up"
              ? "app-metric-card__delta--up"
              : "app-metric-card__delta--down"
          )}
        >
          {delta.trend === "up" ? (
            <RiArrowUpLine className="size-2.5 shrink-0" aria-hidden />
          ) : (
            <RiArrowDownLine className="size-2.5 shrink-0" aria-hidden />
          )}
          {delta.value}
        </span>
      )}
    </div>
  )
}
