"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { DetailField } from "@/components/dashboard/detail-field"
import { scholarshipPillars, scholarshipAllocations, type ScholarshipPillar, type ScholarshipAllocation } from "@/lib/api/scholarship"
import { STATUS_LABELS, STATUS_CLASSES, formatVnd } from "../../constants"
import { ArrowLeft } from "lucide-react"

export default function PillarDetailPage({ params }: { params: { id: string } }) {
  const [pillar, setPillar] = useState<ScholarshipPillar | null>(null)
  const [allocations, setAllocations] = useState<ScholarshipAllocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [pillarRes, allocRes] = await Promise.all([
          scholarshipPillars.get(params.id),
          scholarshipAllocations.list({ pillarId: params.id }),
        ])
        setPillar(pillarRes.data)
        setAllocations(allocRes.items)
      } catch {}
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleUpdateStatus(allocId: string, status: string) {
    const label = STATUS_LABELS[status] || status
    if (!confirm(`Cập nhật trạng thái thành "${label}"?`)) return
    try {
      await scholarshipAllocations.updateStatus(allocId, status)
      toast.success("Cập nhật thành công")
      setAllocations((prev) => prev.map((a) => a.id === allocId ? { ...a, status } : a))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi cập nhật")
    }
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!pillar) return <p className="text-muted-foreground">Không tìm thấy trụ cột.</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Link href="/scholarship" className="hover:text-foreground">Học bổng</Link>
            <span>/</span>
            <Link href={`/scholarship/funds/${pillar.fundId}`} className="hover:text-foreground">Quỹ</Link>
            <span>/</span>
            <span className="text-foreground">{pillar.name}</span>
          </nav>
          <h2 className="text-2xl font-semibold">{pillar.name}</h2>
          {pillar.description && <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>}
        </div>
        <Link href={`/scholarship/funds/${pillar.fundId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Quay lại quỹ
        </Link>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="font-medium mb-3">Thông tin trụ cột</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <DetailField label="Quỹ" labelWidth="w-32">
            <Link href={`/scholarship/funds/${pillar.fundId}`} className="text-primary hover:underline">{pillar.fundId.slice(0, 8)}</Link>
          </DetailField>
          <DetailField label="Số phân bổ" labelWidth="w-32">{allocations.length}</DetailField>
        </dl>
        {pillar.allocationCriteria && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Tiêu chí phân bổ:</p>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">{JSON.stringify(pillar.allocationCriteria, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="rounded-lg border overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/50">
          <h3 className="font-medium text-sm">Phân bổ ({allocations.length})</h3>
        </div>
        {allocations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Chưa có phân bổ nào.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Người học</th>
                <th className="px-4 py-3 text-right font-medium">Số tiền</th>
                <th className="px-4 py-3 text-left font-medium">Năm học</th>
                <th className="px-4 py-3 text-center font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-center font-medium">HĐ</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a) => (
                <tr key={a.id} className="border-b last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/scholarship/allocations/${a.id}`} className="text-primary hover:underline">
                      {a.learner?.fullName || a.learnerId.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatVnd(a.amountVnd)}</td>
                  <td className="px-4 py-3">{a.academicYear || "—"}{a.semester ? ` / ${a.semester}` : ""}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[a.status?.toLowerCase()] || ""}`}>
                      {STATUS_LABELS[a.status?.toLowerCase()] || a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      {a.status?.toUpperCase() === "PENDING" && (
                        <>
                          <button onClick={() => handleUpdateStatus(a.id, "approved")}
                            className="text-xs text-[var(--status-blue)] hover:underline">Duyệt</button>
                          <button onClick={() => handleUpdateStatus(a.id, "rejected")}
                            className="text-xs text-destructive hover:underline">Từ chối</button>
                        </>
                      )}
                      {a.status?.toUpperCase() === "APPROVED" && (
                        <button onClick={() => handleUpdateStatus(a.id, "disbursed")}
                          className="text-xs text-[var(--status-emerald)] hover:underline">Giải ngân</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
