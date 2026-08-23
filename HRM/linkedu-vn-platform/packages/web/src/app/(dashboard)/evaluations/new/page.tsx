"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { evaluationSchema, type EvaluationFormData } from "@/lib/validations"

const TYPE_LABELS: Record<string, string> = {
  mid_term: "Giữa kỳ", final: "Cuối kỳ", supervisor: "Giám sát",
  peer: "Đồng nghiệp", self: "Tự đánh giá",
}

export default function NewEvaluationPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: { evaluationType: "mid_term" },
  })

  async function onSubmit(data: EvaluationFormData) {
    setError("")
    try {
      const payload: Record<string, unknown> = {
        enrollmentId: data.enrollmentId, learnerId: data.learnerId,
        evaluatorId: data.evaluatorId, evaluationType: data.evaluationType,
      }
      if (data.totalScore) payload.totalScore = parseInt(data.totalScore) || undefined
      if (data.maxScore) payload.maxScore = parseInt(data.maxScore) || undefined
      if (data.feedback) payload.feedback = data.feedback
      if (data.strengths) payload.strengths = data.strengths
      if (data.improvements) payload.improvements = data.improvements
      if (data.evaluatedAt) payload.evaluatedAt = data.evaluatedAt
      const res = await api.post<{ data: { id: string } }>("/evaluations", payload)
      router.push(`/evaluations/${res.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo đánh giá")
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Tạo đánh giá mới</h2>
        <Link href="/evaluations" className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
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
              <label className="block text-sm font-medium mb-1">Mã đánh giá viên *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("evaluatorId")} />
              {errors.evaluatorId && <p className="text-sm text-destructive mt-1">{errors.evaluatorId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Loại đánh giá *</label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("evaluationType")}>
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Điểm số</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Điểm</label>
              <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" {...register("totalScore")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tổng điểm</label>
              <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" {...register("maxScore")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày đánh giá</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("evaluatedAt")} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Nhận xét</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Nhận xét chung</label>
            <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("feedback")} rows={3} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Điểm mạnh</label>
              <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("strengths")} rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cần cải thiện</label>
              <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("improvements")} rows={3} />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <Link href="/evaluations" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-muted/50">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang tạo..." : "Tạo đánh giá"}</Button>
        </div>
      </form>
    </div>
  )
}
