"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft: { label: "Nhap", cls: "bg-muted text-muted-foreground" },
  pending: { label: "Chờ duyệt", cls: "bg-[var(--status-yellow)] text-[var(--status-yellow-fg)]" },
  signed: { label: "Da ky", cls: "bg-[var(--status-blue)] text-[var(--status-blue-fg)]" },
  approved: { label: "Phe duyet", cls: "bg-[var(--status-purple)] text-[var(--status-purple-fg)]" },
  active: { label: "Hoạt động", cls: "bg-[var(--status-green)] text-[var(--status-green-fg)]" },
  expired: { label: "Hết hạn", cls: "bg-destructive/10 text-destructive" },
  cancelled: { label: "Huy", cls: "bg-muted text-muted-foreground" },
}

interface MoaItem {
  id: number
  title: string
  status: string
  school?: { name: string }
  enterprise?: { name: string }
  validFrom?: string
  validTo?: string
  createdAt: string
}

export default function MoasPage() {
  const [items, setItems] = useState<MoaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ data: MoaItem[] }>("/moas?limit=50")
      .then((r) => setItems(r.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (row: MoaItem) => (
        <span className="font-mono text-xs">#{row.id}</span>
      ),
    },
    {
      key: "title",
      label: "Tieu de",
      render: (row: MoaItem) => (
        <Link href={`/moas/${row.id}`} className="underline">
          {row.title}
        </Link>
      ),
    },
    {
      key: "schoolName",
      label: "Truong",
      render: (row: MoaItem) => row.school?.name ?? "—",
    },
    {
      key: "enterpriseName",
      label: "Doanh nghiep",
      render: (row: MoaItem) => row.enterprise?.name ?? "—",
    },
    {
      key: "status",
      label: "Trang thai",
      render: (row: MoaItem) => {
        const s = STATUS_MAP[row.status] ?? { label: row.status, cls: "bg-muted text-foreground" }
        return (
          <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + s.cls}>
            {s.label}
          </span>
        )
      },
    },
    {
      key: "validRange",
      label: "Thoi han",
      render: (row: MoaItem) => (
        <span className="text-xs">
          {row.validFrom ? new Date(row.validFrom).toLocaleDateString("vi-VN") : "—"}
          {" → "}
          {row.validTo ? new Date(row.validTo).toLocaleDateString("vi-VN") : "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Tao luc",
      sortable: true,
      render: (row: MoaItem) =>
        new Date(row.createdAt).toLocaleDateString("vi-VN"),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">MoU / MoA</h2>
        <Link href="/moas/new" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Tao moi
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        emptyMessage="Chưa có thỏa thuận nào."
      />
    </div>
  )
}
