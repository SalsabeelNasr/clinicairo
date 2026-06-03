"use client"

import { useMemo, useState } from "react"
import { RiAddLine, RiExternalLinkLine } from "@remixicon/react"
import { useLocale } from "@/contexts/locale-context"
import { SearchInput } from "@/components/SearchInput"
import { PageHeaderAction } from "@/components/shared/PageHeaderAction"
import { cn } from "@/lib/utils"

type Currency = "LYD" | "USD" | "EGP"
type PayStatus = "verified" | "rejected" | "refunded"

interface Payment {
  id: string
  patient: string
  type: "assessment" | "t1" | "t2"
  amount: number
  currency: Currency
  method: string
  status: PayStatus
  date: string
  proofUrl?: string
}
interface OutRow {
  id: string
  kind: "expense" | "payout" | "refund"
  title: string
  sub: string
  amount: number
  currency: Currency
  proofUrl?: string
}

const PAYMENTS: Payment[] = [
  { id: "p1", patient: "سارة المبروك", type: "t1", amount: 120, currency: "USD", method: "تحويل", status: "verified", date: "01-06-2026", proofUrl: "#" },
  { id: "p2", patient: "خالد الورفلي", type: "t2", amount: 954, currency: "LYD", method: "محفظة", status: "verified", date: "01-06-2026" },
  { id: "p3", patient: "فاطمة الزروق", type: "assessment", amount: 50, currency: "USD", method: "تحويل", status: "verified", date: "03-06-2026", proofUrl: "#" },
  { id: "p4", patient: "هالة بن عمر", type: "t1", amount: 2400, currency: "EGP", method: "وكيل", status: "verified", date: "28-05-2026" },
  { id: "p5", patient: "عبد السلام القذافي", type: "t1", amount: 120, currency: "USD", method: "تحويل", status: "verified", date: "03-06-2026", proofUrl: "#" },
]

const EXPENSES = [
  { id: "e1", category: "تسويق", amount: 200, currency: "USD" as Currency, vendor: "Meta Ads", date: "01-06-2026", proofUrl: "#" },
  { id: "e2", category: "أدوات", amount: 300, currency: "LYD" as Currency, vendor: "مورد محلي", date: "30-05-2026" },
]
const PAYOUTS = [
  { id: "po1", staff: "د. أحمد القاضي", period: "2026-05", amount: 800, currency: "USD" as Currency, status: "paid" },
  { id: "po2", staff: "أ. ليلى منصور", period: "2026-05", amount: 1500, currency: "LYD" as Currency, status: "pending", proofUrl: "#" },
]
const REFUNDS = [
  { id: "r1", patient: "مريم سالم", amount: 50, currency: "USD" as Currency, reason: "إلغاء خلال المهلة", date: "29-05-2026", proofUrl: "#" },
]

const CURRENCIES: Currency[] = ["EGP", "USD", "LYD"]

const TT = {
  ar: {
    title: "المحاسبة",
    add: "إضافة عملية",
    ins: "الداخل",
    outs: "الخارج",
    net: "الصافي",
    tabIn: "الداخل",
    tabOut: "الخارج",
    method: "الطريقة",
    viewProof: "عرض الإثبات",
    noConvert: "تُعرض كل عملة على حدة دون تحويل.",
    kind: { expense: "مصروف", payout: "مستحق", refund: "مبلغ مُعاد" } as Record<OutRow["kind"], string>,
    payType: { assessment: "تقييم مبدئي", t1: "باقة أولى", t2: "باقة ثانية" } as Record<Payment["type"], string>,
    payStatus: { verified: "مؤكد", rejected: "مرفوض", refunded: "مُعاد" } as Record<PayStatus, string>,
  },
  en: {
    title: "Accounting",
    add: "Add Transaction",
    ins: "In",
    outs: "Out",
    net: "Net",
    tabIn: "In",
    tabOut: "Out",
    method: "Method",
    viewProof: "View Proof",
    noConvert: "Each currency is shown separately — no conversion.",
    kind: { expense: "Expense", payout: "Payout", refund: "Refund" } as Record<OutRow["kind"], string>,
    payType: { assessment: "Assessment", t1: "Tier 1", t2: "Tier 2" } as Record<Payment["type"], string>,
    payStatus: { verified: "Verified", rejected: "Rejected", refunded: "Refunded" } as Record<PayStatus, string>,
  },
}

