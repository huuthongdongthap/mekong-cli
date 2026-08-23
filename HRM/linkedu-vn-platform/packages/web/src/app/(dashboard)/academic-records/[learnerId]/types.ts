export interface Subject {
  subjectCode: string; subjectName: string; credits: number
  midtermScore?: number; finalScore?: number; totalScore?: number
  letterGrade?: string; numericGrade?: number; status: string; subjectType?: string
}

export interface TranscriptMeta {
  learnerName: string; learnerCode: string; fieldOfStudy: string
  cohort: string; gpa?: number; totalCredits?: number
  academicStatus: string; issuedDate?: string; subjects: Subject[]
}