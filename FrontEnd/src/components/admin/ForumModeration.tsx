import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Flag, CheckCircle, XCircle, Eye, MessageSquare } from '../icons';
import { forumAPI } from '../../services/api';

interface Report {
  id: number;
  topic_id: number;
  topic_title?: string;
  reporter_id: number;
  reporter_name?: string;
  reason: string;
  description?: string;
  status: string;
  created_at: string;
  reviewed_at?: string;
  admin_notes?: string;
  topic?: {
    id: number;
    title: string;
    content: string;
    category: string;
    author?: {
      id: number;
      name: string;
      email: string;
    };
    reply_count?: number;
  };
}

interface Topic {
  id: number;
  title: string;
  content: string;
  category: string;
  user_id: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  reply_count?: number;
  like_count?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  replies?: any[];
}

export default function ForumModeration() {
  const [activeTab, setActiveTab] = useState('topics');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Confirmation & Notification Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'delete' | null>(null);
  const [confirmData, setConfirmData] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmMessage, setConfirmMessage] = useState({ title: '', description: '' });

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'topics') {
      loadTopics();
    } else {
      loadReports();
    }
  }, [activeTab, statusFilter, categoryFilter]);

  // Load topics
  const loadTopics = async () => {
    try {
      setLoading(true);
      const category = categoryFilter === 'Semua' ? undefined : categoryFilter;
      const response = await forumAPI.getTopics(category, undefined);
      if (response.success) {
        setTopics(response.topics || []);
      }
    } catch (error: any) {
      console.error('❌ Error loading topics:', error);
      // ✅ SILENT ERROR - Don't show alert
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };


  const loadReports = async () => {
    try {
      setLoading(true);
      let status = 'pending';
      if (statusFilter === 'Disetujui') status = 'approved';
      else if (statusFilter === 'Ditolak') status = 'rejected';
      else if (statusFilter === 'Semua Status') status = 'all';

      const response = await forumAPI.getReports(status);
      if (response.success) {
        setReports(response.reports || []);
      }
    } catch (error: any) {
      console.error('❌ Error loading reports:', error);
      // ✅ SILENT ERROR - Don't show alert, just log to console
      // User will see empty state "Tidak ada konten yang dilaporkan"
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter reports
  const getFilteredReports = () => {
    return reports.filter(report => {
      const matchesSearch = 
        report.topic_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reporter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  };

  // Get severity level
  const getSeverity = (reason: string): 'low' | 'medium' | 'high' => {
    const highSeverity = ['Konten tidak pantas', 'Harassment', 'Penipuan'];
    const mediumSeverity = ['Informasi menyesatkan', 'Spam komersial'];
    
    if (highSeverity.some(s => reason.includes(s))) return 'high';
    if (mediumSeverity.some(s => reason.includes(s))) return 'medium';
    return 'low';
  };

  // Get severity badge
  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    const styles = {
      high: { backgroundColor: '#fee2e2', color: '#dc2626' },
      medium: { backgroundColor: '#fef3c7', color: '#d97706' },
      low: { backgroundColor: '#dbeafe', color: '#2563eb' }
    };
    
    const labels = {
      high: 'Tinggi',
      medium: 'Sedang',
      low: 'Rendah'
    };

    return (
      <Badge style={styles[severity]}>
        {labels[severity]}
      </Badge>
    );
  };

  // Stats
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const approvedCount = reports.filter(r => r.status === 'approved').length;
  const rejectedCount = reports.filter(r => r.status === 'rejected').length;

  const moderationStats = [
    { label: 'Laporan Pending', value: pendingCount.toString(), color: '#f59e0b' },
    { label: 'Disetujui', value: approvedCount.toString(), color: '#10b981' },
    { label: 'Ditolak', value: rejectedCount.toString(), color: '#ef4444' },
  ];

  // Show confirmation modal
  const showConfirmation = (action: 'approve' | 'reject' | 'delete', data: any, title: string, description: string) => {
    setConfirmAction(action);
    setConfirmData(data);
    setConfirmMessage({ title, description });
    setShowConfirmModal(true);
  };

  // Handle approve
  const handleApproveClick = (reportId: number) => {
    showConfirmation(
      'approve',
      reportId,
      'Apakah Anda yakin ingin menyetujui laporan ini?',
      'Topik akan DIHAPUS PERMANEN.'
    );
  };

  const handleApprove = async (reportId: number) => {
    try {
      setSubmitting(true);
      const response = await forumAPI.approveReport(reportId, adminNotes);
      if (response.success) {
        setShowConfirmModal(false);
        setShowDetailModal(false);
        setSelectedReport(null);
        setAdminNotes('');
        setSuccessMessage('Laporan disetujui dan topik berhasil dihapus');
        setShowSuccessModal(true);
        loadReports();
      }
    } catch (error: any) {
      console.error('Error approving report:', error);
      setShowConfirmModal(false);
      setSuccessMessage(error.response?.data?.error || 'Gagal menyetujui laporan');
      setShowSuccessModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reject
  const handleRejectClick = (reportId: number) => {
    showConfirmation(
      'reject',
      reportId,
      'Apakah Anda yakin ingin menolak laporan ini?',
      'Topik akan TETAP ADA.'
    );
  };

  const handleReject = async (reportId: number) => {
    try {
      setSubmitting(true);
      const response = await forumAPI.rejectReport(reportId, adminNotes);
      if (response.success) {
        setShowConfirmModal(false);
        setShowDetailModal(false);
        setSelectedReport(null);
        setAdminNotes('');
        setSuccessMessage('Laporan ditolak. Topik tetap dipertahankan.');
        setShowSuccessModal(true);
        loadReports();
      }
    } catch (error: any) {
      console.error('Error rejecting report:', error);
      setShowConfirmModal(false);
      setSuccessMessage(error.response?.data?.error || 'Gagal menolak laporan');
      setShowSuccessModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete topic
  const handleDeleteTopicClick = (topicId: number) => {
    showConfirmation(
      'delete',
      topicId,
      'Apakah Anda yakin ingin menghapus topik ini?',
      'Tindakan ini tidak dapat dibatalkan.'
    );
  };

  const handleDeleteTopic = async (topicId: number) => {
    try {
      setSubmitting(true);
      const response = await forumAPI.deleteTopic(topicId);
      if (response.message || response.success) {
        setShowConfirmModal(false);
        setShowDetailModal(false);
        setSelectedTopic(null);
        setSuccessMessage('Topik berhasil dihapus');
        setShowSuccessModal(true);
        loadTopics();
      }
    } catch (error: any) {
      console.error('Error deleting topic:', error);
      setShowConfirmModal(false);
      setSuccessMessage(error.response?.data?.error || 'Gagal menghapus topik');
      setShowSuccessModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Open detail modal
  const openDetailModal = (report: Report) => {
    setSelectedReport(report);
    setAdminNotes('');
    setShowDetailModal(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = 
      topic.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {moderationStats.map((stat, index) => (
          <Card key={index} className="p-6" style={{ backgroundColor: 'white' }}>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl" style={{ color: stat.color }}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TabsList className="h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="topics"
              className="w-full data-[state=active]:bg-[#F3F3E0] data-[state=active]:border-2 data-[state=active]:border-[#4880FF] data-[state=active]:shadow-lg data-[state=inactive]:bg-white data-[state=inactive]:border-2 data-[state=inactive]:border-transparent hover:border-[#CBDCEB] p-6 rounded-xl transition-all shadow-sm h-auto"
            >
              <div className="flex items-center justify-center gap-3">
                <MessageSquare className="w-6 h-6" style={{ color: '#4880FF' }} />
                <div className="text-left">
                  <h3 style={{ color: '#4880FF' }}>Forum Temanikan</h3>
                  <p className="text-sm text-gray-600">Kelola semua topik forum</p>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsList className="h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="moderation"
              className="w-full data-[state=active]:bg-[#F3F3E0] data-[state=active]:border-2 data-[state=active]:border-[#4880FF] data-[state=active]:shadow-lg data-[state=inactive]:bg-white data-[state=inactive]:border-2 data-[state=inactive]:border-transparent hover:border-[#CBDCEB] p-6 rounded-xl transition-all shadow-sm h-auto"
            >
              <div className="flex items-center justify-center gap-3">
                <Flag className="w-6 h-6" style={{ color: '#4880FF' }} />
                <div className="text-left">
                  <h3 style={{ color: '#4880FF' }}>Moderasi Forum</h3>
                  <p className="text-sm text-gray-600">Kelola laporan & moderasi</p>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Forum Temanikan Tab */}
        <TabsContent value="topics" className="space-y-6 mt-6">
          {/* Search & Filter */}
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
                  <SelectItem value="Semua">Semua</SelectItem>
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
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>Oleh: {item.user?.name || 'Anonymous'}</span>
                            <span>•</span>
                            <Badge variant="outline" style={{ backgroundColor: 'rgba(72, 128, 255, 0.1)', color: '#4880FF' }}>
                              {item.category || 'Umum'}
                            </Badge>
                            <span>•</span>
                            <span>{new Date(item.updated_at).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{item.content}</p>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>{item.reply_count || 0} balasan</span>
                        <span>•</span>
                        <span>{item.like_count || 0} suka</span>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTopic(item);
                            setShowDetailModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </Button>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTopicClick(item.id)}
                          disabled={submitting}
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
        </TabsContent>

        {/* Moderasi Forum Tab */}
        <TabsContent value="moderation" className="space-y-6 mt-6">
      {/* Filters */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Cari konten yang dilaporkan..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Status">Semua Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Disetujui">Disetujui</SelectItem>
              <SelectItem value="Ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Reported Content List */}
      {loading ? (
        <Card className="p-12 text-center" style={{ backgroundColor: 'white' }}>
          <p style={{ color: '#6B7280' }}>Memuat laporan...</p>
        </Card>
      ) : getFilteredReports().length === 0 ? (
        <Card className="p-12 text-center" style={{ backgroundColor: 'white' }}>
          <Flag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p style={{ color: '#6B7280' }}>Tidak ada konten yang dilaporkan</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {getFilteredReports().map((report) => {
            const severity = getSeverity(report.reason);
            return (
              <Card key={report.id} className="p-6" style={{ backgroundColor: 'white' }}>
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: '#CBDCEB' }}
                  >
                    <Flag className="w-6 h-6" style={{ color: '#608BC1' }} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 style={{ color: '#133E87', fontWeight: 600 }}>
                            {report.topic_title || 'Topik Tidak Ditemukan'}
                          </h4>
                          {getSeverityBadge(severity)}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>Penulis: {report.topic?.author?.name || 'Anonymous'}</span>
                          <span>•</span>
                          <span>Dilaporkan oleh: {report.reporter_name || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{formatDate(report.created_at)}</span>
                        </div>
                      </div>
                      {report.status === 'pending' && (
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      )}
                      {report.status === 'approved' && (
                        <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
                      )}
                      {report.status === 'rejected' && (
                        <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
                      )}
                    </div>

                    <div 
                      className="p-3 rounded-lg mb-4"
                      style={{ backgroundColor: '#F3F3E0' }}
                    >
                      <p className="text-sm text-gray-700">
                        <strong>Alasan Laporan:</strong> {report.reason}
                      </p>
                      {report.description && (
                        <p className="text-sm text-gray-600 mt-2">{report.description}</p>
                      )}
                    </div>

                    {report.status === 'pending' ? (
                      <div className="flex items-center gap-3">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="text-gray-700"
                          onClick={() => openDetailModal(report)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </Button>
                        <Button 
                          size="sm"
                          className="text-white"
                          style={{ backgroundColor: '#10b981' }}
                          onClick={() => handleApproveClick(report.id)}
                          disabled={submitting}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Setujui
                        </Button>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectClick(report.id)}
                          disabled={submitting}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Tolak & Hapus
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm"
                        variant="outline"
                        className="text-gray-700"
                        onClick={() => openDetailModal(report)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden" style={{ backgroundColor: 'white' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Detail Laporan</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <p className="text-sm text-gray-600 mb-1">Judul</p>
                <p className="text-sm" style={{ color: '#133E87' }}>
                  {selectedReport.topic_title || 'Topik Tidak Ditemukan'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipe</p>
                  <Badge variant="outline" className="text-xs">Post</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tingkat Keparahan</p>
                  {getSeverityBadge(getSeverity(selectedReport.reason))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Penulis</p>
                  <p className="text-sm text-gray-700">
                    {selectedReport.topic?.author?.name || 'Anonymous'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dilaporkan oleh</p>
                  <p className="text-sm text-gray-700">
                    {selectedReport.reporter_name || 'Anonymous'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Alasan Laporan</p>
                <div 
                  className="p-2.5 rounded-lg"
                  style={{ backgroundColor: '#F3F3E0' }}
                >
                  <p className="text-sm text-gray-700">{selectedReport.reason}</p>
                  {selectedReport.description && (
                    <p className="text-xs text-gray-600 mt-1">{selectedReport.description}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Konten</p>
                <div 
                  className="p-3 rounded-lg border max-h-[150px] overflow-y-auto"
                  style={{ borderColor: '#CBDCEB', backgroundColor: '#F5F6FA' }}
                >
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    {selectedReport.topic?.title}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {selectedReport.topic?.content || 'Konten tidak tersedia'}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                    <span>Kategori: {selectedReport.topic?.category}</span>
                    <span>•</span>
                    <span>Balasan: {selectedReport.topic?.reply_count || 0}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tanggal Laporan</p>
                  <p className="text-sm text-gray-700">{formatDate(selectedReport.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {selectedReport.status === 'pending' && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>
                  )}
                  {selectedReport.status === 'approved' && (
                    <Badge className="bg-green-100 text-green-800 text-xs">Disetujui</Badge>
                  )}
                  {selectedReport.status === 'rejected' && (
                    <Badge className="bg-red-100 text-red-800 text-xs">Ditolak</Badge>
                  )}
                </div>
              </div>

              {selectedReport.status === 'pending' && (
                <>
                  <div 
                    className="p-3 rounded-lg border-l-4"
                    style={{ 
                      borderColor: '#f59e0b',
                      backgroundColor: '#fef3c7'
                    }}
                  >
                    <p className="text-xs text-yellow-800">
                      <strong>Tindakan diperlukan:</strong> Konten ini menunggu keputusan moderasi Anda.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Catatan Admin (Opsional)</p>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Tambahkan catatan tentang keputusan Anda..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </>
              )}

              {selectedReport.admin_notes && (
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#F3F3E0' }}
                >
                  <p className="text-xs font-medium mb-1" style={{ color: '#133E87' }}>Catatan Admin:</p>
                  <p className="text-sm text-gray-700">{selectedReport.admin_notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 mt-4 flex-row justify-end">
            {selectedReport?.status === 'pending' && (
              <>
                <Button 
                  size="sm"
                  className="text-white"
                  style={{ backgroundColor: '#10b981' }}
                  onClick={() => handleApproveClick(selectedReport.id)}
                  disabled={submitting}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {submitting ? 'Memproses...' : 'Setujui'}
                </Button>
                <Button 
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRejectClick(selectedReport.id)}
                  disabled={submitting}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  {submitting ? 'Memproses...' : 'Tolak & Hapus'}
                </Button>
              </>
            )}
            <Button 
              size="sm"
              variant="outline"
              onClick={() => {
                setShowDetailModal(false);
                setSelectedReport(null);
                setAdminNotes('');
              }}
              disabled={submitting}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </TabsContent>
      </Tabs>

      {/* Topic Detail Modal */}
      <Dialog open={showDetailModal && selectedTopic !== null} onOpenChange={(open) => {
        if (!open) {
          setShowDetailModal(false);
          setSelectedTopic(null);
        }
      }}>
        <DialogContent className="max-w-2xl" style={{ backgroundColor: 'white' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Detail Topik Forum</DialogTitle>
          </DialogHeader>
          {selectedTopic && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-sm text-gray-600 mb-1">Judul Topik</p>
                <p style={{ color: '#133E87', fontWeight: 600 }}>
                  {selectedTopic.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kategori</p>
                  <Badge variant="outline" style={{ backgroundColor: 'rgba(72, 128, 255, 0.1)', color: '#4880FF' }}>
                    {selectedTopic.category || 'Umum'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {selectedTopic.is_pinned && (
                    <Badge className="bg-yellow-100 text-yellow-800">Disematkan</Badge>
                  )}
                  {selectedTopic.is_locked && (
                    <Badge className="bg-red-100 text-red-800">Terkunci</Badge>
                  )}
                  {!selectedTopic.is_pinned && !selectedTopic.is_locked && (
                    <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Penulis</p>
                  <p className="text-gray-700">
                    {selectedTopic.user?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-500">
                    User ID: {selectedTopic.user_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email Penulis</p>
                  <p className="text-gray-700 text-sm">
                    {selectedTopic.user?.email || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tanggal Dibuat</p>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedTopic.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Terakhir Diupdate</p>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedTopic.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Konten Topik</p>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ borderColor: '#CBDCEB', backgroundColor: '#F5F6FA' }}
                >
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedTopic.content}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Balasan</p>
                  <p className="text-2xl" style={{ color: '#4880FF' }}>
                    {selectedTopic.reply_count || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Suka</p>
                  <p className="text-2xl" style={{ color: '#ef4444' }}>
                    {selectedTopic.like_count || 0}
                  </p>
                </div>
              </div>

              {selectedTopic.replies && selectedTopic.replies.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Balasan ({selectedTopic.replies.length})</p>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedTopic.replies.map((reply: any) => (
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
                            {new Date(reply.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 mt-6">
            <Button 
              variant="destructive"
              onClick={() => {
                setShowDetailModal(false);
                handleDeleteTopicClick(selectedTopic.id);
              }}
              disabled={submitting}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Hapus Topik
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setShowDetailModal(false);
                setSelectedTopic(null);
              }}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              {confirmMessage.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmMessage.description}
            </p>

            <div className="flex gap-3 w-full">
              <Button
                onClick={() => {
                  setShowConfirmModal(false);
                  if (confirmAction === 'approve') {
                    handleApprove(confirmData);
                  } else if (confirmAction === 'reject') {
                    handleReject(confirmData);
                  } else if (confirmAction === 'delete') {
                    handleDeleteTopic(confirmData);
                  }
                }}
                className="flex-1 text-white font-semibold"
                style={{ backgroundColor: '#EF4444' }}
                disabled={submitting}
              >
                {submitting ? 'Memproses...' : 'OK'}
              </Button>
              <Button
                onClick={() => setShowConfirmModal(false)}
                variant="outline"
                className="flex-1"
                disabled={submitting}
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
