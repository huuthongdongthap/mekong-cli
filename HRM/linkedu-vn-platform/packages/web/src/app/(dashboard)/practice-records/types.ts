export interface PracticeRecord {
  id: string; practiceDate: string; activities: string; hoursWorked: number
  supervisorName: string; skillsDemonstrated: string[]; feedback: string | null
  rating: number | null
  learner?: { fullName: string; id: string }
  enterprise?: { name: string } | null
}

export interface RecordResponse {
  items: PracticeRecord[]; total: number; page: number; limit: number; totalPages: number
}