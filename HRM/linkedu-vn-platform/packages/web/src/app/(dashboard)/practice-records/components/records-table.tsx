"use client"
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarRating } from "./star-rating"
import type { PracticeRecord } from "../types"

export function RecordsTable({ items, page, totalPages, total, onPageChange }: {
  items: PracticeRecord[]; page: number; totalPages: number; total: number; onPageChange: (p: number) => void
}) {
  if (items.length === 0) return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có bản ghi thực tập nào.</p>
    </div>
  )

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/80">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Người học</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ngày</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Giờ</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Giám sát</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Đánh giá</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kỹ năng</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Doanh nghiệp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((r) => (
            <tr key={r.id} className="hover:bg-primary/10 transition-colors">
              <td className="px-5 py-4 font-medium text-foreground">{r.learner?.fullName ?? "—"}</td>
              <td className="px-5 py-4 text-muted-foreground text-xs whitespace-nowrap">
                {r.practiceDate ? new Date(r.practiceDate).toLocaleDateString("vi-VN") : "—"}
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]">
                  {r.hoursWorked}h
                </span>
              </td>
              <td className="px-5 py-4 text-muted-foreground">{r.supervisorName}</td>
              <td className="px-5 py-4"><StarRating rating={r.rating} /></td>
              <td className="px-5 py-4">
                {r.skillsDemonstrated?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {r.skillsDemonstrated.slice(0, 3).map((s, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--status-purple)] text-[var(--status-purple-fg)] border border-[var(--status-purple-border)]">
                        {s}
                      </span>
                    ))}
                    {r.skillsDemonstrated.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{r.skillsDemonstrated.length - 3}</span>
                    )}
                  </div>
                ) : <span className="text-muted-foreground">—</span>}
              </td>
              <td className="px-5 py-4 text-muted-foreground text-sm">{r.enterprise?.name ?? "—"}</td>
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