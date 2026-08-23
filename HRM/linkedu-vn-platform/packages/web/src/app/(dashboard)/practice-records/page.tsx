"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Plus, X, Briefcase, Search } from "lucide-react"
import { Pagination } from "@/app/(dashboard)/learner-profile/components/pagination"
import type { RecordResponse } from "./types"
import { RecordsTable } from "./components/records-table"

const PAGE_SIZE = 20

const inputCls = "w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
const labelCls = "block text-xs font-medium text-muted-foreground mb-1"

export default function PracticeRecordsPage() {
  const [data, setData] = useState<RecordResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState({
    enrollmentId: "", learnerId: "", enterpriseId: "", practiceDate: "",
    activities: "", hoursWorked: "", supervisorName: "",
    skillsDemonstrated: "", feedback: "", rating: "",
  })
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError(null)
      try {
        const res = await api.get<RecordResponse>(`/practice-records?page=${page}&limit=${PAGE_SIZE}`)
        if (!cancelled) setData(res)
      } catch (err) { if (!cancelled) setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu") }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [page, refreshKey])

  async function handleCreate() {
    setSubmitting(true); setError(null)
    try {
      await api.post("/practice-records", {
        enrollmentId: form.enrollmentId, learnerId: form.learnerId,
        enterpriseId: Number(form.enterpriseId), practiceDate: form.practiceDate,
        activities: form.activities, hoursWorked: Number(form.hoursWorked),
        supervisorName: form.supervisorName,
        skillsDemonstrated: form.skillsDemonstrated.split(",").map((s) => s.trim()).filter(Boolean),
        feedback: form.feedback || undefined,
        rating: form.rating ? Number(form.rating) : undefined,
        createdById: form.learnerId,
      })
      toast.success("Tạo thành công")
      setShowForm(false)
      setForm({ enrollmentId: "", learnerId: "", enterpriseId: "", practiceDate: "", activities: "", hoursWorked: "", supervisorName: "", skillsDemonstrated: "", feedback: "", rating: "" })
      setRefreshKey((k) => k + 1)
    } catch (err) { setError(err instanceof Error ? err.message : "Lỗi tạo bản ghi") }
    setSubmitting(false)
  }

  const filtered = data?.items.filter(r =>
    !search || r.learner?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    r.supervisorName.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" /> Thực tập tại doanh nghiệp
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Theo dõi quá trình thực tập, kỹ năng, và đánh giá của người học tại doanh nghiệp.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)} className="gap-2"><Plus className="h-4 w-4" /> Tạo bản ghi</Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-foreground">Tạo bản ghi thực tập mới</h3>
            <button onClick={() => setShowForm(false)} aria-label="Đóng form" className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Mã ghi danh *</label><input value={form.enrollmentId} onChange={(e) => setForm({ ...form, enrollmentId: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Mã người học *</label><input value={form.learnerId} onChange={(e) => setForm({ ...form, learnerId: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Mã doanh nghiệp *</label><input type="number" value={form.enterpriseId} onChange={(e) => setForm({ ...form, enterpriseId: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Ngày thực tập *</label><input type="date" value={form.practiceDate} onChange={(e) => setForm({ ...form, practiceDate: e.target.value })} className={inputCls} /></div>
            <div className="col-span-2"><label className={labelCls}>Hoạt động *</label><textarea value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} className={inputCls} rows={2} /></div>
            <div><label className={labelCls}>Số giờ *</label><input type="number" step="0.5" value={form.hoursWorked} onChange={(e) => setForm({ ...form, hoursWorked: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Người giám sát *</label><input value={form.supervisorName} onChange={(e) => setForm({ ...form, supervisorName: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Kỹ năng (phẩy)</label><input value={form.skillsDemonstrated} onChange={(e) => setForm({ ...form, skillsDemonstrated: e.target.value })} placeholder="React, Node.js, SQL..." className={inputCls} /></div>
            <div><label className={labelCls}>Đánh giá (1-5)</label><input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className={inputCls} /></div>
            <div className="col-span-2"><label className={labelCls}>Phản hồi</label><textarea value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} className={inputCls} rows={2} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={submitting || !form.enrollmentId || !form.learnerId || !form.practiceDate}>
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
          <input type="text" placeholder="Tìm kiếm người học, giám sát..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Tìm kiếm thực tập" className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring bg-card" />
        </div>
        <div className="text-sm text-muted-foreground">{data?.total ?? 0} bản ghi</div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : (
        <RecordsTable items={filtered} page={page} totalPages={data?.totalPages ?? 0} total={data?.total ?? 0} onPageChange={setPage} />
      )}
    </div>
  )
}