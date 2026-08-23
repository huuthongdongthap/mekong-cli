"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { moaSchema, type MoaFormData } from "@/lib/validations"

export default function EditMoaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<MoaFormData>({
    resolver: zodResolver(moaSchema),
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: Partial<MoaFormData> & { school?: { id?: string }; enterprise?: { id?: number | string } } }>(`/moas/${params.id}`)
        const m = res.data
        reset({
          title: m.title || "", scope: m.scope || "",
          content: m.content || "",
          schoolId: m.schoolId || m.school?.id || "",
          enterpriseId: m.enterpriseId || m.enterprise?.id?.toString() || "",
          signedDocUrl: m.signedDocUrl || "",
          validFrom: m.validFrom?.slice(0, 10) || "",
          validTo: m.validTo?.slice(0, 10) || "",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, reset])

  async function onSubmit(data: MoaFormData) {
    setError("")
    try {
      const payload: Record<string, unknown> = { title: data.title }
      if (data.scope) payload.scope = data.scope
      if (data.content) payload.content = data.content
      if (data.schoolId) payload.schoolId = data.schoolId
      if (data.enterpriseId) payload.enterpriseId = data.enterpriseId
      if (data.signedDocUrl) payload.signedDocUrl = data.signedDocUrl
      if (data.validFrom) payload.validFrom = data.validFrom
      if (data.validTo) payload.validTo = data.validTo
      await api.put(`/moas/${params.id}`, payload)
      router.push(`/moas/${params.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật")
    }
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Sửa MoU/MoA</h2>
        <Link href={`/moas/${params.id}`} className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border p-6">
        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Thông tin cơ bản</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phạm vi</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("scope")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nội dung</label>
            <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("content")} rows={4} />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Bên liên kết</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mã trường *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("schoolId")} />
              {errors.schoolId && <p className="text-sm text-destructive mt-1">{errors.schoolId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã doanh nghiệp *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("enterpriseId")} />
              {errors.enterpriseId && <p className="text-sm text-destructive mt-1">{errors.enterpriseId.message}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Thời hạn & tài liệu</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Từ ngày</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("validFrom")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đến ngày</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("validTo")} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Link văn bản ký</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("signedDocUrl")} placeholder="https://..." />
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <Link href={`/moas/${params.id}`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-muted/50">Hủy</Link>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}</Button>
        </div>
      </form>
    </div>
  )
}
