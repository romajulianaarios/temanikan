import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Bell, AlertTriangle, Info, CheckCircle, ArrowLeft, Package, User } from '../icons';
import { Button } from '../ui/button';
import { Link } from '../Router';
import { notificationAPI } from '../../services/api';
import { formatNotificationTime } from '../../utils/dateFormat';

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
          time: formatNotificationTime(n.created_at),
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
          <div 
            className="p-3 rounded-full transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.15), rgba(15, 91, 229, 0.1))',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(72, 128, 255, 0.25)',
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
            }}
          >
            <Bell className="w-8 h-8" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h2 style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Semua Notifikasi</h2>
            <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
              {unreadCount} notifikasi belum dibaca
            </p>
          </div>
        </div>
        <Link to="/admin">
          <Button 
            className="bubble-button transition-all duration-300"
            style={{ 
              backgroundColor: '#FFFFFF',
              borderRadius: '9999px',
              padding: '10px 24px',
              fontFamily: 'Nunito Sans, sans-serif',
              fontWeight: 600,
              color: '#133E87',
              border: '2px solid rgba(72, 128, 255, 0.2)',
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
              e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
              e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Card 
        className="bubble-card transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          borderRadius: '32px',
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
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="relative z-10">
        <Tabs defaultValue="semua" onValueChange={setActiveTab}>
          <div className="border-b px-6 pt-6" style={{ borderColor: 'rgba(72, 128, 255, 0.2)' }}>
            <TabsList className="w-full justify-start" style={{ backgroundColor: 'rgba(72, 128, 255, 0.05)', borderRadius: '16px', padding: '4px' }}>
              <TabsTrigger 
                value="semua" 
                className="data-[state=active]:bg-white rounded-xl transition-all duration-300"
                style={{ 
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 600,
                  color: '#133E87',
                  padding: '8px 16px'
                }}
              >
                Semua ({notifications.length})
              </TabsTrigger>
              <TabsTrigger 
                value="belum-dibaca" 
                className="data-[state=active]:bg-white rounded-xl transition-all duration-300"
                style={{ 
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 600,
                  color: '#133E87',
                  padding: '8px 16px'
                }}
              >
                Belum Dibaca ({unreadCount})
              </TabsTrigger>
              <TabsTrigger 
                value="sudah-dibaca" 
                className="data-[state=active]:bg-white rounded-xl transition-all duration-300"
                style={{ 
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 600,
                  color: '#133E87',
                  padding: '8px 16px'
                }}
              >
                Sudah Dibaca ({readCount})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="p-0 m-0">
            <div className="divide-y" style={{ borderColor: 'rgba(72, 128, 255, 0.1)' }}>
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#4880FF' }}></div>
                  <p className="mt-2" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Memuat notifikasi...</p>
                </div>
              ) : getFilteredNotifications().length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: 'rgba(72, 128, 255, 0.3)' }} />
                  <p style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                    Tidak ada notifikasi
                  </p>
                </div>
              ) : (
                getFilteredNotifications().map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => window.location.href = `/admin/notifications/${notification.id}`}
                    className={`p-6 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      !notification.read 
                        ? 'bg-blue-50' 
                        : 'bg-white hover:bg-blue-50/50'
                    }`}
                    style={{
                      borderLeft: !notification.read ? '4px solid #4880FF' : '4px solid transparent',
                      fontFamily: 'Nunito Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.title)}
                      </div>

                      <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <h4 style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ backgroundColor: '#4880FF' }}
                              />
                            )}
                          </div>
                          <Badge 
                            className={getNotificationBadgeColor(notification.type)}
                            style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600, borderRadius: '12px' }}
                          >
                            {notification.type === 'alert' ? 'Penting' :
                              notification.type === 'warning' ? 'Peringatan' :
                                notification.type === 'success' ? 'Berhasil' : 'Info'}
                          </Badge>
                        </div>

                        <p className="text-sm mb-2" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                          {notification.message}
                        </p>

                        <p className="text-xs" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', opacity: 0.7 }}>
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
        </div>
      </Card>
    </div>
  );
}