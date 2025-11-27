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
                    data = response.data;
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
                            className="text-sm text-blue-500 hover:text-blue-600 mb-2 inline-block font-medium"
                        >
                            &larr; Kembali ke Beranda
                        </Link>
                    )}
                    <h2 className="text-2xl font-bold text-gray-800">
                        {deviceId ? 'Notifikasi Perangkat' : 'Semua Notifikasi'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {notifications.length} notifikasi belum dibaca
                    </p>
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
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
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">Tidak ada notifikasi</h3>
                        <p className="text-gray-500">Anda belum memiliki notifikasi baru</p>
                    </div>
                ) : (
                    notifications.map((notification) => {
                        const Icon = getIcon(notification.type, notification.title);
                        const color = getColor(notification.type);

                        return (
                            <Link key={notification.id} to={`/member/notifications/${notification.id}`}>
                                <Card
                                    className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-l-4"
                                    style={{ borderLeftColor: color }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `${color}15` }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color }} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-base font-semibold text-gray-800 mb-1">
                                                    {notification.title || notification.message}
                                                </h4>
                                                <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {notification.time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
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
