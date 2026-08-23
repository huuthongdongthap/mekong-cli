"use client"
import { Building2 } from "lucide-react"
import type { PaymentTransaction } from "../types"
import { STATUS_CLASSES, STATUS_LABELS } from "../constants"

export function PaymentsContent({ items }: { items: PaymentTransaction[] }) {
  if (items.length === 0) return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có giao dịch thanh toán nào.</p>
    </div>
  )

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/80">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mã giao dịch</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Số tiền</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cổng thanh toán</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thời gian</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lịch thanh toán</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-accent/50 transition-colors">
              <td className="px-5 py-4">
                <span className="font-mono text-xs text-foreground">{p.id.slice(0, 8)}...</span>
              </td>
              <td className="px-5 py-4 text-right font-semibold text-foreground">{`${p.amountVnd.toLocaleString("vi-VN")} đ`}</td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--status-indigo)] text-[var(--status-indigo-fg)] border border-[var(--status-indigo-border)]">
                  {p.gatewayType}
                </span>
              </td>
              <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                {new Date(p.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </td>
              <td className="px-5 py-4 text-xs text-muted-foreground">
                {p.billingScheduleId ? <span className="font-mono">{p.billingScheduleId.slice(0, 8)}...</span> : "—"}
              </td>
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  STATUS_CLASSES[p.status] ?? "bg-muted text-foreground border border-border"
                }`}>
                  {STATUS_LABELS[p.status] ?? p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}