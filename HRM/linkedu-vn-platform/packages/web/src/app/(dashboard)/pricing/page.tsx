"use client"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { DollarSign, X, Search, Calculator, Receipt, CreditCard, Settings } from "lucide-react"
import { PaginationBar } from "@/components/dashboard/pagination-bar"
import { TABS, STATUS_LABELS, STATUS_CLASSES, SEGMENT_LABELS, CYCLE_LABELS, formatVnd, PAGE_SIZE } from "./constants"
import type { TabKey, PageRes, PricingTier, Subscription, BillingSchedule, PaymentTransaction } from "./types"
import { TiersContent } from "./components/tiers-content"
import { SubscriptionsContent } from "./components/subscriptions-content"
import { BillingContent } from "./components/billing-content"
import { PaymentsContent } from "./components/payments-content"

export default function PricingPage() {
  const [tab, setTab] = useState<TabKey>("tiers")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const [tiers, setTiers] = useState<PageRes<PricingTier> | null>(null)
  const [subs, setSubs] = useState<PageRes<Subscription> | null>(null)
  const [billing, setBilling] = useState<PageRes<BillingSchedule> | null>(null)
  const [payments, setPayments] = useState<PageRes<PaymentTransaction> | null>(null)
  const [payingId, setPayingId] = useState<string | null>(null)

  /* fetchers */
  const fetchTiers = useCallback(async () => {
    setLoading(true); setError(null)
    try { setTiers(await api.get(`/pricing/tiers?page=${page}&limit=${PAGE_SIZE}`)) }
    catch (err) { setError(err instanceof Error ? err.message : "Lỗi tải gói dịch vụ") }
    setLoading(false)
  }, [page])

  const fetchSubs = useCallback(async () => {
    setLoading(true); setError(null)
    try { setSubs(await api.get(`/pricing/subscriptions?page=${page}&limit=${PAGE_SIZE}`)) }
    catch (err) { setError(err instanceof Error ? err.message : "Lỗi tải danh sách đăng ký") }
    setLoading(false)
  }, [page])

  const fetchBilling = useCallback(async () => {
    setLoading(true); setError(null)
    try { setBilling(await api.get(`/pricing/billing/pending?page=${page}&limit=${PAGE_SIZE}`)) }
    catch (err) { setError(err instanceof Error ? err.message : "Lỗi tải lịch thanh toán") }
    setLoading(false)
  }, [page])

  const fetchPayments = useCallback(async () => {
    setLoading(true); setError(null)
    try { setPayments(await api.get(`/pricing/payments?page=${page}&limit=${PAGE_SIZE}`)) }
    catch (err) { setError(err instanceof Error ? err.message : "Lỗi tải lịch sử thanh toán") }
    setLoading(false)
  }, [page])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        if (cancelled) return
        if (tab === "tiers") await fetchTiers()
        else if (tab === "subscriptions") await fetchSubs()
        else if (tab === "billing") await fetchBilling()
        else await fetchPayments()
      } catch { /* handled in fetchers */ }
    })()
    return () => { cancelled = true }
  }, [tab, fetchTiers, fetchSubs, fetchBilling, fetchPayments])

  async function handlePay(scheduleId: string) {
    setPayingId(scheduleId); setError(null)
    try {
      await api.post(`/pricing/billing/${scheduleId}/pay`, {})
      toast.success("Thanh toán thành công")
      fetchBilling()
    } catch (err) { setError(err instanceof Error ? err.message : "Lỗi xử lý thanh toán") }
    setPayingId(null)
  }

  function switchTab(t: TabKey) { setTab(t); setPage(1); setSearch("") }

  const dataMap = {
    tiers: tiers,
    subscriptions: subs,
    billing: billing,
    payments: payments,
  }

  const items = dataMap[tab]?.items ?? []
  const totalItems = dataMap[tab]?.total ?? 0
  const totalPages = Math.ceil(totalItems / PAGE_SIZE)

  const filtered = items.filter((row) => {
    if (!search) return true
    const q = search.toLowerCase()
    if (tab === "tiers") {
      const t = row as PricingTier
      return t.name.toLowerCase().includes(q) || t.segment.toLowerCase().includes(q)
    }
    if (tab === "subscriptions") {
      const s = row as Subscription
      return s.entityType.toLowerCase().includes(q) || s.entityId.toLowerCase().includes(q) || s.tier?.name?.toLowerCase().includes(q)
    }
    if (tab === "billing") {
      const b = row as BillingSchedule
      return b.id.toLowerCase().includes(q) || b.subscriptionId.toLowerCase().includes(q)
    }
    const p = row as PaymentTransaction
    return p.gatewayType.toLowerCase().includes(q) || p.status.toLowerCase().includes(q)
  })

  const searchPlaceholder = {
    tiers: "Tìm gói dịch vụ...", subscriptions: "Tìm thực thể, gói...",
    billing: "Tìm mã lịch...", payments: "Tìm cổng thanh toán...",
  }[tab]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" /> Bảng giá & Thanh toán
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý gói dịch vụ, đăng ký và theo dõi thanh toán.</p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button key={t.key} onClick={() => switchTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all ${tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon className="h-4 w-4" />{t.label}
              </button>
            )
          })}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring bg-card" />
        </div>
        <div className="text-sm text-muted-foreground">{totalItems} bản ghi</div>
      </div>

      {/* Sub-route quick links */}
      <div className="flex gap-2">
        <Link href="/pricing/quotes" className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent">
          <Calculator className="h-3.5 w-3.5" /> Tính giá
        </Link>
        <Link href="/pricing/billing" className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent">
          <Receipt className="h-3.5 w-3.5" /> Lịch TT đầy đủ
        </Link>
        <Link href="/pricing/payments" className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent">
          <CreditCard className="h-3.5 w-3.5" /> Cổng & Giao dịch
        </Link>
        <Link href="/pricing/settings" className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent">
          <Settings className="h-3.5 w-3.5" /> Pháp nhân & VAT
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <button onClick={() => setError(null)} className="text-destructive/70 hover:text-destructive"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : tab === "tiers" ? (
        <TiersContent items={filtered as PricingTier[]} />
      ) : tab === "subscriptions" ? (
        <SubscriptionsContent items={filtered as Subscription[]} />
      ) : tab === "billing" ? (
        <BillingContent items={filtered as BillingSchedule[]} payingId={payingId} onPay={handlePay} />
      ) : (
        <PaymentsContent items={filtered as PaymentTransaction[]} />
      )}

      {/* Pagination */}
      {!loading && (
        <PaginationBar page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
      )}
    </div>
  )
}