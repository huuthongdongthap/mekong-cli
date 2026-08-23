"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { placementSchema, type PlacementFormData } from "@/lib/validations"

export default function EditPlacementPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PlacementFormData>({
    resolver: zodResolver(placementSchema),
    defaultValues: { employmentType: "full_time", status: "in_progress" },
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: Partial<PlacementFormData> & { salaryMinVnd?: number | string | null; salaryMaxVnd?: number | string | null } }>(`/placements/${params.id}`)
        const p = res.data
        reset({
          learnerId: p.learnerId || "", enterpriseId: p.enterpriseId || "",
          positionApplied: p.positionApplied || "", positionOffered: p.positionOffered || "",
          employmentType: p.employmentType || "full_time",
          salaryMinVnd: p.salaryMinVnd != null ? String(p.salaryMinVnd) : "",
          salaryMaxVnd: p.salaryMaxVnd != null ? String(p.salaryMaxVnd) : "",
          startDate: p.startDate || "", status: p.status || "active",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, reset])

  async function onSubmit(data: PlacementFormData) {
    setError("")
    try {
      const { salaryMinVnd, salaryMaxVnd, startDate, positionOffered, ...rest } = data
      const payload = {
        ...rest,
        salaryMinVnd: salaryMinVnd ? Number(salaryMinVnd) : null,
        salaryMaxVnd: salaryMaxVnd ? Number(salaryMaxVnd) : null,
        ...(startDate ? { startDate } : {}),
        ...(positionOffered ? { positionOffered } : {}),
      }
      await api.put(`/placements/${params.id}`, payload)
      window.location.assign(`/placements/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật")
    }
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Sửa placement</h2>
        <Link href={`/placements/${params.id}`} className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
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
            <label className="block text-sm font-medium mb-1">Doanh nghiệp ID *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("enterpriseId")} />
            {errors.enterpriseId && <p className="text-sm text-destructive mt-1">{errors.enterpriseId.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vị trí ứng tuyển</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("positionApplied")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vị trí được nhận</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("positionOffered")} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại hợp đồng</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("employmentType")}>
              <option value="full_time">Toàn thời gian</option>
              <option value="part_time">Bán thời gian</option>
              <option value="internship">Thực tập</option>
              <option value="contract">Hợp đồng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("status")}>
              <option value="active">Đang làm</option>
              <option value="completed">Kết thúc</option>
              <option value="terminated">Đã nghỉ</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lương tối thiểu (VND)</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="number" {...register("salaryMinVnd")} placeholder="Để trống nếu không có" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lương tối đa (VND)</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="number" {...register("salaryMaxVnd")} placeholder="Để trống nếu không có" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="date" {...register("startDate")} />
          </div>
          <div />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href={`/placements/${params.id}`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  )
}
