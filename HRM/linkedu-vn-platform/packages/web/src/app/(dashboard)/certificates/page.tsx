"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"

interface CertItem {
  id: string
  certificateNumber: string
  status: string
  learnerId: string
  issueDate: string | null
  enterprise?: { name: string }
  program?: { name: string }
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft: { label: "Nhap", cls: "bg-muted text-muted-foreground" },
  issued: { label: "Đã cấp", cls: "bg-[var(--status-green)] text-[var(--status-green-fg)]" },
  revoked: { label: "Thu hồi", cls: "bg-destructive/10 text-destructive" },
}

export default function CertificatesPage() {
  const [items, setItems] = useState<CertItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ data: CertItem[] }>("/internship-certificates?limit=50")
      .then((r) => setItems(r.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    {
      key: "certificateNumber",
      label: "So chung chi",
      render: (row: CertItem) => (
        <Link href={`/certificates/${row.id}`} className="underline font-mono text-xs">
          {row.certificateNumber}
        </Link>
      ),
    },
    {
      key: "learnerId",
      label: "Nguoi hoc",
      render: (row: CertItem) => (
        <Link href={`/learners/${row.learnerId}`} className="text-primary hover:underline">
          {row.learnerId.slice(0, 8)}
        </Link>
      ),
    },
    {
      key: "programName",
      label: "Chuong trinh",
      render: (row: CertItem) => row.program?.name ?? "—",
    },
    {
      key: "enterpriseName",
      label: "Doanh nghiep",
      render: (row: CertItem) => row.enterprise?.name ?? "—",
    },
    {
      key: "issueDate",
      label: 'Cập nhật',
      sortable: true,
      render: (row: CertItem) =>
        row.issueDate ? new Date(row.issueDate).toLocaleDateString("vi-VN") : "—",
    },
    {
      key: "status",
      label: "Trang thai",
      render: (row: CertItem) => {
        const s = STATUS_MAP[row.status] ?? { label: row.status, cls: "bg-muted" }
        return (
          <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + s.cls}>
            {s.label}
          </span>
        )
      },
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Chung chi thuc tap</h2>
        <Link href="/certificates/new" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Tao chung chi
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage="Chưa có chứng chỉ nào."
      />
    </div>
  )
}
