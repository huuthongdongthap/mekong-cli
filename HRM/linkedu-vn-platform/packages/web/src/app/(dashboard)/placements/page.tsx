"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api-client"
import { DataTable } from "@/components/ui/data-table"
import { PLACEMENT_COLUMNS, type PlacementRow } from "./helpers"

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<PlacementRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ data: PlacementRow[] }>(
      "/placements?limit=50&fields=id,learnerName,positionApplied,positionOffered,employmentType,salaryMinVnd,salaryMaxVnd,startDate,enterpriseName,tracking3mStatus,tracking6mStatus,isCurrentJob,status",
    )
      .then((r) => setPlacements(r.data ?? []))
      .catch((err) => {
        console.error("API error:", err)
        setPlacements([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Viec lam sau tot nghiep</h2>
      </div>
      <DataTable
        columns={PLACEMENT_COLUMNS}
        data={placements}
        loading={loading}
        emptyMessage="Chưa có kết quả việc làm nào."
      />
    </div>
  )
}
