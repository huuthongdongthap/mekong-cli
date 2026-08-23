export interface LearnerProfile {
  id: string; fullName: string; gender: string | null; dateOfBirth: string | null
  phone: string | null; email: string | null; address: string | null
  idNumber: string | null; emergencyContact: string | null
  schoolMajor: string | null; graduationYear: number | null
  enrollmentDate: string | null; status: string
  school?: { id: string; name: string; code?: string }
  program?: { id: string; name: string; field?: string }
}

export interface Cert {
  id: string; certificateNumber: string; status: string; issueDate: string | null
  program?: { name: string; field?: string }; enterprise?: { name: string }
}

export interface Enrollment {
  id: string; programName: string; enrollmentDate: string; status: string
}