export default function AccountingPage() {
  const { lang } = useLocale()
  const t = TT[lang]
  const [tab, setTab] = useState<"in" | "out">("in")
  const [searchIn, setSearchIn] = useState("")
  const [searchOut, setSearchOut] = useState("")

  const totals = useMemo(() => CURRENCIES.map((cur) => {
    const ins = PAYMENTS.filter((p) => p.currency === cur && p.status === "verified").reduce((s, p) => s + p.amount, 0)
    const outs =
      EXPENSES.filter((e) => e.currency === cur).reduce((s, e) => s + e.amount, 0) +
      PAYOUTS.filter((p) => p.currency === cur).reduce((s, p) => s + p.amount, 0) +
      REFUNDS.filter((r) => r.currency === cur).reduce((s, r) => s + r.amount, 0)
    return { cur, ins, outs, net: ins - outs }
  }), [])

  const outRows: OutRow[] = useMemo(() => [
    ...EXPENSES.map((e) => ({ id: e.id, kind: "expense" as const, title: e.category, sub: `${e.vendor} · ${e.date}`, amount: e.amount, currency: e.currency, proofUrl: e.proofUrl })),
    ...PAYOUTS.map((p) => ({ id: p.id, kind: "payout" as const, title: p.staff, sub: p.period, amount: p.amount, currency: p.currency, proofUrl: (p as any).proofUrl })),
    ...REFUNDS.map((r) => ({ id: r.id, kind: "refund" as const, title: r.patient, sub: `${r.reason} · ${r.date}`, amount: r.amount, currency: r.currency, proofUrl: r.proofUrl })),
  ], [])

  const filteredIn = useMemo(() => {
    if (!searchIn) return PAYMENTS
    const s = searchIn.toLowerCase()
    return PAYMENTS.filter((p) => 
      p.patient.toLowerCase().includes(s) || 
      p.method.toLowerCase().includes(s) ||
      p.amount.toString().includes(s)
    )
  }, [searchIn])

  const filteredOut = useMemo(() => {
    if (!searchOut) return outRows
    const s = searchOut.toLowerCase()
    return outRows.filter((row) => 
      row.title.toLowerCase().includes(s) || 
      row.sub.toLowerCase().includes(s) ||
      row.amount.toString().includes(s)
    )
  }, [searchOut, outRows])

  const getEquivalents = (amount: number, from: Currency) => {
    const others = CURRENCIES.filter((c) => c !== from)
    const rates: Record<Currency, Record<string, number>> = {
      USD: { LYD: 4.8, EGP: 47.5 },
      LYD: { USD: 1 / 4.8, EGP: 9.9 },
      EGP: { USD: 1 / 47.5, LYD: 1 / 9.9 },
    }
    return others.map((to) => {
      const val = amount * (rates[from][to] || 1)
      return `${val.toLocaleString("en-US", { maximumFractionDigits: 0 })} ${to}`
    })
  }

  return (
    <div className="app-page">
      <header className="app-page-header">
        <div className="app-page-header__text">
          <h1 className="app-page-title">{t.title}</h1>
        </div>
        <PageHeaderAction icon={RiAddLine} onClick={() => {}}>
          {t.add}
        </PageHeaderAction>
      </header>

      {/* Currency Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {totals.map(({ cur, ins, outs, net }) => (
          <div key={cur} className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400">{cur}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>{t.ins}</span>
                <span>{ins.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>{t.outs}</span>
                <span>{outs.toLocaleString("en-US")}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                <span>{t.net}</span>
                <span>
                  {net < 0 ? "" : "+"}{net.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav className="app-tabs">
        <button
          onClick={() => setTab("in")}
          className={cn(
            "app-tabs__btn",
            tab === "in" && "app-tabs__btn--active"
          )}
        >
          {t.tabIn}
        </button>
        <button
          onClick={() => setTab("out")}
          className={cn(
            "app-tabs__btn",
            tab === "out" && "app-tabs__btn--active"
          )}
        >
          {t.tabOut}
        </button>
      </nav>

      {/* Toolbar - Search under tabs */}
      <div className="app-toolbar">
        <SearchInput
          value={tab === "in" ? searchIn : searchOut}
          onSearchChange={tab === "in" ? setSearchIn : setSearchOut}
          placeholder={lang === "ar" ? "بحث في العمليات..." : "Search transactions..."}
        />
      </div>

      {/* Transactions List */}
      <div className="app-list">
        {tab === "in" && filteredIn.map((p) => (
          <article key={p.id} className="app-row app-row--widget">
            <div className="app-row__main">
              <div className="app-row__info">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="app-row__info-title">{p.patient}</h3>
                  <span className="app-pill app-pill--success">
                    {t.payStatus[p.status]}
                  </span>
                  <span className="app-pill app-pill--muted">
                    {t.payType[p.type]}
                  </span>
                </div>
                <p className="app-row__info-subtitle">{p.method} • {p.date}</p>
              </div>
            </div>
            <div className="app-row__actions">
              <div className="flex flex-col items-end">
                <span className="font-bold text-lg text-slate-900" dir="ltr">
                  +{p.amount.toLocaleString("en-US")} {p.currency}
                </span>
                <div className="flex gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                  {getEquivalents(p.amount, p.currency).map((eq, i) => (
                    <span key={i}>{eq}</span>
                  ))}
                </div>
              </div>
              {p.proofUrl && (
                <a
                  href={p.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
                >
                  <RiExternalLinkLine className="size-3.5" />
                  {t.viewProof}
                </a>
              )}
            </div>
          </article>
        ))}

        {tab === "out" && filteredOut.map((row) => (
          <article key={row.kind + row.id} className="app-row app-row--widget">
            <div className="app-row__main">
              <div className="app-row__info">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="app-row__info-title">{row.title}</h3>
                  <span className="app-pill app-pill--success">
                    {t.kind[row.kind]}
                  </span>
                </div>
                <p className="app-row__info-subtitle">{row.sub}</p>
              </div>
            </div>
            <div className="app-row__actions">
              <div className="flex flex-col items-end">
                <span className="font-bold text-lg text-slate-900" dir="ltr">
                  -{row.amount.toLocaleString("en-US")} {row.currency}
                </span>
                <div className="flex gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                  {getEquivalents(row.amount, row.currency).map((eq, i) => (
                    <span key={i}>{eq}</span>
                  ))}
                </div>
              </div>
              {row.proofUrl && (
                <a
                  href={row.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
                >
                  <RiExternalLinkLine className="size-3.5" />
                  {t.viewProof}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
