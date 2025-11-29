import { useState, useEffect } from 'react';
import { useParams } from '../components/Router';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, AlertTriangle, Info, CheckCircle, Package, User, Calendar, Clock } from '../components/icons';
import { notificationAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'alert' | 'warning' | 'info' | 'success';
    is_read: boolean;
    created_at: string;
}

export default function NotificationDetail() {
    const { id } = useParams();
    const [notification, setNotification] = useState<Notification | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Determine user type based on URL or local storage
    // This is a simple check, ideally should come from auth context or prop
    const userType = window.location.pathname.startsWith('/admin') ? 'admin' : 'member';

    useEffect(() => {
        if (id) {
            fetchNotificationDetail(parseInt(id));
        }
    }, [id]);

    const fetchNotificationDetail = async (notificationId: number) => {
        try {
            setLoading(true);
            const response = await notificationAPI.getNotificationDetail(notificationId);
            if (response.success) {
                setNotification(response.data);
            } else {
                setError('Gagal memuat notifikasi');
            }
        } catch (err: any) {
            console.error('Error fetching notification:', err);
            setError(err.message || 'Terjadi kesalahan saat memuat notifikasi');
        } finally {
            setLoading(false);
        }
    };

    const getNotificationIcon = (type: string, title: string) => {
        if (title.toLowerCase().includes('pesanan')) return <Package className="w-8 h-8 text-blue-500" />;
        if (title.toLowerCase().includes('pengguna') || title.toLowerCase().includes('user')) return <User className="w-8 h-8 text-green-500" />;

        switch (type) {
            case 'alert':
                return <AlertTriangle className="w-8 h-8 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
            case 'success':
                return <CheckCircle className="w-8 h-8 text-green-500" />;
            default:
                return <Info className="w-8 h-8 text-blue-500" />;
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <DashboardLayout title="Detail Notifikasi" userType={userType}>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !notification) {
        return (
            <DashboardLayout title="Detail Notifikasi" userType={userType}>
                <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Notifikasi Tidak Ditemukan</h3>
                    <p className="text-gray-500 mb-6">{error || 'Notifikasi yang Anda cari tidak tersedia.'}</p>
                    <Button onClick={() => window.history.back()}>Kembali</Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Detail Notifikasi" userType={userType}>
            <div className="max-w-3xl mx-auto">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                </Button>

                <Card className="p-8 bg-white shadow-sm">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 p-3 bg-gray-50 rounded-xl">
                            {getNotificationIcon(notification.type, notification.title)}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge className={getNotificationBadgeColor(notification.type)}>
                                    {notification.type === 'alert' ? 'Penting' :
                                        notification.type === 'warning' ? 'Peringatan' :
                                            notification.type === 'success' ? 'Berhasil' : 'Info'}
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(notification.created_at)}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatTime(notification.created_at)}
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                {notification.title}
                            </h1>

                            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {notification.message}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
