"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Plus, X, BarChart3, Search } from "lucide-react"
import type { EvalResponse } from "./types"
import { EvaluationsTable } from "./components/evaluations-table"

const PAGE_SIZE = 20

const inputCls = "w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
const labelCls = "block text-xs font-medium text-muted-foreground mb-1"

export default function EvaluationsPage() {
  const [data, setData] = useState<EvalResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState({
    enrollmentId: "", learnerId: "", evaluatorId: "",
    evaluationType: "mid_term", totalScore: "", maxScore: "", feedback: "",
  })

  async function fetchEvals(targetPage = page) {
    setLoading(true); setError(null)
    try { setData(await api.get<EvalResponse>(`/evaluations?page=${targetPage}&limit=${PAGE_SIZE}`)) }
    catch (err) { setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu") }
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError(null)
      try {
        const res = await api.get<EvalResponse>(`/evaluations?page=${page}&limit=${PAGE_SIZE}`)
        if (!cancelled) setData(res)
      } catch (err) { if (!cancelled) setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu") }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [page])

  async function handleCreate() {
    setSubmitting(true); setError(null)
    try {
      await api.post("/evaluations", {
        enrollmentId: form.enrollmentId, learnerId: form.learnerId,
        evaluatorId: form.evaluatorId, evaluationType: form.evaluationType,
        totalScore: form.totalScore ? Number(form.totalScore) : undefined,
        maxScore: form.maxScore ? Number(form.maxScore) : undefined,
        feedback: form.feedback || undefined,
      })
      toast.success("Tạo thành công")
      setShowForm(false)
      setForm({ enrollmentId: "", learnerId: "", evaluatorId: "", evaluationType: "mid_term", totalScore: "", maxScore: "", feedback: "" })
      fetchEvals()
    } catch (err) { setError(err instanceof Error ? err.message : "Lỗi tạo đánh giá") }
    setSubmitting(false)
  }

  const filtered = data?.items.filter(e =>
    !search ||
    e.learner?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    (e.evaluator ? `${e.evaluator.firstName} ${e.evaluator.lastName}`.toLowerCase().includes(search.toLowerCase()) : false)
  ) ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Đánh giá người học
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Theo dõi kết quả đánh giá và phát triển năng lực của từng người học.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo đánh giá
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-foreground">Tạo đánh giá mới</h3>
            <button onClick={() => setShowForm(false)} aria-label="Đóng form" className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Mã ghi danh *</label><input value={form.enrollmentId} onChange={(e) => setForm({ ...form, enrollmentId: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Mã người học *</label><input value={form.learnerId} onChange={(e) => setForm({ ...form, learnerId: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Mã đánh giá viên *</label><input value={form.evaluatorId} onChange={(e) => setForm({ ...form, evaluatorId: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Loại đánh giá *</label><select value={form.evaluationType} onChange={(e) => setForm({ ...form, evaluationType: e.target.value })} className={inputCls}>
              <option value="mid_term">Giữa kỳ</option>
              <option value="final">Cuối kỳ</option>
              <option value="supervisor">Giám sát</option>
              <option value="peer">Đồng nghiệp</option>
              <option value="self">Tự đánh giá</option>
            </select></div>
            <div><label className={labelCls}>Điểm</label><input type="number" value={form.totalScore} onChange={(e) => setForm({ ...form, totalScore: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Tổng số điểm</label><input type="number" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: e.target.value })} className={inputCls} /></div>
            <div className="col-span-2"><label className={labelCls}>Nhận xét</label><textarea value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} className={inputCls} rows={2} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={submitting || !form.enrollmentId || !form.learnerId || !form.evaluatorId}>
              {submitting ? "Đang tạo..." : "Tạo"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Tìm kiếm người học, đánh giá viên..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Tìm kiếm đánh giá" className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring bg-card" />
        </div>
        <div className="text-sm text-muted-foreground">{data?.total ?? 0} đánh giá</div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : (
        <EvaluationsTable items={filtered} page={page} totalPages={data?.totalPages ?? 0} total={data?.total ?? 0} onPageChange={setPage} />
      )}
    </div>
  )
}