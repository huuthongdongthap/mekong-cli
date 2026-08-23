"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { certificateSchema, type CertificateFormData } from "@/lib/validations"

export default function NewCertificatePage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      learnerId: "", programId: "", enterpriseId: "", enrollmentId: "",
      certificateNumber: "", issueDate: "", startDate: "", endDate: "",
      totalHours: "", position: "", department: "",
      supervisorName: "", supervisorTitle: "",
      evaluationScore: "", evaluationComment: "",
    },
  })

  async function onSubmit(data: CertificateFormData) {
    setError("")
    try {
      const payload: Record<string, unknown> = { ...data }
      if (!payload.totalHours) delete payload.totalHours
      if (!payload.evaluationScore) delete payload.evaluationScore
      if (!payload.department) delete payload.department
      if (!payload.supervisorTitle) delete payload.supervisorTitle
      if (!payload.evaluationComment) delete payload.evaluationComment
      const res = await api.post<{ data: { id: string } }>("/internship-certificates", payload)
      router.push(`/certificates/${res.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo chứng chỉ")
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Tạo chứng chỉ thực tập</h2>
        <Link href="/certificates" className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border p-6">
        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Thông tin liên kết</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Người học (ID) *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("learnerId")} />
              {errors.learnerId && <p className="text-sm text-destructive mt-1">{errors.learnerId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chương trình (ID) *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("programId")} />
              {errors.programId && <p className="text-sm text-destructive mt-1">{errors.programId.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Doanh nghiệp (ID) *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("enterpriseId")} />
              {errors.enterpriseId && <p className="text-sm text-destructive mt-1">{errors.enterpriseId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đăng ký (ID) *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("enrollmentId")} />
              {errors.enrollmentId && <p className="text-sm text-destructive mt-1">{errors.enrollmentId.message}</p>}
            </div>
          </div>
        </section>
        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Chi tiết chứng chỉ</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Số chứng chỉ</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("certificateNumber")} placeholder="CERT/2026/00001" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giờ thực tập</label>
              <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" {...register("totalHours")} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ngày cấp</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("issueDate")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày bắt đầu TT</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("startDate")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày kết thúc TT</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("endDate")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vị trí thực tập</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("position")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phòng ban</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("department")} />
            </div>
          </div>
        </section>
        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Giám sát & đánh giá</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Người giám sát</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("supervisorName")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chức vụ giám sát</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("supervisorTitle")} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Điểm đánh giá (0-100)</label>
            <input type="number" min="0" max="100" className="w-full rounded-md border px-3 py-2 text-sm" {...register("evaluationScore")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nhận xét</label>
            <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("evaluationComment")} rows={3} />
          </div>
        </section>
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/certificates" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang tạo..." : "Tạo chứng chỉ"}</Button>
        </div>
      </form>
    </div>
  )
}
