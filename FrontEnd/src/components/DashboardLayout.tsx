import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from './Router';
import { useAuth } from './AuthContext';
import { notificationAPI } from '../services/api';
import {
    Fish,
    Home as LayoutDashboard,
    Droplets,
    Bot,
    Camera,
    BookOpen,
    Users as UsersIcon,
    MessageSquare,
    Settings,
    Bell,
    User,
    Menu,
    X,
    LogOut,
    ChevronDown,
    ShoppingCart
} from './icons';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
    userType: 'member' | 'admin';
    breadcrumbs?: BreadcrumbItem[];
}

export default function DashboardLayout({ children, title, userType, breadcrumbs }: DashboardLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Mock current user if not available from context (for safety)
    const currentUser = user || { name: 'User', email: '', role: userType };

    const menuItems = userType === 'admin' ? [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Users', path: '/admin/users', icon: UsersIcon },
        { label: 'Fishpedia', path: '/admin/fishpedia', icon: BookOpen },
        { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    ] : [
        { label: 'Beranda', path: '/member', icon: LayoutDashboard },
        { label: 'Fishpedia', path: '/member/fishpedia', icon: BookOpen },
        { label: 'Forum', path: '/member/forum', icon: MessageSquare },
        { label: 'Pesanan', path: '/member/orders', icon: ShoppingCart },
    ];

    const isActivePath = (path: string) => {
        if (path === '/member' && location.pathname === '/member') return true;
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/member' && path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await notificationAPI.getNotifications(10, false);
                if (response.success || response.notifications) {
                    const notifs = response.notifications || (response.data && response.data.notifications) || [];
                    const count = response.unread_count !== undefined ? response.unread_count : (response.data && response.data.unread_count) || 0;

                    setNotifications(notifs);
                    setUnreadCount(count);
                }
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };

        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F5F6FA' }}>
            <nav className="bg-white border-b sticky top-0 z-30 shadow-sm" style={{ borderColor: '#F3F4F6' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Fish className="w-8 h-8" style={{ color: '#4880FF' }} />
                            <span className="text-xl hidden sm:block tracking-tight" style={{ color: '#111827', fontWeight: 800 }}>temanikan</span>
                        </div>

                        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-4xl mx-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200"
                                    style={{
                                        backgroundColor: isActivePath(item.path) ? '#4880FF' : 'transparent',
                                        color: isActivePath(item.path) ? '#FFFFFF' : '#6B7280',
                                        fontWeight: isActivePath(item.path) ? 600 : 500,
                                        fontSize: '14px',
                                        boxShadow: isActivePath(item.path) ? '0 4px 12px rgba(72, 128, 255, 0.25)' : 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActivePath(item.path)) {
                                            e.currentTarget.style.backgroundColor = '#F9FAFB';
                                            e.currentTarget.style.color = '#4880FF';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActivePath(item.path)) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#6B7280';
                                        }
                                    }}
                                >
                                    <item.icon className={`w-4 h-4 flex-shrink-0 ${isActivePath(item.path) ? 'animate-pulse-subtle' : ''}`} />
                                    <span className="whitespace-nowrap">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            <select
                                className="hidden md:block px-3 py-2 rounded-lg border text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                style={{ borderColor: '#E5E7EB', color: '#4B5563' }}
                                defaultValue="id"
                            >
                                <option value="id">ID</option>
                                <option value="en">EN</option>
                            </select>

                            <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative hover:bg-gray-50 p-2.5 rounded-xl transition-all duration-200 group">
                                        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: '#6B7280' }} />
                                        <span
                                            className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white"
                                            style={{ backgroundColor: '#EF4444', display: unreadCount > 0 ? 'block' : 'none' }}
                                        />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl shadow-xl border-gray-100">
                                    <div className="p-4 border-b border-gray-50">
                                        <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-sm text-gray-500">
                                                <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Bell className="w-6 h-6 text-gray-400" />
                                                </div>
                                                Tidak ada notifikasi baru
                                            </div>
                                        ) : (
                                            notifications.slice(0, 5).map((notif) => (
                                                <DropdownMenuItem
                                                    key={notif.id}
                                                    className={`cursor-pointer flex flex-col items-start p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.is_read ? 'bg-blue-50/50' : ''}`}
                                                    onClick={() => {
                                                        setNotificationOpen(false);
                                                        navigate(userType === 'admin' ? `/admin/notifications/${notif.id}` : `/member/notifications/${notif.id}`);
                                                    }}
                                                >
                                                    <div className="flex justify-between w-full mb-1">
                                                        <span className={`font-semibold text-sm ${!notif.is_read ? 'text-blue-600' : 'text-gray-900'}`}>
                                                            {notif.title}
                                                        </span>
                                                        {!notif.is_read && (
                                                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">{notif.message}</p>
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-gray-50 bg-gray-50/50">
                                        <DropdownMenuItem
                                            className="cursor-pointer justify-center py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-center w-full"
                                            onClick={() => {
                                                setNotificationOpen(false);
                                                navigate(userType === 'admin' ? '/admin/notifications' : '/member/notifications');
                                            }}
                                        >
                                            <span className="text-sm font-medium" style={{ color: '#4880FF' }}>
                                                Lihat Semua Notifikasi
                                            </span>
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 hover:bg-gray-50 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-100">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-white"
                                            style={{ backgroundColor: '#4880FF' }}
                                        >
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="hidden lg:flex flex-col items-start">
                                            <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{currentUser.name}</p>
                                            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{currentUser.role}</p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 hidden lg:block text-gray-400" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-xl border-gray-100">
                                    <DropdownMenuLabel className="px-3 py-2">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                                            <p className="text-xs text-gray-500 font-medium">{currentUser.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="my-2" />

                                    <DropdownMenuItem asChild>
                                        <Link
                                            to={userType === 'member' ? '/member/profile' : '/admin/profile'}
                                            className="cursor-pointer flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <User className="w-4 h-4 mr-3 text-blue-500" />
                                            <span className="font-medium text-gray-700">Profil Saya</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link
                                            to={userType === 'member' ? '/member/settings' : '/admin/settings'}
                                            className="cursor-pointer flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <Settings className="w-4 h-4 mr-3 text-blue-500" />
                                            <span className="font-medium text-gray-700">Pengaturan</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="my-2" />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer flex items-center px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 focus:text-red-700 focus:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        <span className="font-medium">Keluar</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button
                                className="lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <Menu className="w-6 h-6" style={{ color: '#1F2937' }} />
                            </button>
                        </div>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden border-t" style={{ borderColor: '#E5E7EB' }}>
                        <div className="py-2 space-y-1 px-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                                    style={{
                                        backgroundColor: isActivePath(item.path) ? '#4880FF' : 'transparent',
                                        color: isActivePath(item.path) ? '#FFFFFF' : '#6B7280',
                                        fontWeight: isActivePath(item.path) ? 600 : 400
                                    }}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
                {children}
            </main>
        </div>
    );
}