"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { moaSchema, type MoaFormData } from "@/lib/validations"
import { t } from "@/lib/i18n"

export default function NewMoaPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MoaFormData>({
    resolver: zodResolver(moaSchema),
    defaultValues: { title: "", scope: "", content: "", schoolId: "", enterpriseId: "", signedDocUrl: "", validFrom: "", validTo: "" },
  })

  async function onSubmit(data: MoaFormData) {
    setError("")
    try {
      const payload: Record<string, unknown> = {
        title: data.title,
        scope: data.scope || undefined,
        content: data.content || undefined,
        schoolId: data.schoolId,
        enterpriseId: data.enterpriseId,
        signedDocUrl: data.signedDocUrl || undefined,
        validFrom: data.validFrom || undefined,
        validTo: data.validTo || undefined,
      }
      const res = await api.post<{ data: { id: number } }>("/moas", payload)
      router.push(`/moas/${res.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Loi tao MoA")
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Tao MoU / MoA</h2>
        <Link href="/moas" className="text-sm text-muted-foreground hover:underline">Quay lại</Link>
      </div>
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border p-6">
        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Thong tin chinh</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Tieu de *</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pham vi</label>
            <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("scope")} rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Noi dung</label>
            <textarea className="w-full rounded-md border px-3 py-2 text-sm" {...register("content")} rows={5} />
          </div>
        </section>
        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Ben lien ket</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">School ID *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("schoolId")} />
              {errors.schoolId && <p className="text-sm text-destructive mt-1">{errors.schoolId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Enterprise ID *</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("enterpriseId")} />
              {errors.enterpriseId && <p className="text-sm text-destructive mt-1">{errors.enterpriseId.message}</p>}
            </div>
          </div>
        </section>
        <section className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">Thoi han</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tu ngay</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("validFrom")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Den ngay</label>
              <input type="date" className="w-full rounded-md border px-3 py-2 text-sm" {...register("validTo")} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL van ban da ky</label>
            <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("signedDocUrl")} />
          </div>
        </section>
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/moas" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Huy</Link>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? t('CREATING') : 'Tạo MoA'}</Button>
        </div>
      </form>
    </div>
  )
}
