"use client"
import { ChevronLeft, ChevronRight, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AuditLog } from "../types"
import { ACTION_CLS, ACTION_LABELS } from "../constants"

export function AuditLogsTable({ items, page, totalPages, total, onPageChange }: {
  items: AuditLog[]; page: number; totalPages: number; total: number; onPageChange: (p: number) => void
}) {
  if (items.length === 0) return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <History className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có nhật ký hoạt động.</p>
    </div>
  )

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/80">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thời gian</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Người thực hiện</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hành động</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Đối tượng</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chi tiết</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((log) => (
            <tr key={log.id} className="hover:bg-accent transition-colors">
              <td className="px-5 py-4 text-muted-foreground text-xs whitespace-nowrap">
                {new Date(log.createdAt).toLocaleString("vi-VN")}
              </td>
              <td className="px-5 py-4">
                <div className="font-medium text-foreground">
                  {log.actor ? `${log.actor.firstName} ${log.actor.lastName}` : "—"}
                </div>
                {log.actor && (
                  <div className="text-xs text-muted-foreground mt-0.5">{log.actor.email}</div>
                )}
              </td>
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ACTION_CLS[log.action] ?? "bg-muted text-muted-foreground"}`}>
                  {ACTION_LABELS[log.action] ?? log.action}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className="text-foreground">{log.entityType}</span>
              </td>
              <td className="px-5 py-4 text-muted-foreground text-xs max-w-[200px] truncate">
                {log.details || `${log.entityType} #${String(log.entityId).slice(0, 8)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/50">
          <p className="text-xs text-muted-foreground">Tổng {total} bản ghi — Trang {page}/{totalPages}</p>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              if (p > totalPages) return null
              return (
                <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => onPageChange(p)} className="h-8 w-8 p-0 text-xs">{p}</Button>
              )
            })}
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}