"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { DetailField } from "@/components/dashboard/detail-field"

interface Enterprise {
  id: string
  name: string
  taxCode: string | null
  industry: string | null
  companySize: string | null
  status: string
  provinceCode: string | null
  address: string | null
  contactEmail: string | null
  contactPhone: string | null
  website: string | null
  representativeName: string | null
}

export default function EnterpriseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [ent, setEnt] = useState<Enterprise | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: Enterprise }>(
          `/enterprises/${params.id}?fields=id,name,taxCode,industry,companySize,status,provinceCode,address,contactEmail,contactPhone,website,representativeName`
        )
        setEnt(res.data)
      } catch (err) { console.error("API error:", err) }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!ent) return (
    <div>
      <p className="text-muted-foreground">Không tìm thấy doanh nghiệp.</p>
      <Link href="/enterprises" className="text-sm text-primary hover:underline mt-2 block">Quay lại danh sách</Link>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{ent.name}</h2>
          <p className="text-sm text-muted-foreground">Mã: {ent.id}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/enterprises/${params.id}/edit`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Sửa</Link>
          <button onClick={() => { if (confirm("Xác nhận xóa doanh nghiệp này?")) api.delete(`/enterprises/${params.id}`).then(() => router.push("/enterprises")) }}
            className="inline-flex items-center justify-center rounded-md border border-destructive/20 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Xóa</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Thông tin doanh nghiệp</h3>
          <dl className="space-y-2 text-sm">
            <DetailField label="Mã số thuế" labelWidth="w-32">{ent.taxCode || "—"}</DetailField>
            <DetailField label="Ngành" labelWidth="w-32">{ent.industry || "—"}</DetailField>
            <DetailField label="Quy mô" labelWidth="w-32">{ent.companySize || "—"}</DetailField>
            <DetailField label="Trạng thái" labelWidth="w-32">{ent.status}</DetailField>
          </dl>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Liên hệ</h3>
          <dl className="space-y-2 text-sm">
            <DetailField label="Tỉnh/TP" labelWidth="w-32">{ent.provinceCode || "—"}</DetailField>
            <DetailField label="Địa chỉ" labelWidth="w-32">{ent.address || "—"}</DetailField>
            <DetailField label="Người đại diện" labelWidth="w-32">{ent.representativeName || "—"}</DetailField>
            <DetailField label="Email" labelWidth="w-32">{ent.contactEmail || "—"}</DetailField>
            <DetailField label="SĐT" labelWidth="w-32">{ent.contactPhone || "—"}</DetailField>
            <DetailField label="Website" labelWidth="w-32">
              {ent.website ? <a href={ent.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{ent.website}</a> : "—"}
            </DetailField>
          </dl>
        </div>
      </div>
    </div>
  )
}
