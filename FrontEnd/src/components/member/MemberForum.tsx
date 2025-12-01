import { useState, useEffect } from 'react';
import { Link } from '../Router';  // ✅ DIPERBAIKI: Custom Router
import { forumAPI } from '../../services/api';
import { useAuth } from '../AuthContext';  // ✅ DIPERBAIKI: Path relatif
import { useTranslation } from '../../contexts/LanguageContext';
import { formatTimeAgo } from '../../utils/dateFormat';

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
  const t = useTranslation();
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(t('forum.allTopics'));
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
          { name: t('forum.allTopics'), count: mappedTopics.length },
          ...Object.entries(categoryCounts).map(([name, count]) => ({
            name,
            count: count as number
          }))
        ];

        setCategories(categoryList);
      }
    } catch (err: any) {
      console.error('❌ Error fetching topics:', err);
      setError(err.response?.data?.message || t('forum.error'));
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
    if (selectedCategory !== t('forum.allTopics')) {
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
          <p className="text-gray-600">{t('forum.loading')}</p>
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
            {t('common.tryAgain')}
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
          <h2 className="text-3xl mb-2" style={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
            {t('forum.title')}
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Nunito Sans, sans-serif' }}>
            {t('forum.subtitle')}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/member/forum/new">
            <button
              className="bubble-button flex items-center gap-2 px-4 py-2 rounded-full text-white transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)',
                fontFamily: 'Nunito Sans, sans-serif',
                fontWeight: 700
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
              <Plus className="w-4 h-4" />
              {t('forum.newTopic')}
            </button>
          </Link>
          <Link to="/member/forum/my-topics">
            <button
              className="bubble-button flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
              style={{ 
                color: '#133E87',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(72, 128, 255, 0.2)',
                boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                fontFamily: 'Nunito Sans, sans-serif',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F5FF';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
              }}
            >
              {t('forum.myTopics')}
            </button>
          </Link>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative">
        <input
          type="text"
          placeholder={t('forum.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-4 py-3 rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(15, 91, 229, 0.3)',
            boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 91, 229, 0.25), 0 0 0 1px rgba(15, 91, 229, 0.4) inset';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
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
          className="bubble-card lg:col-span-1 p-6 h-fit transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif',
            borderRadius: '48px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
            e.currentTarget.style.boxShadow = '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
          }}
        >
          {/* Bubble glow effect */}
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
              filter: 'blur(15px)'
            }}
          ></div>
          <h3 className="mb-4 text-lg relative z-10" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
            {t('forum.category')}
          </h3>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className="w-full flex items-center justify-between p-3 transition-all duration-300 text-left cursor-pointer relative z-10"
                style={{
                  backgroundColor:
                    selectedCategory === category.name
                      ? 'rgba(72, 128, 255, 0.15)'
                      : 'rgba(255, 255, 255, 0.5)',
                  color: selectedCategory === category.name ? '#4880FF' : '#133E87',
                  fontWeight: selectedCategory === category.name ? 700 : 600,
                  border:
                    selectedCategory === category.name
                      ? '2px solid rgba(72, 128, 255, 0.4)'
                      : '2px solid rgba(72, 128, 255, 0.1)',
                  boxShadow: selectedCategory === category.name
                    ? '0 4px 15px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
                    : '0 2px 8px rgba(72, 128, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
                  fontFamily: 'Nunito Sans, sans-serif',
                  borderRadius: '24px'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.name) {
                    e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.4) inset';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.name) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(72, 128, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.3) inset';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span className="text-sm" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>{category.name}</span>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      selectedCategory === category.name
                        ? 'rgba(72, 128, 255, 0.3)'
                        : 'rgba(107, 114, 128, 0.15)',
                    color: selectedCategory === category.name ? '#FFFFFF' : '#6B7280',
                    fontFamily: 'Nunito Sans, sans-serif',
                    fontWeight: 600
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
                className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                  fontFamily: 'Nunito Sans, sans-serif',
                  borderRadius: '48px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(15, 91, 229, 0.3), 0 0 0 1px rgba(15, 91, 229, 0.4) inset';
                  e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8) inset';
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
                }}
              >
                {/* Bubble glow effect */}
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
                    filter: 'blur(15px)'
                  }}
                ></div>
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
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999998
          }}
          onClick={() => setShowReplies(false)}
        >
          <div
            className="max-w-2xl w-full max-h-[80vh] rounded-3xl overflow-hidden relative"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              border: '2px solid rgba(72, 128, 255, 0.2)',
              boxShadow: '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
              fontFamily: 'Nunito Sans, sans-serif',
              zIndex: 99999999
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-6 py-5 border-b" style={{ borderColor: 'rgba(72, 128, 255, 0.2)' }}>
              <div className="pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full bg-[#608BC1]/20 blur-2xl" />
              <h3 className="text-xl font-bold relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>
                {selectedTopic.replies_count} Balasan - {selectedTopic.title}
              </h3>
            </div>

            <div className="p-6 overflow-y-auto max-h-[500px]">
              <div className="space-y-4">
                {selectedTopic.replies && selectedTopic.replies.length > 0 ? (
                  selectedTopic.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-4 rounded-2xl transition-all duration-300 relative overflow-hidden"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid rgba(72, 128, 255, 0.2)',
                        boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                        fontFamily: 'Nunito Sans, sans-serif'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                        e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                        e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
                      }}
                    >
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
                          filter: 'blur(10px)'
                        }}
                      ></div>
                      <div className="flex items-start gap-3 relative z-10">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ 
                            backgroundColor: 'rgba(72, 128, 255, 0.15)',
                            border: '2px solid rgba(72, 128, 255, 0.3)',
                            boxShadow: '0 2px 8px rgba(72, 128, 255, 0.2)'
                          }}
                        >
                          <User className="w-5 h-5" style={{ color: '#4880FF' }} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>
                              {reply.author_name}
                            </span>
                            <span className="text-xs" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                              {formatTimeAgo(reply.created_at)}
                            </span>
                          </div>
                          <p className="text-sm mb-3" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>{reply.content}</p>
                          <div className="flex items-center gap-1 text-xs" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                            <ThumbsUp className="w-3 h-3" />
                            <span>{reply.likes} suka</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Belum ada balasan</div>
                )}
              </div>
            </div>

            <div className="p-4 border-t" style={{ borderColor: 'rgba(72, 128, 255, 0.2)' }}>
              <div className="flex gap-3">
                <Link to={`/member/forum/topic/${selectedTopic.id}`} className="flex-1">
                  <button
                    className="w-full py-2 rounded-full text-white font-semibold transition-all duration-300 bubble-button"
                    style={{ 
                      backgroundColor: '#4880FF',
                      border: '2px solid rgba(72, 128, 255, 0.4)',
                      boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
                      fontFamily: 'Nunito Sans, sans-serif',
                      fontWeight: 600
                    }}
                    onClick={() => setShowReplies(false)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.5) inset';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3) inset';
                    }}
                  >
                    Lihat Detail & Balas Topik
                  </button>
                </Link>
                <button
                  onClick={() => setShowReplies(false)}
                  className="px-4 py-2 rounded-full border transition-all duration-300 bubble-button"
                  style={{ 
                    borderColor: 'rgba(72, 128, 255, 0.3)',
                    color: '#133E87',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif',
                    fontWeight: 600
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F0F5FF';
                    e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                  }}
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
        <DialogContent 
          className="sm:max-w-md p-0"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          overlayStyle={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99999998
          }}
        >
          <div className="relative px-6 py-5">
            <div className="pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full bg-[#608BC1]/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-4 h-40 w-40 rounded-full bg-[#133E87]/10 blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>
                Laporkan Topik
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>
                    Alasan Laporan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl transition-all duration-300 focus:outline-none"
                    style={{ 
                      borderColor: 'rgba(72, 128, 255, 0.3)',
                      border: '2px solid rgba(72, 128, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                      fontFamily: 'Nunito Sans, sans-serif',
                      color: '#133E87'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.5)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                    }}
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
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Jelaskan lebih detail tentang laporan Anda..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl transition-all duration-300 focus:outline-none resize-none"
                    style={{ 
                      borderColor: 'rgba(72, 128, 255, 0.3)',
                      border: '2px solid rgba(72, 128, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                      fontFamily: 'Nunito Sans, sans-serif',
                      color: '#133E87'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.5)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmitReport}
                    disabled={!reportReason || submittingReport}
                    className="flex-1 text-white rounded-full transition-all duration-300 bubble-button"
                    style={{ 
                      backgroundColor: '#EF4444',
                      border: '2px solid rgba(239, 68, 68, 0.4)',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
                      fontFamily: 'Nunito Sans, sans-serif',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => {
                      if (!submittingReport && reportReason) {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 6px 25px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.5) inset';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3) inset';
                    }}
                  >
                    {submittingReport ? 'Mengirim...' : 'Kirim Laporan'}
                  </Button>
                  <Button
                    onClick={() => setShowReportModal(false)}
                    variant="outline"
                    disabled={submittingReport}
                    className="rounded-full transition-all duration-300 bubble-button"
                    style={{
                      borderColor: 'rgba(72, 128, 255, 0.3)',
                      color: '#133E87',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                      fontFamily: 'Nunito Sans, sans-serif',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => {
                      if (!submittingReport) {
                        e.currentTarget.style.backgroundColor = '#F0F5FF';
                        e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent 
          className="sm:max-w-md p-0"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          overlayStyle={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99999998
          }}
        >
          <div className="relative px-6 py-5">
            <div className="pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full bg-[#608BC1]/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-4 h-40 w-40 rounded-full bg-[#133E87]/10 blur-3xl" />
            <div className="flex flex-col items-center justify-center text-center relative z-10">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(203, 255, 169, 0.3)',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
                }}
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

              <h3 className="text-xl font-bold mb-2" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>
                Laporan Berhasil Dikirim
              </h3>
              <p className="mb-6" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                Terima kasih atas laporan Anda. Admin akan meninjau dan mengambil tindakan yang sesuai.
              </p>

              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full text-white font-semibold rounded-full transition-all duration-300 bubble-button"
                style={{ 
                  backgroundColor: '#4880FF',
                  border: '2px solid rgba(72, 128, 255, 0.4)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 600
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.5) inset';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3) inset';
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Already Reported Modal */}
      <Dialog open={showAlreadyReportedModal} onOpenChange={setShowAlreadyReportedModal}>
        <DialogContent 
          className="sm:max-w-md p-0"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          overlayStyle={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99999998
          }}
        >
          <div className="relative px-6 py-5">
            <div className="pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full bg-[#608BC1]/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-4 h-40 w-40 rounded-full bg-[#133E87]/10 blur-3xl" />
            <div className="flex flex-col items-center justify-center text-center relative z-10">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(254, 243, 199, 0.3)',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
                }}
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

              <h3 className="text-xl font-bold mb-2" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>
                Topik Sudah Dilaporkan
              </h3>
              <p className="mb-6" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                Anda sudah pernah melaporkan topik ini sebelumnya. Laporan Anda sedang ditinjau oleh admin.
              </p>

              <Button
                onClick={() => setShowAlreadyReportedModal(false)}
                className="w-full text-white font-semibold rounded-full transition-all duration-300 bubble-button"
                style={{ 
                  backgroundColor: '#4880FF',
                  border: '2px solid rgba(72, 128, 255, 0.4)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 600
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.5) inset';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3) inset';
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
