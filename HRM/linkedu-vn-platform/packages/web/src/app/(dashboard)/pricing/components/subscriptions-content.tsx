"use client"
import { CreditCard } from "lucide-react"
import type { Subscription } from "../types"
import { STATUS_CLASSES, STATUS_LABELS } from "../constants"

export function SubscriptionsContent({ items }: { items: Subscription[] }) {
  if (items.length === 0) return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <CreditCard className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có đăng ký nào.</p>
    </div>
  )

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/80">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thực thể</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Loại</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gói dịch vụ</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Giá</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ngày bắt đầu</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ngày kết thúc</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((sub) => (
            <tr key={sub.id} className="hover:bg-accent/50 transition-colors">
              <td className="px-5 py-4">
                <span className="font-mono text-xs text-foreground">{sub.entityId.slice(0, 8)}...</span>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                  {sub.entityType}
                </span>
              </td>
              <td className="px-5 py-4 font-medium text-foreground">{sub.tier?.name ?? "—"}</td>
              <td className="px-5 py-4 text-right font-semibold text-foreground">
                {sub.tier?.priceVnd != null ? `${sub.tier.priceVnd.toLocaleString("vi-VN")} đ` : "—"}
              </td>
              <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                {new Date(sub.startDate).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                {sub.endDate ? new Date(sub.endDate).toLocaleDateString("vi-VN") : "—"}
              </td>
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  STATUS_CLASSES[sub.status] ?? "bg-muted text-foreground border border-border"
                }`}>
                  {STATUS_LABELS[sub.status] ?? sub.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}