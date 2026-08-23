export interface LearnerProfile {
  id: string
  userId: string
  gender: string | null
  dateOfBirth: string | null
  phone: string | null
  address: string | null
  avatarUrl: string | null
  bio: string | null
  status: string
  user?: { firstName: string; lastName: string; email: string }
  workExperiences?: WorkExperience[]
  educations?: Education[]
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string | null
}

export interface Education {
  id: string
  schoolName: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string | null
}

export type TabKey = "info" | "experience" | "education"

export interface EditForm {
  gender: string
  dateOfBirth: string
  phone: string
  address: string
  bio: string
}

export interface WorkForm {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface EduForm {
  schoolName: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
}

export type WorkExperienceForm = WorkForm
export type EducationForm = EduForm