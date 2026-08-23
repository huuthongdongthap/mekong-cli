import Link from 'next/link'
import { api } from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import { StatusBadge, Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Learner {
  id: string
  fullName: string
  gender: string
  schoolMajor: string | null
  graduationYear: number | null
  phone: string | null
  email: string | null
  status: string
}

export default async function LearnersPage() {
  let learners: Learner[] = []
  try {
    const res = await api.get<{ data: Learner[] }>('/learners?limit=50&fields=id,fullName,gender,schoolMajor,graduationYear,phone,email,status')
    learners = res.data ?? []
  } catch { learners = [] }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nguoi hoc</h1>
        <Button><Link href="/learners/new">+ Them nguoi hoc</Link></Button>
      </div>

      {learners.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">Chưa có người học nào.</p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="px-4 py-3 text-left font-medium">Ho ten</th>
                  <th className="px-4 py-3 text-left font-medium">Gioi tinh</th>
                  <th className="px-4 py-3 text-left font-medium">Chuyên ngành</th>
                  <th className="px-4 py-3 text-left font-medium">Nam TN</th>
                  <th className="px-4 py-3 text-left font-medium">Dien thoai</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Trang thai</th>
                </tr>
              </thead>
              <tbody>
                {learners.map((l) => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-accent">
                    <td className="px-4 py-3">
                      <Link href={`/learners/${l.id}`} className="text-primary hover:underline">
                        {l.fullName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{l.gender}</td>
                    <td className="px-4 py-3">{l.schoolMajor ?? '—'}</td>
                    <td className="px-4 py-3">{l.graduationYear?.toString() ?? '—'}</td>
                    <td className="px-4 py-3">{l.phone ?? '—'}</td>
                    <td className="px-4 py-3">{l.email ?? '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
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
