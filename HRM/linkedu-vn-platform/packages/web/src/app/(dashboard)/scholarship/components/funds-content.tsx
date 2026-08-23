"use client"
import Link from "next/link"
import { TrendingUp, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/app/(dashboard)/learner-profile/components/pagination"
import type { Fund, FundRes } from "../types"
import { STATUS_CLASSES, formatVnd } from "../constants"

export function FundsContent({ items, total, page, totalPages, onPageChange }: {
  items: Fund[]; total: number; page: number; totalPages: number; onPageChange: (p: number) => void
}) {
  if (items.length === 0) return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có quỹ học bổng nào.</p>
    </div>
  )

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/80">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tên quỹ</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mục tiêu</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thời gian</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((f) => (
            <tr key={f.id} className="hover:bg-primary/10 transition-colors">
              <td className="px-5 py-4">
                <Link href={`/scholarship/funds/${f.id}`} className="font-medium text-foreground hover:underline">{f.name}</Link>
                {f.description && <div className="text-xs text-muted-foreground mt-0.5 max-w-[300px] truncate">{f.description}</div>}
              </td>
              <td className="px-5 py-4 text-right">
                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />{formatVnd(f.targetAmountVnd)}
                </span>
              </td>
              <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {f.startDate ? new Date(f.startDate).toLocaleDateString("vi-VN") : "—"}
                  {f.endDate ? ` → ${new Date(f.endDate).toLocaleDateString("vi-VN")}` : ""}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  f.isActive ? "bg-[var(--status-emerald)] text-[var(--status-emerald-fg)] border border-[var(--status-emerald-border)]" : "bg-muted text-muted-foreground border border-border"
                }`}>
                  {f.isActive ? "Hoạt động" : "Không hoạt động"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/50">
          <p className="text-xs text-muted-foreground">Tổng {total} quỹ — Trang {page}/{totalPages}</p>
          <Pagination current={page} total={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  )
}