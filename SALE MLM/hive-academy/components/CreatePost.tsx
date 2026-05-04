'use client';

import { useState } from 'react';

const CHANNELS = ['Kỹ năng bán hàng', 'Chia sẻ kinh nghiệm', 'Thắc mắc', 'Thành công', 'Tâm sự', 'Công cụ'];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function CreatePost({ token, onPostCreated }) {
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState('Chia sẻ kinh nghiệm');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, channel }),
      });
      if (res.ok) {
        setContent('');
        onPostCreated();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Chia sẻ điều gì đó với cộng đồng..."
          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#004CE3] text-sm"
          rows={3}
        />
        <div className="flex justify-between items-center mt-3">
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#004CE3]"
          >
            {CHANNELS.map((ch) => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="bg-[#004CE3] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Đang đăng...' : 'Đăng bài'}
          </button>
        </div>
      </form>
    </div>
  );
}
