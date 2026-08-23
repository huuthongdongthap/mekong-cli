// packages/web/src/components/pricing/vat-section.tsx
//
// VAT classification list + inline create form for the pricing settings page.
// Owns its own form state; the parent page stays under 200 lines.

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FormInput, FormSelect } from "@/components/dashboard/form-input"
import { pricingVAT, type LegalEntity, type VATClassification } from "@/lib/api/pricing"
import { Plus } from "lucide-react"

const ENTITY_TYPE_LABELS: Record<string, string> = { EDCO: "Giáo dục", TECHCO: "Công nghệ" }

interface Props {
  vatClassifications: VATClassification[]
  entities: LegalEntity[]
  onRefresh: () => void
}

export function VatSection({ vatClassifications, entities, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    productCode: "", description: "", vatRate: "10", legalEntityId: "",
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!form.productCode || !form.legalEntityId) {
      toast.error("Điền mã sản phẩm và chọn pháp nhân"); return
    }
    setSaving(true)
    try {
      await pricingVAT.create({
        ...form, vatRate: parseInt(form.vatRate) || 0,
      })
      toast.success("Tạo phân loại VAT thành công")
      setShowForm(false)
      setForm({ productCode: "", description: "", vatRate: "10", legalEntityId: "" })
      onRefresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi tạo")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Phân loại VAT ({vatClassifications.length})</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Thêm
        </Button>
      </div>

      {showForm && (
        <div className="rounded-md border p-4 mb-3 space-y-3 bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Mã sản phẩm *" value={form.productCode}
              onChange={(e) => setForm({ ...form, productCode: e.target.value })} />
            <FormInput label="Mô tả *" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="VAT %" type="number" value={form.vatRate}
              onChange={(e) => setForm({ ...form, vatRate: e.target.value })} />
            <FormSelect label="Pháp nhân *" value={form.legalEntityId}
              onChange={(e) => setForm({ ...form, legalEntityId: e.target.value })}>
              <option value="">-- Chọn --</option>
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({ENTITY_TYPE_LABELS[e.type] || e.type})
                </option>
              ))}
            </FormSelect>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit} size="sm" disabled={saving}>Tạo</Button>
          </div>
        </div>
      )}

      {vatClassifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa có phân loại VAT nào.</p>
      ) : (
        <div className="space-y-2">
          {vatClassifications.map((vc) => (
            <div key={vc.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <div>
                <span className="font-mono font-medium">{vc.productCode}</span>
                <span className="text-muted-foreground ml-2">{vc.description}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{vc.legalEntityId.slice(0, 8)}</span>
                <span className="font-medium">{vc.vatRate}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}