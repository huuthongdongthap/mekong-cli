"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { placementSchema, type PlacementFormData } from "@/lib/validations"

export default function NewPlacementPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PlacementFormData>({
    resolver: zodResolver(placementSchema),
    defaultValues: { employmentType: "full_time", status: "in_progress" },
  })

  async function onSubmit(data: PlacementFormData) {
    setError("")
    try {
      const { salaryMinVnd, salaryMaxVnd, startDate, positionOffered, ...rest } = data
      const payload = {
        ...rest,
        ...(salaryMinVnd ? { salaryMinVnd } : {}),
        ...(salaryMaxVnd ? { salaryMaxVnd } : {}),
        ...(startDate ? { startDate } : {}),
        ...(positionOffered ? { positionOffered } : {}),
      }
      const res = await api.post<{ data: { id: string } }>("/placements", payload)
      router.push(`/placements/${res.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo placement")
    }
  }

  const typeLabel: Record<string, string> = {
    full_time: "Full-time", part_time: "Part-time", internship: "Thực tập", contract: "Hợp đồng",
  }
  const statusLabel: Record<string, string> = {
    in_progress: "Đang diễn ra", completed: "Đã hoàn thành", terminated: "Đã kết thúc",
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Thêm kết quả việc làm</h2>
        <Link href="/placements" className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Người học (ID) *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("learnerId")} />
            {errors.learnerId && <p className="text-sm text-destructive mt-1">{errors.learnerId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Doanh nghiệp (ID) *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("enterpriseId")} />
            {errors.enterpriseId && <p className="text-sm text-destructive mt-1">{errors.enterpriseId.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vị trí ứng tuyển *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("positionApplied")} />
            {errors.positionApplied && <p className="text-sm text-destructive mt-1">{errors.positionApplied.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vị trí nhận</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("positionOffered")} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại hình</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("employmentType")}>
              {Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("status")}>
              {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lương Min (VND)</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="number" {...register("salaryMinVnd")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lương Max (VND)</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="number" {...register("salaryMaxVnd")} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
          <input className="w-full rounded-md border px-3 py-2 text-sm" type="date" {...register("startDate")} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/placements" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo placement"}
          </Button>
        </div>
      </form>
    </div>
  )
}
