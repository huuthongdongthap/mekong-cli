"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { enrollmentSchema, type EnrollmentFormData } from "@/lib/validations"

export default function EditEnrollmentPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { enrollmentType: "thuc_tap", status: "active" },
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: Partial<EnrollmentFormData> & { enrolledAt?: string } }>(`/enrollments/${params.id}`)
        const e = res.data
        reset({
          learnerId: e.learnerId || "", programId: e.programId || "",
          enrollmentType: e.enrollmentType || "thuc_tap", enrollmentDate: e.enrolledAt || "",
          status: e.status || "active",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, reset])

  async function onSubmit(data: EnrollmentFormData) {
    setError("")
    try {
      await api.put(`/enrollments/${params.id}`, { ...data })
      window.location.assign(`/enrollments/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật")
    }
  }

  const typeLabel: Record<string, string> = {
    thuc_tap: "Thực tập", thuc_tap_chung: "Thực tập chung",
    viec_lam: "Việc làm", du_hoc: "Du học nghề",
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Sửa đăng ký</h2>
        <Link href={`/enrollments/${params.id}`} className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Người học ID *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("learnerId")} />
            {errors.learnerId && <p className="text-sm text-destructive mt-1">{errors.learnerId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Chương trình ID *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("programId")} />
            {errors.programId && <p className="text-sm text-destructive mt-1">{errors.programId.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại</label>
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
          <Link href={`/enrollments/${params.id}`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  )
}
