import Link from "next/link"
import { api } from "@/lib/api-client"
import { ArrowLeft, Award, BookOpen } from "lucide-react"
import type { LearnerProfile, Cert, Enrollment } from "./types"
import { STATUS_MAP, CERT_STATUS, GENDER_MAP } from "./constants"
import { InfoCard, Field } from "./components/info-card"
import { phoneLink, emailLink, fmtDate } from "./helpers"

export const dynamic = "force-dynamic"

async function getLearner(id: string): Promise<LearnerProfile | null> {
  try {
    const r = await api.get<{ data: LearnerProfile | null }>("/learners/" + id)
    return r.data ?? null
  } catch { return null }
}
async function getCertificates(learnerId: string): Promise<Cert[]> {
  try {
    const r = await api.get<{ data: Cert[] }>("/internship-certificates/learner/" + learnerId)
    return r.data ?? []
  } catch { return [] }
}
async function getEnrollments(learnerId: string): Promise<Enrollment[]> {
  try {
    const r = await api.get<{ data: Enrollment[] }>("/enrollments?learnerId=" + learnerId + "&limit=10")
    return r.data ?? []
  } catch { return [] }
}

export default async function LearnerProfilePage({ params }: { params: { id: string } }) {
  const [learner, certs, enrollments] = await Promise.all([
    getLearner(params.id), getCertificates(params.id), getEnrollments(params.id),
  ])

  if (!learner) {
    return (
      <div className="space-y-4">
        <Link href="/learners" className="text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-4 w-4 inline mr-1" /> Quay lại
        </Link>
        <p className="text-muted-foreground">Không tìm thấy người học.</p>
      </div>
    )
  }
  const ls = STATUS_MAP[learner.status] ?? { label: learner.status, cls: "" }

  return (
    <div className="space-y-6">
      <Link href={"/learners/" + params.id} className="text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="h-4 w-4 inline mr-1" /> Quay lại hồ sơ
      </Link>
      <div>
        <h1 className="text-2xl font-semibold">{learner.fullName}</h1>
        <p className="text-sm text-muted-foreground">Mã: {learner.id}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Thông tin cá nhân">
          <Field label="Giới tính" value={GENDER_MAP[learner.gender ?? ""] ?? learner.gender ?? "—"} />
          <Field label="Ngày sinh" value={learner.dateOfBirth ?? "—"} />
          <Field label="Điện thoại" value={phoneLink(learner.phone)} />
          <Field label="Email" value={emailLink(learner.email)} />
          <Field label="CCCD" value={learner.idNumber ?? "—"} />
          <Field label="Địa chỉ" value={learner.address ?? "—"} />
          <Field label="Người thân" value={learner.emergencyContact ?? "—"} />
          <Field label="Chuyên ngành" value={learner.schoolMajor ?? "—"} />
          <Field label="Năm TN" value={learner.graduationYear?.toString() ?? "—"} />
          <Field label="Trạng thái" value={<span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + ls.cls}>{ls.label}</span>} />
        </InfoCard>
        <InfoCard title="Trường / Chương trình">
          <Field label="Trường" value={learner.school?.name ?? "—"} />
          <Field label="Mã trường" value={learner.school?.code ?? "—"} />
          <Field label="Chương trình" value={learner.program?.name ?? "—"} />
          <Field label="Ngành" value={learner.program?.field ?? "—"} />
          <Field label="Ngày DK" value={learner.enrollmentDate ?? "—"} />
        </InfoCard>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2"><Award className="h-4 w-4" /> Chứng chỉ thực tập</h3>
            <Link href="/certificates" className="text-sm text-primary hover:underline">Xem tất cả</Link>
          </div>
          {certs.length === 0 ? <p className="text-sm text-muted-foreground">Chưa có chứng chỉ.</p> : (
            <div className="space-y-2">{certs.map((c) => {
              const cs = CERT_STATUS[c.status] ?? { label: c.status, cls: "" }
              return (
                <div key={c.id} className="flex items-center justify-between border rounded-md px-3 py-2 text-sm">
                  <div>
                    <span className="font-medium">{c.certificateNumber}</span>
                    <span className="text-muted-foreground ml-2">{c.enterprise?.name ?? c.program?.name ?? ""}</span>
                  </div>
                  <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + cs.cls}>{cs.label}</span>
                </div>
              )
            })}</div>
          )}
        </div>
        <div className="rounded-lg border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2"><BookOpen className="h-4 w-4" /> Đăng ký chương trình</h3>
            <Link href="/enrollments" className="text-sm text-primary hover:underline">Xem tất cả</Link>
          </div>
          {enrollments.length === 0 ? <p className="text-sm text-muted-foreground">Chưa có đăng ký.</p> : (
            <div className="space-y-2">{enrollments.map((e) => (
              <div key={e.id} className="flex items-center justify-between border rounded-md px-3 py-2 text-sm">
                <span className="font-medium">{e.programName}</span>
                <span className="text-muted-foreground">{fmtDate(e.enrollmentDate)}</span>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  )
}