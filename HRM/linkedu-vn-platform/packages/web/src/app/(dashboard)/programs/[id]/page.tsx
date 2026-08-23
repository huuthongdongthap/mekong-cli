"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"

interface Program {
  id: string
  code: string
  name: string
  programType: string
  field: string
  durationMonths: number | null
  tuitionFee: number | null
  maxLearners: number | null
  status: string
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

interface Enrollment {
  id: string
  learnerId: string
  enrollmentType: string
  enrolledAt: string
  status: string
}

export default function ProgramDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [program, setProgram] = useState<Program | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const [p, e] = await Promise.all([
          api.get<{ data: Program }>(`/programs/${params.id}?fields=id,code,name,programType,field,durationMonths,tuitionFee,maxLearners,status`),
          api.get<{ data: Enrollment[] }>(`/enrollments?programId=${params.id}&fields=id,learnerId,enrollmentType,enrolledAt,status`),
        ])
        setProgram(p.data)
        setEnrollments(e.data)
      } catch (err) { console.error("API error:", err) }
      setLoading(false)
    })()
  }, [params.id])

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!program)
    return (
      <div>
        <p className="text-muted-foreground">Không tìm thấy chương trình.</p>
        <Link href="/programs" className="text-sm text-primary hover:underline mt-2 block">Quay lại danh sách</Link>
      </div>
    )

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{program.name}</h2>
          <p className="text-sm text-muted-foreground">Mã: {program.code}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/programs/${params.id}/edit`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">Sửa</Link>
          <button onClick={() => confirm("Xác nhận xóa?") && api.delete(`/programs/${params.id}`).then(() => router.push("/programs"))} className="inline-flex items-center justify-center rounded-md border border-destructive/20 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Xóa</button>
        </div>
      </div>

      <div className="rounded-lg border p-6 mb-6">
        <h3 className="font-medium mb-4">Thông tin chương trình</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex"><dt className="w-36 text-muted-foreground">Loại</dt><dd>{typeLabel[program.programType] || program.programType}</dd></div>
          <div className="flex"><dt className="w-36 text-muted-foreground">Lĩnh vực</dt><dd>{program.field || "—"}</dd></div>
          <div className="flex"><dt className="w-36 text-muted-foreground">Thời gian</dt><dd>{program.durationMonths ? `${program.durationMonths} tháng` : "—"}</dd></div>
          <div className="flex"><dt className="w-36 text-muted-foreground">Học phí</dt><dd>{program.tuitionFee ? `${(program.tuitionFee / 1_000_000).toFixed(1)}tr VND` : "—"}</dd></div>
          <div className="flex"><dt className="w-36 text-muted-foreground">Sĩ số</dt><dd>{program.maxLearners || "—"}</dd></div>
          <div className="flex"><dt className="w-36 text-muted-foreground">Trạng thái</dt><dd>{program.status}</dd></div>
        </dl>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="font-medium mb-3">Người học đăng ký</h3>
        {enrollments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có người học đăng ký.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Người học</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Loại</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Trạng thái</th>
                  <th className="pb-2 font-medium text-muted-foreground">Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enr) => (
                  <tr key={enr.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">
                      <Link href={`/learners/${enr.learnerId}`} className="text-primary hover:underline">
                        {enr.learnerId.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="py-2 pr-4">{typeLabel[enr.enrollmentType] || enr.enrollmentType}</td>
                    <td className="py-2 pr-4">{statusLabel[enr.status] || enr.status}</td>
                    <td className="py-2">{fmtDate(enr.enrolledAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
