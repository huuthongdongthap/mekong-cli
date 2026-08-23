// packages/web/src/components/pricing/gateway-form.tsx
//
// Inline "add payment gateway" form extracted from the payments page so the
// page stays under the 200-line cap.

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { pricingGateways } from "@/lib/api/pricing"
import { Plus } from "lucide-react"

const GATEWAY_TYPE_LABELS: Record<string, string> = {
  MOMO: "MoMo", VNPAY: "VNPay", ZALOPAY: "ZaloPay",
  STRIPE: "Stripe", BANK_TRANSFER: "Chuyển khoản",
}

interface Props {
  onCreated: () => void
}

export function GatewayForm({ onCreated }: Props) {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: "", type: "MOMO", isTestMode: true })
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!form.name.trim()) { toast.error("Nhập tên cổng thanh toán"); return }
    setSaving(true)
    try {
      await pricingGateways.create({
        name: form.name, type: form.type, config: {}, isTestMode: form.isTestMode,
      })
      toast.success("Tạo cổng thanh toán thành công")
      setShow(false)
      setForm({ name: "", type: "MOMO", isTestMode: true })
      onCreated()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi tạo cổng")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-muted-foreground">Cổng thanh toán</h3>
        <Button onClick={() => setShow(!show)} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Thêm
        </Button>
      </div>

      {show && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Ví dụ: MoMo Gateway"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Loại</label>
              <select className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {Object.entries(GATEWAY_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isTestMode}
                  onChange={(e) => setForm({ ...form, isTestMode: e.target.checked })} />
                Chế độ test
              </label>
              <Button onClick={handleSubmit} size="sm" disabled={saving}>Tạo</Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}