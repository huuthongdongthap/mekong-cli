"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { UserCircle } from "lucide-react"
import { TABS, PAGE_SIZE } from "./constants"
import type { LearnerProfile, TabKey, EditForm, WorkForm, EduForm } from "./types"
import { InfoView } from "./components/info-view"
import { ExperienceTab, EducationTab } from "./tabs"

function getLearnerId(): string {
  if (typeof window !== "undefined") return localStorage.getItem("learnerId") || ""
  return ""
}

export default function LearnerProfilePage() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<TabKey>("info")
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [workPage, setWorkPage] = useState(1)
  const [eduPage, setEduPage] = useState(1)
  const [editForm, setEditForm] = useState<EditForm>({ gender: "", dateOfBirth: "", phone: "", address: "", bio: "" })
  const [showWorkForm, setShowWorkForm] = useState(false)
  const [workSubmitting, setWorkSubmitting] = useState(false)
  const [showEduForm, setShowEduForm] = useState(false)
  const [eduSubmitting, setEduSubmitting] = useState(false)

  const [refreshKey, setRefreshKey] = useState(0)

  function refetchProfile() { setRefreshKey((k) => k + 1) }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const id = getLearnerId()
      if (!id) {
        if (!cancelled) {
          setError("Không tìm thấy mã người học. Vui lòng đăng nhập lại.")
          setLoading(false)
        }
        return
      }
      setLoading(true); setError(null)
      try {
        const data = await api.get<LearnerProfile>(`/learners/${id}/profile`)
        if (cancelled) return
        setProfile(data)
        setEditForm({
          gender: data.gender ?? "", dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
          phone: data.phone ?? "", address: data.address ?? "", bio: data.bio ?? "",
        })
      } catch (err) { if (!cancelled) setError(err instanceof Error ? err.message : "Lỗi tải hồ sơ") }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [refreshKey])

  async function handleSaveProfile() {
    const id = getLearnerId(); if (!id) return
    setSaving(true); setError(null)
    try {
      await api.put(`/learners/${id}/profile`, {
        gender: editForm.gender || null, dateOfBirth: editForm.dateOfBirth || null,
        phone: editForm.phone || null, address: editForm.address || null, bio: editForm.bio || null,
      })
      toast.success("Cập nhật thành công"); setEditMode(false); refetchProfile()
    } catch (err) { setError(err instanceof Error ? err.message : "Lỗi cập nhật hồ sơ") }
    setSaving(false)
  }

  async function handleAddWork(data: WorkForm) {
    const id = getLearnerId(); if (!id) return
    setWorkSubmitting(true); setError(null)
    try {
      await api.post(`/learners/${id}/work-experiences`, {
        company: data.company, position: data.position, startDate: data.startDate,
        endDate: data.endDate || null, description: data.description || null,
      })
      toast.success("Tạo thành công"); setShowWorkForm(false); refetchProfile()
    } catch (err) { setError(err instanceof Error ? err.message : "Lỗi thêm kinh nghiệm") }
    setWorkSubmitting(false)
  }
  async function handleDeleteWork(expId: string) {
    const id = getLearnerId(); if (!id) return
    if (!confirm("Bạn có chắc muốn xóa kinh nghiệm này?")) return
    try { await api.delete(`/learners/${id}/work-experiences/${expId}`); toast.success("Đã xóa"); refetchProfile() }
    catch (err) { setError(err instanceof Error ? err.message : "Lỗi xóa kinh nghiệm") }
  }

  async function handleAddEdu(data: EduForm) {
    const id = getLearnerId(); if (!id) return
    setEduSubmitting(true); setError(null)
    try {
      await api.post(`/learners/${id}/educations`, {
        schoolName: data.schoolName, degree: data.degree, fieldOfStudy: data.fieldOfStudy,
        startDate: data.startDate, endDate: data.endDate || null,
      })
      toast.success("Tạo thành công"); setShowEduForm(false); refetchProfile()
    } catch (err) { setError(err instanceof Error ? err.message : "Lỗi thêm học vấn") }
    setEduSubmitting(false)
  }
  async function handleDeleteEdu(eduId: string) {
    const id = getLearnerId(); if (!id) return
    if (!confirm("Bạn có chắc muốn xóa học vấn này?")) return
    try { await api.delete(`/learners/${id}/educations/${eduId}`); toast.success("Đã xóa"); refetchProfile() }
    catch (err) { setError(err instanceof Error ? err.message : "Lỗi xóa học vấn") }
  }

  const tabProps = {
    profile: profile!,
    workPage, eduPage, showWorkForm, workSubmitting, showEduForm, eduSubmitting,
    setWorkPage, setEduPage, setShowWorkForm, setShowEduForm,
    onAddWork: handleAddWork, onDeleteWork: handleDeleteWork,
    onAddEdu: handleAddEdu, onDeleteEdu: handleDeleteEdu,
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><UserCircle className="h-6 w-6 text-primary" /> Hồ sơ cá nhân</h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý thông tin cá nhân, kinh nghiệm và học vấn.</p></div>
      {error && <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4"><p className="text-sm text-destructive">{error}</p></div>}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" /></div>
      ) : !profile ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center"><UserCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">Không tìm thấy hồ sơ.</p></div>
      ) : (
        <>
          <div className="bg-muted rounded-lg p-1 inline-flex gap-1">
            {TABS.map((t) => {
              const Icon = t.icon
              return (<button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-muted-foreground"}`}><Icon className="h-4 w-4" />{t.label}</button>)
            })}
          </div>
          {tab === "info" && <InfoView profile={profile} editMode={editMode} editForm={editForm} saving={saving} onToggleEdit={() => setEditMode(true)} onSave={handleSaveProfile} onCancel={() => setEditMode(false)} onChangeEdit={setEditForm} />}
          {tab === "experience" && <ExperienceTab {...tabProps} />}
          {tab === "education" && <EducationTab {...tabProps} />}
        </>
      )}
    </div>
  )
}