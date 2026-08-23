"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { learnerSchema, type LearnerFormData } from "@/lib/validations"

export default function EditLearnerPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LearnerFormData>({
    resolver: zodResolver(learnerSchema),
    defaultValues: { gender: "nam", status: "student" },
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: Partial<LearnerFormData> & { graduationYear?: string | number } }>(`/learners/${params.id}`)
        const l = res.data
        reset({
          fullName: l.fullName || "", dateOfBirth: l.dateOfBirth || "", gender: l.gender || "nam",
          phone: l.phone || "", email: l.email || "", schoolMajor: l.schoolMajor || "",
          graduationYear: l.graduationYear || "", status: l.status || "student",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, reset])

  async function onSubmit(data: LearnerFormData) {
    setError("")
    try {
      const payload = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== "" && v !== undefined)
      )
      await api.put(`/learners/${params.id}`, payload)
      window.location.assign(`/learners/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật")
    }
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Sửa người học</h2>
        <Link href={`/learners/${params.id}`} className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Họ và tên *</label>
          <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("fullName")} />
          {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="date" {...register("dateOfBirth")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giới tính</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("gender")}>
              <option value="nam">Nam</option>
              <option value="nu">Nữ</option>
              <option value="khac">Khác</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">SĐT</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Chuyên ngành</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("schoolMajor")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Năm tốt nghiệp</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="number" min="2000" max="2030" {...register("graduationYear")} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("status")}>
            <option value="student">Đang học</option>
            <option value="graduated">Đã tốt nghiệp</option>
            <option value="pending">Chờ xác nhận</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href={`/learners/${params.id}`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Hủy</Link>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  )
}
