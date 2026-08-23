"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { DataTable } from "@/components/ui/data-table"

interface Enrollment {
  id: string
  enrollmentNo: string
  programName: string
  learnerName: string
  enrollmentType: string
  examScore: number | null
  practiceStart: string | null
  practiceEnd: string | null
  status: string
}

const TYPE_LABELS: Record<string, string> = {
  self_apply: "Tu ung tuyen",
  staff_created: "Nhan vien tao",
  enterprise_nominated: "Doanh nghiep de xuat",
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Partial<Enrollment>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ data: Enrollment[] }>(
      "/enrollments?limit=50&fields=id,enrollmentNo,programName,learnerName,enrollmentType,examScore,practiceStart,practiceEnd,status",
    )
      .then((r) => setEnrollments(r.data ?? []))
      .catch((err) => {
        console.error("API error:", err)
        setEnrollments([])
      })
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    {
      key: "enrollmentNo",
      label: "Ma",
      render: (row: Partial<Enrollment>) => (
        <Link href={`/enrollments/${row.id}`} className="underline">
          {row.enrollmentNo}
        </Link>
      ),
    },
    {
      key: "learnerName",
      label: "Nguoi hoc",
      render: (row: Partial<Enrollment>) => row.learnerName ?? "—",
    },
    {
      key: "programName",
      label: "Chuong trinh",
      render: (row: Partial<Enrollment>) => row.programName ?? "—",
    },
    {
      key: "enrollmentType",
      label: "Loai",
      render: (row: Partial<Enrollment>) =>
        TYPE_LABELS[row.enrollmentType ?? ""] ?? row.enrollmentType ?? "—",
    },
    {
      key: "examScore",
      label: "Diem thi",
      render: (row: Partial<Enrollment>) => row.examScore ?? "—",
    },
    {
      key: "practiceRange",
      label: "TT thuc tap",
      render: (row: Partial<Enrollment>) =>
        row.practiceStart && row.practiceEnd
          ? `${row.practiceStart} → ${row.practiceEnd}`
          : "—",
    },
    {
      key: "status",
      label: "Trang thai",
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Tuyen sinh</h2>
      </div>
      <DataTable
        columns={columns}
        data={enrollments}
        loading={loading}
        emptyMessage="Chưa có đăng ký nào."
      />
    </div>
  )
}
