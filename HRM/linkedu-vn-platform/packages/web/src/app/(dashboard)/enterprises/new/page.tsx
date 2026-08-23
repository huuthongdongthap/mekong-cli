"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { enterpriseSchema, type EnterpriseFormData } from "@/lib/validations"

export default function NewEnterprisePage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EnterpriseFormData>({
    resolver: zodResolver(enterpriseSchema),
    defaultValues: { status: "pending" },
  })

  async function onSubmit(data: EnterpriseFormData) {
    setError("")
    try {
      const res = await api.post<{ data: { id: string } }>("/enterprises", data)
      router.push(`/enterprises/${res.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo doanh nghiệp")
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Thêm doanh nghiệp</h2>
        <Link href="/enterprises" className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-6">
        <h3 className="font-medium">Thông tin doanh nghiệp</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên doanh nghiệp *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mã số thuế</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("taxCode")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ngành</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("industry")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quy mô</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("companySize")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tỉnh/TP</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("provinceCode")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm" {...register("status")}>
              <option value="pending">Chờ duyệt</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Địa chỉ</label>
          <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("address")} rows={2} />
        </div>
        <h3 className="font-medium pt-2">Người đại diện</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên người đại diện</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("representativeName")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Chức vụ</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("representativePosition")} />
          </div>
        </div>
        <h3 className="font-medium pt-2">Thông tin liên hệ</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Liên hệ</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("contactName")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SĐT liên hệ</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("contactPhone")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email liên hệ</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" type="email" {...register("contactEmail")} />
            {errors.contactEmail && <p className="text-sm text-destructive mt-1">{errors.contactEmail.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("website")} />
            {errors.website && <p className="text-sm text-destructive mt-1">{errors.website.message}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/enterprises" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo doanh nghiệp"}
          </Button>
        </div>
      </form>
    </div>
  )
}
