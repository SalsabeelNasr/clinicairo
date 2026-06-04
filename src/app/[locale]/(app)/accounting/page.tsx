"use client"

import { useMemo, useState } from "react"
import { RiAddLine, RiExternalLinkLine } from "@remixicon/react"
import { useLocale } from "@/contexts/locale-context"
import { SearchInput } from "@/components/SearchInput"
import { PageHeaderAction } from "@/components/shared/PageHeaderAction"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
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

const PAYMENTS_SEED: Payment[] = [
  { id: "p1", patient: "سارة المبروك", type: "t1", amount: 120, currency: "USD", method: "تحويل", status: "verified", date: "01-06-2026", proofUrl: "#" },
  { id: "p2", patient: "خالد الورفلي", type: "t2", amount: 954, currency: "LYD", method: "محفظة", status: "verified", date: "01-06-2026" },
  { id: "p3", patient: "فاطمة الزروق", type: "assessment", amount: 50, currency: "USD", method: "تحويل", status: "verified", date: "03-06-2026", proofUrl: "#" },
  { id: "p4", patient: "هالة بن عمر", type: "t1", amount: 2400, currency: "EGP", method: "وكيل", status: "verified", date: "28-05-2026" },
  { id: "p5", patient: "عبد السلام القذافي", type: "t1", amount: 120, currency: "USD", method: "تحويل", status: "verified", date: "03-06-2026", proofUrl: "#" },
]

