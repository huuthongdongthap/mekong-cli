"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { pricingBilling, type BillingSchedule } from "@/lib/api/pricing"
import { STATUS_LABELS, STATUS_CLASSES, formatVnd } from "../constants"
import { PaginationBar } from "@/components/dashboard/pagination-bar"
import { Receipt, ArrowLeft } from "lucide-react"

const PAGE_SIZE = 20

export default function BillingPage() {
  const [items, setItems] = useState<BillingSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [payingId, setPayingId] = useState<string | null>(null)

  const fetchBilling = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<{ data: BillingSchedule[] }>("/pricing/billing/pending")
      setItems(res.data)
    } catch {}
    setLoading(false)
  }, [])

  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; fetchBilling() }
  }, [fetchBilling])
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; void Promise.resolve().then(fetchBilling) }
  }, [fetchBilling])

  async function handlePay(scheduleId: string) {
    setPayingId(scheduleId)
    try {
      await pricingBilling.markPaid(scheduleId)
      toast.success("Đã đánh dấu thanh toán thành công")
      fetchBilling()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi xử lý")
    }
    setPayingId(null)
  }

  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / PAGE_SIZE)
  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Receipt className="h-6 w-6 text-primary" /> Lịch thanh toán
        </h1>
        <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">Không có lịch thanh toán chờ xử lý.</div>
      ) : (
        <>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Mã lịch</th>
                  <th className="px-4 py-3 text-left font-medium">Đăng ký</th>
                  <th className="px-4 py-3 text-right font-medium">Số tiền</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày đến hạn</th>
                  <th className="px-4 py-3 text-center font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-center font-medium">HĐ</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <tr key={row.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{row.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">{row.subscriptionId.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatVnd(row.amountVnd)}</td>
                    <td className="px-4 py-3">{new Date(row.scheduledAt).toLocaleDateString("vi-VN")}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[row.status?.toLowerCase()] || ""}`}>
                        {STATUS_LABELS[row.status?.toLowerCase()] || row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button size="sm" variant="outline" disabled={payingId === row.id || row.status === "PAID"}
                        onClick={() => handlePay(row.id)}>
                        {payingId === row.id ? "..." : "TT"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationBar page={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
