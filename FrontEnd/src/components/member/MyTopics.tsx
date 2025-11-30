import { useState, useEffect } from 'react';
import { Link } from '../Router';  // ✅ DIPERBAIKI: Custom Router
import { forumAPI } from '../../services/api';
import { useAuth } from '../AuthContext';  // ✅ DIPERBAIKI: Path relatif
import { formatTimeAgo } from '../../utils/dateFormat';

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
              style={{ color: '#FFFFFF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#4880FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
              Topik <span style={{ color: '#FFFFFF' }}>Saya</span>
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
            className="bubble-card p-12 rounded-[32px] text-center transition-all duration-300 relative overflow-hidden"
            style={{ 
              backgroundColor: '#FFFFFF',
              border: '2px solid rgba(72, 128, 255, 0.2)',
              boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
          >
            <User className="w-12 h-12 mx-auto mb-4 relative z-10" style={{ color: 'rgba(72, 128, 255, 0.3)' }} />
            <p className="mb-4 relative z-10" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Anda belum membuat topik</p>
            <Link to="/member/forum/new" className="relative z-10">
              <button
                className="bubble-button px-6 py-2 rounded-full text-white font-semibold transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
                }}
              >
                Buat Topik Pertama Anda
              </button>
            </Link>
          </div>
        ) : (
          getSortedTopics().map((topic) => (
            <div
              key={topic.id}
              className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '2px solid rgba(72, 128, 255, 0.2)',
                boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
              }}
            >
              {/* Bubble glow effect */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                  filter: 'blur(20px)'
                }}
              ></div>
              <div className="flex justify-between items-start gap-4 relative z-10">
                <div className="flex-1">
                  <Link to={`/member/forum/topic/${topic.id}`}>
                    <h3
                      className="text-lg font-bold hover:underline cursor-pointer mb-2"
                      style={{ color: '#133E87', fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif' }}
                    >
                      {topic.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 mb-3 text-sm" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                    <span
                      className="px-3 py-1 rounded-full font-semibold"
                      style={{
                        backgroundColor: 'rgba(72, 128, 255, 0.1)',
                        color: '#4880FF',
                        border: '1px solid rgba(72, 128, 255, 0.2)',
                        fontWeight: 600
                      }}
                    >
                      {topic.category}
                    </span>
                    <span style={{ color: '#608BC1' }}>•</span>
                    <span style={{ color: '#608BC1' }}>
                      Dibuat: {formatTimeAgo(topic.created_at)}
                    </span>
                    <span style={{ color: '#608BC1' }}>•</span>
                    <span style={{ color: '#608BC1' }}>
                      Diubah: {formatTimeAgo(topic.updated_at)}
                    </span>
                  </div>

                  <p className="text-sm line-clamp-2 mb-4" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
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
