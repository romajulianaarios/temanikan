import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, XCircle, Eye, MessageSquare } from '../icons';
import { forumAPI } from '../../services/api';

interface Reply {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface Topic {
  id: number;
  title: string;
  content: string;
  category: string;
  user_id: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  replies?: Reply[];
  reply_count?: number;
}

export default function ForumModeration() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Admin fetching forum topics...');
      
      const response = await forumAPI.getTopics(undefined, undefined);
      
      console.log('✅ Admin topics received:', response);
      setTopics(response.topics || []);
    } catch (error: any) {
      console.error('❌ Error fetching topics:', error);
      setError(error.response?.data?.error || 'Gagal memuat topik forum');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: number) => {
    try {
      console.log('🗑️ Deleting topic:', topicId);
      await forumAPI.deleteTopic(topicId);
      
      // Remove from local state
      setTopics(topics.filter(t => t.id !== topicId));
      setShowDeleteConfirm(false);
      setTopicToDelete(null);
      
      alert('Topik berhasil dihapus');
    } catch (error: any) {
      console.error('❌ Error deleting topic:', error);
      alert('Gagal menghapus topik: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleViewDetail = async (topic: Topic) => {
    try {
      console.log('📡 Fetching topic details...');
      const response = await forumAPI.getTopic(topic.id);
      console.log('✅ Topic details received:', response);
      setSelectedTopic(response.topic);
      setShowDetailModal(true);
    } catch (error) {
      console.error('❌ Error fetching topic details:', error);
      setSelectedTopic(topic);
      setShowDetailModal(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.user?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'Semua Kategori' || topic.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const totalTopics = topics.length;
  const totalReplies = topics.reduce((sum, t) => sum + (t.reply_count || 0), 0);
  const pinnedTopics = topics.filter(t => t.is_pinned).length;

  const moderationStats = [
    { label: 'Total Topik', value: totalTopics.toString(), color: '#608BC1' },
    { label: 'Total Balasan', value: totalReplies.toString(), color: '#4880FF' },
    { label: 'Topik Disematkan', value: pinnedTopics.toString(), color: '#10b981' },
    { label: 'Kategori Aktif', value: '6', color: '#8B5CF6' },
  ];

  const reportedContent_mock = [
    {
      id: 1,
      type: 'post',
      title: 'Tips Merawat Ikan Koi untuk Pemula',
      content: 'Ini adalah konten yang dilaporkan sebagai spam...',
      author: 'Ahmad Wijaya',
      reporter: 'Anonymous',
      reason: 'Spam',
      status: 'pending',
      date: '4 Nov 2025',
      severity: 'low'
    },
    {
      id: 2,
      type: 'comment',
      title: 'Re: Cara Mengatasi White Spot Disease',
      content: 'Komentar yang mengandung konten tidak pantas...',
      author: 'User123',
      reporter: 'Siti Nurhaliza',
      reason: 'Konten tidak pantas',
      status: 'pending',
      date: '3 Nov 2025',
      severity: 'high'
    },
    {
      id: 3,
      type: 'post',
      title: 'Jual Ikan Murah',
      content: 'Posting iklan jual beli yang tidak pada tempatnya...',
      author: 'Seller456',
      reporter: 'Budi Santoso',
      reason: 'Spam komersial',
      status: 'pending',
      date: '3 Nov 2025',
      severity: 'medium'
    },
    {
      id: 4,
      type: 'comment',
      title: 'Re: Rekomendasi Filter Terbaik',
      content: 'Informasi yang menyesatkan tentang produk...',
      author: 'Dewi Lestari',
      reporter: 'Ahmad Wijaya',
      reason: 'Informasi menyesatkan',
      status: 'approved',
      date: '2 Nov 2025',
      severity: 'medium'
    },
    {
      id: 5,
      type: 'post',
      title: 'Obat Ajaib Sembuhkan Semua Penyakit Ikan',
      content: 'Klaim palsu tentang produk obat ikan...',
      author: 'Scammer99',
      reporter: 'Multiple Users',
      reason: 'Penipuan dan informasi palsu',
      status: 'rejected',
      date: '1 Nov 2025',
      severity: 'high'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {moderationStats.map((stat, index) => (
          <Card key={index} className="p-6" style={{ backgroundColor: 'white' }}>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl" style={{ color: stat.color }}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Cari topik forum..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Kategori">Semua Kategori</SelectItem>
              <SelectItem value="Panduan">Panduan</SelectItem>
              <SelectItem value="Kesehatan">Kesehatan</SelectItem>
              <SelectItem value="Peralatan">Peralatan</SelectItem>
              <SelectItem value="Breeding">Breeding</SelectItem>
              <SelectItem value="Diskusi Umum">Diskusi Umum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Topics List */}
      {loading ? (
        <Card className="p-12 text-center" style={{ backgroundColor: 'white' }}>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Memuat topik forum...</p>
        </Card>
      ) : error ? (
        <Card className="p-12 text-center" style={{ backgroundColor: 'white' }}>
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-red-600 mb-2">{error}</p>
          <Button onClick={fetchTopics} variant="outline">Coba Lagi</Button>
        </Card>
      ) : filteredTopics.length === 0 ? (
        <Card className="p-12 text-center" style={{ backgroundColor: 'white' }}>
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Tidak ada topik forum</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTopics.map((item) => (
            <Card key={item.id} className="p-6" style={{ backgroundColor: 'white' }}>
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: '#CBDCEB' }}
                >
                  <MessageSquare className="w-6 h-6" style={{ color: '#608BC1' }} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 style={{ color: '#133E87' }}>{item.title}</h4>
                        {item.is_pinned && (
                          <Badge className="bg-yellow-100 text-yellow-800">Disematkan</Badge>
                        )}
                        <Badge 
                          variant="outline"
                          className="text-xs"
                          style={{ 
                            backgroundColor: 'rgba(72, 128, 255, 0.1)', 
                            color: '#4880FF', 
                            borderColor: 'rgba(72, 128, 255, 0.2)' 
                          }}
                        >
                          {item.category || 'Umum'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>Penulis: {item.user?.name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{item.reply_count || 0} balasan</span>
                        <span>•</span>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="p-3 rounded-lg mb-4"
                    style={{ backgroundColor: '#F3F3E0' }}
                  >
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-gray-700"
                      onClick={() => handleViewDetail(item)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Lihat Detail
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setTopicToDelete(item);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Hapus Topik
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Detail Topik Forum</DialogTitle>
          </DialogHeader>
          {selectedTopic && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Judul</p>
                <p style={{ color: '#133E87' }}>{selectedTopic.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kategori</p>
                  <Badge 
                    variant="outline"
                    style={{ 
                      backgroundColor: 'rgba(72, 128, 255, 0.1)', 
                      color: '#4880FF', 
                      borderColor: 'rgba(72, 128, 255, 0.2)' 
                    }}
                  >
                    {selectedTopic.category || 'Umum'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {selectedTopic.is_pinned ? (
                    <Badge className="bg-yellow-100 text-yellow-800">Disematkan</Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Penulis</p>
                  <p className="text-gray-700">{selectedTopic.user?.name || 'Anonymous'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email Penulis</p>
                  <p className="text-gray-700">{selectedTopic.user?.email || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Konten Topik</p>
                <div 
                  className="p-4 rounded-lg border max-h-[300px] overflow-y-auto"
                  style={{ borderColor: '#CBDCEB', backgroundColor: '#F5F6FA' }}
                >
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedTopic.content}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tanggal Dibuat</p>
                  <p className="text-gray-700">{formatDate(selectedTopic.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Terakhir Diupdate</p>
                  <p className="text-gray-700">{formatDate(selectedTopic.updated_at)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Balasan ({selectedTopic.replies?.length || 0})</p>
                {selectedTopic.replies && selectedTopic.replies.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedTopic.replies.map((reply) => (
                      <div 
                        key={reply.id}
                        className="p-3 rounded-lg border"
                        style={{ borderColor: '#E5E7EB', backgroundColor: 'white' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold" style={{ color: '#133E87' }}>
                            {reply.user?.name || 'Anonymous'}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Belum ada balasan</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setShowDetailModal(false);
                setSelectedTopic(null);
              }}
            >
              Tutup
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (selectedTopic) {
                  setShowDetailModal(false);
                  setTopicToDelete(selectedTopic);
                  setShowDeleteConfirm(true);
                }
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Hapus Topik
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: '#ef4444' }}>Konfirmasi Hapus Topik</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus topik ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {topicToDelete && (
            <div className="py-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                <p className="text-sm text-red-800">
                  <strong>Topik:</strong> {topicToDelete.title}
                </p>
                <p className="text-sm text-red-800 mt-1">
                  <strong>Penulis:</strong> {topicToDelete.user?.name || 'Anonymous'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setTopicToDelete(null);
              }}
            >
              Batal
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (topicToDelete) {
                  handleDeleteTopic(topicToDelete.id);
                }
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}