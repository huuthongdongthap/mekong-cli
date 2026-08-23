"use client"
import { Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BillingSchedule } from "../types"
import { STATUS_CLASSES, STATUS_LABELS } from "../constants"

export function BillingContent({ items, payingId, onPay }: {
  items: BillingSchedule[]; payingId: string | null; onPay: (id: string) => void
}) {
  if (items.length === 0) return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <Receipt className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Không có lịch thanh toán chờ xử lý.</p>
    </div>
  )

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/80">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mã đăng ký</th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Số tiền</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hạn thanh toán</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hóa đơn</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái</th>
            <th className="px-5 py-3.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((b) => (
            <tr key={b.id} className="hover:bg-accent/50 transition-colors">
              <td className="px-5 py-4">
                <span className="font-mono text-xs text-foreground">{b.subscriptionId.slice(0, 8)}...</span>
              </td>
              <td className="px-5 py-4 text-right font-semibold text-foreground">{`${b.amountVnd.toLocaleString("vi-VN")} đ`}</td>
              <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                {new Date(b.dueDate).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-5 py-4 text-xs text-muted-foreground">
                {b.invoiceId ? <span className="font-mono">{b.invoiceId.slice(0, 8)}...</span> : "—"}
              </td>
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  STATUS_CLASSES[b.status] ?? "bg-muted text-foreground border border-border"
                }`}>
                  {STATUS_LABELS[b.status] ?? b.status}
                </span>
              </td>
              <td className="px-5 py-4 text-center">
                {b.status === "pending" && (
                  <Button size="sm" disabled={payingId === b.id} onClick={() => onPay(b.id)} className="h-7 px-3 text-xs">
                    {payingId === b.id ? (
                      <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Đang xử lý
                      </span>
                    ) : "Thanh toán"}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}