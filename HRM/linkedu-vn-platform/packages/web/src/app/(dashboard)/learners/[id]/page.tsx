"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { DetailField } from "@/components/dashboard/detail-field"

interface Learner {
  id: string
  fullName: string
  gender: string
  dateOfBirth: string | null
  phone: string | null
  email: string | null
  schoolMajor: string | null
  graduationYear: number | null
  status: string
}

const GENDER_LABELS: Record<string, string> = { nam: "Nam", nu: "Nữ", khac: "Khác" }

export default function LearnerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [learner, setLearner] = useState<Learner | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<{ data: Learner }>(
          `/learners/${params.id}?fields=id,fullName,gender,dateOfBirth,phone,email,schoolMajor,graduationYear,status`
        )
        setLearner(res.data)
      } catch (err) { console.error("API error:", err) }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!learner) return (
    <div>
      <p className="text-muted-foreground">Không tìm thấy người học.</p>
      <Link href="/learners" className="text-sm text-primary hover:underline mt-2 block">Quay lại danh sách</Link>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{learner.fullName}</h2>
          <p className="text-sm text-muted-foreground">Mã: {learner.id}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/learners/${params.id}/edit`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Sửa</Link>
          <button onClick={() => { if (confirm("Xác nhận xóa người học này?")) api.delete(`/learners/${params.id}`).then(() => router.push("/learners")) }}
            className="inline-flex items-center justify-center rounded-md border border-destructive/20 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Xóa</button>
        </div>
      </div>

      <div className="rounded-lg border p-6 mb-6">
        <h3 className="font-medium mb-4">Thông tin cá nhân</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <DetailField label="Họ tên"><span className="font-medium">{learner.fullName}</span></DetailField>
          <DetailField label="Giới tính">{GENDER_LABELS[learner.gender] || learner.gender || "—"}</DetailField>
          {learner.dateOfBirth && <DetailField label="Ngày sinh">{learner.dateOfBirth}</DetailField>}
          <DetailField label="Trạng thái">{learner.status}</DetailField>
          <DetailField label="Chuyên ngành">{learner.schoolMajor || "—"}</DetailField>
          <DetailField label="Năm tốt nghiệp">{learner.graduationYear || "—"}</DetailField>
          <DetailField label="Điện thoại">{learner.phone ? <a href={`tel:${learner.phone}`} className="text-primary hover:underline">{learner.phone}</a> : "—"}</DetailField>
          <DetailField label="Email">{learner.email ? <a href={`mailto:${learner.email}`} className="text-primary hover:underline">{learner.email}</a> : "—"}</DetailField>
        </dl>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Chương trình đã đăng ký</h3>
            <Link href="/enrollments" className="text-sm text-primary hover:underline">Xem tất cả</Link>
          </div>
          <p className="text-sm text-muted-foreground">Danh sách enrollments sẽ hiển thị tại đây khi có dữ liệu.</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Cơ hội việc làm</h3>
            <Link href="/placements" className="text-sm text-primary hover:underline">Xem tất cả</Link>
          </div>
          <p className="text-sm text-muted-foreground">Danh sách placements sẽ hiển thị tại đây khi có dữ liệu.</p>
        </div>
      </div>
    </div>
  )
}
