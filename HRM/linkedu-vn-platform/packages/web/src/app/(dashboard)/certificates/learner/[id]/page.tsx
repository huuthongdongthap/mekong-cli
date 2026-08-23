import Link from "next/link"
import { api } from "@/lib/api-client"
import { Award } from "lucide-react"

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft: { label: "Nhap", cls: "bg-muted text-muted-foreground" },
  issued: { label: "Đã cấp", cls: "bg-[var(--status-green)] text-[var(--status-green-fg)]" },
  revoked: { label: "Thu hồi", cls: "bg-destructive/10 text-destructive" },
}

interface Cert {
  id: string
  certificateNumber: string
  status: string
  issueDate?: string
  program?: { name: string; field?: string }
  enterprise?: { name: string }
  createdAt: string
}

export const dynamic = "force-dynamic"

async function getCertificates(learnerId: string): Promise<Cert[]> {
  try {
    const r = await api.get<{ data: Cert[] }>(
      `/internship-certificates/learner/${learnerId}`,
    )
    return r.data ?? []
  } catch {
    return []
  }
}

async function getLearnerName(learnerId: string): Promise<string> {
  try {
    const r = await api.get<{ data: { fullName: string } }>(
      `/learners/${learnerId}`,
    )
    return r.data?.fullName ?? learnerId.slice(0, 8)
  } catch {
    return learnerId.slice(0, 8)
  }
}

export default async function LearnerCertificatesPage({
  params,
}: { params: { id: string } }) {
  const learnerId = params.id
  const [certs, learnerName] = await Promise.all([
    getCertificates(learnerId),
    getLearnerName(learnerId),
  ])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/learners/${learnerId}`} className="text-sm text-muted-foreground hover:underline">
          &larr; Quay lại hồ sơ người học
        </Link>
      </div>
      <h2 className="text-2xl font-semibold mb-1">Chứng chỉ của {learnerName}</h2>
      <p className="text-sm text-muted-foreground mb-6">ID: {learnerId}</p>
      {certs.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Award className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Chưa có chứng chỉ thực tập nào được cấp.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Số chứng chỉ</th>
                <th className="px-4 py-3 text-left font-medium">Doanh nghiệp</th>
                <th className="px-4 py-3 text-left font-medium">Chương trình</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium">Ngày cấp</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => {
                const s = STATUS_MAP[c.status] ?? { label: c.status, cls: "bg-muted" }
                return (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Link href={`/certificates/${c.id}`} className="text-primary hover:underline flex items-center gap-2">
                        <Award className="h-3.5 w-3.5" /> {c.certificateNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{c.enterprise?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      {c.program?.name ?? "—"}
                      {c.program?.field ? <span className="block text-xs text-muted-foreground">{c.program.field}</span> : null}
                    </td>
                    <td className="px-4 py-3">
                      <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + s.cls}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3">{c.issueDate ? new Date(c.issueDate).toLocaleDateString("vi-VN") : "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
