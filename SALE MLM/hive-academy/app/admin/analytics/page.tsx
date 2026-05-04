'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export default function AnalyticsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'leader' && user?.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'leader' || user?.role === 'admin')) {
      loadAnalytics();
    }
  }, [isAuthenticated, user, period]);

  async function loadAnalytics() {
    setLoading(true);
    const token = localStorage.getItem('hive_token');
    try {
      const res = await fetch(`${API}/api/dashboard/analytics?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-[#004CE3]">Hive Academy</h1>
              <a href="/admin" className="text-sm text-gray-600 hover:text-[#004CE3]">Dashboard</a>
              <a href="/admin/reports" className="text-sm text-gray-600 hover:text-[#004CE3]">Báo cáo</a>
              <a href="/admin/analytics" className="text-sm text-[#004CE3] font-semibold">Analytics</a>
            </div>
            <button onClick={() => { localStorage.removeItem('hive_token'); localStorage.removeItem('hive_user'); router.push('/login'); }} className="text-sm text-red-600">Đăng xuất</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Data Analytics</h2>
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="px-4 py-2 border rounded text-sm">
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="all">Toàn bộ</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-sm text-gray-500">Tổng thành viên</p>
                <p className="text-3xl font-bold text-[#004CE3]">{data.total_members || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-sm text-gray-500">Active hôm nay</p>
                <p className="text-3xl font-bold text-green-600">{data.active_today || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-sm text-gray-500">Đang học</p>
                <p className="text-3xl font-bold text-[#FFC734]">{data.learning_members || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-sm text-gray-500">Điểm {period === 'week' ? 'tuần' : period === 'month' ? 'tháng' : ''}</p>
                <p className="text-3xl font-bold text-orange-600">{data.points_week || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Phân bố trạng thái</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>🟢 XANH (Tốt)</span>
                      <span>{data.green_count || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${data.total_members ? (data.green_count || 0) / data.total_members * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>🟡 VÀNG (Cảnh báo)</span>
                      <span>{data.yellow_count || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${data.total_members ? (data.yellow_count || 0) / data.total_members * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>🔴 ĐỎ (Cần chú ý)</span>
                      <span>{data.red_count || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${data.total_members ? (data.red_count || 0) / data.total_members * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Top Learners</h3>
                <div className="space-y-2">
                  {(data.top_learners || []).slice(0, 5).map((m: any, i: number) => (
                    <div key={m.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                        <span className="text-sm font-medium">{m.name}</span>
                      </div>
                      <span className="text-sm text-[#004CE3] font-semibold">{m.points_week || 0} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">Hoạt động theo ngày</h3>
              <div className="flex items-end gap-1 h-32">
                {(data.daily_activity || []).map((d: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-[#004CE3] rounded-t" style={{ height: `${d.count ? d.count / (data.max_daily || 1) * 100 : 0}%`, minHeight: '2px' }}></div>
                    <span className="text-xs text-gray-500 mt-1">{d.date?.slice(5) || ''}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Bài đăng gần đây</h3>
              <p className="text-sm text-gray-500">{data.posts_week || 0} bài trong {period === 'week' ? 'tuần' : period === 'month' ? 'tháng' : ''} qua</p>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-400">Không có dữ liệu</div>
        )}
      </div>
    </main>
  );
}
