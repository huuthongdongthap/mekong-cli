"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

interface Record {
  id: string
  filename: string
  uploadedAt: string
  metadata: {
    learnerName?: string
    gpa?: number
    totalCredits?: number
    fieldOfStudy?: string
    cohort?: string
    academicStatus?: string
  }
}

export default function AcademicRecordsPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [learnerId, setLearnerId] = useState("")
  const [results, setResults] = useState<{id: string, fullName: string}[]>([])
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function searchLearners() {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const r = await api.get<{ data: { id: string; fullName: string }[] }>(`/learners?search=${encodeURIComponent(query.trim())}&limit=10`)
      setResults((r.data ?? []).map((l) => ({id: l.id, fullName: l.fullName})))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tìm kiếm người học")
      setResults([])
    }
    setLoading(false)
  }

  function selectLearner(id: string) {
    setLearnerId(id)
    router.push(`/academic-records/${id}`)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Bang diem hoc tap</h2>

      <div className="rounded-lg border-border p-4 mb-6">
        <p className="text-sm text-muted-foreground mb-3">Tìm kiếm người học để xem bảng điểm chi tiết</p>
        <div className="flex gap-2">
          <input
            placeholder="Ten hoac ma nguoi hoc..."
            aria-label="Tìm kiếm người học"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchLearners()}
            className="max-w-md rounded-md border-border px-3 py-2 text-sm"
          />
          <Button onClick={searchLearners} disabled={loading || !query.trim()}>
            <Users className="h-4 w-4 mr-2" /> Tim
          </Button>
        </div>
        {error && (
          <div className="mt-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        {results.length > 0 && (
          <div className="mt-2 border-border rounded-md max-w-md">
            {results.map((l) => (
              <button key={l.id} onClick={() => selectLearner(l.id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent border-b last:border-0">
                {l.fullName} <span className="text-xs text-muted-foreground ml-2">{l.id.slice(0,8)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border-border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">Chưa có bảng điểm được đồng bộ.</p>
        <p className="text-xs text-muted-foreground mt-1">Tìm kiếm người học để xem chi tiết.</p>
      </div>
    </div>
  )
}
