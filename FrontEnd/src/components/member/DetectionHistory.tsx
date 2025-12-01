import { useState, useEffect } from 'react';
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
  const [detectionRecords, setDetectionRecords] = useState<DetectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetections = async () => {
      try {
        const { diseaseAPI } = await import('../../services/api');
        // Fetch all detections (ignoring deviceId as requested)
        const response = await diseaseAPI.getAllDetections(50);

        if (response.success && response.detections) {
          const formattedRecords = response.detections.map((d: any) => ({
            id: d.id,
            fishType: d.fish_type || 'Unknown',
            location: d.location || 'Unknown',
            date: new Date(d.detected_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date(d.detected_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            status: d.severity === 'critical' || d.severity === 'high' ? 'critical' :
              d.severity === 'medium' ? 'warning' : 'healthy',
            disease: d.disease_name,
            confidence: Math.round(d.confidence * 100),
            imageUrl: d.image_url,
            recommendation: d.recommended_treatment,
            symptoms: d.symptoms ? (typeof d.symptoms === 'string' ? JSON.parse(d.symptoms) : d.symptoms) : []
          }));
          setDetectionRecords(formattedRecords);
        }
      } catch (error) {
        console.error('Failed to fetch detections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetections();
  }, []);

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

  if (loading) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">Memuat riwayat deteksi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(206, 57, 57, 0.3), rgba(220, 38, 38, 0.2))',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(206, 57, 57, 0.3)',
              boxShadow: '0 4px 15px rgba(206, 57, 57, 0.2)'
            }}
          >
            <Eye className="w-7 h-7" style={{ color: '#CE3939' }} />
          </div>
          <div>
            <h2 className="text-3xl" style={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>Riwayat Deteksi Penyakit</h2>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Nunito Sans, sans-serif' }}>
              {detectionRecords.length} total deteksi
            </p>
          </div>
        </div>
        <Button
          className="bubble-button text-white rounded-full transition-all duration-300"
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
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 10px 50px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
            e.currentTarget.style.boxShadow = '0 20px 70px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.3) inset';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 50px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
          }}
        >
          {/* Bubble glow effect */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="flex items-center gap-3 relative z-10">
            <div
              className="p-3 rounded-full transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
              }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: '#4AD991' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Sehat</p>
              <p className="text-3xl" style={{ color: '#133E87', fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif' }}>{healthyCount}</p>
            </div>
          </div>
        </Card>

        <Card
          className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(254, 197, 61, 0.2)',
            boxShadow: '0 10px 50px rgba(254, 197, 61, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
            e.currentTarget.style.boxShadow = '0 20px 70px rgba(254, 197, 61, 0.3), 0 0 0 1px rgba(254, 197, 61, 0.3) inset';
            e.currentTarget.style.borderColor = 'rgba(254, 197, 61, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 50px rgba(254, 197, 61, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
            e.currentTarget.style.borderColor = 'rgba(254, 197, 61, 0.2)';
          }}
        >
          {/* Bubble glow effect */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(254, 197, 61, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="flex items-center gap-3 relative z-10">
            <div
              className="p-3 rounded-full transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(254, 197, 61, 0.3), rgba(245, 158, 11, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(254, 197, 61, 0.3)',
                boxShadow: '0 4px 15px rgba(254, 197, 61, 0.2)'
              }}
            >
              <AlertCircle className="w-6 h-6" style={{ color: '#FEC53D' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Perhatian/Kritis</p>
              <p className="text-3xl" style={{ color: '#133E87', fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif' }}>{warningCount}</p>
            </div>
          </div>
        </Card>

        <Card
          className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
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
          <div className="flex items-center gap-3 relative z-10">
            <div
              className="p-3 rounded-full transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(72, 128, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
              }}
            >
              <Calendar className="w-6 h-6" style={{ color: '#8280FF' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Periode</p>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="border-0 p-0 h-auto" style={{ fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif', color: '#133E87' }}>
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
      <Card
        className="bubble-card rounded-[32px] transition-all duration-300 relative overflow-hidden"
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
        <Tabs defaultValue="semua" onValueChange={setActiveTab} className="relative z-10">
          <div className="border-b px-6 pt-6" style={{ borderColor: 'rgba(72, 128, 255, 0.1)' }}>
            <TabsList className="w-full justify-start rounded-full p-1" style={{ backgroundColor: 'rgba(72, 128, 255, 0.05)', border: '1px solid rgba(72, 128, 255, 0.1)' }}>
              <TabsTrigger
                value="semua"
                className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#133E87] data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200"
                style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#608BC1' }}
              >
                Semua ({detectionRecords.length})
              </TabsTrigger>
              <TabsTrigger
                value="sehat"
                className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#133E87] data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200"
                style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#608BC1' }}
              >
                Sehat ({healthyCount})
              </TabsTrigger>
              <TabsTrigger
                value="perhatian"
                className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#133E87] data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200"
                style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#608BC1' }}
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