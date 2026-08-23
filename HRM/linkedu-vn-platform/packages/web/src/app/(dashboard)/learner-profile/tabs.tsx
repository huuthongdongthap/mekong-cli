import { PAGE_SIZE } from "./constants"
import type { LearnerProfile, WorkForm, EduForm } from "./types"
import { Pagination } from "./components/pagination"
import { WorkExperienceForm } from "./components/work-experience-form"
import { EducationForm } from "./components/education-form"
import { WorkCard, EmptyWork, AddWorkButton } from "./components/work-card"
import { EducationCard, EmptyEducation, AddEducationButton } from "./components/education-card"

interface TabProps {
  profile: LearnerProfile
  workPage: number
  eduPage: number
  showWorkForm: boolean
  workSubmitting: boolean
  showEduForm: boolean
  eduSubmitting: boolean
  setWorkPage: (p: number) => void
  setEduPage: (p: number) => void
  setShowWorkForm: (v: boolean) => void
  setShowEduForm: (v: boolean) => void
  onAddWork: (data: WorkForm) => void
  onDeleteWork: (id: string) => void
  onAddEdu: (data: EduForm) => void
  onDeleteEdu: (id: string) => void
}

export function ExperienceTab({
  profile, workPage, showWorkForm, workSubmitting,
  setWorkPage, setShowWorkForm, onAddWork, onDeleteWork,
}: TabProps) {
  const items = profile.workExperiences ?? []
  const paged = items.slice((workPage - 1) * PAGE_SIZE, workPage * PAGE_SIZE)
  const total = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">Kinh nghiệm làm việc ({items.length})</h3>
        <AddWorkButton onClick={() => setShowWorkForm(true)} />
      </div>
      {showWorkForm && <WorkExperienceForm submitting={workSubmitting} onSubmit={onAddWork} onCancel={() => setShowWorkForm(false)} />}
      {paged.length === 0 ? <EmptyWork /> : (
        <>
          <div className="space-y-3">{paged.map((exp) => <WorkCard key={exp.id} exp={exp} onDelete={onDeleteWork} />)}</div>
          <Pagination current={workPage} total={total} onChange={setWorkPage} />
        </>
      )}
    </div>
  )
}

export function EducationTab({
  profile, eduPage, showEduForm, eduSubmitting,
  setEduPage, setShowEduForm, onAddEdu, onDeleteEdu,
}: TabProps) {
  const items = profile.educations ?? []
  const paged = items.slice((eduPage - 1) * PAGE_SIZE, eduPage * PAGE_SIZE)
  const total = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">Học vấn ({items.length})</h3>
        <AddEducationButton onClick={() => setShowEduForm(true)} />
      </div>
      {showEduForm && <EducationForm submitting={eduSubmitting} onSubmit={onAddEdu} onCancel={() => setShowEduForm(false)} />}
      {paged.length === 0 ? <EmptyEducation /> : (
        <>
          <div className="space-y-3">{paged.map((edu) => <EducationCard key={edu.id} edu={edu} onDelete={onDeleteEdu} />)}</div>
          <Pagination current={eduPage} total={total} onChange={setEduPage} />
        </>
      )}
    </div>
  )
}
