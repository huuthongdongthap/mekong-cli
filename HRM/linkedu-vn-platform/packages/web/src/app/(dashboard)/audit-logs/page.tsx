"use client"
import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Filter, ChevronLeft, ChevronRight, Download, Search, History } from "lucide-react"
import type { AuditResponse } from "./types"
import { AuditLogsTable } from "./components/audit-logs-table"

const PAGE_SIZE = 20

export default function AuditLogsPage() {
  const [data, setData] = useState<AuditResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [action, setAction] = useState("")
  const [entityType, setEntityType] = useState("")
  const [search, setSearch] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError(null)
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
        if (action) params.set("action", action)
        if (entityType) params.set("entityType", entityType)
        const res = await api.get<AuditResponse>(`/audit-logs?${params}`)
        if (!cancelled) setData(res)
      } catch (err) { if (!cancelled) setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu") }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- search is intentionally excluded from refetch
  }, [page, action, entityType])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Nhật ký kiểm tra
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Theo dõi mọi thay đổi trong hệ thống để đảm bảo tính minh bạch.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm nhật ký..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Tìm kiếm nhật ký audit"
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary bg-card"
          />
        </div>
        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1) }}
          aria-label="Lọc theo hành động"
          className="px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">Tất cả hành động</option>
          <option value="CREATE">Tạo</option>
          <option value="UPDATE">Cập nhật</option>
          <option value="DELETE">Xóa</option>
          <option value="SIGN">Ký</option>
          <option value="APPROVE">Duyệt</option>
          <option value="REJECT">Từ chối</option>
          <option value="LOGIN">Đăng nhập</option>
          <option value="LOGOUT">Đăng xuất</option>
          <option value="EXPORT">Xuất</option>
        </select>
        <input
          type="text"
          placeholder="Loại đối tượng..."
          value={entityType}
          onChange={(e) => { setEntityType(e.target.value); setPage(1) }}
          aria-label="Lọc theo loại đối tượng"
          className="px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring/50 w-44"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : (
        <AuditLogsTable items={data?.items ?? []} page={page} totalPages={data?.totalPages ?? 0} total={data?.total ?? 0} onPageChange={setPage} />
      )}
    </div>
  )
}