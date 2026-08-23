"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { schoolSchema, type SchoolFormData } from "@/lib/validations"

export default function EditSchoolPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: { schoolType: "public", status: "active", verificationStatus: "pending" },
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: Partial<SchoolFormData> }>(`/schools/${params.id}?fields=id,code,name,schoolType,status,verificationStatus,directorName,phone,address,provinceCode`)
        const s = res.data
        reset({
          code: s.code || "", name: s.name || "",
          schoolType: s.schoolType || "public", status: s.status || "active",
          verificationStatus: s.verificationStatus || "pending",
          directorName: s.directorName || "", phone: s.phone || "",
          address: s.address || "", provinceCode: s.provinceCode || "",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, reset])

  async function onSubmit(data: SchoolFormData) {
    setError("")
    try {
      await api.put(`/schools/${params.id}`, data)
      router.push(`/schools/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-muted-foreground">Đang tải...</span>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Sửa trường đối tác</h2>
        <Link href={`/schools/${params.id}`} className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mã trường *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("code")} />
            {errors.code && <p className="text-sm text-destructive mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên trường *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("schoolType")}>
              <option value="public">Công lập</option>
              <option value="private">Tư thục</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("status")}>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
              <option value="pending">Chờ xác nhận</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Xác minh</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("verificationStatus")}>
              <option value="pending">Chờ xác minh</option>
              <option value="in_progress">Đang xác minh</option>
              <option value="verified">Đã xác minh</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hiệu trưởng</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("directorName")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Điện thoại</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("phone")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mã tỉnh</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("provinceCode")} placeholder="VD: HN, SG, DN" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Địa chỉ</label>
          <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("address")} rows={2} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href={`/schools/${params.id}`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  )
}
