import Link from 'next/link'
import { api } from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Program {
  id: number
  name: string
  field: string | null
  duration: string | null
  status: string
  level: string | null
}

export default async function ProgramsPage() {
  let programs: Program[] = []
  try {
    const res = await api.get<{ data: Program[] }>('/programs?limit=50')
    programs = res.data ?? []
  } catch { programs = [] }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chuong trinh</h1>
        <Button><Link href="/programs/new">+ Them chuong trinh</Link></Button>
      </div>

      {programs.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">Chưa có chương trình nào.</p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="px-4 py-3 text-left font-medium">Ma</th>
                  <th className="px-4 py-3 text-left font-medium">Ten</th>
                  <th className="px-4 py-3 text-left font-medium">Nganh</th>
                  <th className="px-4 py-3 text-left font-medium">Thoi gian</th>
                  <th className="px-4 py-3 text-left font-medium">Trinh do</th>
                  <th className="px-4 py-3 text-left font-medium">Trang thai</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-accent">
                    <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                    <td className="px-4 py-3">
                      <Link href={`/programs/${p.id}`} className="text-primary hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{p.field ?? '—'}</td>
                    <td className="px-4 py-3">{p.duration ?? '—'}</td>
                    <td className="px-4 py-3">{p.level ?? '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
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
