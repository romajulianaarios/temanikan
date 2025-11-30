import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Clock, Filter, Package } from 'lucide-react';
import { deviceAPI, notificationAPI } from '../../services/api';
import { Link } from '../Router';
import { Card } from '../ui/card';

interface Notification {
    id: number;
    type: 'alert' | 'info' | 'warning' | 'success';
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    deviceId?: number;
}

interface AllNotificationsProps {
    deviceId?: string;
}

const AllNotifications = ({ deviceId }: AllNotificationsProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    // const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                let data;

                if (deviceId) {
                    const response = await deviceAPI.getDashboardNotificationsRecent(parseInt(deviceId));
                    console.log('Device notifications response:', response);
                    data = response.data;
                } else {
                    const response = await notificationAPI.getNotifications();
                    console.log('Global notifications response:', response);
                    data = response.notifications;
                }

                if (!Array.isArray(data)) {
                    console.error('Notifications data is not an array:', data);
                    setNotifications([]);
                    return;
                }

                const formattedNotifications = data.map((n: any) => ({
                    id: n.id,
                    type: n.type,
                    title: n.title,
                    message: n.message,
                    time: n.created_at,
                    isRead: n.is_read,
                    deviceId: n.device_id
                }));

                setNotifications(formattedNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [deviceId]);

    const getIcon = (type: string, title: string = '') => {
        if (title.toLowerCase().includes('pesanan') || title.toLowerCase().includes('order')) {
            return Package;
        }
        switch (type) {
            case 'warning': return AlertTriangle;
            case 'success': return CheckCircle;
            case 'error': return AlertTriangle;
            default: return Info;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'warning': return '#FEC53D';
            case 'success': return '#4AD991';
            case 'error': return '#CE3939';
            default: return '#4880FF';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    {deviceId && (
                        <Link
                            to={`/member/device/${deviceId}/dashboard`}
                            className="bubble-button text-sm mb-2 inline-block font-medium rounded-full px-3 py-1.5 transition-all duration-300"
                            style={{
                                color: '#133E87',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                fontFamily: 'Nunito Sans, sans-serif'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.transform = 'translateX(-4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}
                        >
                            &larr; Kembali ke Beranda
                        </Link>
                    )}
                    <h2 className="text-2xl font-bold" style={{ color: '#FFFFFF', fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
                        {deviceId ? 'Notifikasi Perangkat' : 'Semua Notifikasi'}
                    </h2>
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Nunito Sans, sans-serif' }}>
                        {notifications.length} notifikasi belum dibaca
                    </p>
                </div>

                <div className="flex gap-2">
                    <button 
                        className="bubble-button px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '2px solid rgba(72, 128, 255, 0.2)',
                            color: '#133E87',
                            boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                            fontFamily: 'Nunito Sans, sans-serif',
                            fontWeight: 600
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F0F5FF';
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                        }}
                    >
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button 
                        className="bubble-button px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '2px solid rgba(72, 128, 255, 0.2)',
                            color: '#133E87',
                            boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                            fontFamily: 'Nunito Sans, sans-serif',
                            fontWeight: 600
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F0F5FF';
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                        }}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Tandai Semua Dibaca
                    </button>
                </div>
            </div >

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-gray-500">Memuat notifikasi...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div 
                        className="bubble-card text-center py-12 rounded-[32px] relative overflow-hidden transition-all duration-300"
                        style={{
                            backgroundColor: '#FFFFFF',
                            border: '2px solid rgba(72, 128, 255, 0.2)',
                            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                            fontFamily: 'Nunito Sans, sans-serif'
                        }}
                    >
                        {/* Bubble glow effect */}
                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                                filter: 'blur(20px)'
                            }}
                        ></div>
                        <Bell className="w-12 h-12 mx-auto mb-3 relative z-10" style={{ color: 'rgba(72, 128, 255, 0.3)' }} />
                        <h3 className="text-lg font-medium relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Tidak ada notifikasi</h3>
                        <p className="relative z-10" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Anda belum memiliki notifikasi baru</p>
                    </div>
                ) : (
                    notifications.map((notification) => {
                        const Icon = getIcon(notification.type, notification.title);
                        const color = getColor(notification.type);

                        return (
                            <Link key={notification.id} to={`/member/notifications/${notification.id}`}>
                                <Card
                                    className="bubble-card p-4 rounded-[32px] transition-all duration-300 cursor-pointer relative overflow-hidden"
                                    style={{ 
                                        backgroundColor: '#FFFFFF',
                                        border: '2px solid rgba(72, 128, 255, 0.2)',
                                        borderLeft: `4px solid ${color}`,
                                        boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                                        fontFamily: 'Nunito Sans, sans-serif'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 91, 229, 0.25), 0 0 0 1px rgba(15, 91, 229, 0.4) inset';
                                        e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8) inset';
                                        e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
                                    }}
                                >
                                    {/* Bubble glow effect */}
                                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                                        style={{
                                            background: `radial-gradient(circle, ${color}40, transparent 70%)`,
                                            filter: 'blur(12px)'
                                        }}
                                    ></div>
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                                            style={{ 
                                                background: `linear-gradient(135deg, ${color}40, ${color}20)`,
                                                border: `1px solid ${color}50`,
                                                boxShadow: `0 4px 12px ${color}30`
                                            }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color }} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-base font-semibold mb-1" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>
                                                    {notification.title || notification.message}
                                                </h4>
                                                <span className="text-xs whitespace-nowrap flex items-center gap-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                                                    <Clock className="w-3 h-3" />
                                                    {notification.time}
                                                </span>
                                            </div>
                                            <p className="text-sm leading-relaxed" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })
                )}
            </div>
        </div >
    );
}

export default AllNotifications;
