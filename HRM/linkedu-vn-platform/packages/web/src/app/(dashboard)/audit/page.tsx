"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { auditLogs, ACTION_LABELS, type AuditLog } from "@/lib/api/audit"
import { PaginationBar } from "@/components/dashboard/pagination-bar"
import { History, Search } from "lucide-react"

const PAGE_SIZE = 20

export default function AuditPage() {
  const [items, setItems] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const res = await auditLogs.list({ page, limit: PAGE_SIZE })
        if (!cancelled) { setItems(res.data.items); setTotal(res.data.total) }
      } catch {}
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [page])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const filtered = items.filter((item) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (item.action?.toLowerCase().includes(q) || item.entityType?.toLowerCase().includes(q) || item.entityId?.toLowerCase().includes(q))
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6 text-primary" /> Audit Log
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Tìm hành động, đối tượng..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/50 bg-card" />
        </div>
        <div className="text-sm text-muted-foreground">{total} bản ghi</div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">Chưa có bản ghi audit.</div>
      ) : (
        <>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Hành động</th>
                  <th className="px-4 py-3 text-left font-medium">Đối tượng</th>
                  <th className="px-4 py-3 text-left font-medium">Mã</th>
                  <th className="px-4 py-3 text-left font-medium">Người thực hiện</th>
                  <th className="px-4 py-3 text-left font-medium">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/audit/${row.id}`} className="text-primary hover:underline">{row.id}</Link>
                    </td>
                    <td className="px-4 py-3">{ACTION_LABELS[row.action] || row.action}</td>
                    <td className="px-4 py-3">{row.entityType}</td>
                    <td className="px-4 py-3 font-mono text-xs">{row.entityId?.slice(0, 8)}</td>
                    <td className="px-4 py-3">{row.userName || row.userId?.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString("vi-VN") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationBar page={page} totalPages={totalPages} totalItems={total} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
