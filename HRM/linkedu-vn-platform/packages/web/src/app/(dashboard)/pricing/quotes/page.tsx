"use client"

import { useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { pricingTiers, pricingQuotes, type PricingTier, type QuoteResult } from "@/lib/api/pricing"
import { SEGMENT_LABELS, formatVnd } from "../constants"
import { useEffect } from "react"
import { Calculator, ArrowLeft } from "lucide-react"

export default function QuoteCalculatorPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<QuoteResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    entityId: "", entityType: "enterprise",
    tierId: "", volume: "", contractMonths: "", promoCode: "",
  })

  useEffect(() => {
    api.get<{ data: PricingTier[] }>("/pricing/tiers").then((res) => setTiers(res.data)).catch(() => {})
  }, [])

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleCalculate() {
    if (!form.tierId) { setError("Chọn gói dịch vụ"); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await pricingQuotes.calculate({
        entityId: form.entityId || "demo",
        entityType: form.entityType,
        tierId: form.tierId,
        volume: form.volume ? parseInt(form.volume) : undefined,
        contractMonths: form.contractMonths ? parseInt(form.contractMonths) : undefined,
        promoCode: form.promoCode || undefined,
      })
      setResult(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tính giá")
    }
    setLoading(false)
  }

  async function handleCreateQuote() {
    if (!result) return
    setLoading(true); setError(null)
    try {
      await pricingQuotes.create({
        entityId: form.entityId || "demo",
        entityType: form.entityType,
        tierId: form.tierId,
        volume: form.volume ? parseInt(form.volume) : undefined,
        contractMonths: form.contractMonths ? parseInt(form.contractMonths) : undefined,
        promoCode: form.promoCode || undefined,
      })
      setResult(null)
      setForm({ entityId: "", entityType: "enterprise", tierId: "", volume: "", contractMonths: "", promoCode: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo báo giá")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" /> Tính giá
        </h1>
        <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Link>
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <div className="rounded-lg border p-6 space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground">Thông tin báo giá</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại thực thể</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.entityType} onChange={(e) => updateField("entityType", e.target.value)}>
              {Object.entries(SEGMENT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mã thực thể</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="ID thực thể"
              value={form.entityId} onChange={(e) => updateField("entityId", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Gói dịch vụ *</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.tierId} onChange={(e) => updateField("tierId", e.target.value)}>
              <option value="">-- Chọn gói --</option>
              {tiers.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({SEGMENT_LABELS[t.segment] || t.segment}) — {formatVnd(t.basePriceVnd)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số lượng</label>
            <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Volume"
              value={form.volume} onChange={(e) => updateField("volume", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Thời hạn hợp đồng (tháng)</label>
            <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Số tháng"
              value={form.contractMonths} onChange={(e) => updateField("contractMonths", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mã khuyến mãi</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="PROMO_CODE"
              value={form.promoCode} onChange={(e) => updateField("promoCode", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={handleCalculate} disabled={loading}>
            {loading ? "Đang tính..." : "Tính giá"}
          </Button>
        </div>
      </div>

      {result && (
        <div className="rounded-lg border p-6 space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Kết quả</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Gói:</dt>
              <dd className="font-medium">{result.tierName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Giá gốc:</dt>
              <dd>{formatVnd(result.basePriceVnd)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Giá sau giảm:</dt>
              <dd className="text-lg font-bold text-primary">{formatVnd(result.finalPriceVnd)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tiết kiệm:</dt>
              <dd className="text-green-600">{formatVnd(result.basePriceVnd - result.finalPriceVnd)}</dd>
            </div>
          </dl>
          {Object.keys(result.appliedRules).length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Quy tắc áp dụng:</p>
              <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(result.appliedRules, null, 2)}</pre>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={handleCreateQuote} disabled={loading} variant="outline">
              Tạo báo giá chính thức
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
