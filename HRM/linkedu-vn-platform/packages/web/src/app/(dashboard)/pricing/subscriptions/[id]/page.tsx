"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { DetailField } from "@/components/dashboard/detail-field"
import { pricingSubscriptions, type Subscription } from "@/lib/api/pricing"
import { SEGMENT_LABELS, CYCLE_LABELS, STATUS_LABELS, STATUS_CLASSES, formatVnd } from "../../constants"

export default function SubscriptionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [sub, setSub] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: Subscription[] }>(
          `/pricing/subscriptions?entityId=${params.id}&entityType=enterprise`
        )
        setSub(res.data?.[0] || null)
      } catch {}
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleCancel(atPeriodEnd: boolean) {
    if (!sub) return
    const msg = atPeriodEnd
      ? "Hủy đăng ký sau khi hết hạn kỳ hiện tại?"
      : "Hủy đăng ký ngay lập tức?"
    if (!confirm(msg)) return
    setCancelling(true)
    try {
      await pricingSubscriptions.cancel(sub.id, atPeriodEnd)
      setSub({ ...sub, cancelAtPeriodEnd: atPeriodEnd, status: atPeriodEnd ? "ACTIVE" : "CANCELLED" })
    } catch {}
    setCancelling(false)
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!sub) return <p className="text-muted-foreground">Không tìm thấy đăng ký.</p>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Đăng ký #{sub.id.slice(0, 8)}</h2>
          <p className="text-sm text-muted-foreground">
            {SEGMENT_LABELS[sub.entityType] || sub.entityType} — {sub.tier?.name || sub.tierId}
          </p>
        </div>
        <div className="flex gap-2">
          {sub.status !== "CANCELLED" && (
            <>
              <button onClick={() => handleCancel(true)} disabled={cancelling}
                className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">
                Hủy cuối kỳ
              </button>
              <button onClick={() => handleCancel(false)} disabled={cancelling}
                className="inline-flex items-center justify-center rounded-md border border-destructive/20 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
                Hủy ngay
              </button>
            </>
          )}
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">
            Quay lại
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Thông tin đăng ký</h3>
          <dl className="space-y-2 text-sm">
            <DetailField label="Trạng thái" labelWidth="w-36">
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[sub.status?.toLowerCase()] || ""}`}>
                {STATUS_LABELS[sub.status?.toLowerCase()] || sub.status}
              </span>
            </DetailField>
            <DetailField label="Chu kỳ thanh toán" labelWidth="w-36">{CYCLE_LABELS[sub.billingCycle?.toLowerCase()] || sub.billingCycle}</DetailField>
            <DetailField label="Kỳ bắt đầu" labelWidth="w-36">
              {sub.currentPeriodStart ? new Date(sub.currentPeriodStart).toLocaleDateString("vi-VN") : "—"}
            </DetailField>
            <DetailField label="Kỳ kết thúc" labelWidth="w-36">
              {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString("vi-VN") : "—"}
            </DetailField>
            <DetailField label="Hủy cuối kỳ" labelWidth="w-36">{sub.cancelAtPeriodEnd ? "Có" : "Không"}</DetailField>
          </dl>
        </div>

        {sub.tier && (
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-3">Gói dịch vụ</h3>
            <dl className="space-y-2 text-sm">
              <DetailField label="Tên gói" labelWidth="w-36">{sub.tier.name}</DetailField>
              <DetailField label="Giá" labelWidth="w-36">{formatVnd(sub.tier.basePriceVnd)}</DetailField>
              <DetailField label="Phí thiết lập" labelWidth="w-36">{formatVnd(sub.tier.setupFeeVnd || 0)}</DetailField>
            </dl>
          </div>
        )}
      </div>

      {sub.billingSchedules && sub.billingSchedules.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Lịch thanh toán ({sub.billingSchedules.length})</h3>
          <div className="space-y-2">
            {sub.billingSchedules.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                <div>
                  <span className="font-medium">{formatVnd(s.amountVnd)}</span>
                  <span className="text-muted-foreground ml-2">
                    — {new Date(s.scheduledAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[s.status?.toLowerCase()] || ""}`}>
                  {STATUS_LABELS[s.status?.toLowerCase()] || s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
