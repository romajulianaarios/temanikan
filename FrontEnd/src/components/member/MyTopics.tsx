import { useState, useEffect } from 'react';
import { Link } from '../Router';  // ✅ DIPERBAIKI: Custom Router
import { forumAPI } from '../../services/api';
import { useAuth } from '../AuthContext';  // ✅ DIPERBAIKI: Path relatif

import { MessageSquare, ThumbsUp, User, Edit2, Trash2, ArrowLeft, Flag, Eye } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';

interface Topic {
  id: number;
  title: string;
  content: string;
  author_name: string;
  category: string;
  replies_count: number;
  likes: number;
  views: number;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
}

export default function MyTopics() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'replies'>('recent');
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteTopicId, setDeleteTopicId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch topik milik user dari database
  useEffect(() => {
    fetchMyTopics();
  }, [user?.id]);

  const fetchMyTopics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Panggil endpoint untuk get topik milik member
      const response = await forumAPI.getUserTopics();
      console.log('📥 My topics from database:', response);

      if (response.success && response.topics) {
        // Map backend data to frontend format
        const mappedTopics = response.topics.map((topic: any) => ({
          id: topic.id,
          title: topic.title,
          content: topic.content,
          author_name: topic.author?.name || topic.author?.username || 'Anonymous',
          category: topic.category || 'Umum',
          replies_count: topic.reply_count || 0,
          likes: topic.like_count || 0,
          views: topic.views || 0,
          created_at: topic.created_at,
          updated_at: topic.updated_at,
          is_pinned: topic.is_pinned || false
        }));
        
        setTopics(mappedTopics);
      } else {
        setError('Gagal memuat topik Anda');
      }
    } catch (err: any) {
      console.error('❌ Error fetching my topics:', err);
      setError(err.response?.data?.message || 'Gagal memuat topik');
    } finally {
      setLoading(false);
    }
  };

  // Delete topic
  const handleDeleteTopicClick = (topicId: number) => {
    setDeleteTopicId(topicId);
    setShowConfirmModal(true);
  };

  const handleDeleteTopic = async () => {
    if (!deleteTopicId) return;

    try {
      const response = await forumAPI.deleteTopic(deleteTopicId);
      console.log('🗑️ Topic deleted:', response);

      if (response.message || response.success) {
        setTopics(topics.filter((t: Topic) => t.id !== deleteTopicId));
        setShowConfirmModal(false);
        setSuccessMessage('Topik berhasil dihapus');
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error('❌ Error deleting topic:', err);
      setShowConfirmModal(false);
      setSuccessMessage(err.response?.data?.error || err.response?.data?.message || 'Gagal menghapus topik');
      setShowSuccessModal(true);
    }
  };

  // Sort topics berdasarkan pilihan
  const getSortedTopics = () => {
    const sorted = [...topics];

    switch (sortBy) {
      case 'popular':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'replies':
        return sorted.sort((a, b) => b.replies_count - a.replies_count);
      case 'recent':
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  };

  // Format waktu relatif
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat topik Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/member/forum">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
              style={{ color: '#4880FF' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: '#1F2937' }}>
              Topik <span style={{ color: '#4880FF' }}>Saya</span>
            </h2>
            <p className="text-sm text-gray-600">Total: {topics.length} topik</p>
          </div>
        </div>

        <Link to="/member/forum/new">
          <button
            className="px-4 py-2 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
            style={{ backgroundColor: '#4880FF' }}
          >
            + Topik Baru
          </button>
        </Link>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-700">Urutkan:</label>
        {(['recent', 'popular', 'replies'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className="px-4 py-2 rounded-lg transition-all text-sm font-semibold"
            style={{
              backgroundColor: sortBy === option ? '#4880FF' : '#F3F4F6',
              color: sortBy === option ? 'white' : '#6B7280',
            }}
          >
            {option === 'recent'
              ? 'Terbaru'
              : option === 'popular'
                ? 'Populer'
                : 'Paling Banyak Balasan'}
          </button>
        ))}
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {getSortedTopics().length === 0 ? (
          <div
            className="p-12 rounded-xl text-center"
            style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}
          >
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">Anda belum membuat topik</p>
            <Link to="/member/forum/new">
              <button
                className="px-6 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: '#4880FF' }}
              >
                Buat Topik Pertama Anda
              </button>
            </Link>
          </div>
        ) : (
          getSortedTopics().map((topic) => (
            <div
              key={topic.id}
              className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all"
              style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <Link to={`/member/forum/topic/${topic.id}`}>
                    <h3
                      className="text-lg font-bold hover:underline cursor-pointer mb-2"
                      style={{ color: '#1F2937' }}
                    >
                      {topic.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                    <span
                      className="px-3 py-1 rounded-lg font-semibold"
                      style={{
                        backgroundColor: 'rgba(72, 128, 255, 0.1)',
                        color: '#4880FF',
                      }}
                    >
                      {topic.category}
                    </span>
                    <span style={{ color: '#6B7280' }}>•</span>
                    <span style={{ color: '#6B7280' }}>
                      Dibuat: {formatTimeAgo(topic.created_at)}
                    </span>
                    <span style={{ color: '#6B7280' }}>•</span>
                    <span style={{ color: '#6B7280' }}>
                      Diubah: {formatTimeAgo(topic.updated_at)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {topic.content}
                  </p>

                  <div className="flex items-center gap-6 text-sm">
                    <div
                      className="flex items-center gap-2"
                      style={{ color: '#4880FF', fontWeight: 500 }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{topic.replies_count}</span>
                    </div>
                    <div
                      className="flex items-center gap-2"
                      style={{ color: '#8280FF', fontWeight: 500 }}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{topic.likes}</span>
                    </div>
                    <div
                      className="flex items-center gap-2"
                      style={{ color: '#6B7280', fontWeight: 500 }}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{topic.views}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/member/forum/topic/${topic.id}/edit`}>
                    <button
                      className="p-2 rounded-lg hover:bg-blue-50 transition-all"
                      style={{ color: '#4880FF' }}
                      title="Edit topik"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteTopicClick(topic.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-all text-red-500"
                    title="Hapus topik"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#FEF3C7' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: '#F59E0B' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold mb-2" style={{ color: '#133E87' }}>
              Apakah Anda yakin ingin menghapus topik ini?
            </h3>
            <p className="text-gray-600 mb-6">
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3 w-full">
              <Button
                onClick={handleDeleteTopic}
                className="flex-1 text-white font-semibold"
                style={{ backgroundColor: '#EF4444' }}
              >
                OK
              </Button>
              <Button
                onClick={() => setShowConfirmModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#CBFFA9' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: '#133E87' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold mb-2" style={{ color: '#133E87' }}>
              {successMessage}
            </h3>

            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full text-white font-semibold mt-4"
              style={{ backgroundColor: '#4880FF' }}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
