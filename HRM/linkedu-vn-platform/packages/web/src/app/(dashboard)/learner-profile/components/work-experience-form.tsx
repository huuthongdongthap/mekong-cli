"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import type { WorkExperienceForm } from "../types"

const cls = "w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
const lbl = "block text-xs font-medium text-muted-foreground mb-1"

export function WorkExperienceForm({ submitting, onSubmit, onCancel }: { submitting: boolean; onSubmit: (data: WorkExperienceForm) => void; onCancel: () => void }) {
  const [form, setForm] = useState<WorkExperienceForm>({ company: "", position: "", startDate: "", endDate: "", description: "" })
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-sm text-foreground">Thêm kinh nghiệm mới</h4>
        <button onClick={onCancel} aria-label="Đóng form" className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>Công ty *</label><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={cls} /></div>
        <div><label className={lbl}>Vị trí *</label><input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className={cls} /></div>
        <div><label className={lbl}>Ngày bắt đầu *</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={cls} /></div>
        <div><label className={lbl}>Ngày kết thúc</label><input type="date" value={form.endDate ?? ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={cls} /></div>
        <div className="col-span-2"><label className={lbl}>Mô tả công việc</label><textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={cls} /></div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={() => onSubmit(form)} disabled={submitting || !form.company || !form.position || !form.startDate}>{submitting ? "Đang lưu..." : "Thêm"}</Button>
        <Button size="sm" variant="outline" onClick={onCancel}>Hủy</Button>
      </div>
    </div>
  )
}