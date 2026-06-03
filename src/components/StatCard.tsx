import type { RemixiconComponentType } from "@remixicon/react"
import { RiArrowUpLine, RiArrowDownLine } from "@remixicon/react"
import { cx } from "@/lib/utils"

interface StatCardProps {
  icon: RemixiconComponentType
  label: string
  value: string | number
  delta?: { value: string; trend: "up" | "down" }
}

/** TailAdmin-style metric card: icon tile + label + big value + optional trend. */
export function StatCard({ icon: Icon, label, value, delta }: StatCardProps) {
  return (
    <div className="app-stat">
      <div className="app-stat__icon-box">
        <Icon className="size-6" aria-hidden="true" />
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <span className="app-stat__label">{label}</span>
          <h4 className="app-stat__value">{value}</h4>
        </div>

        {delta && (
          <span
            className={cx(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              delta.trend === "up"
                ? "bg-success-50 text-success-600"
                : "bg-error-50 text-error-600",
            )}
          >
            {delta.trend === "up" ? (
              <RiArrowUpLine className="size-3" />
            ) : (
              <RiArrowDownLine className="size-3" />
            )}
            {delta.value}
          </span>
        )}
      </div>
    </div>
  )
}
