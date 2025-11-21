import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Bell, AlertTriangle, Info, CheckCircle, ArrowLeft } from '../icons';
import { Button } from '../ui/button';
import { Link } from '../Router';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  read: boolean;
}

export default function AllNotifications() {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Pengguna baru terdaftar',
      message: 'Ahmad Wijaya telah mendaftar sebagai member premium.',
      time: '5 menit yang lalu',
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'Robot error pada pengguna',
      message: 'Robot ID #1234 mengalami error pada akuarium milik Budi Santoso.',
      time: '1 jam yang lalu',
      type: 'alert',
      read: false
    },
    {
      id: 3,
      title: 'Laporan penyakit meningkat',
      message: 'Terjadi peningkatan kasus white spot disease sebesar 15% minggu ini.',
      time: '2 jam yang lalu',
      type: 'warning',
      read: false
    },
    {
      id: 4,
      title: 'Pemeliharaan sistem selesai',
      message: 'Pemeliharaan rutin server telah selesai. Semua sistem berjalan normal.',
      time: '3 jam yang lalu',
      type: 'success',
      read: true
    },
    {
      id: 5,
      title: 'Permintaan bantuan dari pengguna',
      message: 'Siti Nurhaliza meminta bantuan teknis melalui forum.',
      time: '5 jam yang lalu',
      type: 'info',
      read: true
    },
    {
      id: 6,
      title: 'Update konten Fishpedia',
      message: 'Konten baru untuk 5 spesies ikan telah ditambahkan ke database.',
      time: '1 hari yang lalu',
      type: 'success',
      read: true
    },
    {
      id: 7,
      title: 'Aktivitas mencurigakan',
      message: 'Terdeteksi multiple login attempts dari IP yang sama pada akun admin.',
      time: '1 hari yang lalu',
      type: 'alert',
      read: true
    },
    {
      id: 8,
      title: 'Kapasitas server meningkat',
      message: 'Penggunaan server mencapai 85%. Pertimbangkan untuk upgrade kapasitas.',
      time: '2 hari yang lalu',
      type: 'warning',
      read: true
    },
    {
      id: 9,
      title: 'Backup data berhasil',
      message: 'Backup database otomatis telah selesai tanpa error.',
      time: '2 hari yang lalu',
      type: 'success',
      read: true
    },
    {
      id: 10,
      title: '100 pengguna aktif',
      message: 'Sistem mencapai milestone 100 pengguna aktif harian.',
      time: '3 hari yang lalu',
      type: 'success',
      read: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('semua');

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'belum-dibaca':
        return notifications.filter(n => !n.read);
      case 'sudah-dibaca':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8" style={{ color: '#133E87' }} />
          <div>
            <h2 style={{ color: '#133E87' }}>Semua Notifikasi</h2>
            <p className="text-sm text-gray-600">
              {unreadCount} notifikasi belum dibaca
            </p>
          </div>
        </div>
        <Link to="/admin">
          <Button className="bg-gray-100 text-gray-600 hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Card style={{ backgroundColor: 'white' }}>
        <Tabs defaultValue="semua" onValueChange={setActiveTab}>
          <div className="border-b px-6 pt-6" style={{ borderColor: '#CBDCEB' }}>
            <TabsList className="w-full justify-start" style={{ backgroundColor: '#F3F3E0' }}>
              <TabsTrigger value="semua" className="data-[state=active]:bg-white">
                Semua ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="belum-dibaca" className="data-[state=active]:bg-white">
                Belum Dibaca ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="sudah-dibaca" className="data-[state=active]:bg-white">
                Sudah Dibaca ({readCount})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="p-0 m-0">
            <div className="divide-y" style={{ borderColor: '#CBDCEB' }}>
              {getFilteredNotifications().map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <h4 style={{ color: '#133E87' }}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: '#608BC1' }}
                            />
                          )}
                        </div>
                        <Badge className={getNotificationBadgeColor(notification.type)}>
                          {notification.type === 'alert' ? 'Penting' :
                           notification.type === 'warning' ? 'Peringatan' :
                           notification.type === 'success' ? 'Berhasil' : 'Info'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {getFilteredNotifications().length === 0 && (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    Tidak ada notifikasi
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}