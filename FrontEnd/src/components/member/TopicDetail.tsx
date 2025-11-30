import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '../Router';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent } from '../ui/dialog';
import { ThumbsUp, MessageSquare, ArrowLeft, User, Eye } from '../icons';
import { forumAPI } from '../../services/api';
import { formatTimeAgo } from '../../utils/dateFormat';

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
  author_name: string;
  category: string;
  content: string;
  likes: number;
  replies: Reply[];
  views: number;
  created_at: string;
  is_pinned?: boolean;
}

export default function TopicDetail() {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const [newReply, setNewReply] = useState('');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  // Like state
  const [likingTopic, setLikingTopic] = useState(false);

  // Fetch topic detail from database
  useEffect(() => {
    fetchTopicDetail();
  }, [topicId]);

  const fetchTopicDetail = async () => {
    try {
      setLoading(true);
      const id = Number(topicId);
      
      if (!id) {
        navigate('/member/forum');
        return;
      }

      const response = await forumAPI.getTopic(id);
      console.log('📥 Topic detail from database:', response);

      if (response.success && response.topic) {
        // Map backend data to frontend format
        const mappedTopic: Topic = {
          id: response.topic.id,
          title: response.topic.title,
          author_name: response.topic.author?.name || response.topic.author?.username || 'Anonymous',
          category: response.topic.category || 'Umum',
          content: response.topic.content,
          likes: response.topic.like_count || 0,
          views: response.topic.views || 0,
          created_at: response.topic.created_at,
          is_pinned: response.topic.is_pinned || false,
          replies: response.topic.replies?.map((reply: any) => ({
            id: reply.id,
            author_name: reply.author?.name || reply.author?.username || 'Anonymous',
            content: reply.content,
            likes: reply.like_count || 0,
            created_at: reply.created_at
          })) || []
        };
        
        setTopic(mappedTopic);
      } else {
        setModalMessage('Topik tidak ditemukan');
        setShowErrorModal(true);
        setTimeout(() => navigate('/member/forum'), 2000);
      }
    } catch (err: any) {
      console.error('❌ Error fetching topic:', err);
      setModalMessage('Gagal memuat topik');
      setShowErrorModal(true);
      setTimeout(() => navigate('/member/forum'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReply.trim()) {
      setModalMessage('Balasan tidak boleh kosong');
      setShowErrorModal(true);
      return;
    }

    if (newReply.trim().length < 10) {
      setModalMessage('Balasan minimal 10 karakter');
      setShowErrorModal(true);
      return;
    }

    try {
      setSubmitting(true);
      const id = Number(topicId);
      
      console.log('📤 Sending reply:', {
        topic_id: id,
        content: newReply.trim()
      });

      const response = await forumAPI.addReply(id, newReply.trim());

      console.log('✅ Reply created:', response);

      if (response.success || response.reply) {
        setNewReply('');
        setModalMessage('Balasan berhasil dikirim!');
        setShowSuccessModal(true);
        // Refresh topic to show new reply
        fetchTopicDetail();
      }
    } catch (err: any) {
      console.error('❌ Error creating reply:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Gagal mengirim balasan';
      setModalMessage(errorMessage);
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Like Topic
  const handleLikeTopic = async () => {
    if (likingTopic || !topic) return;
    
    try {
      setLikingTopic(true);
      const id = Number(topicId);
      
      const response = await forumAPI.toggleTopicLike(id);
      console.log('👍 Like toggled:', response);
      
      // Update topic like count
      if (response.like_count !== undefined) {
        setTopic({ ...topic, likes: response.like_count });
      }
    } catch (err: any) {
      console.error('❌ Error toggling like:', err);
      setModalMessage('Gagal menyukai topik');
      setShowErrorModal(true);
    } finally {
      setLikingTopic(false);
    }
  };


  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat topik...</p>
        </div>
      </div>
    );
  }

  // No topic found
  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Topik tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/member/forum')}
          style={{ color: '#608BC1' }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Forum
        </Button>
      </div>

      {/* Original Post */}
      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          fontFamily: 'Nunito Sans, sans-serif'
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
        <div className="flex items-start gap-4 relative z-10">
          <Avatar className="w-12 h-12" style={{ backgroundColor: '#CBDCEB' }}>
            <AvatarFallback>
              <User className="w-6 h-6" style={{ color: '#608BC1' }} />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>{topic.title}</h2>
                  {topic.is_pinned && (
                    <Badge 
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: 'rgba(254, 197, 61, 0.15)',
                        color: '#FEC53D',
                        border: '1px solid rgba(254, 197, 61, 0.3)',
                        fontWeight: 700,
                        fontFamily: 'Nunito Sans, sans-serif'
                      }}
                    >
                      Populer
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                  <span style={{ color: '#133E87', fontWeight: 600 }}>{topic.author_name}</span>
                  <span>•</span>
                  <Badge 
                    variant="outline"
                    className="rounded-full px-3 py-1"
                    style={{
                      backgroundColor: 'rgba(72, 128, 255, 0.1)',
                      color: '#4880FF',
                      border: '1px solid rgba(72, 128, 255, 0.2)',
                      fontWeight: 600,
                      fontFamily: 'Nunito Sans, sans-serif'
                    }}
                  >
                    {topic.category}
                  </Badge>
                  <span>•</span>
                  <span>{formatTimeAgo(topic.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-4">
              <p className="text-gray-700 whitespace-pre-line">{topic.content}</p>
            </div>

            <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: '#CBDCEB' }}>
              <button
                onClick={handleLikeTopic}
                disabled={likingTopic}
                className="flex items-center gap-2 text-sm hover:opacity-70 transition disabled:opacity-50"
                style={{ color: '#8280FF', fontWeight: 500 }}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{topic.likes}</span>
              </button>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: '#4880FF', fontWeight: 500 }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{topic.replies.length}</span>
              </div>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: '#6B7280', fontWeight: 500 }}
              >
                <Eye className="w-4 h-4" />
                <span>{topic.views}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Replies */}
      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          fontFamily: 'Nunito Sans, sans-serif'
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
        <h3 className="mb-4 relative z-10" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
          {topic.replies.length} Balasan
        </h3>

        <div className="space-y-4 relative z-10">
          {topic.replies.map((reply) => (
            <div 
              key={reply.id}
              className="p-4 rounded-xl transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(72, 128, 255, 0.05)',
                border: '1px solid rgba(72, 128, 255, 0.2)',
                boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10" style={{ backgroundColor: '#CBDCEB' }}>
                  <AvatarFallback>
                    <User className="w-5 h-5" style={{ color: '#608BC1' }} />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm" style={{ color: '#133E87' }}>{reply.author_name}</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(reply.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{reply.content}</p>
                  <button 
                    className="text-xs hover:opacity-70 transition"
                    style={{ color: '#4880FF' }}
                    title="Balas"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reply Form */}
      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          fontFamily: 'Nunito Sans, sans-serif'
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
        <h3 className="mb-4 relative z-10" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Tulis Balasan</h3>
        
        <form onSubmit={handleSubmitReply} className="relative z-10">
          <Textarea
            placeholder="Tulis balasan Anda di sini..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            rows={5}
            className="mb-4 rounded-xl"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(72, 128, 255, 0.2)',
              boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1)',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
          />
          
          <div className="flex gap-3">
            <Button
              type="submit"
              className="bubble-button text-white rounded-full transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)',
                fontFamily: 'Nunito Sans, sans-serif',
                fontWeight: 700
              }}
              onMouseEnter={(e) => {
                if (!(!newReply.trim() || submitting)) {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!(!newReply.trim() || submitting)) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
                }
              }}
              disabled={!newReply.trim() || submitting}
            >
              {submitting ? 'Mengirim...' : 'Kirim Balasan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full transition-all duration-300"
              style={{
                border: '2px solid rgba(72, 128, 255, 0.2)',
                color: '#133E87',
                fontFamily: 'Nunito Sans, sans-serif',
                fontWeight: 600
              }}
              onClick={() => setNewReply('')}
            >
              Batal
            </Button>
          </div>
        </form>
      </Card>

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
              {modalMessage}
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

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: '#EF4444' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold mb-2" style={{ color: '#133E87' }}>
              {modalMessage}
            </h3>

            <Button
              onClick={() => setShowErrorModal(false)}
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
