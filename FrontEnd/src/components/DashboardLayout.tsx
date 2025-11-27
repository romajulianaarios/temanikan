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
    const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);

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
                const response = await notificationAPI.getNotifications(10, true);
                if (response.success) {
                    const notifications = Array.isArray(response.data)
                        ? response.data
                        : (response.data.notifications || []);
                    setUnreadNotifications(notifications);
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
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b sticky top-0 z-30" style={{ borderColor: '#E5E7EB' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Fish className="w-7 h-7" style={{ color: '#4880FF' }} />
                            <span className="text-lg hidden sm:block" style={{ color: '#1F2937', fontWeight: 700 }}>temanikan</span>
                        </div>

                        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center max-w-4xl mx-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all"
                                    style={{
                                        backgroundColor: isActivePath(item.path) ? '#4880FF' : 'transparent',
                                        color: isActivePath(item.path) ? '#FFFFFF' : '#6B7280',
                                        fontWeight: isActivePath(item.path) ? 600 : 500,
                                        fontSize: '13px',
                                        transform: 'translateY(0)',
                                        transitionProperty: 'all',
                                        transitionDuration: '200ms'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActivePath(item.path)) {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.backgroundColor = '#F3F4F6';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        if (!isActivePath(item.path)) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <item.icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="whitespace-nowrap">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            <select
                                className="hidden md:block px-2.5 py-1.5 rounded-lg border text-xs"
                                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                                defaultValue="id"
                            >
                                <option value="id">ID</option>
                                <option value="en">EN</option>
                            </select>

                            <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative hover:bg-gray-100 p-2 rounded-lg transition-colors">
                                        <Bell className="w-5 h-5" style={{ color: '#6B7280' }} />
                                        <span
                                            className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white"
                                            style={{ backgroundColor: '#EF4444', fontSize: '10px' }}
                                        >
                                            {unreadNotifications.length}
                                        </span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {unreadNotifications.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-gray-500">
                                            Tidak ada notifikasi baru
                                        </div>
                                    ) : (
                                        unreadNotifications.slice(0, 5).map((notif) => (
                                            <DropdownMenuItem
                                                key={notif.id}
                                                className="cursor-pointer flex flex-col items-start p-3"
                                                onClick={() => {
                                                    setNotificationOpen(false);
                                                    navigate(userType === 'admin' ? `/admin/notifications/${notif.id}` : `/member/notifications/${notif.id}`);
                                                }}
                                            >
                                                <div className="font-medium text-sm">{notif.title}</div>
                                                <div className="text-xs text-gray-500 line-clamp-2">{notif.message}</div>
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer justify-center"
                                        onClick={() => {
                                            setNotificationOpen(false);
                                            navigate(userType === 'admin' ? '/admin/notifications' : '/member/notifications');
                                        }}
                                    >
                                        <span className="w-full text-center" style={{ color: '#4880FF' }}>
                                            Lihat Semua Notifikasi
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: '#4880FF' }}
                                        >
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="hidden lg:flex flex-col items-start">
                                            <p className="text-xs" style={{ color: '#1F2937', fontWeight: 600 }}>{currentUser.name}</p>
                                            <p className="text-xs" style={{ color: '#6B7280', fontSize: '11px' }}>{currentUser.role}</p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 hidden lg:block" style={{ color: '#6B7280' }} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm" style={{ color: '#1F2937' }}>{currentUser.name}</p>
                                            <p className="text-xs text-gray-600">{currentUser.email}</p>
                                            <p className="text-xs" style={{ color: '#4880FF' }}>{currentUser.role}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild>
                                        <Link
                                            to={userType === 'member' ? '/member/profile' : '/admin/profile'}
                                            className="cursor-pointer flex items-center"
                                        >
                                            <User className="w-4 h-4 mr-2" style={{ color: '#4880FF' }} />
                                            Profil Saya
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link
                                            to={userType === 'member' ? '/member/settings' : '/admin/settings'}
                                            className="cursor-pointer flex items-center"
                                        >
                                            <Settings className="w-4 h-4 mr-2" style={{ color: '#4880FF' }} />
                                            Pengaturan
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-red-600 focus:text-red-600 flex items-center"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
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
                        <div className="py-2 space-y-1">
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

            <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
                {children}
            </main>
        </div>
    );
}