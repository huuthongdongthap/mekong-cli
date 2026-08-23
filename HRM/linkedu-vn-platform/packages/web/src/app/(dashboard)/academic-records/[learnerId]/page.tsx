import Link from "next/link"
import { notFound } from "next/navigation"
import { api } from "@/lib/api-client"
import { ArrowLeft, Download } from "lucide-react"
import type { TranscriptMeta } from "./types"
import { STATUS_BADGE, STATUS_LABELS, STATUS_COLORS, gradeColor } from "./constants"

export const dynamic = "force-dynamic"

async function getTranscriptMeta(learnerId: string): Promise<TranscriptMeta | null> {
  try { const r = await api.get<{ data: TranscriptMeta }>("/academic-records/learner/" + learnerId + "/data"); return r.data ?? null }
  catch { return null }
}

async function getTranscriptUrl(learnerId: string): Promise<string | null> {
  try { const r = await api.get<{ data: { downloadUrl: string } }>("/academic-records/learner/" + learnerId + "/transcript"); return r.data?.downloadUrl ?? null }
  catch { return null }
}

async function getLearnerName(learnerId: string): Promise<string> {
  try { const r = await api.get<{ data: { fullName: string } }>("/learners/" + learnerId); return r.data?.fullName ?? learnerId.slice(0, 8) }
  catch { return learnerId.slice(0, 8) }
}

export default async function TranscriptPage({ params }: { params: { learnerId: string } }) {
  const learnerId = params.learnerId
  const [meta, pdfUrl] = await Promise.all([getTranscriptMeta(learnerId), getTranscriptUrl(learnerId)])
  if (!meta) return notFound()

  const badge = STATUS_BADGE[meta.academicStatus] ?? { label: meta.academicStatus, cls: "bg-muted text-muted-foreground" }
  const avg = meta.subjects.length > 0 ? meta.subjects.reduce((s, x) => s + (x.numericGrade ?? 0), 0) / meta.subjects.length : undefined

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/academic-records" className="text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-4 w-4 inline mr-1" /> Quay lại
        </Link>
      </div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Bảng điểm học tập</h2>
          <p className="text-sm text-muted-foreground">{meta.learnerName} · {meta.learnerCode} · {meta.fieldOfStudy} · Khoa {meta.cohort}</p>
        </div>
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noopener" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" /> Tải PDF
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ["GPA", meta.gpa?.toFixed(2) ?? "—", gradeColor(meta.gpa)],
          ["Tín chỉ", meta.totalCredits?.toString() ?? "—", ""],
          ["Môn học", meta.subjects.length.toString(), ""],
          ["Điểm TB môn", avg == null ? "—" : avg.toFixed(2), avg == null ? "text-muted-foreground" : gradeColor(avg)],
        ].map(([k, v, c]) => (
          <div key={k} className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className={"text-xl font-semibold " + c}>{v}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className={"inline-flex rounded-full px-3 py-1 text-sm font-medium " + badge.cls}>{badge.label}</span>
        {meta.issuedDate && <span className="text-xs text-muted-foreground">Cấp ngày: {new Date(meta.issuedDate).toLocaleDateString("vi-VN")}</span>}
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {["Mã môn", "Tên môn", "TC", "Điểm GK", "Điểm CK", "Điểm tổng", "Điểm chữ", "KQ"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meta.subjects.map((s) => (
              <tr key={s.subjectCode} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 font-mono text-xs">{s.subjectCode}</td>
                <td className="px-4 py-3">{s.subjectName}</td>
                <td className="px-4 py-3">{s.credits}</td>
                <td className="px-4 py-3">{s.midtermScore ?? "—"}</td>
                <td className="px-4 py-3">{s.finalScore ?? "—"}</td>
                <td className={"px-4 py-3 " + gradeColor(s.numericGrade)}>{s.totalScore ?? s.numericGrade ?? "—"}</td>
                <td className="px-4 py-3">{s.letterGrade ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={STATUS_COLORS[s.status] ?? "text-muted-foreground"}>
                    {STATUS_LABELS[s.status] ?? s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}