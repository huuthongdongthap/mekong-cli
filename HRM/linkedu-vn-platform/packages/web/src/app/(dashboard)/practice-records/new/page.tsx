"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { practiceRecordSchema, type PracticeRecordFormData } from "@/lib/validations"

export default function NewPracticeRecordPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PracticeRecordFormData>({
    resolver: zodResolver(practiceRecordSchema),
  })

  async function onSubmit(data: PracticeRecordFormData) {
    setError("")
    try {
      const payload: Record<string, unknown> = {
        enrollmentId: data.enrollmentId, learnerId: data.learnerId,
        enterpriseId: parseInt(data.enterpriseId) || 0,
        practiceDate: data.practiceDate,
        activities: data.activities,
        hoursWorked: parseFloat(data.hoursWorked) || 0,
        supervisorName: data.supervisorName,
        createdById: data.learnerId,
      }
      if (data.skillsDemonstrated) {
        payload.skillsDemonstrated = data.skillsDemonstrated.split(",").map((s) => s.trim()).filter(Boolean)
      }
      if (data.feedback) payload.feedback = data.feedback
      if (data.rating) payload.rating = parseInt(data.rating) || undefined
      const res = await api.post<{ data: { id: string } }>("/practice-records", payload)
      router.push(`/practice-records/${res.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo bản ghi")
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Tạo bản ghi thực tập</h2>
        <Link href="/practice-records" className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border p-6">
        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Liên kết</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mã ghi danh *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("enrollmentId")} />
              {errors.enrollmentId && <p className="text-sm text-destructive mt-1">{errors.enrollmentId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã người học *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("learnerId")} />
              {errors.learnerId && <p className="text-sm text-destructive mt-1">{errors.learnerId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã doanh nghiệp *</label>
              <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" {...register("enterpriseId")} />
              {errors.enterpriseId && <p className="text-sm text-destructive mt-1">{errors.enterpriseId.message}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Thông tin thực tập</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ngày thực tập *</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("practiceDate")} />
              {errors.practiceDate && <p className="text-sm text-destructive mt-1">{errors.practiceDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số giờ *</label>
              <input type="number" step="0.5" className="w-full rounded-md border px-3 py-2 text-sm" {...register("hoursWorked")} />
              {errors.hoursWorked && <p className="text-sm text-destructive mt-1">{errors.hoursWorked.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Người giám sát *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("supervisorName")} />
              {errors.supervisorName && <p className="text-sm text-destructive mt-1">{errors.supervisorName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đánh giá (1-5)</label>
              <input type="number" min="1" max="5" className="w-full rounded-md border px-3 py-2 text-sm" {...register("rating")} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hoạt động *</label>
            <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("activities")} rows={3} />
            {errors.activities && <p className="text-sm text-destructive mt-1">{errors.activities.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kỹ năng (phẩy)</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("skillsDemonstrated")} placeholder="React, Node.js, SQL..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phản hồi</label>
            <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("feedback")} rows={2} />
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <Link href="/practice-records" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-muted/50">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang tạo..." : "Tạo bản ghi"}</Button>
        </div>
      </form>
    </div>
  )
}
