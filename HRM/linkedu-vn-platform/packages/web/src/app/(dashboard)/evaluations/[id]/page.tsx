"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

const TYPE_LABELS: Record<string, string> = {
  mid_term: "Giữa kỳ", final: "Cuối kỳ", supervisor: "Giám sát",
  peer: "Đồng nghiệp", self: "Tự đánh giá",
}

const TYPE_CLS: Record<string, string> = {
  mid_term: "bg-[var(--status-purple)] text-[var(--status-purple-fg)]",
  final: "bg-[var(--status-purple)] text-[var(--status-purple-fg)]",
  supervisor: "bg-[var(--status-orange)] text-[var(--status-orange-fg)]",
  peer: "bg-[var(--status-emerald)] text-[var(--status-emerald-fg)]",
  self: "bg-muted text-muted-foreground",
}

interface EvalDetail {
  id?: string
  evaluationType?: string | null
  totalScore?: number
  maxScore?: number
  percentage?: number | null
  feedback?: string
  strengths?: string
  improvements?: string
  evaluatedAt?: string
  learner?: { fullName?: string } | null
  evaluator?: { firstName?: string; lastName?: string } | null
  enrollment?: { program?: { name?: string } } | null
}

export default function EvaluationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<EvalDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ data: EvalDetail }>(`/evaluations/${params.id}`)
      .then((r) => setItem(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground/70" /></div>
  if (!item) return (
    <div>
      <p className="text-muted-foreground">Không tìm thấy đánh giá.</p>
      <Link href="/evaluations" className="text-sm text-primary hover:underline mt-2 block">Quay lại</Link>
    </div>
  )

  const score = item.percentage ?? (item.totalScore != null && item.maxScore ? Math.round((item.totalScore / item.maxScore) * 100) : null)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} aria-label="Quay lại" className="p-2 rounded-md border hover:bg-accent"><ArrowLeft className="h-4 w-4" /></button>
          <div>
            <h2 className="text-2xl font-semibold">Đánh giá #{item.id?.slice(0, 8)}</h2>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium mt-1 ${TYPE_CLS[item.evaluationType ?? ""] ?? "bg-muted text-muted-foreground"}`}>
              {TYPE_LABELS[item.evaluationType ?? ""] ?? item.evaluationType}
            </span>
          </div>
        </div>
        <Link href={`/evaluations/${params.id}/edit`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">
          Chỉnh sửa
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border p-6">
            <h3 className="font-medium mb-4">Điểm số</h3>
            {score != null ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{score}%</span>
                {item.totalScore != null && item.maxScore && (
                  <span className="text-muted-foreground">({item.totalScore}/{item.maxScore})</span>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Chưa có điểm</p>
            )}
          </div>

          {item.feedback && (
            <div className="rounded-lg border p-6">
              <h3 className="font-medium mb-2">Nhận xét</h3>
              <p className="text-sm whitespace-pre-wrap">{item.feedback}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {item.strengths && (
              <div className="rounded-lg border p-6">
                <h3 className="font-medium mb-2 text-emerald-600">Điểm mạnh</h3>
                <p className="text-sm whitespace-pre-wrap">{item.strengths}</p>
              </div>
            )}
            {item.improvements && (
              <div className="rounded-lg border p-6">
                <h3 className="font-medium mb-2 text-amber-600">Cần cải thiện</h3>
                <p className="text-sm whitespace-pre-wrap">{item.improvements}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-5">
            <h3 className="font-medium mb-3">Thông tin</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Người học</dt>
                <dd className="font-medium">{item.learner?.fullName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Đánh giá viên</dt>
                <dd className="font-medium">{item.evaluator ? `${item.evaluator.firstName} ${item.evaluator.lastName}` : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Chương trình</dt>
                <dd className="font-medium">{item.enrollment?.program?.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Ngày đánh giá</dt>
                <dd>{item.evaluatedAt ? new Date(item.evaluatedAt).toLocaleDateString("vi-VN") : "—"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
