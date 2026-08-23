"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { DetailField } from "@/components/dashboard/detail-field"
import { EMPLOYMENT_LABELS } from "../constants"

interface Placement {
  id: string
  learnerId: string
  enterpriseId: string
  positionApplied: string
  positionOffered: string
  employmentType: string
  salaryMinVnd: number | null
  salaryMaxVnd: number | null
  startDate: string
  tracking3mStatus: string
  tracking6mStatus: string
  isCurrentJob: boolean
  status: string
}

const STATUS_LABELS: Record<string, string> = {
  active: "Đang làm",
  completed: "Kết thúc",
  terminated: "Đã nghỉ",
}

const STATUS_CLS: Record<string, string> = {
  active: "bg-[var(--status-blue)] text-[var(--status-blue-fg)]",
  completed: "bg-[var(--status-green)] text-[var(--status-green-fg)]",
  terminated: "bg-[var(--status-red)] text-[var(--status-red-fg)]",
}

function fmtVnd(value: number | null): string {
  if (value == null) return "—"
  return new Intl.NumberFormat("vi-VN").format(value) + " VND"
}

export default function PlacementDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<Placement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: Placement }>(
          `/placements/${params.id}?fields=id,learnerId,enterpriseId,positionApplied,positionOffered,employmentType,salaryMinVnd,salaryMaxVnd,startDate,tracking3mStatus,tracking6mStatus,isCurrentJob,status`
        )
        setItem(res.data)
      } catch (err) { console.error("API error:", err) }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!item) return (
    <div>
      <p className="text-muted-foreground">Không tìm thấy placement.</p>
      <Link href="/placements" className="text-sm text-primary hover:underline mt-2 block">Quay lại</Link>
    </div>
  )

  const statusCls = STATUS_CLS[item.status] || ""

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Placement #{item.id.slice(0, 8)}</h2>
          <p className="text-sm text-muted-foreground">{EMPLOYMENT_LABELS[item.employmentType] || item.employmentType}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/placements/${params.id}/edit`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Sửa</Link>
          <button onClick={() => { if (confirm("Xác nhận xóa?")) api.delete(`/placements/${params.id}`).then(() => router.push("/placements")) }}
            className="inline-flex items-center justify-center rounded-md border border-destructive/20 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Xóa</button>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="font-medium mb-4">Chi tiết placement</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <DetailField label="Người học" labelWidth="w-40">
            <Link href={`/learners/${item.learnerId}`} className="text-primary hover:underline">{item.learnerId.slice(0, 8)}</Link>
          </DetailField>
          <DetailField label="Doanh nghiệp" labelWidth="w-40">
            <Link href={`/enterprises/${item.enterpriseId}`} className="text-primary hover:underline">{item.enterpriseId.slice(0, 8)}</Link>
          </DetailField>
          <DetailField label="Vị trí ứng tuyển" labelWidth="w-40">{item.positionApplied || "—"}</DetailField>
          <DetailField label="Vị trí được nhận" labelWidth="w-40">{item.positionOffered || "—"}</DetailField>
          <DetailField label="Loại hợp đồng" labelWidth="w-40">{EMPLOYMENT_LABELS[item.employmentType] || item.employmentType}</DetailField>
          <DetailField label="Mức lương" labelWidth="w-40">
            {item.salaryMinVnd != null || item.salaryMaxVnd != null
              ? `${fmtVnd(item.salaryMinVnd)}${item.salaryMinVnd != null && item.salaryMaxVnd != null ? " – " : ""}${fmtVnd(item.salaryMaxVnd)}`
              : "—"}
          </DetailField>
          <DetailField label="Ngày bắt đầu" labelWidth="w-40">{item.startDate ? new Date(item.startDate).toLocaleDateString("vi-VN") : "—"}</DetailField>
          <DetailField label="Theo dõi 3 tháng" labelWidth="w-40">{item.tracking3mStatus || "—"}</DetailField>
          <DetailField label="Theo dõi 6 tháng" labelWidth="w-40">{item.tracking6mStatus || "—"}</DetailField>
          <DetailField label="Công việc hiện tại" labelWidth="w-40">
            {item.isCurrentJob ? <span className="inline-flex rounded-full bg-[var(--status-green)] px-2 py-0.5 text-xs font-medium text-[var(--status-green-fg)]">Có</span> : "Không"}
          </DetailField>
          <DetailField label="Trạng thái" labelWidth="w-40">
            {statusCls ? <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusCls}`}>{STATUS_LABELS[item.status] || item.status}</span> : (STATUS_LABELS[item.status] || item.status)}
          </DetailField>
        </dl>
      </div>
    </div>
  )
}
