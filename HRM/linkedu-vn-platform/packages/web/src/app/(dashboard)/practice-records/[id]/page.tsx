"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Star } from "lucide-react"

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-muted-foreground">—</span>
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
      ))}
      <span className="ml-1.5 text-sm font-medium">{rating}/5</span>
    </span>
  )
}

interface RecordDetail {
  learner?: { fullName?: string } | null
  enterprise?: { name?: string } | null
  practiceDate?: string
  activities?: string | null
  hoursWorked?: number
  supervisorName?: string | null
  skillsDemonstrated?: string[]
  feedback?: string | null
  rating?: number | null
}

export default function PracticeRecordDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<RecordDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ data: RecordDetail }>(`/practice-records/${params.id}`)
      .then((r) => setItem(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground/70" /></div>
  if (!item) return (
    <div>
      <p className="text-muted-foreground">Không tìm thấy bản ghi.</p>
      <Link href="/practice-records" className="text-sm text-primary hover:underline mt-2 block">Quay lại</Link>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} aria-label="Quay lại" className="p-2 rounded-md border hover:bg-accent"><ArrowLeft className="h-4 w-4" /></button>
          <div>
            <h2 className="text-2xl font-semibold">Bản ghi thực tập</h2>
            <p className="text-sm text-muted-foreground">{item.learner?.fullName ?? "—"}</p>
          </div>
        </div>
        <Link href={`/practice-records/${params.id}/edit`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">
          Chỉnh sửa
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border p-6">
            <h3 className="font-medium mb-4">Hoạt động thực tập</h3>
            <p className="text-sm whitespace-pre-wrap">{item.activities || "—"}</p>
          </div>

          {(item.skillsDemonstrated?.length ?? 0) > 0 && (
            <div className="rounded-lg border p-6">
              <h3 className="font-medium mb-3">Kỹ năng</h3>
              <div className="flex flex-wrap gap-2">
                {item.skillsDemonstrated?.map((s, i) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--status-purple)] text-[var(--status-purple-fg)] border border-[var(--status-purple-border)]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.feedback && (
            <div className="rounded-lg border p-6">
              <h3 className="font-medium mb-2">Phản hồi</h3>
              <p className="text-sm whitespace-pre-wrap">{item.feedback}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-5">
            <h3 className="font-medium mb-3">Thông tin</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Ngày thực tập</dt>
                <dd className="font-medium">{item.practiceDate ? new Date(item.practiceDate).toLocaleDateString("vi-VN") : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Số giờ</dt>
                <dd className="font-medium">{item.hoursWorked}h</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Giám sát</dt>
                <dd className="font-medium">{item.supervisorName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Doanh nghiệp</dt>
                <dd className="font-medium">{item.enterprise?.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Đánh giá</dt>
                <dd><StarRating rating={item.rating ?? null} /></dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
