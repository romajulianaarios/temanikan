import { useState, useEffect } from 'react';
import { Link } from '../Router';  // ✅ DIPERBAIKI: Custom Router
import { forumAPI } from '../../services/api';
import { useAuth } from '../AuthContext';  // ✅ DIPERBAIKI: Path relatif

// Lucide Icons
import { MessageSquare, ThumbsUp, User, Plus, Flag, Search } from 'lucide-react';

// UI Components
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';

interface Reply {
  id: number;
  author_name: string;
  content: string;
  likes: number;
  created_at: string;
}

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
  user_liked?: boolean;
  replies?: Reply[];
}

interface Category {
  name: string;
  count: number;
}

export default function MemberForum() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Topik');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Report Modal States
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTopicId, setReportTopicId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  
  // Success/Error Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlreadyReportedModal, setShowAlreadyReportedModal] = useState(false);
  
  // Like States
  const [likingTopics, setLikingTopics] = useState<Set<number>>(new Set());

  // Fetch topics dari database
  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await forumAPI.getTopics();
      console.log('📥 Topics from database:', response);

      if (response.success && response.topics) {
        // Map backend data to frontend format
        const mappedTopics = response.topics.map((topic: any) => {
          // Capitalize each word in category
          const rawCategory = topic.category || 'umum';
          const capitalizedCategory = rawCategory
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          
          return {
            id: topic.id,
            title: topic.title,
            content: topic.content,
            author_name: topic.author?.name || topic.author?.username || 'Anonymous',
            category: capitalizedCategory,
            replies_count: topic.reply_count || 0,
            likes: topic.like_count || 0,
            views: topic.views || 0,
            created_at: topic.created_at,
            updated_at: topic.updated_at,
            is_pinned: topic.is_pinned || false,
            user_liked: topic.user_liked || false
          };
        });
        
        setTopics(mappedTopics);
        
        // Hitung kategori dan count-nya dari data
        const categoryCounts = mappedTopics.reduce((acc: Record<string, number>, topic: Topic) => {
          acc[topic.category] = (acc[topic.category] || 0) + 1;
          return acc;
        }, {});

        const categoryList: Category[] = [
          { name: 'Semua Topik', count: mappedTopics.length },
          ...Object.entries(categoryCounts).map(([name, count]) => ({
            name,
            count: count as number
          }))
        ];

        setCategories(categoryList);
      }
    } catch (err: any) {
      console.error('❌ Error fetching topics:', err);
      setError(err.response?.data?.message || 'Gagal memuat topik forum');
    } finally {
      setLoading(false);
    }
  };

  // Fetch replies untuk topik tertentu
  const handleViewReplies = async (topic: Topic) => {
    try {
      const response = await forumAPI.getTopic(topic.id);
      console.log('📥 Topic detail from database:', response);

      if (response.success && response.topic) {
        // Map replies if they exist
        const mappedReplies = response.topic.replies?.map((reply: any) => ({
          id: reply.id,
          author_name: reply.author?.name || reply.author?.username || 'Anonymous',
          content: reply.content,
          likes: reply.like_count || 0,
          created_at: reply.created_at
        })) || [];
        
        setSelectedTopic({
          ...topic,
          replies: mappedReplies
        });
        setShowReplies(true);
      }
    } catch (err) {
      console.error('❌ Error fetching replies:', err);
      setSelectedTopic(topic);
      setShowReplies(true);
    }
  };

  // Filter topics berdasarkan kategori dan search query
  const getFilteredTopics = () => {
    let filtered = topics;
    
    // Filter by category
    if (selectedCategory !== 'Semua Topik') {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }
    
    // Filter by search query (title or author)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(query) ||
        topic.author_name.toLowerCase().includes(query)
      );
    }
    
    return filtered;
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

  // Handle Report Topic
  const handleReportClick = (topicId: number) => {
    setReportTopicId(topicId);
    setReportReason('');
    setReportDescription('');
    setShowReportModal(true);
  };

  const handleSubmitReport = async () => {
    if (!reportTopicId || !reportReason) {
      alert('Silakan pilih alasan laporan');
      return;
    }

    try {
      setSubmittingReport(true);
      const response = await forumAPI.reportTopic(reportTopicId, {
        reason: reportReason,
        description: reportDescription
      });

      console.log('✅ Report submitted:', response);
      
      setShowReportModal(false);
      
      // Check if already reported
      if (response.message && response.message.includes('sudah')) {
        setShowAlreadyReportedModal(true);
      } else {
        setShowSuccessModal(true);
      }
      
    } catch (err: any) {
      console.error('❌ Error submitting report:', err);
      
      // Check if already reported from error response
      if (err.response?.data?.error?.includes('sudah')) {
        setShowReportModal(false);
        setShowAlreadyReportedModal(true);
      } else {
        alert(err.response?.data?.error || 'Gagal mengirim laporan');
      }
    } finally {
      setSubmittingReport(false);
    }
  };

  // Handle Like Topic
  const handleLikeTopic = async (topicId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (likingTopics.has(topicId)) return;
    
    try {
      setLikingTopics(prev => new Set(prev).add(topicId));
      
      const response = await forumAPI.toggleTopicLike(topicId);
      console.log('👍 Like toggled:', response);
      
      // Update topic like count and liked status in state
      setTopics(prevTopics => 
        prevTopics.map(topic => 
          topic.id === topicId 
            ? { 
                ...topic, 
                likes: response.like_count || topic.likes,
                user_liked: response.liked !== undefined ? response.liked : !topic.user_liked
              }
            : topic
        )
      );
    } catch (err: any) {
      console.error('❌ Error toggling like:', err);
    } finally {
      setLikingTopics(prev => {
        const newSet = new Set(prev);
        newSet.delete(topicId);
        return newSet;
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat forum...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchTopics}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl mb-2" style={{ color: '#1F2937', fontWeight: 700 }}>
            Forum <span style={{ color: '#4880FF' }}>Komunitas</span>
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Berbagi pengalaman dan tips dengan komunitas
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/member/forum/new">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:shadow-lg transition-all"
              style={{ backgroundColor: '#4880FF' }}
            >
              <Plus className="w-4 h-4" />
              Topik Baru
            </button>
          </Link>
          <Link to="/member/forum/my-topics">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
              style={{ color: '#4880FF', border: '1px solid #4880FF' }}
            >
              Lihat Topik Saya
            </button>
          </Link>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5" style={{ color: '#9CA3AF' }} />
        </div>
        <input
          type="text"
          placeholder="Cari topik berdasarkan judul atau nama penulis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
          style={{ backgroundColor: 'white' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div
          className="lg:col-span-1 p-6 h-fit rounded-xl shadow-md border"
          style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
        >
          <h3 className="mb-4 text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>
            Kategori
          </h3>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className="w-full flex items-center justify-between p-3 rounded-lg transition-all text-left hover:bg-gray-50 hover:shadow-md cursor-pointer"
                style={{
                  backgroundColor:
                    selectedCategory === category.name
                      ? 'rgba(72, 128, 255, 0.1)'
                      : 'transparent',
                  color: selectedCategory === category.name ? '#4880FF' : '#1F2937',
                  fontWeight: selectedCategory === category.name ? 600 : 400,
                  border:
                    selectedCategory === category.name
                      ? '1px solid rgba(72, 128, 255, 0.2)'
                      : '1px solid transparent',
                }}
              >
                <span className="text-sm">{category.name}</span>
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor:
                      selectedCategory === category.name
                        ? 'rgba(72, 128, 255, 0.2)'
                        : 'rgba(107, 114, 128, 0.1)',
                    color: selectedCategory === category.name ? '#4880FF' : '#6B7280',
                  }}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        <div className="lg:col-span-3 space-y-4">
          {getFilteredTopics().length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery ? (
                <div>
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-semibold mb-2">Tidak ada hasil</p>
                  <p className="text-sm">Tidak ditemukan topik dengan kata kunci "{searchQuery}"</p>
                  <p className="text-sm mt-1">
                    {selectedCategory !== 'Semua Topik' && `di kategori ${selectedCategory}`}
                  </p>
                </div>
              ) : (
                <p>Belum ada topik di kategori ini</p>
              )}
            </div>
          ) : (
            getFilteredTopics().map((topic) => (
              <div
                key={topic.id}
                className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all"
                style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
              >
                <div className="flex gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(72, 128, 255, 0.1)' }}
                  >
                    <User className="w-6 h-6" style={{ color: '#4880FF' }} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link to={`/member/forum/topic/${topic.id}`}>
                          <h4
                            className="mb-1 hover:underline cursor-pointer text-lg"
                            style={{ color: '#1F2937', fontWeight: 600 }}
                          >
                            {topic.title}
                            {topic.is_pinned && (
                              <span
                                className="ml-2 text-xs px-2 py-1 rounded"
                                style={{
                                  backgroundColor: 'rgba(254, 197, 61, 0.1)',
                                  color: '#FEC53D',
                                }}
                              >
                                Populer
                              </span>
                            )}
                          </h4>
                        </Link>
                        <div
                          className="flex items-center gap-3 text-sm"
                          style={{ color: '#6B7280' }}
                        >
                          <span>{topic.author_name}</span>
                          <span>•</span>
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: 'rgba(72, 128, 255, 0.1)',
                              color: '#4880FF',
                              border: '1px solid rgba(72, 128, 255, 0.2)',
                            }}
                          >
                            {topic.category}
                          </span>
                          <span>•</span>
                          <span>{formatTimeAgo(topic.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 text-sm">
                      <button
                        onClick={() => handleViewReplies(topic)}
                        className="flex items-center gap-2 hover:opacity-70 transition-all"
                        style={{ color: '#4880FF', fontWeight: 500 }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{topic.replies_count}</span>
                      </button>
                      <button
                        onClick={(e) => handleLikeTopic(topic.id, e)}
                        disabled={likingTopics.has(topic.id)}
                        className="flex items-center gap-2 hover:opacity-70 transition-all disabled:opacity-50"
                        style={{ color: '#8280FF', fontWeight: 500 }}
                      >
                        <ThumbsUp 
                          className="w-4 h-4" 
                          fill={topic.user_liked ? 'currentColor' : 'none'}
                        />
                        <span>{topic.likes}</span>
                      </button>
                      <button
                        onClick={() => handleReportClick(topic.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-all"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Replies Modal */}
      {showReplies && selectedTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-2xl w-full max-h-[80vh] rounded-xl overflow-hidden"
            style={{ backgroundColor: '#F3F3E0' }}
          >
            <div className="p-6 border-b" style={{ borderColor: '#CBDCEB' }}>
              <h3 className="text-xl font-bold" style={{ color: '#133E87' }}>
                {selectedTopic.replies_count} Balasan - {selectedTopic.title}
              </h3>
            </div>

            <div className="p-6 overflow-y-auto max-h-[500px]">
              <div className="space-y-4">
                {selectedTopic.replies && selectedTopic.replies.length > 0 ? (
                  selectedTopic.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: 'white' }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#CBDCEB' }}
                        >
                          <User className="w-5 h-5" style={{ color: '#608BC1' }} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold" style={{ color: '#133E87' }}>
                              {reply.author_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(reply.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{reply.content}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{reply.likes} suka</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">Belum ada balasan</div>
                )}
              </div>
            </div>

            <div className="p-4 border-t" style={{ borderColor: '#CBDCEB' }}>
              <div className="flex gap-3">
                <Link to={`/member/forum/topic/${selectedTopic.id}`} className="flex-1">
                  <button
                    className="w-full py-2 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: '#133E87' }}
                    onClick={() => setShowReplies(false)}
                  >
                    Lihat Detail & Balas Topik
                  </button>
                </Link>
                <button
                  onClick={() => setShowReplies(false)}
                  className="px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#133E87', color: '#133E87' }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#133E87' }}>
              Laporkan Topik
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#133E87' }}>
                  Alasan Laporan <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <option value="">Pilih alasan</option>
                  <option value="spam">Spam atau iklan</option>
                  <option value="inappropriate">Konten tidak pantas</option>
                  <option value="misleading">Informasi menyesatkan</option>
                  <option value="harassment">Pelecehan atau bullying</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#133E87' }}>
                  Deskripsi (Opsional)
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Jelaskan lebih detail tentang laporan Anda..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitReport}
                  disabled={!reportReason || submittingReport}
                  className="flex-1 text-white"
                  style={{ backgroundColor: '#EF4444' }}
                >
                  {submittingReport ? 'Mengirim...' : 'Kirim Laporan'}
                </Button>
                <Button
                  onClick={() => setShowReportModal(false)}
                  variant="outline"
                  disabled={submittingReport}
                >
                  Batal
                </Button>
              </div>
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
              Laporan Berhasil Dikirim
            </h3>
            <p className="text-gray-600 mb-6">
              Terima kasih atas laporan Anda. Admin akan meninjau dan mengambil tindakan yang sesuai.
            </p>

            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full text-white font-semibold"
              style={{ backgroundColor: '#4880FF' }}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Already Reported Modal */}
      <Dialog open={showAlreadyReportedModal} onOpenChange={setShowAlreadyReportedModal}>
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
              Topik Sudah Dilaporkan
            </h3>
            <p className="text-gray-600 mb-6">
              Anda sudah pernah melaporkan topik ini sebelumnya. Laporan Anda sedang ditinjau oleh admin.
            </p>

            <Button
              onClick={() => setShowAlreadyReportedModal(false)}
              className="w-full text-white font-semibold"
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
