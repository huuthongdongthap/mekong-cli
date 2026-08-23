"use client"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Evaluation } from "../types"
import { PAGE_SIZE } from "../constants"
import { TYPE_CLS, TYPE_LABELS } from "../constants"

export function EvaluationsTable({ items, page, totalPages, total, onPageChange }: {
  items: Evaluation[]; page: number; totalPages: number; total: number; onPageChange: (p: number) => void
}) {
  if (items.length === 0) return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <span className="text-6xl mb-3 block">📊</span>
      <p className="text-sm text-muted-foreground">Chưa có đánh giá nào.</p>
    </div>
  )

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/80">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Người học</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Loại đánh giá</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Điểm</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chương trình</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Đánh giá viên</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ngày</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((e) => (
            <tr key={e.id} className="hover:bg-accent transition-colors">
              <td className="px-5 py-4 font-medium text-foreground">{e.learner?.fullName ?? "—"}</td>
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${TYPE_CLS[e.evaluationType] ?? "bg-muted text-muted-foreground border-border"}`}>
                  {TYPE_LABELS[e.evaluationType] ?? e.evaluationType}
                </span>
              </td>
              <td className="px-5 py-4"><ScoreBadge evaluation={e} /></td>
              <td className="px-5 py-4 text-foreground">{e.enrollment?.program?.name ?? "—"}</td>
              <td className="px-5 py-4 text-foreground">
                {e.evaluator ? `${e.evaluator.firstName} ${e.evaluator.lastName}` : "—"}
              </td>
              <td className="px-5 py-4 text-muted-foreground text-xs whitespace-nowrap">
                {e.evaluatedAt ? new Date(e.evaluatedAt).toLocaleDateString("vi-VN") : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/50">
          <p className="text-xs text-muted-foreground">Tổng {total} đánh giá — Trang {page}/{totalPages}</p>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              if (p > totalPages) return null
              return (
                <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => onPageChange(p)} className="h-8 w-8 p-0 text-xs">{p}</Button>
              )
            })}
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function StarRating({ score }: { score: number }) {
  const filled = Math.round(score / 20)
  return (
    <span className="text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? "text-amber-400" : "text-muted-foreground/50"}>
          {i < filled ? "★" : "☆"}
        </span>
      ))}
    </span>
  )
}

function ScoreBadge({ evaluation }: { evaluation: Evaluation }) {
  const score = evaluation.percentage ?? (evaluation.totalScore != null && evaluation.maxScore ? Math.round((evaluation.totalScore / evaluation.maxScore) * 100) : null)
  if (score == null) return <span className="text-muted-foreground">—</span>
  const color = score >= 85 ? "text-emerald-600" : score >= 70 ? "text-amber-600" : "text-destructive"
  return (
    <span className={`font-semibold ${color}`}>
      {evaluation.totalScore != null && evaluation.maxScore
        ? `${evaluation.totalScore}/${evaluation.maxScore}`
        : `${score}%`}
      {" "}
      <StarRating score={score} />
    </span>
  )
}