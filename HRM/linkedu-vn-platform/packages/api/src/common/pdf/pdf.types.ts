export interface CertificateData {
  certificateNumber: string
  learnerName: string
  enterpriseName: string
  enterpriseTaxCode: string
  programName: string
  programField: string
  issueDate: Date | string
  startDate: Date | string
  endDate: Date | string
  totalHours: number
  position: string
  department?: string
  supervisorName: string
  supervisorTitle?: string
  evaluationScore?: number
  evaluationComment?: string
  skillsAcquired: string[]
  achievements: string[]
  qrCodeUrl: string
}