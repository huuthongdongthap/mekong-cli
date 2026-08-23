"use client"
import { Users } from "lucide-react"
import type { CohortData } from "../types"
import { fmtPct } from "../constants"

export function CohortsTable({ items }: { items: CohortData[] }) {
  if (items.length === 0) return (
    <div className="p-12 text-center">
      <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có dữ liệu cohort.</p>
    </div>
  )

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cohort</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ban dau</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thang 1</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thang 3</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thang 6</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thang 12</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ty le giu chan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {items.map((c) => (
            <tr key={c.cohort} className="hover:bg-primary/10 transition-colors">
              <td className="px-5 py-4 font-medium text-foreground">{c.cohort}</td>
              <td className="px-5 py-4 text-right text-muted-foreground">{c.initial.toLocaleString("vi-VN")}</td>
              <td className="px-5 py-4 text-right text-muted-foreground">{c.month1.toLocaleString("vi-VN")}</td>
              <td className="px-5 py-4 text-right text-muted-foreground">{c.month3.toLocaleString("vi-VN")}</td>
              <td className="px-5 py-4 text-right text-muted-foreground">{c.month6.toLocaleString("vi-VN")}</td>
              <td className="px-5 py-4 text-right text-muted-foreground">{c.month12.toLocaleString("vi-VN")}</td>
              <td className="px-5 py-4 text-right">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  c.retentionRate >= 0.5
                    ? "bg-[var(--status-green)] text-[var(--status-green-fg)] border border-[var(--status-green-border)]"
                    : c.retentionRate >= 0.3
                      ? "bg-[var(--status-amber)] text-[var(--status-amber-fg)] border border-[var(--status-amber-border)]"
                      : "bg-[var(--status-red)] text-[var(--status-red-fg)] border border-[var(--status-red-border)]"
                }`}>
                  {fmtPct(c.retentionRate)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}