// packages/web/src/components/pricing/entity-section.tsx
//
// Legal-entity list + inline create form for the pricing settings page.
// Owns its own form state so the parent page stays under 200 lines.

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FormInput, FormSelect } from "@/components/dashboard/form-input"
import { DetailField } from "@/components/dashboard/detail-field"
import { pricingEntities, type LegalEntity } from "@/lib/api/pricing"
import { Plus } from "lucide-react"

const ENTITY_TYPE_LABELS: Record<string, string> = { EDCO: "Giáo dục", TECHCO: "Công nghệ" }

interface Props {
  entities: LegalEntity[]
  onRefresh: () => void
}

export function EntitySection({ entities, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "", type: "EDCO" as "EDCO" | "TECHCO",
    taxCode: "", vatRate: "0", address: "", isDefault: false,
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (!form.name || !form.taxCode) {
      toast.error("Điền tên và mã số thuế"); return
    }
    setSaving(true)
    try {
      await pricingEntities.create({
        ...form, vatRate: parseInt(form.vatRate) || 0,
      })
      toast.success("Tạo pháp nhân thành công")
      setShowForm(false)
      setForm({ name: "", type: "EDCO", taxCode: "", vatRate: "0", address: "", isDefault: false })
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
        <h3 className="font-medium">Pháp nhân ({entities.length})</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Thêm
        </Button>
      </div>

      {showForm && (
        <div className="rounded-md border p-4 mb-3 space-y-3 bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Tên pháp nhân *" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormSelect label="Loại" value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "EDCO" | "TECHCO" })}>
              <option value="EDCO">Giáo dục (EDCO)</option>
              <option value="TECHCO">Công nghệ (TECHCO)</option>
            </FormSelect>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput label="MST *" value={form.taxCode}
              onChange={(e) => setForm({ ...form, taxCode: e.target.value })} />
            <FormInput label="VAT %" type="number" value={form.vatRate}
              onChange={(e) => setForm({ ...form, vatRate: e.target.value })} />
            <FormInput label="Địa chỉ" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
              Đặt làm mặc định
            </label>
            <Button onClick={handleSubmit} size="sm" disabled={saving}>Tạo</Button>
          </div>
        </div>
      )}

      {entities.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa có pháp nhân nào.</p>
      ) : (
        <div className="space-y-2">
          {entities.map((ent) => (
            <div key={ent.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm">{ent.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {ENTITY_TYPE_LABELS[ent.type] || ent.type}
                  </span>
                  {ent.isDefault && (
                    <span className="inline-flex rounded-full bg-[var(--status-green)] px-2 py-0.5 text-xs font-medium text-[var(--status-green-fg)] ml-2">
                      Mặc định
                    </span>
                  )}
                </div>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                <DetailField label="MST" labelWidth="w-12">{ent.taxCode}</DetailField>
                <DetailField label="VAT" labelWidth="w-8">{ent.vatRate}%</DetailField>
                <DetailField label="Địa chỉ" labelWidth="w-16">{ent.address}</DetailField>
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}