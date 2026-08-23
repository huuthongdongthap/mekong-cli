"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Plus, X, Award, Search } from "lucide-react"
import { STATUS_LABELS, PAGE_SIZE } from "./constants"
import type { TabKey, Fund, FundRes, Alloc, AllocRes } from "./types"
import { FundsContent } from "./components/funds-content"
import { AllocationsContent } from "./components/allocations-content"

export default function ScholarshipPage() {
  const [funds, setFunds] = useState<FundRes | null>(null)
  const [allocs, setAllocs] = useState<AllocRes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState<"funds" | "allocations">("funds")
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState({ name: "", description: "", targetAmountVnd: "", startDate: "", endDate: "" })

  async function fetchFunds() {
    setLoading(true); setError(null)
    try { setFunds(await api.get(`/scholarship/funds?page=${page}&limit=${PAGE_SIZE}`)) } catch (err) { setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu") }
    setLoading(false)
  }
  async function fetchAllocs() {
    setLoading(true); setError(null)
    try { setAllocs(await api.get(`/scholarship/allocations?page=${page}&limit=${PAGE_SIZE}`)) } catch (err) { setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu") }
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        if (cancelled) return
        if (tab === "funds") await fetchFunds()
        else await fetchAllocs()
      } catch { /* handled in fetch fns */ }
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchers close over current page/tab
  }, [page, tab])

  async function handleCreateFund() {
    setSubmitting(true); setError(null)
    try {
      await api.post("/scholarship/funds", {
        name: form.name, description: form.description || undefined,
        targetAmountVnd: Number(form.targetAmountVnd),
        startDate: form.startDate || undefined, endDate: form.endDate || undefined,
      })
      toast.success("Tạo thành công")
      setShowForm(false); setForm({ name: "", description: "", targetAmountVnd: "", startDate: "", endDate: "" }); fetchFunds()
    } catch (err) { setError(err instanceof Error ? err.message : "Lỗi tạo quỹ") }
    setSubmitting(false)
  }

  const inputCls = "w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1"

  const totalItems = tab === "funds" ? funds?.total ?? 0 : allocs?.total ?? 0
  const totalPages = tab === "funds" ? funds?.totalPages ?? 0 : Math.ceil((allocs?.total ?? 0) / PAGE_SIZE)

  const searchPlaceholder = tab === "funds" ? "Tìm quỹ học bổng..." : "Tìm người học, quỹ..."

  const filtered = tab === "funds"
    ? (funds?.items ?? []).filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()))
    : (allocs?.items ?? []).filter(a =>
        !search || a.learner?.fullName?.toLowerCase().includes(search.toLowerCase()) || a.fund?.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" /> Quản lý học bổng
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý quỹ học bổng và phân bổ cho người học có hoàn cảnh khó khăn.</p>
        </div>
        {tab === "funds" && (
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Tạo quỹ
          </Button>
        )}
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {([{ value: "funds" as TabKey, label: "Quỹ học bổng" }, { value: "allocations" as TabKey, label: "Phân bổ" }]).map((t) => (
            <button key={t.value} onClick={() => { setTab(t.value); setPage(1); setSearch("") }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${tab === t.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring bg-card" />
        </div>
        <div className="text-sm text-muted-foreground">{tab === "funds" ? `${funds?.total ?? 0} quỹ` : `${allocs?.total ?? 0} phân bổ`}</div>
      </div>

      {/* Create Fund Form */}
      {showForm && tab === "funds" && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-foreground">Tạo quỹ học bổng mới</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className={labelCls}>Tên quỹ *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
            <div className="col-span-2"><label className={labelCls}>Mô tả</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} rows={2} /></div>
            <div><label className={labelCls}>Mục tiêu (VND) *</label>
              <input type="number" value={form.targetAmountVnd} onChange={(e) => setForm({ ...form, targetAmountVnd: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Ngày bắt đầu</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Ngày kết thúc</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={handleCreateFund} disabled={submitting || !form.name || !form.targetAmountVnd}>
              {submitting ? "Đang tạo..." : "Tạo"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : tab === "funds" ? (
        <FundsContent items={filtered as Fund[]} total={totalItems} page={page} totalPages={totalPages} onPageChange={setPage} />
      ) : (
        <AllocationsContent items={filtered as Alloc[]} total={totalItems} page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}