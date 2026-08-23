"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { certificateSchema, type CertificateFormData } from "@/lib/validations"

export default function EditCertificatePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: CertificateFormData & { issueDate?: string | null; startDate?: string | null; endDate?: string | null; totalHours?: number | string; evaluationScore?: number | string } }>(`/internship-certificates/${params.id}`)
        const c = res.data
        reset({
          learnerId: c.learnerId || "", programId: c.programId || "",
          enterpriseId: c.enterpriseId || "", enrollmentId: c.enrollmentId || "",
          certificateNumber: c.certificateNumber || "",
          issueDate: c.issueDate?.slice(0, 10) || "",
          startDate: c.startDate?.slice(0, 10) || "",
          endDate: c.endDate?.slice(0, 10) || "",
          totalHours: c.totalHours?.toString() || "",
          position: c.position || "", department: c.department || "",
          supervisorName: c.supervisorName || "",
          supervisorTitle: c.supervisorTitle || "",
          evaluationScore: c.evaluationScore?.toString() || "",
          evaluationComment: c.evaluationComment || "",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, reset])

  async function onSubmit(data: CertificateFormData) {
    setError("")
    try {
      const payload: Record<string, unknown> = {
        learnerId: data.learnerId, programId: data.programId,
        enterpriseId: data.enterpriseId, enrollmentId: data.enrollmentId,
      }
      if (data.certificateNumber) payload.certificateNumber = data.certificateNumber
      if (data.issueDate) payload.issueDate = data.issueDate
      if (data.startDate) payload.startDate = data.startDate
      if (data.endDate) payload.endDate = data.endDate
      if (data.totalHours) payload.totalHours = parseInt(data.totalHours) || undefined
      if (data.position) payload.position = data.position
      if (data.department) payload.department = data.department
      if (data.supervisorName) payload.supervisorName = data.supervisorName
      if (data.supervisorTitle) payload.supervisorTitle = data.supervisorTitle
      if (data.evaluationScore) payload.evaluationScore = parseInt(data.evaluationScore) || undefined
      if (data.evaluationComment) payload.evaluationComment = data.evaluationComment
      await api.put(`/internship-certificates/${params.id}`, payload)
      router.push(`/certificates/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật")
    }
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Sửa chứng chỉ</h2>
        <Link href={`/certificates/${params.id}`} className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border p-6">
        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Liên kết</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mã người học *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("learnerId")} />
              {errors.learnerId && <p className="text-sm text-destructive mt-1">{errors.learnerId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã chương trình *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("programId")} />
              {errors.programId && <p className="text-sm text-destructive mt-1">{errors.programId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã doanh nghiệp *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("enterpriseId")} />
              {errors.enterpriseId && <p className="text-sm text-destructive mt-1">{errors.enterpriseId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã đăng ký *</label>
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
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("certificateNumber")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày cấp</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("issueDate")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("startDate")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("endDate")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tổng giờ</label>
              <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" {...register("totalHours")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chức vụ</label>
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
              <label className="block text-sm font-medium mb-1">Tên giám sát</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("supervisorName")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chức danh giám sát</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("supervisorTitle")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Điểm đánh giá</label>
              <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" {...register("evaluationScore")} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nhận xét đánh giá</label>
            <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("evaluationComment")} rows={3} />
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <Link href={`/certificates/${params.id}`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-muted/50">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}</Button>
        </div>
      </form>
    </div>
  )
}
