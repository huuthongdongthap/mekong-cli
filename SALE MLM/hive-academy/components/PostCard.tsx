'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LevelBadge from './LevelBadge';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function PostCard({ post, token, userId, onUpdate }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const isLiked = post.likes_by ? post.likes_by.includes(userId) : false;

  const handleLike = async () => {
    const res = await fetch(`${API_BASE}/api/posts/${post.id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) onUpdate();
  };

  const handleDelete = async () => {
    if (!confirm('Xóa bài viết này?')) return;
    setDeleting(true);
    try {
      await fetch(`${API_BASE}/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate();
    } finally {
      setDeleting(false);
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#004CE3] text-white flex items-center justify-center font-bold text-sm">
            {post.author_name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-medium text-sm">{post.author_name || 'Ẩn danh'}</p>
            <div className="flex items-center gap-2">
              <LevelBadge points={post.author_points || 0} size="sm" />
              <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
            </div>
          </div>
        </div>
        {post.channel && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{post.channel}</span>
        )}
      </div>

      <p className="text-gray-800 whitespace-pre-wrap text-sm mb-4">{post.content}</p>

      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-3 py-1 rounded-full ${isLiked ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          {isLiked ? '❤️' : '🤍'} {post.likes || 0}
        </button>

        {post.user_id === userId && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            {deleting ? 'Đang xóa...' : 'Xóa'}
          </button>
        )}
      </div>
    </div>
  );
}
