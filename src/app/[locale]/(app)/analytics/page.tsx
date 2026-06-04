"use client"

import { useMemo } from "react"
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"
import { StatCard } from "@/components/StatCard"
import { useLocale } from "@/contexts/locale-context"

const T = {
  ar: {
    title: "التحليلات",
    activePatients: "مرضى نشطون", tiers: "الباقة الأولى / الثانية", newThisMonth: "جدد هذا الشهر", churned: "متوقفون",
    newPatients: "المرضى الجدد (آخر 6 أشهر)",
    months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
  },
  en: {
    title: "Analytics",
    activePatients: "Active patients", tiers: "Tier 1 / Tier 2", newThisMonth: "New this month", churned: "Churned",
    newPatients: "New patients (last 6 months)",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
}

export default function AnalyticsPage() {
  const { lang } = useLocale()
  const t = T[lang]
  const chartData = useMemo(
    () => t.months.map((m, i) => ({ month: m, value: [12, 18, 15, 24, 28, 32][i] })),
    [t.months],
  )

  return (
    <div className="app-page">
      <h1 className="app-page-title">{t.title}</h1>

      <div className="app-metric-grid app-metric-grid--4">
        <StatCard label={t.activePatients} value={196} />
        <StatCard label={t.tiers} value="140 / 56" />
        <StatCard label={t.newThisMonth} value={32} delta={{ value: "12%", trend: "up" }} />
        <StatCard label={t.churned} value={4} delta={{ value: "1%", trend: "down" }} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="mb-5 text-lg font-bold text-slate-900">{t.newPatients}</h2>
        <div className="h-72 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ab7d5" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#0ab7d5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e7ec" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#98a2b3" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#98a2b3" }} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7ec", fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="#0ab7d5" strokeWidth={2} fill="url(#analyticsFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
