"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { programSchema, type ProgramFormData } from "@/lib/validations"

export default function NewProgramPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: { programType: "thuc_tap", status: "draft" },
  })

  async function onSubmit(data: ProgramFormData) {
    setError("")
    try {
      const optional = ["durationMonths", "maxLearners", "startDate", "tuitionFee"] as const
      const payload = Object.fromEntries(
        Object.entries(data).filter(([k, v]) => !(optional.includes(k as typeof optional[number]) && !v))
      )
      const res = await api.post<{ data: { id: string } }>("/programs", payload)
      router.push(`/programs/${res.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo chương trình")
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Thêm chương trình đào tạo</h2>
        <Link href="/programs" className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mã chương trình *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("code")} />
            {errors.code && <p className="text-sm text-destructive mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên chương trình *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("programType")}>
              <option value="thuc_tap">Thực tập</option>
              <option value="thuc_tap_chung">Thực tập chung</option>
              <option value="viec_lam">Việc làm</option>
              <option value="du_hoc">Du học nghề</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lĩnh vực</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("field")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bậc đào tạo</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("qualificationLevel")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thời gian (tháng)</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="number" min="1" {...register("durationMonths")} />
            {errors.durationMonths && <p className="text-sm text-destructive mt-1">{errors.durationMonths.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="date" {...register("startDate")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("status")}>
              <option value="draft">Nháp</option>
              <option value="active">Đang hoạt động</option>
              <option value="completed">Đã kết thúc</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/programs" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo chương trình"}
          </Button>
        </div>
      </form>
    </div>
  )
}
