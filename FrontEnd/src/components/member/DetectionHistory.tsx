import { useState } from 'react';
import { Link } from '../Router';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Eye, AlertCircle, CheckCircle, XCircle, Calendar, Download } from '../icons';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface DetectionRecord {
  id: number;
  fishType: string;
  location: string;
  date: string;
  time: string;
  status: 'warning' | 'healthy' | 'critical';
  disease: string;
  confidence: number;
  imageUrl: string;
  recommendation: string;
  symptoms: string[];
}

export default function DetectionHistory() {
  const [activeTab, setActiveTab] = useState('semua');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedRecord, setSelectedRecord] = useState<DetectionRecord | null>(null);

  const detectionRecords: DetectionRecord[] = [
    {
      id: 1,
      fishType: 'Ikan Koi',
      location: 'Akuarium Utama',
      date: '4 Nov 2025',
      time: '14:30',
      status: 'warning',
      disease: 'Parasitic Diseases',
      confidence: 85,
      imageUrl: 'https://images.unsplash.com/photo-1669241942890-2e066facbd9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb2klMjBmaXNoJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjIyNjUwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      recommendation: 'Segera isolasi ikan yang terinfeksi. Naikkan suhu air secara bertahap hingga 28-30°C. Berikan obat anti-parasit sesuai dosis.',
      symptoms: ['Bintik putih pada tubuh', 'Ikan menggosok-gosokkan tubuh', 'Nafsu makan menurun']
    },
    {
      id: 2,
      fishType: 'Ikan Mas',
      location: 'Akuarium Utama',
      date: '3 Nov 2025',
      time: '16:45',
      status: 'healthy',
      disease: 'Healthy Fish',
      confidence: 95,
      imageUrl: 'https://images.unsplash.com/photo-1720001586147-0bfee9e5dba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZmlzaCUyMGNsb3NlJTIwdW5kZXJ3YXRlcnxlbnwxfHx8fDE3NjIyNjUwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      recommendation: 'Ikan dalam kondisi sehat. Lanjutkan perawatan rutin.',
      symptoms: []
    },
    {
      id: 3,
      fishType: 'Ikan Cupang',
      location: 'Akuarium Karantina',
      date: '3 Nov 2025',
      time: '09:15',
      status: 'warning',
      disease: 'Bacterial Diseases',
      confidence: 72,
      imageUrl: 'https://images.unsplash.com/photo-1573472420143-0c68f179bdc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXR0YSUyMGZpc2glMjBibHVlfGVufDF8fHx8MTc2MjI2NTA2MHww&ixlib=rb-4.1.0&q=80&w=1080',
      recommendation: 'Periksa kualitas air. Ganti 25% air secara berkala. Berikan garam ikan dan antibiotik jika diperlukan.',
      symptoms: ['Sirip robek atau compang-camping', 'Perubahan warna pada sirip']
    },
    {
      id: 4,
      fishType: 'Ikan Koi',
      location: 'Akuarium Utama',
      date: '2 Nov 2025',
      time: '11:20',
      status: 'healthy',
      disease: 'Healthy Fish',
      confidence: 92,
      imageUrl: 'https://images.unsplash.com/photo-1669241942890-2e066facbd9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb2klMjBmaXNoJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjIyNjUwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      recommendation: 'Ikan dalam kondisi sehat. Lanjutkan perawatan rutin.',
      symptoms: []
    },
    {
      id: 5,
      fishType: 'Ikan Cupang',
      location: 'Akuarium Karantina',
      date: '1 Nov 2025',
      time: '15:30',
      status: 'critical',
      disease: 'Bacterial Diseases',
      confidence: 88,
      imageUrl: 'https://images.unsplash.com/photo-1573472420143-0c68f179bdc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXR0YSUyMGZpc2glMjBibHVlfGVufDF8fHx8MTc2MjI2NTA2MHww&ixlib=rb-4.1.0&q=80&w=1080',
      recommendation: 'Kondisi kritis. Isolasi segera. Konsultasi dengan ahli ikan. Berikan antibiotik spektrum luas.',
      symptoms: ['Perut membengkak', 'Sisik berdiri', 'Ikan tidak aktif']
    },
    {
      id: 6,
      fishType: 'Ikan Mas',
      location: 'Akuarium Utama',
      date: '31 Okt 2025',
      time: '10:00',
      status: 'healthy',
      disease: 'Healthy Fish',
      confidence: 96,
      imageUrl: 'https://images.unsplash.com/photo-1720001586147-0bfee9e5dba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZmlzaCUyMGNsb3NlJTIwdW5kZXJ3YXRlcnxlbnwxfHx8fDE3NjIyNjUwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      recommendation: 'Ikan dalam kondisi sehat. Lanjutkan perawatan rutin.',
      symptoms: []
    },
    {
      id: 7,
      fishType: 'Ikan Koi',
      location: 'Akuarium Utama',
      date: '30 Okt 2025',
      time: '14:15',
      status: 'warning',
      disease: 'Fungal Diseases',
      confidence: 78,
      imageUrl: 'https://images.unsplash.com/photo-1669241942890-2e066facbd9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb2klMjBmaXNoJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjIyNjUwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      recommendation: 'Gunakan obat anti-jamur. Perbaiki kualitas air. Isolasi jika memburuk.',
      symptoms: ['Bercak putih seperti kapas', 'Kulit tampak rusak']
    },
    {
      id: 8,
      fishType: 'Ikan Cupang',
      location: 'Akuarium Karantina',
      date: '29 Okt 2025',
      time: '09:45',
      status: 'healthy',
      disease: 'Healthy Fish',
      confidence: 93,
      imageUrl: 'https://images.unsplash.com/photo-1573472420143-0c68f179bdc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXR0YSUyMGZpc2glMjBibHVlfGVufDF8fHx8MTc2MjI2NTA2MHww&ixlib=rb-4.1.0&q=80&w=1080',
      recommendation: 'Ikan dalam kondisi sehat. Lanjutkan perawatan rutin.',
      symptoms: []
    }
  ];

  const getFilteredRecords = () => {
    switch (activeTab) {
      case 'sehat':
        return detectionRecords.filter(r => r.status === 'healthy');
      case 'perhatian':
        return detectionRecords.filter(r => r.status === 'warning' || r.status === 'critical');
      default:
        return detectionRecords;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Sehat</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Perhatian</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Kritis</Badge>;
      default:
        return null;
    }
  };

  const healthyCount = detectionRecords.filter(r => r.status === 'healthy').length;
  const warningCount = detectionRecords.filter(r => r.status === 'warning' || r.status === 'critical').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(206, 57, 57, 0.1)' }}
          >
            <Eye className="w-7 h-7" style={{ color: '#CE3939' }} />
          </div>
          <div>
            <h2 className="text-3xl" style={{ color: '#1F2937', fontWeight: 700 }}>Riwayat Deteksi Penyakit</h2>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {detectionRecords.length} total deteksi
            </p>
          </div>
        </div>
        <Button
          className="text-white hover:shadow-lg transition-all"
          style={{ backgroundColor: '#4880FF' }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: 'rgba(74, 217, 145, 0.1)' }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: '#4AD991' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Sehat</p>
              <p className="text-3xl" style={{ color: '#1F2937', fontWeight: 700 }}>{healthyCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: 'rgba(254, 197, 61, 0.1)' }}
            >
              <AlertCircle className="w-6 h-6" style={{ color: '#FEC53D' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Perhatian/Kritis</p>
              <p className="text-3xl" style={{ color: '#1F2937', fontWeight: 700 }}>{warningCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: 'rgba(130, 128, 255, 0.1)' }}
            >
              <Calendar className="w-6 h-6" style={{ color: '#8280FF' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Periode</p>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="border-0 p-0 h-auto" style={{ fontWeight: 600 }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Hari</SelectItem>
                  <SelectItem value="30d">30 Hari</SelectItem>
                  <SelectItem value="90d">90 Hari</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs and Table */}
      <Card className="rounded-xl shadow-md border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <Tabs defaultValue="semua" onValueChange={setActiveTab}>
          <div className="border-b px-6 pt-6" style={{ borderColor: '#E5E7EB' }}>
            <TabsList className="w-full justify-start" style={{ backgroundColor: 'rgba(72, 128, 255, 0.05)' }}>
              <TabsTrigger
                value="semua"
                className="data-[state=active]:bg-white"
                style={{ fontWeight: 600 }}
              >
                Semua ({detectionRecords.length})
              </TabsTrigger>
              <TabsTrigger
                value="sehat"
                className="data-[state=active]:bg-white"
                style={{ fontWeight: 600 }}
              >
                Sehat ({healthyCount})
              </TabsTrigger>
              <TabsTrigger
                value="perhatian"
                className="data-[state=active]:bg-white"
                style={{ fontWeight: 600 }}
              >
                Perhatian/Kritis ({warningCount})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: '#1F2937', fontWeight: 700 }}>Ikan</TableHead>
                  <TableHead style={{ color: '#1F2937', fontWeight: 700 }}>Tanggal & Waktu</TableHead>
                  <TableHead style={{ color: '#1F2937', fontWeight: 700 }}>Status</TableHead>
                  <TableHead style={{ color: '#1F2937', fontWeight: 700 }}>Diagnosis</TableHead>
                  <TableHead style={{ color: '#1F2937', fontWeight: 700 }}>Kepercayaan</TableHead>
                  <TableHead style={{ color: '#1F2937', fontWeight: 700 }}>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredRecords().map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={record.imageUrl}
                            alt={record.fishType}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span style={{ color: '#1F2937', fontWeight: 600 }}>{record.fishType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <div>
                          <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{record.date}</p>
                          <p className="text-xs" style={{ color: '#6B7280' }}>{record.time}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell style={{ color: '#1F2937', fontWeight: 600 }}>{record.disease}</TableCell>
                    <TableCell>
                      <span
                        className="px-2 py-1 rounded text-sm"
                        style={{
                          backgroundColor: 'rgba(72, 128, 255, 0.1)',
                          color: '#4880FF',
                          fontWeight: 600
                        }}
                      >
                        {record.confidence}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRecord(record)}
                        className="hover:bg-blue-50 transition-all"
                        style={{ color: '#4880FF', fontWeight: 600 }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {getFilteredRecords().length === 0 && (
              <div className="p-12 text-center">
                <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">
                  Tidak ada data deteksi
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Detail Modal */}
      <Dialog open={selectedRecord !== null} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl" style={{ backgroundColor: 'white' }}>
          {selectedRecord && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl" style={{ color: '#1F2937', fontWeight: 700 }}>Detail Deteksi Penyakit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedRecord.imageUrl}
                    alt={selectedRecord.fishType}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Jenis Ikan</p>
                    <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{selectedRecord.fishType}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tingkat Kepercayaan</p>
                    <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{selectedRecord.confidence}%</p>
                  </div>
                  <div className="col-span-2 p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tanggal & Waktu</p>
                    <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{selectedRecord.date} - {selectedRecord.time}</p>
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg border-l-4"
                  style={{
                    backgroundColor: selectedRecord.status === 'healthy' ? 'rgba(74, 217, 145, 0.05)' : 'rgba(254, 197, 61, 0.05)',
                    borderColor: selectedRecord.status === 'healthy' ? '#4AD991' : '#FEC53D'
                  }}
                >
                  <h4 className="mb-2 text-sm" style={{ color: selectedRecord.status === 'healthy' ? '#4AD991' : '#FEC53D', fontWeight: 600 }}>Diagnosis</h4>
                  <p className="text-sm" style={{ color: '#1F2937' }}>{selectedRecord.disease}</p>
                </div>

                {selectedRecord.symptoms.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>Gejala yang Terdeteksi</h4>
                    <div className="space-y-2">
                      {selectedRecord.symptoms.map((symptom, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 rounded-lg"
                          style={{ backgroundColor: '#F9FAFB' }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                            style={{ backgroundColor: '#FEC53D' }}
                          />
                          <p className="text-sm" style={{ color: '#1F2937' }}>{symptom}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'rgba(72, 128, 255, 0.05)',
                    borderColor: '#4880FF33'
                  }}
                >
                  <h4 className="mb-2 flex items-center gap-2 text-sm" style={{ color: '#4880FF', fontWeight: 600 }}>
                    <AlertCircle className="w-5 h-5" />
                    Rekomendasi Penanganan
                  </h4>
                  <p className="text-sm" style={{ color: '#1F2937' }}>{selectedRecord.recommendation}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}