export interface ApiDoc {
  id: string; filename: string; originalFilename: string; fileSize: number
  mimeType: string; documentType: string; entityType: string; entityId: string
  uploadedAt: string; r2Url?: string
}