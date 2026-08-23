export const MIME_LABEL: Record<string, string> = {
  'application/pdf': 'PDF', 'image/jpeg': 'JPEG', 'image/png': 'PNG',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
}

export const DOC_TYPE_LABEL: Record<string, string> = {
  cv: 'CV', certificate: 'Chứng chỉ', contract: 'Hợp đồng', report: 'Báo cáo',
  transcript: 'Học bạ', mou: 'MOU', other: 'Khác',
}

export function fmtSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}