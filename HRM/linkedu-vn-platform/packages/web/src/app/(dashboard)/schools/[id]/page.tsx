"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
interface School {
 id: string
 code: string
 name: string
 schoolType: string
 status: string
 verificationStatus: string
 directorName: string | null
 phone: string | null
 email: string | null
 address: string | null
 website: string | null
 provinceCode: string | null
}

const typeLabel: Record<string, string> = {
 public: "Công lập",
 private: "Tư thục",
}

export default function SchoolDetailPage({ params }: { params: { id: string } }) {
 const router = useRouter()
 const [school, setSchool] = useState<School | null>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 const load = async () => {
 try {
const res = await api.get<{ data: School }>(`/schools/${params.id}?fields=id,code,name,schoolType,status,verificationStatus,directorName,phone,email,address,website,provinceCode,createdAt,updatedAt`)
 setSchool(res.data)
 } catch (err) { console.error("API error:", err) }
 setLoading(false)
 }
 load()
 }, [params.id])

 if (loading) return <p className="text-muted-foreground">Đang tải...</p>
 if (!school) return <p className="text-muted-foreground">Không tìm thấy trường.</p>

 return (
 <div>
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="text-2xl font-semibold">{school.name}</h2>
 <p className="text-sm text-muted-foreground">Mã: {school.code}</p>
 </div>
 <div className="flex gap-2">
 <Link
 href={`/schools/${params.id}/edit`}
 className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
 >
 Sửa
 </Link>
 <button
 onClick={() => {
 if (confirm("Xác nhận xóa trường này?")) {
 api.delete(`/schools/${params.id}`).then(() => router.push("/schools"))
 }
 }}
 className="inline-flex items-center justify-center rounded-md border border-destructive/20 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
 >
 Xóa
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="rounded-lg border p-4">
 <h3 className="font-medium mb-3">Thông tin cơ bản</h3>
 <dl className="space-y-2 text-sm">
 <div className="flex">
 <dt className="w-32 text-muted-foreground">Loại</dt>
 <dd>{typeLabel[school.schoolType] || school.schoolType}</dd>
 </div>
 <div className="flex">
 <dt className="w-32 text-muted-foreground">Trạng thái</dt>
 <dd>{school.status}</dd>
 </div>
 <div className="flex">
 <dt className="w-32 text-muted-foreground">Xác minh</dt>
 <dd>{school.verificationStatus}</dd>
 </div>
 </dl>
 </div>

 <div className="rounded-lg border p-4">
 <h3 className="font-medium mb-3">Liên hệ</h3>
 <dl className="space-y-2 text-sm">
 <div className="flex">
 <dt className="w-32 text-muted-foreground">Hiệu trưởng</dt>
 <dd>{school.directorName || "—"}</dd>
 </div>
 <div className="flex">
 <dt className="w-32 text-muted-foreground">Điện thoại</dt>
 <dd>{school.phone || "—"}</dd>
 </div>
 <div className="flex">
 <dt className="w-32 text-muted-foreground">Địa chỉ</dt>
 <dd>{school.address || "—"}</dd>
 </div>
 </dl>
 </div>
 </div>
 </div>
 )
}

