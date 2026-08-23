"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { DetailField } from "@/components/dashboard/detail-field"
import { scholarshipFunds, scholarshipPillars, type ScholarshipFund, type FundSummary, type ScholarshipPillar } from "@/lib/api/scholarship"
import { STATUS_LABELS, STATUS_CLASSES, formatVnd } from "../../constants"
import { ArrowLeft, Plus } from "lucide-react"

export default function FundDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [fund, setFund] = useState<ScholarshipFund | null>(null)
  const [summary, setSummary] = useState<FundSummary | null>(null)
  const [pillars, setPillars] = useState<ScholarshipPillar[]>([])
  const [loading, setLoading] = useState(true)
  const [showPillarForm, setShowPillarForm] = useState(false)
  const [pillarForm, setPillarForm] = useState({ name: "", description: "" })

  useEffect(() => {
    const load = async () => {
      try {
        const [fundRes, summaryRes, pillarsRes] = await Promise.all([
          scholarshipFunds.get(params.id),
          scholarshipFunds.summary(params.id).catch(() => null),
          scholarshipPillars.listByFund(params.id).catch(() => ({ data: [] })),
        ])
        setFund(fundRes.data)
        setSummary(summaryRes?.data || null)
        setPillars(pillarsRes.data)
      } catch {}
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleCreatePillar() {
    if (!pillarForm.name) { toast.error("Nhập tên trụ cột"); return }
    try {
      await scholarshipPillars.create(params.id, {
        name: pillarForm.name,
        description: pillarForm.description || undefined,
      })
      toast.success("Tạo trụ cột thành công")
      setShowPillarForm(false)
      setPillarForm({ name: "", description: "" })
      const res = await scholarshipPillars.listByFund(params.id)
      setPillars(res.data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi tạo")
    }
  }

  async function handleDelete() {
    if (!confirm("Xác nhận xóa quỹ học bổng này?")) return
    try {
      await scholarshipFunds.delete(params.id)
      toast.success("Đã xóa quỹ")
      router.push("/scholarship")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi xóa")
    }
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!fund) return <p className="text-muted-foreground">Không tìm thấy quỹ.</p>

  const inputCls = "w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Link href="/scholarship" className="hover:text-foreground">Học bổng</Link>
            <span>/</span>
            <span className="text-foreground">{fund.name}</span>
          </nav>
          <h2 className="text-2xl font-semibold">{fund.name}</h2>
        </div>
        <div className="flex gap-2">
          <Link href={`/scholarship/funds/${params.id}/edit`}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Sửa</Link>
          <button onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-md border border-destructive/20 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Xóa</button>
          <Link href="/scholarship" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">
            <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Thông tin quỹ</h3>
          <dl className="space-y-2 text-sm">
            <DetailField label="Mô tả" labelWidth="w-32">{fund.description || "—"}</DetailField>
            <DetailField label="Mục tiêu" labelWidth="w-32">{formatVnd(fund.targetAmountVnd)}</DetailField>
            <DetailField label="Ngày bắt đầu" labelWidth="w-32">{fund.startDate ? new Date(fund.startDate).toLocaleDateString("vi-VN") : "—"}</DetailField>
            <DetailField label="Ngày kết thúc" labelWidth="w-32">{fund.endDate ? new Date(fund.endDate).toLocaleDateString("vi-VN") : "—"}</DetailField>
            <DetailField label="Trạng thái" labelWidth="w-32">
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${fund.isActive ? STATUS_CLASSES.active : STATUS_CLASSES.cancelled}`}>
                {fund.isActive ? "Đang hoạt động" : "Đã tắt"}
              </span>
            </DetailField>
          </dl>
        </div>

        {summary && (
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-3">Tóm tắt phân bổ</h3>
            <dl className="space-y-2 text-sm">
              <DetailField label="Đã phân bổ" labelWidth="w-32">{formatVnd(summary.totalAllocatedVnd)}</DetailField>
              <DetailField label="Đã giải ngân" labelWidth="w-32">{formatVnd(summary.totalDisbursedVnd)}</DetailField>
              <DetailField label="Số phân bổ" labelWidth="w-32">{summary.allocationCount}</DetailField>
              <DetailField label="Số trụ cột" labelWidth="w-32">{summary.pillarCount}</DetailField>
              <DetailField label="Tiến độ" labelWidth="w-32">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min(100, (summary.totalAllocatedVnd / fund.targetAmountVnd) * 100)}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((summary.totalAllocatedVnd / fund.targetAmountVnd) * 100)}%
                  </span>
                </div>
              </DetailField>
            </dl>
          </div>
        )}
      </div>

      {/* Pillars */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Trụ cột ({pillars.length})</h3>
          <Button onClick={() => setShowPillarForm(!showPillarForm)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Thêm
          </Button>
        </div>

        {showPillarForm && (
          <div className="rounded-md border p-4 mb-3 space-y-3 bg-muted/30">
            <div>
              <label className={labelCls}>Tên trụ cột *</label>
              <input value={pillarForm.name} onChange={(e) => setPillarForm({ ...pillarForm, name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Mô tả</label>
              <textarea value={pillarForm.description} onChange={(e) => setPillarForm({ ...pillarForm, description: e.target.value })} className={inputCls} rows={2} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreatePillar}>Tạo</Button>
              <Button size="sm" variant="outline" onClick={() => setShowPillarForm(false)}>Hủy</Button>
            </div>
          </div>
        )}

        {pillars.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có trụ cột nào.</p>
        ) : (
          <div className="space-y-2">
            {pillars.map((p) => (
              <Link key={p.id} href={`/scholarship/pillars/${p.id}`}
                className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/30 transition-colors">
                <div>
                  <span className="font-medium text-sm">{p.name}</span>
                  {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                </div>
                <span className="text-xs text-muted-foreground">{p.allocations?.length ?? 0} phân bổ</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
