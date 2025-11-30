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
        <div className="min-h-screen" style={{ 
            background: 'linear-gradient(to bottom, #87CEEB 0%, #4A90E2 15%, #357ABD 30%, #2E5C8A 50%, #1E3A5F 70%, #0F2027 100%)',
            position: 'relative'
        }}>
            <nav 
                className="sticky top-0 z-30 transition-all duration-300"
                style={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2) inset'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.2), rgba(72, 128, 255, 0.15))',
                                    border: '2px solid rgba(15, 91, 229, 0.3)',
                                    boxShadow: '0 4px 12px rgba(15, 91, 229, 0.15)'
                                }}
                            >
                                <Fish className="w-6 h-6" style={{ color: '#0F5BE5' }} />
                            </div>
                            <span 
                                className="text-xl hidden sm:block tracking-tight" 
                                style={{ 
                                    color: '#FFFFFF',
                                    fontWeight: 800,
                                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                                    fontFamily: 'Nunito Sans, sans-serif'
                                }}
                            >
                                temanikan
                            </span>
                        </div>

                        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-4xl mx-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="bubble-button flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 relative overflow-hidden"
                                    style={{
                                        backgroundColor: isActivePath(item.path) ? '#4880FF' : 'rgba(255, 255, 255, 0.9)',
                                        border: isActivePath(item.path) 
                                            ? '2px solid rgba(72, 128, 255, 0.5)' 
                                            : '2px solid rgba(72, 128, 255, 0.15)',
                                        color: isActivePath(item.path) ? '#FFFFFF' : '#133E87',
                                        fontWeight: isActivePath(item.path) ? 700 : 600,
                                        fontSize: '14px',
                                        fontFamily: 'Nunito Sans, sans-serif',
                                        boxShadow: isActivePath(item.path) 
                                            ? '0 6px 25px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset' 
                                            : '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActivePath(item.path)) {
                                            e.currentTarget.style.backgroundColor = '#F0F5FF';
                                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
                                            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActivePath(item.path)) {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                                            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.15)';
                                        }
                                    }}
                                >
                                    {isActivePath(item.path) && (
                                        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full opacity-30 pointer-events-none"
                                            style={{
                                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%)',
                                                filter: 'blur(15px)'
                                            }}
                                        ></div>
                                    )}
                                    <item.icon className={`w-4 h-4 flex-shrink-0 relative z-10 ${isActivePath(item.path) ? 'animate-pulse-subtle' : ''}`} />
                                    <span className="whitespace-nowrap relative z-10">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            <select
                                className="hidden md:block px-3 py-2 rounded-full text-xs font-medium outline-none transition-all duration-300 bubble-button"
                                style={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    border: '2px solid rgba(72, 128, 255, 0.2)',
                                    color: '#133E87',
                                    fontFamily: 'Nunito Sans, sans-serif',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
                                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                defaultValue="id"
                            >
                                <option value="id">ID</option>
                                <option value="en">EN</option>
                            </select>

                            <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button 
                                        className="bubble-button relative p-2.5 rounded-full transition-all duration-300 group"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            border: '2px solid rgba(72, 128, 255, 0.2)',
                                            boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                                            fontFamily: 'Nunito Sans, sans-serif'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#F0F5FF';
                                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                                            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                                            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
                                        }}
                                    >
                                        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" style={{ color: '#133E87' }} />
                                        <span
                                            className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white z-20"
                                            style={{ backgroundColor: '#EF4444', display: unreadCount > 0 ? 'block' : 'none' }}
                                        />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                    align="end" 
                                    className="w-80 p-0 rounded-2xl shadow-xl"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(15px)',
                                        border: '2px solid rgba(72, 128, 255, 0.2)',
                                        boxShadow: '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                                        fontFamily: 'Nunito Sans, sans-serif'
                                    }}
                                >
                                    <div className="p-4 border-b" style={{ borderColor: 'rgba(72, 128, 255, 0.1)' }}>
                                        <h3 className="font-semibold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Notifikasi</h3>
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
                                                    className={`cursor-pointer flex flex-col items-start p-4 border-b transition-all duration-200 rounded-xl mx-2 my-1 ${!notif.is_read ? 'bg-blue-50/50' : ''}`}
                                                    style={{
                                                        borderColor: 'rgba(72, 128, 255, 0.1)',
                                                        fontFamily: 'Nunito Sans, sans-serif'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                                                        e.currentTarget.style.transform = 'translateX(4px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = !notif.is_read ? 'rgba(72, 128, 255, 0.05)' : 'transparent';
                                                        e.currentTarget.style.transform = 'translateX(0)';
                                                    }}
                                                    onClick={() => {
                                                        setNotificationOpen(false);
                                                        navigate(userType === 'admin' ? `/admin/notifications/${notif.id}` : `/member/notifications/${notif.id}`);
                                                    }}
                                                >
                                                    <div className="flex justify-between w-full mb-1">
                                                        <span className={`font-semibold text-sm ${!notif.is_read ? 'text-blue-600' : 'text-gray-900'}`} style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                                                            {notif.title}
                                                        </span>
                                                        {!notif.is_read && (
                                                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs line-clamp-2 mb-2 leading-relaxed" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{notif.message}</p>
                                                    <span className="text-[10px] font-medium" style={{ color: '#9CA3AF', fontFamily: 'Nunito Sans, sans-serif' }}>
                                                        {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-2 border-t" style={{ borderColor: 'rgba(72, 128, 255, 0.1)', background: 'rgba(72, 128, 255, 0.05)' }}>
                                        <DropdownMenuItem
                                            className="cursor-pointer justify-center py-2.5 rounded-full hover:bg-white hover:shadow-sm transition-all text-center w-full bubble-button"
                                            style={{
                                                fontFamily: 'Nunito Sans, sans-serif',
                                                border: '2px solid rgba(72, 128, 255, 0.2)',
                                                background: 'rgba(255, 255, 255, 0.8)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#F0F5FF';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(72, 128, 255, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                            onClick={() => {
                                                setNotificationOpen(false);
                                                navigate(userType === 'admin' ? '/admin/notifications' : '/member/notifications');
                                            }}
                                        >
                                            <span className="text-sm font-medium" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>
                                                Lihat Semua Notifikasi
                                            </span>
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button 
                                        className="bubble-button flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            border: '2px solid rgba(72, 128, 255, 0.2)',
                                            boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                                            fontFamily: 'Nunito Sans, sans-serif'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#F0F5FF';
                                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                                            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                                            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
                                        }}
                                    >
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                                            style={{ 
                                                background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                                                boxShadow: '0 4px 12px rgba(15, 91, 229, 0.3)',
                                                border: '2px solid rgba(255, 255, 255, 0.3)'
                                            }}
                                        >
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="hidden lg:flex flex-col items-start relative z-10">
                                            <p className="text-sm font-semibold leading-none mb-1" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{currentUser.name}</p>
                                            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{currentUser.role}</p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 hidden lg:block relative z-10" style={{ color: '#608BC1' }} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                    align="end" 
                                    className="w-64 p-2 rounded-2xl shadow-xl"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(15px)',
                                        border: '2px solid rgba(72, 128, 255, 0.2)',
                                        boxShadow: '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                                        fontFamily: 'Nunito Sans, sans-serif'
                                    }}
                                >
                                    <DropdownMenuLabel className="px-3 py-2">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{currentUser.name}</p>
                                            <p className="text-xs font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{currentUser.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="my-2" style={{ borderColor: 'rgba(72, 128, 255, 0.1)' }} />

                                    <DropdownMenuItem asChild>
                                        <Link
                                            to={userType === 'member' ? '/member/profile' : '/admin/profile'}
                                            className="cursor-pointer flex items-center px-3 py-2.5 rounded-full hover:bg-gray-50 transition-all duration-200 bubble-button"
                                            style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            <User className="w-4 h-4 mr-3" style={{ color: '#4880FF' }} />
                                            <span className="font-medium" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Profil Saya</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link
                                            to={userType === 'member' ? '/member/settings' : '/admin/settings'}
                                            className="cursor-pointer flex items-center px-3 py-2.5 rounded-full hover:bg-gray-50 transition-all duration-200 bubble-button"
                                            style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            <Settings className="w-4 h-4 mr-3" style={{ color: '#4880FF' }} />
                                            <span className="font-medium" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Pengaturan</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="my-2" style={{ borderColor: 'rgba(72, 128, 255, 0.1)' }} />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer flex items-center px-3 py-2.5 rounded-full hover:bg-red-50 transition-all duration-200 bubble-button"
                                        style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <LogOut className="w-4 h-4 mr-3" style={{ color: '#EF4444' }} />
                                        <span className="font-medium" style={{ color: '#DC2626', fontFamily: 'Nunito Sans, sans-serif' }}>Keluar</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button
                                className="bubble-button lg:hidden p-2 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    border: '2px solid rgba(72, 128, 255, 0.2)',
                                    boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                                    fontFamily: 'Nunito Sans, sans-serif'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F0F5FF';
                                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                                }}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <Menu className="w-6 h-6" style={{ color: '#133E87' }} />
                            </button>
                        </div>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div 
                        className="lg:hidden border-t"
                        style={{ 
                            borderColor: 'rgba(72, 128, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <div className="py-2 space-y-1 px-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="bubble-button flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 relative overflow-hidden"
                                    style={{
                                        backgroundColor: isActivePath(item.path) ? '#4880FF' : 'rgba(255, 255, 255, 0.9)',
                                        border: isActivePath(item.path) 
                                            ? '2px solid rgba(72, 128, 255, 0.5)' 
                                            : '2px solid rgba(72, 128, 255, 0.15)',
                                        color: isActivePath(item.path) ? '#FFFFFF' : '#133E87',
                                        fontWeight: isActivePath(item.path) ? 700 : 600,
                                        fontFamily: 'Nunito Sans, sans-serif',
                                        boxShadow: isActivePath(item.path) 
                                            ? '0 6px 25px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset' 
                                            : '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActivePath(item.path)) {
                                            e.currentTarget.style.backgroundColor = '#F0F5FF';
                                            e.currentTarget.style.transform = 'translateX(4px) scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActivePath(item.path)) {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                            e.currentTarget.style.transform = 'translateX(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                                        }
                                    }}
                                >
                                    {isActivePath(item.path) && (
                                        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full opacity-30 pointer-events-none"
                                            style={{
                                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%)',
                                                filter: 'blur(15px)'
                                            }}
                                        ></div>
                                    )}
                                    <item.icon className="w-5 h-5 relative z-10" />
                                    <span className="text-sm relative z-10">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
                {children}
            </main>
        </div>
    );
}