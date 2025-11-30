import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { CheckCircle, XCircle, AlertTriangle, Bot, Calendar } from '../icons';
import { mockCleaningRecords } from './data/robotMockData';
import { formatDate, formatTime } from '../../utils/dateFormat';

interface CleaningRecord {
  id: number;
  date: string;
  time: string;
  duration: string;
  status: 'completed' | 'failed' | 'interrupted';
  batteryUsed: number;
  areasCleaned: string[];
  notes?: string;
}

export default function CleaningHistory() {
  const [activeTab, setActiveTab] = useState('semua');

  const cleaningRecords: CleaningRecord[] = mockCleaningRecords.map((record) => {
    return {
      id: record.id,
      date: formatDate(record.started_at),
      time: formatTime(record.started_at),
      duration: record.duration_minutes > 0 ? `${record.duration_minutes} menit` : '0 menit',
      status: record.status,
      batteryUsed: record.battery_used,
      areasCleaned: record.areas_cleaned,
      notes: record.notes
    };
  });

  const getFilteredRecords = () => {
    switch (activeTab) {
      case 'berhasil':
        return cleaningRecords.filter(r => r.status === 'completed');
      case 'gagal':
        return cleaningRecords.filter(r => r.status === 'failed' || r.status === 'interrupted');
      default:
        return cleaningRecords;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'interrupted':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Gagal</Badge>;
      case 'interrupted':
        return <Badge className="bg-yellow-100 text-yellow-800">Terputus</Badge>;
      default:
        return null;
    }
  };

  const completedCount = cleaningRecords.filter(r => r.status === 'completed').length;
  const failedCount = cleaningRecords.filter(r => r.status === 'failed' || r.status === 'interrupted').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(72, 128, 255, 0.3)',
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
            }}
          >
            <Bot className="w-6 h-6" style={{ color: '#4880FF' }} />
          </div>
          <div>
            <h2 style={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>Riwayat Pembersihan Lengkap</h2>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Nunito Sans, sans-serif' }}>
              {completedCount} pembersihan berhasil dari {cleaningRecords.length} total
            </p>
          </div>
        </div>
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
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Berhasil</p>
              <p className="text-2xl" style={{ color: '#133E87', fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif' }}>{completedCount}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(239, 68, 68, 0.2)',
            boxShadow: '0 10px 50px rgba(239, 68, 68, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
            e.currentTarget.style.boxShadow = '0 20px 70px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.3) inset';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 50px rgba(239, 68, 68, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
          }}
        >
          {/* Bubble glow effect */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="flex items-center gap-3 relative z-10">
            <div 
              className="p-3 rounded-full transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
              }}
            >
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Gagal/Terputus</p>
              <p className="text-2xl" style={{ color: '#133E87', fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif' }}>{failedCount}</p>
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
              <Calendar className="w-6 h-6" style={{ color: '#608BC1' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Rata-rata Durasi</p>
              <p className="text-2xl" style={{ color: '#133E87', fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif' }}>44 menit</p>
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
                Semua ({cleaningRecords.length})
              </TabsTrigger>
              <TabsTrigger 
                value="berhasil" 
                className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#133E87] data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200"
                style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#608BC1' }}
              >
                Berhasil ({completedCount})
              </TabsTrigger>
              <TabsTrigger 
                value="gagal" 
                className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#133E87] data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200"
                style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#608BC1' }}
              >
                Gagal/Terputus ({failedCount})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: '#133E87' }}>Tanggal & Waktu</TableHead>
                  <TableHead style={{ color: '#133E87' }}>Durasi</TableHead>
                  <TableHead style={{ color: '#133E87' }}>Status</TableHead>
                  <TableHead style={{ color: '#133E87' }}>Baterai Terpakai</TableHead>
                  <TableHead style={{ color: '#133E87' }}>Area Dibersihkan</TableHead>
                  <TableHead style={{ color: '#133E87' }}>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredRecords().map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <div>
                          <p className="text-sm" style={{ color: '#133E87' }}>{record.date}</p>
                          <p className="text-xs text-gray-600">{record.time}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell style={{ color: '#133E87' }}>{record.duration}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell style={{ color: '#133E87' }}>{record.batteryUsed}%</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {record.areasCleaned.length > 0 ? (
                          record.areasCleaned.map((area, idx) => (
                            <p key={idx} className="text-xs text-gray-600">• {area}</p>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400">-</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.notes ? (
                        <p className="text-xs text-gray-600">{record.notes}</p>
                      ) : (
                        <p className="text-xs text-gray-400">-</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {getFilteredRecords().length === 0 && (
              <div className="p-12 text-center relative z-10">
                <Bot className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgba(72, 128, 255, 0.3)' }} />
                <p style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>
                  Tidak ada data riwayat pembersihan
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
