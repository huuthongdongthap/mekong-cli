"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { DetailField } from "@/components/dashboard/detail-field"
import { scholarshipAllocations, type ScholarshipAllocation } from "@/lib/api/scholarship"
import { STATUS_LABELS, STATUS_CLASSES, formatVnd } from "../../constants"
import { ArrowLeft } from "lucide-react"

const NEXT_STATUS: Record<string, { label: string; value: string }[]> = {
  pending: [
    { label: "Duyệt", value: "approved" },
    { label: "Từ chối", value: "rejected" },
  ],
  approved: [
    { label: "Giải ngân", value: "disbursed" },
    { label: "Hủy", value: "cancelled" },
  ],
}

export default function AllocationDetailPage({ params }: { params: { id: string } }) {
  const [alloc, setAlloc] = useState<ScholarshipAllocation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await scholarshipAllocations.list({ page: 1, limit: 1000 })
        const found = res.items.find((a) => a.id === params.id)
        setAlloc(found || null)
      } catch {}
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleUpdateStatus(status: string) {
    const label = STATUS_LABELS[status] || status
    if (!confirm(`Cập nhật trạng thái thành "${label}"?`)) return
    try {
      await scholarshipAllocations.updateStatus(params.id, status)
      toast.success("Cập nhật thành công")
      setAlloc((prev) => prev ? { ...prev, status } : prev)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi cập nhật")
    }
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!alloc) return <p className="text-muted-foreground">Không tìm thấy phân bổ.</p>

  const actions = NEXT_STATUS[alloc.status?.toLowerCase()] || []

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Link href="/scholarship" className="hover:text-foreground">Học bổng</Link>
            <span>/</span>
            {alloc.fund && <Link href={`/scholarship/funds/${alloc.fund.id}`} className="hover:text-foreground">{alloc.fund.name}</Link>}
            {alloc.fund && <span>/</span>}
            {alloc.pillar && <Link href={`/scholarship/pillars/${alloc.pillar.id}`} className="hover:text-foreground">{alloc.pillar.name}</Link>}
            {alloc.pillar && <span>/</span>}
            <span className="text-foreground">Phân bổ</span>
          </nav>
          <h2 className="text-2xl font-semibold">Phân bổ #{alloc.id.slice(0, 8)}</h2>
        </div>
        <Link href="/scholarship"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Link>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="font-medium mb-4">Chi tiết phân bổ</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <DetailField label="Người học" labelWidth="w-36">
            {alloc.learner?.fullName || alloc.learnerId}
          </DetailField>
          <DetailField label="Số tiền" labelWidth="w-36">
            <span className="font-semibold text-lg">{formatVnd(alloc.amountVnd)}</span>
          </DetailField>
          <DetailField label="Năm học" labelWidth="w-36">{alloc.academicYear || "—"}</DetailField>
          <DetailField label="Học kỳ" labelWidth="w-36">{alloc.semester || "—"}</DetailField>
          <DetailField label="Quỹ" labelWidth="w-36">
            {alloc.fund ? (
              <Link href={`/scholarship/funds/${alloc.fund.id}`} className="text-primary hover:underline">{alloc.fund.name}</Link>
            ) : "—"}
          </DetailField>
          <DetailField label="Trụ cột" labelWidth="w-36">
            {alloc.pillar ? (
              <Link href={`/scholarship/pillars/${alloc.pillar.id}`} className="text-primary hover:underline">{alloc.pillar.name}</Link>
            ) : "—"}
          </DetailField>
          <DetailField label="Trạng thái" labelWidth="w-36">
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[alloc.status?.toLowerCase()] || ""}`}>
              {STATUS_LABELS[alloc.status?.toLowerCase()] || alloc.status}
            </span>
          </DetailField>
          <DetailField label="Ngày tạo" labelWidth="w-36">
            {alloc.createdAt ? new Date(alloc.createdAt).toLocaleDateString("vi-VN") : "—"}
          </DetailField>
        </dl>
        {alloc.notes && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">Ghi chú:</p>
            <p className="text-sm bg-muted p-3 rounded-md">{alloc.notes}</p>
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Cập nhật trạng thái</h3>
          <div className="flex gap-2">
            {actions.map((action) => (
              <button key={action.value} onClick={() => handleUpdateStatus(action.value)}
                className={`inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent
                  ${action.value === "rejected" ? "border-destructive/20 text-destructive hover:bg-destructive/10" : ""}`}>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
