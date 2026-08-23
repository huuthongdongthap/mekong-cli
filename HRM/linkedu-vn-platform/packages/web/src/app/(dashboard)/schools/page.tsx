import Link from 'next/link'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'

interface School {
  id: string
  code: string
  name: string
  schoolType: string
  status: string
  verificationStatus: string
  directorName?: string
  phone?: string
}

export default async function SchoolsPage() {
  let schools: School[] = []
  try {
    const res = await api.get<{ data: School[] }>('/schools?limit=50')
    schools = res.data ?? []
  } catch { schools = [] }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Truong doi tac</h1>
        <Button><Link href="/schools/new">+ Them truong</Link></Button>
      </div>

      {schools.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">Chưa có trường nào.</p>
          <p className="text-xs text-muted-foreground mt-1">Chạy seed để thêm dữ liệu mẫu.</p>
        </Card>
      ) : (
        <Card padding="none">

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="px-4 py-3 text-left font-medium">Ma</th>
                  <th className="px-4 py-3 text-left font-medium">Ten</th>
                  <th className="px-4 py-3 text-left font-medium">Loai</th>
                  <th className="px-4 py-3 text-left font-medium">Hieu truong</th>
                  <th className="px-4 py-3 text-left font-medium">Trang thai</th>
                  <th className="px-4 py-3 text-left font-medium">Xac minh</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-accent">
                    <td className="px-4 py-3 font-mono text-xs">{s.code}</td>
                    <td className="px-4 py-3">
                      <Link href={`/schools/${s.id}`} className="text-primary hover:underline">
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{s.schoolType}</td>
                    <td className="px-4 py-3">{s.directorName ?? '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={s.verificationStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Card>
      )}
    </div>
  )
}
