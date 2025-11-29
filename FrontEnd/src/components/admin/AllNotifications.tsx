import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Bell, AlertTriangle, Info, CheckCircle, ArrowLeft, Package, User } from '../icons';
import { Button } from '../ui/button';
import { Link } from '../Router';
import { notificationAPI } from '../../services/api';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  read: boolean;
  created_at: string;
}

export default function AllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('semua');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications();
      if (response && response.notifications) {
        // Transform API data to match component interface
        const formattedNotifications = response.notifications.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          time: new Date(n.created_at).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
          }),
          type: n.type,
          read: n.is_read,
          created_at: n.created_at
        }));
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  //   const markAsRead = async (id: number) => {
  //     try {
  //       await notificationAPI.markAsRead(id);
  //       setNotifications(prev =>
  //         prev.map(n => n.id === id ? { ...n, read: true } : n)
  //       );
  //     } catch (error) {
  //       console.error('Failed to mark as read:', error);
  //     }
  //   };

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

  const getNotificationIcon = (type: string, title: string) => {
    // Special icons based on title/context
    if (title.toLowerCase().includes('pesanan')) return <Package className="w-5 h-5 text-blue-500" />;
    if (title.toLowerCase().includes('pengguna') || title.toLowerCase().includes('user')) return <User className="w-5 h-5 text-green-500" />;

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
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-500">Memuat notifikasi...</p>
                </div>
              ) : getFilteredNotifications().length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    Tidak ada notifikasi
                  </p>
                </div>
              ) : (
                getFilteredNotifications().map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => window.location.href = `/admin/notifications/${notification.id}`}
                    className={`p-6 hover:bg-gray-50 transition cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                      }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.title)}
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
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}