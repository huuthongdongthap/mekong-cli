"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { pricingPayments, type PaymentTransaction } from "@/lib/api/pricing"
import { GatewayForm } from "@/components/pricing/gateway-form"
import { STATUS_LABELS, STATUS_CLASSES, formatVnd } from "../constants"
import { PaginationBar } from "@/components/dashboard/pagination-bar"
import { CreditCard, ArrowLeft } from "lucide-react"

const PAGE_SIZE = 20

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const txRes = await api.get<{ data: PaymentTransaction[] }>("/pricing/payments").catch(() => ({ data: [] }))
      setTransactions(txRes.data)
    } catch {}
    setLoading(false)
  }, [])

  // Mount-only fetch; guard keeps setState out of the effect's sync path.
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; fetchData() }
  }, [fetchData])

  async function handleUpdateStatus(id: string, status: "SUCCESS" | "FAILED" | "REFUNDED") {
    try {
      await pricingPayments.updateStatus(id, status)
      toast.success("Cập nhật trạng thái thành công")
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi cập nhật")
    }
  }

  const totalTx = transactions.length
  const totalPages = Math.ceil(totalTx / PAGE_SIZE)
  const paged = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" /> Thanh toán
        </h1>
        <div className="flex gap-2">
          <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Link>
        </div>
      </div>

      <GatewayForm onCreated={fetchData} />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : (
        <>
          {/* Transactions */}
          <div className="rounded-lg border overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/50">
              <h3 className="font-medium text-sm">Giao dịch ({totalTx})</h3>
            </div>
            {totalTx === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Chưa có giao dịch.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Mã GD</th>
                    <th className="px-4 py-3 text-right font-medium">Số tiền</th>
                    <th className="px-4 py-3 text-left font-medium">Cổng</th>
                    <th className="px-4 py-3 text-center font-medium">Trạng thái</th>
                    <th className="px-4 py-3 text-center font-medium">HĐ</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((tx) => (
                    <tr key={tx.id} className="border-b last:border-b-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs">{tx.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatVnd(tx.amountVnd)}</td>
                      <td className="px-4 py-3">{tx.gatewayId.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[tx.status?.toLowerCase()] || ""}`}>
                          {STATUS_LABELS[tx.status?.toLowerCase()] || tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-1 justify-center">
                          {tx.status === "PENDING" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(tx.id, "SUCCESS")}>✓</Button>
                              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(tx.id, "FAILED")}>✗</Button>
                            </>
                          )}
                          {tx.status === "SUCCESS" && (
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(tx.id, "REFUNDED")}>Hoàn</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <PaginationBar page={page} totalPages={totalPages} totalItems={totalTx} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}