const EXPENSES_SEED = [
  { id: "e1", category: "تسويق", amount: 200, currency: "USD" as Currency, vendor: "Meta Ads", date: "01-06-2026", proofUrl: "#" },
  { id: "e2", category: "أدوات", amount: 300, currency: "LYD" as Currency, vendor: "مورد محلي", date: "30-05-2026" },
]
const PAYOUTS_SEED = [
  { id: "po1", staff: "د. أحمد القاضي", period: "2026-05", amount: 800, currency: "USD" as Currency, status: "paid" },
  { id: "po2", staff: "أ. ليلى منصور", period: "2026-05", amount: 1500, currency: "LYD" as Currency, status: "pending", proofUrl: "#" },
]
const REFUNDS_SEED: Array<{
  id: string
  patient: string
  amount: number
  currency: Currency
  reason: string
  date: string
  proofUrl?: string
}> = [
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
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS_SEED)
  const [expenses, setExpenses] = useState(EXPENSES_SEED)
  const [payouts, setPayouts] = useState(PAYOUTS_SEED)
  const [refunds, setRefunds] = useState(REFUNDS_SEED)

  const totals = useMemo(() => CURRENCIES.map((cur) => {
    const ins = payments.filter((p) => p.currency === cur && p.status === "verified").reduce((s, p) => s + p.amount, 0)
    const outs =
      expenses.filter((e) => e.currency === cur).reduce((s, e) => s + e.amount, 0) +
      payouts.filter((p) => p.currency === cur).reduce((s, p) => s + p.amount, 0) +
      refunds.filter((r) => r.currency === cur).reduce((s, r) => s + r.amount, 0)
    return { cur, ins, outs, net: ins - outs }
  }), [payments, expenses, payouts, refunds])

  const outRows: OutRow[] = useMemo(() => [
    ...expenses.map((e) => ({ id: e.id, kind: "expense" as const, title: e.category, sub: `${e.vendor} · ${e.date}`, amount: e.amount, currency: e.currency, proofUrl: e.proofUrl })),
    ...payouts.map((p) => ({ id: p.id, kind: "payout" as const, title: p.staff, sub: p.period, amount: p.amount, currency: p.currency, proofUrl: p.proofUrl })),
    ...refunds.map((r) => ({ id: r.id, kind: "refund" as const, title: r.patient, sub: `${r.reason} · ${r.date}`, amount: r.amount, currency: r.currency, proofUrl: r.proofUrl })),
  ], [expenses, payouts, refunds])

  const filteredIn = useMemo(() => {
    if (!searchIn) return payments
    const s = searchIn.toLowerCase()
    return payments.filter((p) => 
      p.patient.toLowerCase().includes(s) || 
      p.method.toLowerCase().includes(s) ||
      p.amount.toString().includes(s)
    )
  }, [searchIn, payments])

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
        <PageHeaderAction icon={RiAddLine} onClick={() => setShowAddDrawer(true)}>
          {t.add}
        </PageHeaderAction>
      </header>

      {/* Currency Summary Cards */}
      <div className="app-metric-grid app-metric-grid--3">
        {totals.map(({ cur, ins, outs, net }) => (
          <div key={cur} className="app-metric-card">
            <span className="app-metric-card__heading app-metric-card__heading--code">{cur}</span>
            <div className="app-metric-card__rows">
              <div className="app-metric-card__row">
                <span>{t.ins}</span>
                <span className="app-metric-card__row-value" dir="ltr">
                  {ins.toLocaleString("en-US")}
                </span>
              </div>
              <div className="app-metric-card__row">
                <span>{t.outs}</span>
                <span className="app-metric-card__row-value" dir="ltr">
                  {outs.toLocaleString("en-US")}
                </span>
              </div>
              <div className="app-metric-card__highlight">
                <span>{t.net}</span>
                <span className="app-metric-card__highlight-value" dir="ltr">
                  {net < 0 ? "" : "+"}
                  {net.toLocaleString("en-US")}
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
                <div className="app-row__title-row">
                  <h3 className="app-row__info-title">{p.patient}</h3>
                  <div className="app-row__chips">
                    <span className="app-pill app-pill--success">
                      {t.payStatus[p.status]}
                    </span>
                    <span className="app-pill app-pill--muted">
                      {t.payType[p.type]}
                    </span>
                  </div>
                </div>
                <p className="app-row__info-subtitle">{p.method} • {p.date}</p>
                {p.proofUrl && (
                  <a
                    href={p.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-link--subtle mt-1"
                  >
                    <RiExternalLinkLine className="size-3" aria-hidden />
                    {t.viewProof}
                  </a>
                )}
              </div>
            </div>
            <div className="app-row__actions">
              <div className="app-row__amount">
                <span className="app-row__amount-primary" dir="ltr">
                  +{p.amount.toLocaleString("en-US")} {p.currency}
                </span>
                <div className="app-row__amount-secondary">
                  {getEquivalents(p.amount, p.currency).map((eq, i) => (
                    <span key={i}>{eq}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}

        {tab === "out" && filteredOut.map((row) => (
          <article key={row.kind + row.id} className="app-row app-row--widget">
            <div className="app-row__main">
              <div className="app-row__info">
                <div className="app-row__title-row">
                  <h3 className="app-row__info-title">{row.title}</h3>
                  <div className="app-row__chips">
                    <span className="app-pill app-pill--success">
                      {t.kind[row.kind]}
                    </span>
                  </div>
                </div>
                <p className="app-row__info-subtitle">{row.sub}</p>
                {row.proofUrl && (
                  <a
                    href={row.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-link--subtle mt-1"
                  >
                    <RiExternalLinkLine className="size-3" aria-hidden />
                    {t.viewProof}
                  </a>
                )}
              </div>
            </div>
            <div className="app-row__actions">
              <div className="app-row__amount">
                <span className="app-row__amount-primary" dir="ltr">
                  -{row.amount.toLocaleString("en-US")} {row.currency}
                </span>
                <div className="app-row__amount-secondary">
                  {getEquivalents(row.amount, row.currency).map((eq, i) => (
                    <span key={i}>{eq}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <AddTransactionDrawer
        open={showAddDrawer}
        onOpenChange={setShowAddDrawer}
        onCreate={(payload) => {
          if (payload.kind === "payment") {
            setPayments((prev) => [
              {
                id: `p-${Date.now()}`,
                patient: payload.title,
                amount: payload.amount,
                currency: payload.currency,
                type: "t1",
                method: payload.sub || (lang === "ar" ? "تحويل" : "Transfer"),
                status: "verified",
                date: payload.date,
              },
              ...prev,
            ])
            setTab("in")
            return
          }
          if (payload.kind === "expense") {
            setExpenses((prev) => [
              {
                id: `e-${Date.now()}`,
                category: payload.title,
                amount: payload.amount,
                currency: payload.currency,
                vendor: payload.sub || (lang === "ar" ? "مورد" : "Vendor"),
                date: payload.date,
              },
              ...prev,
            ])
          } else if (payload.kind === "payout") {
            setPayouts((prev) => [
              {
                id: `po-${Date.now()}`,
                staff: payload.title,
                period: payload.sub || payload.date.slice(0, 7),
                amount: payload.amount,
                currency: payload.currency,
                status: "pending",
              },
              ...prev,
            ])
          } else {
            setRefunds((prev) => [
              {
                id: `r-${Date.now()}`,
                patient: payload.title,
                amount: payload.amount,
                currency: payload.currency,
                reason: payload.sub || (lang === "ar" ? "استرداد" : "Refund"),
                date: payload.date,
              },
              ...prev,
            ])
          }
          setTab("out")
        }}
      />
    </div>
  )
}

type TxnKind = "payment" | "expense" | "payout" | "refund"
interface AddTxnPayload {
  kind: TxnKind
  title: string
  sub: string
  amount: number
  currency: Currency
  date: string
}

function AddTransactionDrawer({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (payload: AddTxnPayload) => void
}) {
  const { lang, isRtl } = useLocale()
  const [kind, setKind] = useState<TxnKind>("payment")
  const [title, setTitle] = useState("")
  const [sub, setSub] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const reset = () => {
    setKind("payment")
    setTitle("")
    setSub("")
    setAmount("")
    setCurrency("USD")
    setDate(new Date().toISOString().slice(0, 10))
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const numericAmount = Number(amount)
    if (!title.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) return
    onCreate({
      kind,
      title: title.trim(),
      sub: sub.trim(),
      amount: numericAmount,
      currency,
      date,
    })
    onOpenChange(false)
    reset()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-xl">
        <DrawerHeader>
          <DrawerTitle>{lang === "ar" ? "إضافة عملية" : "Add transaction"}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="txn-kind">{lang === "ar" ? "النوع" : "Type"}</Label>
              <Select id="txn-kind" value={kind} onChange={(e) => setKind(e.target.value as TxnKind)}>
                <option value="payment">{lang === "ar" ? "داخل: دفعة" : "In: Payment"}</option>
                <option value="expense">{lang === "ar" ? "خارج: مصروف" : "Out: Expense"}</option>
                <option value="payout">{lang === "ar" ? "خارج: مستحق" : "Out: Payout"}</option>
                <option value="refund">{lang === "ar" ? "خارج: استرداد" : "Out: Refund"}</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="txn-title">{lang === "ar" ? "الاسم" : "Title"}</Label>
              <Input id="txn-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="txn-sub">{lang === "ar" ? "وصف إضافي" : "Sub label"}</Label>
              <Input id="txn-sub" value={sub} onChange={(e) => setSub(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="txn-amount">{lang === "ar" ? "المبلغ" : "Amount"}</Label>
                <Input id="txn-amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="txn-currency">{lang === "ar" ? "العملة" : "Currency"}</Label>
                <Select id="txn-currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
                  {CURRENCIES.map((cur) => (
                    <option key={cur} value={cur}>{cur}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="txn-date">{lang === "ar" ? "التاريخ" : "Date"}</Label>
              <Input id="txn-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="flex-1">
                {lang === "ar" ? "حفظ" : "Save"}
              </Button>
            </div>
          </form>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
