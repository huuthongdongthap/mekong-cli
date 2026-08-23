"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"

interface Enrollment {
 id: string
 learnerId: string
 programId: string
 enrollmentType: string
 enrolledAt: string
 status: string
 completedAt: string | null
}

const typeLabel: Record<string, string> = {
 thuc_tap: "Thực tập",
 thuc_tap_chung: "Thực tập chung",
 viec_lam: "Việc làm",
 du_hoc: "Du học nghề",
}

const statusLabel: Record<string, string> = {
 active: "Đang tham gia",
 completed: "Đã hoàn thành",
 cancelled: "Đã hủy",
 withdrawn: "Đã rút lui",
}

export default function EnrollmentDetailPage({ params }: { params: { id: string } }) {
 const router = useRouter()
 const [item, setItem] = useState<Enrollment | null>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 const load = async () => {
 try {
 const res = await api.get<{ data: Enrollment }>(
 `/enrollments/${params.id}?fields=id,learnerId,programId,enrollmentType,enrolledAt,status,completedAt`
 )
 setItem(res.data)
 } catch (err) { console.error("API error:", err) }
 setLoading(false)
 }
 load()
 }, [params.id])

 if (loading) return <p className="text-muted-foreground">Đang tải...</p>
 if (!item)
 return (
 <div>
 <p className="text-muted-foreground">Không tìm thấy đăng ký.</p>
 <Link href="/enrollments" className="text-sm text-primary hover:underline mt-2 block">Quay lại</Link>
 </div>
 )

 return (
 <div>
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="text-2xl font-semibold">Đăng ký #{item.id.slice(0, 8)}</h2>
 <p className="text-sm text-muted-foreground">{typeLabel[item.enrollmentType] || item.enrollmentType}</p>
 </div>
 <div className="flex gap-2">
 <Link href={`/enrollments/${params.id}/edit`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Sửa</Link>
 <button onClick={() => { if (confirm("Xác nhận xóa?")) api.delete(`/enrollments/${params.id}`).then(() => router.push("/enrollments")) }} className="inline-flex items-center justify-center rounded-md border border-destructive/20 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Xóa</button>
 </div>
 </div>

 <div className="rounded-lg border p-6">
 <h3 className="font-medium mb-4">Chi tiết đăng ký</h3>
 <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
 <div className="flex"><dt className="w-36 text-muted-foreground">Loại</dt><dd>{typeLabel[item.enrollmentType] || item.enrollmentType}</dd></div>
 <div className="flex"><dt className="w-36 text-muted-foreground">Trạng thái</dt><dd>{statusLabel[item.status] || item.status}</dd></div>
 <div className="flex"><dt className="w-36 text-muted-foreground">Người học</dt>
 <dd><Link href={`/learners/${item.learnerId}`} className="text-primary hover:underline">{item.learnerId.slice(0, 8)}</Link></dd></div>
 <div className="flex"><dt className="w-36 text-muted-foreground">Chương trình</dt>
 <dd><Link href={`/programs/${item.programId}`} className="text-primary hover:underline">{item.programId.slice(0, 8)}</Link></dd></div>
 <div className="flex"><dt className="w-36 text-muted-foreground">Ngày đăng ký</dt><dd>{item.enrolledAt ? new Date(item.enrolledAt).toLocaleDateString("vi-VN") : "—"}</dd></div>
 <div className="flex"><dt className="w-36 text-muted-foreground">Ngày kết thúc</dt><dd>{item.completedAt ? new Date(item.completedAt).toLocaleDateString("vi-VN") : "—"}</dd></div>
 </dl>
 </div>
 </div>
 )
}
