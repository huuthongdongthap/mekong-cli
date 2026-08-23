'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api-client'

interface WorkExperience {
  id: string
  position?: string
  companyName?: string
  location?: string
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  description?: string
  skills?: string[]
}
interface Education {
  id: string
  degree?: string
  fieldOfStudy?: string
  institution?: string
  location?: string
  gpa?: number
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  description?: string
}
interface Profile {
  id: string
  visibility: string
  headline: string | null
  summary: string | null
  skills: string[]
  workExperiences: WorkExperience[]
  educations: Education[]
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ data: Profile }>(`/learners/${params.id}/profile`)
      .then((r) => setProfile(r.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!profile) return <p className="text-muted-foreground">Chưa có hồ sơ.</p>

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h3 className="font-medium mb-4">Ho so ca nhan</h3>
        {profile.headline && <p className="text-sm font-medium mb-2">{profile.headline}</p>}
        {profile.summary && <p className="text-sm text-muted-foreground mb-3">{profile.summary}</p>}
        {profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.skills.map((s: string) => (
              <span key={s} className="inline-flex rounded-full bg-[var(--status-blue)] px-2 py-0.5 text-xs text-[var(--status-blue-fg)]">{s}</span>
            ))}
          </div>
        )}
      </div>

      {profile.workExperiences.length > 0 && (
        <div className="rounded-lg border p-6">
          <h3 className="font-medium mb-4">Kinh nghiem lam viec</h3>
          <div className="space-y-4">
            {profile.workExperiences.map((we) => (
              <div key={we.id} className="border-l-2 border-[var(--status-blue-border)] pl-4">
                <p className="text-sm font-medium">{we.position || 'Vị trí'} {we.companyName ? `- ${we.companyName}` : ''}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {we.location || ''}
                  {(we.startDate || we.endDate || we.isCurrent) && (
                    <span> | {we.startDate ? new Date(we.startDate).toLocaleDateString('vi-VN') : ''} 
                    {we.isCurrent ? ' -> hiện tại' : we.endDate ? ` -> ${new Date(we.endDate).toLocaleDateString('vi-VN')}` : ''}</span>
                  )}
                </p>
                {we.description && <p className="text-sm text-muted-foreground mt-1">{we.description}</p>}
                {we.skills && we.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {we.skills.map((s: string, i: number) => (
                      <span key={i} className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.educations.length > 0 && (
        <div className="rounded-lg border p-6">
          <h3 className="font-medium mb-4">Hoc van</h3>
          <div className="space-y-4">
            {profile.educations.map((ed) => (
              <div key={ed.id} className="border-l-2 border-green-200 pl-4">
                <p className="text-sm font-medium">{ed.degree || 'Bằng cấp'} {ed.fieldOfStudy ? `- ${ed.fieldOfStudy}` : ''}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {ed.institution || ''} {ed.location ? `| ${ed.location}` : ''} {ed.gpa ? `| GPA: ${ed.gpa}` : ''}
                </p>
                {(ed.startDate || ed.endDate || ed.isCurrent) && (
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {ed.startDate ? new Date(ed.startDate).toLocaleDateString('vi-VN') : ''} 
                    {ed.isCurrent ? ' -> hiện tại' : ed.endDate ? ` -> ${new Date(ed.endDate).toLocaleDateString('vi-VN')}` : ''}
                  </p>
                )}
                {ed.description && <p className="text-sm text-muted-foreground mt-1">{ed.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
