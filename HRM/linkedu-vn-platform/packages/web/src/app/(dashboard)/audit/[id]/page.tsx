"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DetailField } from "@/components/dashboard/detail-field"
import { auditLogs, ACTION_LABELS, formatDiff, type AuditLog } from "@/lib/api/audit"
import { ArrowLeft } from "lucide-react"

const ENTITY_LABELS: Record<string, string> = {
  learner: "Người học", enterprise: "Doanh nghiệp", school: "Trường",
  placement: "Việc làm", enrollment: "Đăng ký", invoice: "Hóa đơn",
  document: "Tài liệu", scholarship_fund: "Quỹ học bổng", user: "Người dùng",
}

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  const [log, setLog] = useState<AuditLog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await auditLogs.get(Number(params.id))
        setLog(res.data)
      } catch {}
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!log) return <p className="text-muted-foreground">Không tìm thấy bản ghi audit.</p>

  const actionCls = (() => {
    const a = log.action?.toUpperCase()
    if (a === "CREATE" || a === "APPROVE") return "bg-[var(--status-green)] text-[var(--status-green-fg)]"
    if (a === "DELETE" || a === "REJECT") return "bg-destructive/10 text-destructive"
    if (a === "UPDATE") return "bg-[var(--status-blue)] text-[var(--status-blue-fg)]"
    return "bg-muted text-muted-foreground"
  })()

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Link href="/audit" className="hover:text-foreground">Audit log</Link>
            <span>/</span>
            <span className="text-foreground">#{log.id}</span>
          </nav>
          <h2 className="text-2xl font-semibold">Audit #{log.id}</h2>
        </div>
        <Link href="/audit"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Link>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="font-medium mb-4">Thông tin chung</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <DetailField label="Hành động" labelWidth="w-32">
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${actionCls}`}>
              {ACTION_LABELS[log.action] || log.action}
            </span>
          </DetailField>
          <DetailField label="Đối tượng" labelWidth="w-32">
            {ENTITY_LABELS[log.entityType] || log.entityType}
          </DetailField>
          <DetailField label="Mã đối tượng" labelWidth="w-32">
            <code className="text-xs">{log.entityId.slice(0, 12)}</code>
          </DetailField>
          <DetailField label="Người thực hiện" labelWidth="w-32">{log.userName || log.userId}</DetailField>
          <DetailField label="Thời gian" labelWidth="w-32">
            {log.createdAt ? new Date(log.createdAt).toLocaleString("vi-VN") : "—"}
          </DetailField>
          <DetailField label="IP" labelWidth="w-32"><code className="text-xs">{log.ipAddress || "—"}</code></DetailField>
        </dl>
      </div>

      {/* Change diff */}
      {(log.oldValues || log.newValues) && (
        <div className="rounded-lg border p-6">
          <h3 className="font-medium mb-3">Thay đổi</h3>
          <div className="space-y-2">
            {(() => {
              const old = (log.oldValues || {}) as Record<string, unknown>
              const newV = (log.newValues || {}) as Record<string, unknown>
              const allKeys = [...new Set([...Object.keys(old), ...Object.keys(newV)])]
              if (allKeys.length === 0) return <p className="text-sm text-muted-foreground">Không có dữ liệu thay đổi.</p>
              return allKeys.map((key) => (
                <div key={key} className="flex items-start gap-3 text-sm border-b border-border pb-2 last:border-b-0">
                  <span className="font-medium min-w-[120px] text-muted-foreground">{key}</span>
                  <span className="flex-1">{formatDiff(old[key], newV[key])}</span>
                </div>
              ))
            })()}
          </div>
        </div>
      )}

      {/* User agent */}
      {log.userAgent && (
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2 text-sm">User Agent</h3>
          <p className="text-xs text-muted-foreground break-all">{log.userAgent}</p>
        </div>
      )}
    </div>
  )
}
