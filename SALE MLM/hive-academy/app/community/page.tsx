'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';

const CHANNELS = ['Tất cả', 'Kỹ năng bán hàng', 'Chia sẻ kinh nghiệm', 'Thắc mắc', 'Thành công', 'Tâm sự', 'Công cụ'];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function CommunityPage() {
  const { user, token, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [activeChannel, setActiveChannel] = useState('Tất cả');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (token) fetchPosts();
  }, [token, activeChannel, refresh]);

  const fetchPosts = async () => {
    const url = new URL(`${API_BASE}/api/posts`);
    if (activeChannel !== 'Tất cả') url.searchParams.set('channel', activeChannel);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setPosts(await res.json());
  };

  const handlePostCreated = () => setRefresh(r => r + 1);

  if (loading || !user) return <p className="p-8 text-center">Loading...</p>;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-[#004CE3]">Hive Academy</h1>
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/learn')} className="text-sm text-gray-600 hover:text-[#004CE3]">Học tập</button>
              <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-600 hover:text-[#004CE3]">Dashboard</button>
              <span className="text-sm text-gray-600">{user.name}</span>
              <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="text-sm text-red-600">Đăng xuất</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-2">Cộng đồng</h2>
        <p className="text-gray-600 mb-6">Chia sẻ kinh nghiệm, đặt câu hỏi và kết nối với đồng đội.</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {CHANNELS.map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeChannel === ch ? 'bg-[#004CE3] text-white' : 'bg-white border hover:border-[#004CE3]'}`}
            >
              {ch}
            </button>
          ))}
        </div>

        <CreatePost token={token} onPostCreated={handlePostCreated} />
        <div className="mt-6 space-y-4">
          {posts.length === 0 && <p className="text-center text-gray-400 py-8">Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!</p>}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} token={token} userId={user.id} onUpdate={handlePostCreated} />
          ))}
        </div>
      </div>
    </main>
  );
}
