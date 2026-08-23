"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { enrollmentSchema, type EnrollmentFormData } from "@/lib/validations"

export default function NewEnrollmentPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { enrollmentType: "thuc_tap", status: "active" },
  })

  async function onSubmit(data: EnrollmentFormData) {
    setError("")
    try {
      const { completedAt, ...payload } = data as EnrollmentFormData & { completedAt?: string }
      const res = await api.post<{ data: { id: string } }>("/enrollments", completedAt ? { ...payload, completedAt } : payload)
      router.push(`/enrollments/${res.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo đăng ký")
    }
  }

  const typeLabel: Record<string, string> = {
    thuc_tap: "Thực tập", thuc_tap_chung: "Thực tập chung",
    viec_lam: "Việc làm", du_hoc: "Du học nghề",
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Thêm đăng ký</h2>
        <Link href="/enrollments" className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Người học (ID) *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("learnerId")} placeholder="UUID người học" />
            {errors.learnerId && <p className="text-sm text-destructive mt-1">{errors.learnerId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Chương trình (ID) *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("programId")} placeholder="UUID chương trình" />
            {errors.programId && <p className="text-sm text-destructive mt-1">{errors.programId.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại đăng ký</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("enrollmentType")}>
              {Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("status")}>
              <option value="active">Đang tham gia</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
              <option value="withdrawn">Đã rút lui</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ngày đăng ký</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="date" {...register("enrollmentDate")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("notes")} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/enrollments" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo đăng ký"}
          </Button>
        </div>
      </form>
    </div>
  )
}
