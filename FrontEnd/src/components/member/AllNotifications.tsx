import { useState } from 'react';
import { Link } from '../Router';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Bell, AlertTriangle, Info, CheckCircle } from '../icons';

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
      title: 'pH terlalu rendah',
      message: 'Parameter pH akuarium Anda berada di 6.2, disarankan untuk dinaikkan ke range optimal 6.8-7.2.',
      time: '5 menit yang lalu',
      type: 'warning',
      read: false
    },
    {
      id: 2,
      title: 'Penyakit terdeteksi',
      message: 'Terdeteksi gejala white spot pada ikan Koi Anda. Segera lakukan treatment untuk mencegah penyebaran.',
      time: '1 jam yang lalu',
      type: 'alert',
      read: false
    },
    {
      id: 3,
      title: 'Jadwal pemberian makan',
      message: 'Waktunya memberi makan ikan Anda. Pastikan porsi makan sesuai dengan jumlah ikan.',
      time: '2 jam yang lalu',
      type: 'info',
      read: false
    },
    {
      id: 4,
      title: 'Suhu air normal',
      message: 'Suhu air akuarium Anda dalam kondisi optimal di 25°C.',
      time: '3 jam yang lalu',
      type: 'success',
      read: true
    },
    {
      id: 5,
      title: 'Jadwal penggantian air',
      message: 'Sudah waktunya untuk mengganti 25% air akuarium. Terakhir diganti 2 minggu yang lalu.',
      time: '5 jam yang lalu',
      type: 'info',
      read: true
    },
    {
      id: 6,
      title: 'Filter perlu dibersihkan',
      message: 'Filter akuarium Anda perlu dibersihkan untuk menjaga kualitas air yang optimal.',
      time: '1 hari yang lalu',
      type: 'warning',
      read: true
    },
    {
      id: 7,
      title: 'Kadar oksigen baik',
      message: 'Kadar oksigen terlarut dalam kondisi baik. Sistem aerasi bekerja dengan sempurna.',
      time: '1 hari yang lalu',
      type: 'success',
      read: true
    },
    {
      id: 8,
      title: 'Perawatan robot selesai',
      message: 'Perawatan rutin robot pembersih akuarium telah selesai dilakukan.',
      time: '2 hari yang lalu',
      type: 'success',
      read: true
    },
    {
      id: 9,
      title: 'Amonia terdeteksi tinggi',
      message: 'Kadar amonia mencapai 0.5 ppm. Segera lakukan penggantian air dan periksa sistem filtrasi.',
      time: '3 hari yang lalu',
      type: 'alert',
      read: true
    },
    {
      id: 10,
      title: 'Pencahayaan optimal',
      message: 'Durasi dan intensitas pencahayaan akuarium dalam kondisi optimal untuk pertumbuhan tanaman.',
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