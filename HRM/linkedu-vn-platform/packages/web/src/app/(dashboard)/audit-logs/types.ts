export interface AuditLog {
  id: number
  action: string
  entityType: string
  entityId: string
  details?: string | null
  createdAt: string
  actor?: { firstName: string; lastName: string; email: string } | null
}

export interface AuditResponse {
  items: AuditLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}