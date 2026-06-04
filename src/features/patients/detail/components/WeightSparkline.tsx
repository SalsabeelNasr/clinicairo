"use client"

import { cn } from "@/lib/utils"

interface WeightSparklineProps {
  points: number[]
  className?: string
}

export function WeightSparkline({ points, className }: WeightSparklineProps) {
  if (points.length < 2) return null

  const w = 120
  const h = 36
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - ((p - min) / range) * (h - 4) - 2
    return `${x},${y}`
  })

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("h-9 w-[7.5rem] text-primary-600", className)}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords.join(" ")}
      />
    </svg>
  )
}
