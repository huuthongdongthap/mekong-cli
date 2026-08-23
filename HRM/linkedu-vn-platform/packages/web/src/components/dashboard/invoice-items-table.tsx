import { UseFieldArrayReturn, UseFormRegister } from "react-hook-form"
import { Button } from "@/components/ui/button"
import type { InvoiceFormData } from "@/lib/validations/invoice"
import { fmtVnd } from "./invoice-constants"

interface InvoiceItemsTableProps {
  fields: UseFieldArrayReturn<InvoiceFormData, "items", "id">["fields"]
  register: UseFormRegister<InvoiceFormData>
  items: Partial<{ description?: string; quantity?: string; unitPrice?: string; amount?: number }>[]
  onAppend: () => void
  onRemove: (idx: number) => void
}

export function InvoiceItemsTable({ fields, register, items, onAppend, onRemove }: InvoiceItemsTableProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-muted-foreground">Chi tiết hóa đơn</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAppend}>Thêm dòng</Button>
      </div>
      {fields.map((field, idx) => (
        <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
          <div className="col-span-5">
            <label className="block text-xs text-muted-foreground mb-1">Diễn giải</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register(`items.${idx}.description`)} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-muted-foreground mb-1">Số lượng</label>
            <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" {...register(`items.${idx}.quantity`)} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-muted-foreground mb-1">Đơn giá</label>
            <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" {...register(`items.${idx}.unitPrice`)} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-muted-foreground mb-1">Thành tiền</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm bg-muted/50" value={fmtVnd((parseInt(items?.[idx]?.quantity || "0") || 0) * (parseInt(items?.[idx]?.unitPrice || "0") || 0))} readOnly />
          </div>
          <div className="col-span-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(idx)} className="text-red-500">X</Button>
          </div>
        </div>
      ))}
    </section>
  )
}
