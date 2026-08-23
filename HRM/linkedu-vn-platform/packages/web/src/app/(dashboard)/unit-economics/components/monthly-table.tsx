"use client"
import { BarChart3 } from "lucide-react"
import type { DashboardMetrics } from "../types"
import { formatVnd, fmtRatio } from "../constants"

export function MonthlyTable({ metrics }: { metrics: DashboardMetrics }) {
  if (metrics.monthlyData.length === 0) return (
    <div className="p-12 text-center">
      <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có dữ liệu hàng tháng. Nhấn &quot;Tính toán&quot; để bắt đầu.</p>
    </div>
  )

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ngay</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">CAC</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">LTV</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ty le LTV/CAC</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Doanh thu</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">KH moi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {metrics.monthlyData.map((row) => (
            <tr key={row.date} className="hover:bg-primary/10 transition-colors">
              <td className="px-5 py-4 font-medium text-foreground">{new Date(row.date).toLocaleDateString("vi-VN")}</td>
              <td className="px-5 py-4 text-right text-destructive font-medium">{formatVnd(row.cac)}</td>
              <td className="px-5 py-4 text-right text-green-600 font-medium">{formatVnd(row.ltv)}</td>
              <td className="px-5 py-4 text-right font-semibold text-primary">{fmtRatio(row.ltvCacRatio)}</td>
              <td className="px-5 py-4 text-right font-medium text-foreground">{formatVnd(row.monthlyRevenue)}</td>
              <td className="px-5 py-4 text-right text-muted-foreground">{row.newCustomers.toLocaleString("vi-VN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-5 py-3 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">{metrics.monthlyData.length} ban ghi — {metrics.totalCustomers.toLocaleString("vi-VN")} khach hang</p>
      </div>
    </div>
  )
}