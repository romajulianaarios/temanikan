import { useState } from 'react';
import { Link } from '../Router';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { CheckCircle, XCircle, AlertTriangle, Bot, Calendar } from '../icons';

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

  const cleaningRecords: CleaningRecord[] = [
    {
      id: 1,
      date: '4 Nov 2025',
      time: '20:00',
      duration: '45 menit',
      status: 'completed',
      batteryUsed: 35,
      areasCleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter']
    },
    {
      id: 2,
      date: '3 Nov 2025',
      time: '20:00',
      duration: '42 menit',
      status: 'completed',
      batteryUsed: 32,
      areasCleaned: ['Dasar kolam', 'Dinding kolam']
    },
    {
      id: 3,
      date: '2 Nov 2025',
      time: '20:00',
      duration: '48 menit',
      status: 'completed',
      batteryUsed: 38,
      areasCleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter']
    },
    {
      id: 4,
      date: '2 Nov 2025',
      time: '10:00',
      duration: '15 menit',
      status: 'interrupted',
      batteryUsed: 12,
      areasCleaned: ['Dasar kolam'],
      notes: 'Pembersihan dihentikan secara manual'
    },
    {
      id: 5,
      date: '1 Nov 2025',
      time: '20:00',
      duration: '44 menit',
      status: 'completed',
      batteryUsed: 34,
      areasCleaned: ['Dasar kolam', 'Dinding kolam']
    },
    {
      id: 6,
      date: '31 Okt 2025',
      time: '20:00',
      duration: '0 menit',
      status: 'failed',
      batteryUsed: 0,
      areasCleaned: [],
      notes: 'Baterai terlalu rendah untuk memulai pembersihan'
    },
    {
      id: 7,
      date: '30 Okt 2025',
      time: '20:00',
      duration: '46 menit',
      status: 'completed',
      batteryUsed: 36,
      areasCleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter']
    },
    {
      id: 8,
      date: '29 Okt 2025',
      time: '20:00',
      duration: '43 menit',
      status: 'completed',
      batteryUsed: 33,
      areasCleaned: ['Dasar kolam', 'Dinding kolam']
    },
    {
      id: 9,
      date: '28 Okt 2025',
      time: '20:00',
      duration: '47 menit',
      status: 'completed',
      batteryUsed: 37,
      areasCleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter']
    },
    {
      id: 10,
      date: '27 Okt 2025',
      time: '20:00',
      duration: '41 menit',
      status: 'completed',
      batteryUsed: 31,
      areasCleaned: ['Dasar kolam', 'Dinding kolam']
    },
    {
      id: 11,
      date: '26 Okt 2025',
      time: '20:00',
      duration: '45 menit',
      status: 'completed',
      batteryUsed: 35,
      areasCleaned: ['Dasar kolam', 'Dinding kolam']
    },
    {
      id: 12,
      date: '25 Okt 2025',
      time: '20:00',
      duration: '44 menit',
      status: 'completed',
      batteryUsed: 34,
      areasCleaned: ['Dasar kolam', 'Dinding kolam', 'Area filter']
    }
  ];

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
          <Bot className="w-8 h-8" style={{ color: '#133E87' }} />
          <div>
            <h2 style={{ color: '#133E87' }}>Riwayat Pembersihan Lengkap</h2>
            <p className="text-sm text-gray-600">
              {completedCount} pembersihan berhasil dari {cleaningRecords.length} total
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Berhasil</p>
              <p className="text-2xl" style={{ color: '#133E87' }}>{completedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-100">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Gagal/Terputus</p>
              <p className="text-2xl" style={{ color: '#133E87' }}>{failedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#CBDCEB' }}>
              <Calendar className="w-6 h-6" style={{ color: '#608BC1' }} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rata-rata Durasi</p>
              <p className="text-2xl" style={{ color: '#133E87' }}>44 menit</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs and Table */}
      <Card style={{ backgroundColor: 'white' }}>
        <Tabs defaultValue="semua" onValueChange={setActiveTab}>
          <div className="border-b px-6 pt-6" style={{ borderColor: '#CBDCEB' }}>
            <TabsList className="w-full justify-start" style={{ backgroundColor: '#F3F3E0' }}>
              <TabsTrigger value="semua" className="data-[state=active]:bg-white">
                Semua ({cleaningRecords.length})
              </TabsTrigger>
              <TabsTrigger value="berhasil" className="data-[state=active]:bg-white">
                Berhasil ({completedCount})
              </TabsTrigger>
              <TabsTrigger value="gagal" className="data-[state=active]:bg-white">
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
              <div className="p-12 text-center">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">
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