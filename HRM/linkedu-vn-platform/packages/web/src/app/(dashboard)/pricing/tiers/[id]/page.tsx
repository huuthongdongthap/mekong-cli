"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { DetailField } from "@/components/dashboard/detail-field"
import { pricingTiers, pricingRules, type PricingTier, type PricingRule } from "@/lib/api/pricing"
import { SEGMENT_LABELS, CYCLE_LABELS, STATUS_LABELS, STATUS_CLASSES, formatVnd } from "../../constants"

const TIER_LEVEL_LABELS: Record<string, string> = {
  STARTER: "Starter", GROWTH: "Growth", ENTERPRISE: "Enterprise",
}

const RULE_TYPE_LABELS: Record<string, string> = {
  VOLUME_DISCOUNT: "Giảm theo số lượng",
  CONTRACT_TERM: "Giảm theo hợp đồng",
  PROMO: "Khuyến mãi",
  SEASONAL: "Theo mùa",
}

export default function TierDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tier, setTier] = useState<PricingTier | null>(null)
  const [rules, setRules] = useState<PricingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await pricingTiers.get(params.id)
        setTier(res.data)
        const rulesRes = await pricingRules.listByTier(params.id)
        setRules(rulesRes.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu")
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleDelete() {
    if (!confirm("Xác nhận xóa gói dịch vụ này?")) return
    try {
      await pricingTiers.delete(params.id)
      router.push("/pricing")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi xóa")
    }
  }

  async function handleToggleActive() {
    if (!tier) return
    try {
      await pricingTiers.update(tier.id, { isActive: !tier.isActive })
      setTier({ ...tier, isActive: !tier.isActive })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật")
    }
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (error && !tier) return <div className="text-destructive">{error}</div>
  if (!tier) return <p className="text-muted-foreground">Không tìm thấy gói dịch vụ.</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{tier.name}</h2>
          <p className="text-sm text-muted-foreground">
            {SEGMENT_LABELS[tier.segment] || tier.segment} — {TIER_LEVEL_LABELS[tier.tierLevel] || tier.tierLevel}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleToggleActive}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">
            {tier.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
          </button>
          <button onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-md border border-destructive/20 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
            Xóa
          </button>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">
            Quay lại
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Thông tin gói</h3>
          <dl className="space-y-2 text-sm">
            <DetailField label="Giá cơ bản" labelWidth="w-36">{formatVnd(tier.basePriceVnd)}</DetailField>
            <DetailField label="Phí thiết lập" labelWidth="w-36">{formatVnd(tier.setupFeeVnd)}</DetailField>
            <DetailField label="Trạng thái" labelWidth="w-36">
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[tier.isActive ? "active" : "cancelled"] || ""}`}>
                {tier.isActive ? "Đang hoạt động" : "Đã tắt"}
              </span>
            </DetailField>
            <DetailField label="Số đăng ký" labelWidth="w-36">{tier._count?.subscriptions ?? 0}</DetailField>
          </dl>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Tính năng</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(tier.features || {}).map(([key, val]) => (
              <span key={key} className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${val ? "bg-[var(--status-green)] text-[var(--status-green-fg)]" : "bg-muted text-muted-foreground"}`}>
                {key}: {val ? "✓" : "✗"}
              </span>
            ))}
            {Object.keys(tier.features || {}).length === 0 && (
              <p className="text-sm text-muted-foreground">Chưa có tính năng</p>
            )}
          </div>
          <h3 className="font-medium mt-4 mb-2">Giới hạn</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(tier.limits || {}).map(([key, val]) => (
              <span key={key} className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {key}: {val === -1 ? "Không giới hạn" : val}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Quy tắc giá ({rules.length})</h3>
        </div>
        {rules.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có quy tắc giá nào.</p>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <span className="text-sm font-medium">{RULE_TYPE_LABELS[rule.ruleType] || rule.ruleType}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Config: {JSON.stringify(rule.config)}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {rule.startDate && `Từ: ${new Date(rule.startDate).toLocaleDateString("vi-VN")}`}
                  {rule.endDate && ` — Đến: ${new Date(rule.endDate).toLocaleDateString("vi-VN")}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
