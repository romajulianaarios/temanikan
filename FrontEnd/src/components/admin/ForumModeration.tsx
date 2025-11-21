import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Flag, CheckCircle, XCircle, Eye } from '../icons';

interface ReportedContent {
  id: number;
  type: 'post' | 'comment';
  title: string;
  content?: string;
  author: string;
  reporter: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  severity: 'low' | 'medium' | 'high';
}

export default function ForumModeration() {
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([
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
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [severityFilter, setSeverityFilter] = useState('Semua Tingkat');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);

  // Filter reported content
  const filteredContent = reportedContent.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporter.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'Pending') matchesStatus = item.status === 'pending';
    else if (statusFilter === 'Disetujui') matchesStatus = item.status === 'approved';
    else if (statusFilter === 'Ditolak') matchesStatus = item.status === 'rejected';
    
    let matchesSeverity = true;
    if (severityFilter === 'Tinggi') matchesSeverity = item.severity === 'high';
    else if (severityFilter === 'Sedang') matchesSeverity = item.severity === 'medium';
    else if (severityFilter === 'Rendah') matchesSeverity = item.severity === 'low';
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Stats
  const pendingCount = reportedContent.filter(r => r.status === 'pending').length;
  const reviewedTodayCount = reportedContent.filter(r => r.date.includes('Nov 2025')).length;
  const approvedCount = reportedContent.filter(r => r.status === 'approved').length;
  const rejectedCount = reportedContent.filter(r => r.status === 'rejected').length;

  const moderationStats = [
    { label: 'Laporan Pending', value: pendingCount.toString(), color: '#f59e0b' },
    { label: 'Direview Hari Ini', value: reviewedTodayCount.toString(), color: '#608BC1' },
    { label: 'Disetujui', value: approvedCount.toString(), color: '#10b981' },
    { label: 'Ditolak', value: rejectedCount.toString(), color: '#ef4444' },
  ];

  // Handle Approve
  const handleApprove = (id: number) => {
    setReportedContent(reportedContent.map(item =>
      item.id === id ? { ...item, status: 'approved' as const } : item
    ));
  };

  // Handle Reject & Delete
  const handleRejectAndDelete = (id: number) => {
    setReportedContent(reportedContent.map(item =>
      item.id === id ? { ...item, status: 'rejected' as const } : item
    ));
  };

  // Open Detail Modal
  const openDetailModal = (report: ReportedContent) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

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
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Tingkat">Semua Tingkat</SelectItem>
              <SelectItem value="Tinggi">Tinggi</SelectItem>
              <SelectItem value="Sedang">Sedang</SelectItem>
              <SelectItem value="Rendah">Rendah</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Reported Content List */}
      {filteredContent.length === 0 ? (
        <Card className="p-12 text-center" style={{ backgroundColor: 'white' }}>
          <Flag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Tidak ada konten yang dilaporkan</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContent.map((item) => (
            <Card key={item.id} className="p-6" style={{ backgroundColor: 'white' }}>
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
                        <h4 style={{ color: '#133E87' }}>{item.title}</h4>
                        {item.severity === 'high' && (
                          <Badge className="bg-red-100 text-red-800">Tinggi</Badge>
                        )}
                        {item.severity === 'medium' && (
                          <Badge className="bg-yellow-100 text-yellow-800">Sedang</Badge>
                        )}
                        {item.severity === 'low' && (
                          <Badge className="bg-blue-100 text-blue-800">Rendah</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>Penulis: {item.author}</span>
                        <span>•</span>
                        <span>Dilaporkan oleh: {item.reporter}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                    {item.status === 'pending' && (
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    )}
                    {item.status === 'approved' && (
                      <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
                    )}
                    {item.status === 'rejected' && (
                      <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
                    )}
                  </div>

                  <div 
                    className="p-3 rounded-lg mb-4"
                    style={{ backgroundColor: '#F3F3E0' }}
                  >
                    <p className="text-sm text-gray-700">
                      <strong>Alasan Laporan:</strong> {item.reason}
                    </p>
                  </div>

                  {item.status === 'pending' ? (
                    <div className="flex items-center gap-3">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="text-gray-700"
                        onClick={() => openDetailModal(item)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </Button>
                      <Button 
                        size="sm"
                        className="text-white"
                        style={{ backgroundColor: '#10b981' }}
                        onClick={() => handleApprove(item.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Setujui
                      </Button>
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectAndDelete(item.id)}
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
                      onClick={() => openDetailModal(item)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Lihat Detail
                    </Button>
                  )}
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
            <DialogTitle style={{ color: '#133E87' }}>Detail Laporan</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Judul</p>
                <p style={{ color: '#133E87' }}>{selectedReport.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipe</p>
                  <Badge variant="outline">
                    {selectedReport.type === 'post' ? 'Post' : 'Komentar'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tingkat Keparahan</p>
                  {selectedReport.severity === 'high' && (
                    <Badge className="bg-red-100 text-red-800">Tinggi</Badge>
                  )}
                  {selectedReport.severity === 'medium' && (
                    <Badge className="bg-yellow-100 text-yellow-800">Sedang</Badge>
                  )}
                  {selectedReport.severity === 'low' && (
                    <Badge className="bg-blue-100 text-blue-800">Rendah</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Penulis</p>
                  <p className="text-gray-700">{selectedReport.author}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dilaporkan oleh</p>
                  <p className="text-gray-700">{selectedReport.reporter}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Alasan Laporan</p>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#F3F3E0' }}
                >
                  <p className="text-gray-700">{selectedReport.reason}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Konten</p>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ borderColor: '#CBDCEB', backgroundColor: '#F5F6FA' }}
                >
                  <p className="text-gray-700">
                    {selectedReport.content || 'Konten tidak tersedia'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tanggal Laporan</p>
                  <p className="text-gray-700">{selectedReport.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {selectedReport.status === 'pending' && (
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  )}
                  {selectedReport.status === 'approved' && (
                    <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
                  )}
                  {selectedReport.status === 'rejected' && (
                    <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
                  )}
                </div>
              </div>

              {selectedReport.status === 'pending' && (
                <div 
                  className="p-4 rounded-lg border-l-4"
                  style={{ 
                    borderColor: '#f59e0b',
                    backgroundColor: '#fef3c7'
                  }}
                >
                  <p className="text-sm text-yellow-800">
                    <strong>Tindakan diperlukan:</strong> Konten ini menunggu keputusan moderasi Anda.
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedReport?.status === 'pending' && (
              <>
                <Button 
                  className="text-white"
                  style={{ backgroundColor: '#10b981' }}
                  onClick={() => {
                    if (selectedReport) {
                      handleApprove(selectedReport.id);
                      setShowDetailModal(false);
                      setSelectedReport(null);
                    }
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Setujui
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (selectedReport) {
                      handleRejectAndDelete(selectedReport.id);
                      setShowDetailModal(false);
                      setSelectedReport(null);
                    }
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak & Hapus
                </Button>
              </>
            )}
            <Button 
              variant="outline"
              onClick={() => {
                setShowDetailModal(false);
                setSelectedReport(null);
              }}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}