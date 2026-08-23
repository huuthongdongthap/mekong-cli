"use client"
import Link from "next/link"
import { Award } from "lucide-react"
import { Pagination } from "@/app/(dashboard)/learner-profile/components/pagination"
import type { Alloc } from "../types"
import { STATUS_CLASSES, STATUS_LABELS, formatVnd } from "../constants"

export function AllocationsContent({ items, total, page, totalPages, onPageChange }: {
  items: Alloc[]; total: number; page: number; totalPages: number; onPageChange: (p: number) => void
}) {
  if (items.length === 0) return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có phân bổ nào.</p>
    </div>
  )

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/80">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Người học</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quỹ</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Số tiền</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Học kỳ</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((a) => (
            <tr key={a.id} className="hover:bg-primary/10 transition-colors">
              <td className="px-5 py-4 font-medium text-foreground">
                <Link href={`/scholarship/allocations/${a.id}`} className="hover:underline">{a.learner?.fullName ?? "—"}</Link>
              </td>
              <td className="px-5 py-4 text-muted-foreground">{a.fund?.name ?? "—"}</td>
              <td className="px-5 py-4 text-right font-semibold text-foreground">{formatVnd(a.amountVnd)}</td>
              <td className="px-5 py-4 text-xs text-muted-foreground">
                {a.semester ?? "—"}{a.academicYear ? ` (${a.academicYear})` : ""}
              </td>
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_CLASSES[a.status] ?? "bg-muted text-muted-foreground border border-border"}`}>
                  {STATUS_LABELS[a.status] ?? a.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/50">
          <p className="text-xs text-muted-foreground">Tổng {total} phân bổ — Trang {page}/{totalPages}</p>
          <Pagination current={page} total={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  )
}