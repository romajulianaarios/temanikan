import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from './Router';
import { useAuth } from './AuthContext';
import { notificationAPI } from '../services/api';
import { formatNotificationTime } from '../utils/dateFormat';
import { 
  Home as LayoutDashboard, 
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
  ChevronLeft,
  ShoppingCart
} from './icons';
import logo from '../assets/logo_temanikan.png';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface AdminSidebarLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AdminSidebarLayout({ children, title, breadcrumbs }: AdminSidebarLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // User data from auth context
  const currentUser = {
    name: user?.name || 'Admin Temanikan',
    email: user?.email || 'admin@temanikan.com',
    role: 'Administrator'
  };

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationAPI.getNotifications(10, false);
        console.log('🔔 Notification API Response:', response);
        
        // Handle different response formats
        let notifs = [];
        let count = 0;
        
        if (response.success || response.notifications) {
          notifs = response.notifications || (response.data && response.data.notifications) || [];
          count = response.unread_count !== undefined ? response.unread_count : (response.data && response.data.unread_count) || 0;
        } else if (Array.isArray(response)) {
          // If response is directly an array
          notifs = response;
          count = response.filter((n: any) => !n.is_read).length;
        }

        console.log('📬 Notifications:', notifs);
        console.log('🔴 Unread Count:', count);

        setNotifications(notifs);
        setUnreadCount(count);
      } catch (error) {
        console.error('❌ Failed to fetch notifications', error);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: UsersIcon, label: 'Manajemen Pengguna', path: '/admin/users' },
    { icon: Bot, label: 'Status Robot', path: '/admin/robots' },
    { icon: Camera, label: 'Tren Deteksi', path: '/admin/disease-trends' },
    { icon: BookOpen, label: 'Fishpedia', path: '/admin/fishpedia' },
    { icon: MessageSquare, label: 'Forum', path: '/admin/forum' },
    { icon: ShoppingCart, label: 'Kelola Pesanan', path: '/admin/orders' },
  ];

  const handleLogout = () => {
    logout();
    // Force reload to home page to ensure clean state
    window.location.href = '/';
  };

  const isActivePath = (path: string) => {
    if (path === '/admin/forum') {
      return location.pathname.startsWith('/admin/forum');
    }
    if (path === '/admin/orders') {
      return location.pathname.startsWith('/admin/orders');
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ 
      background: 'linear-gradient(to bottom, #87CEEB 0%, #4A90E2 15%, #357ABD 30%, #2E5C8A 50%, #1E3A5F 70%, #0F2027 100%)',
      position: 'relative'
    }}>
      {/* Background Bubbles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F5BE5] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD6D6] rounded-full blur-3xl"></div>
      </div>
      
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full transition-all duration-300 z-40 shadow-lg`}
        style={{ 
          width: sidebarCollapsed ? '80px' : '280px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ 
          borderColor: 'rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <img src={logo} alt="Temanikan Logo" className="w-7 h-7 object-contain" />
              <span className="text-lg font-bold" style={{ 
                color: '#133E87',
                fontFamily: 'Nunito Sans, sans-serif',
                fontWeight: 700
              }}>temanikan</span>
            </div>
          )}
          {sidebarCollapsed && (
            <img src={logo} alt="Temanikan Logo" className="w-7 h-7 mx-auto object-contain" />
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="bubble-button p-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: 'rgba(72, 128, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(72, 128, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.4)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ChevronLeft 
              className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
              style={{ color: '#4880FF' }}
            />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="bubble-button flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ 
                backgroundColor: isActivePath(item.path) 
                  ? '#4880FF' 
                  : '#FFFFFF',
                border: isActivePath(item.path) 
                  ? '2px solid rgba(72, 128, 255, 0.5)' 
                  : '2px solid rgba(72, 128, 255, 0.15)',
                color: isActivePath(item.path) ? '#FFFFFF' : '#133E87',
                fontWeight: isActivePath(item.path) ? 700 : 600,
                fontFamily: 'Nunito Sans, sans-serif',
                boxShadow: isActivePath(item.path) 
                  ? '0 6px 25px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset' 
                  : '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
              }}
              title={sidebarCollapsed ? item.label : ''}
              onMouseEnter={(e) => {
                if (!isActivePath(item.path)) {
                  e.currentTarget.style.backgroundColor = '#F0F5FF';
                  e.currentTarget.style.transform = 'translateX(4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActivePath(item.path)) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateX(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.15)';
                }
              }}
            >
              {/* Bubble glow for active item */}
              {isActivePath(item.path) && (
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-30 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%)',
                    filter: 'blur(15px)'
                  }}
                ></div>
              )}
              <item.icon className="w-5 h-5 flex-shrink-0 relative z-10" />
              {!sidebarCollapsed && <span className="relative z-10">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
          <button
            type="button"
            onClick={handleLogout}
            className="bubble-button w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ 
              backgroundColor: '#FEE2E2',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              color: '#B91C1C',
              fontWeight: 700,
              fontFamily: 'Nunito Sans, sans-serif',
              boxShadow: '0 6px 25px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6) inset'
            }}
            title={sidebarCollapsed ? 'Logout' : ''}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FECACA';
              e.currentTarget.style.transform = 'translateX(4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.35), 0 0 0 1px rgba(239, 68, 68, 0.2) inset';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
              e.currentTarget.style.transform = 'translateX(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6) inset';
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 relative z-10" />
            {!sidebarCollapsed && <span className="relative z-10">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`lg:hidden fixed left-0 top-0 h-full w-280px z-50 shadow-lg transform transition-transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.3)',
          width: '280px'
        }}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ 
          borderColor: 'rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Temanikan Logo" className="w-7 h-7 object-contain" />
            <span className="text-lg font-bold" style={{ 
              color: '#133E87',
              fontFamily: 'Nunito Sans, sans-serif',
              fontWeight: 700
            }}>temanikan</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="bubble-button p-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: 'rgba(72, 128, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(72, 128, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.4)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X className="w-5 h-5" style={{ color: '#4880FF' }} />
          </button>
        </div>

        {/* Mobile Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="bubble-button flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ 
                backgroundColor: isActivePath(item.path) 
                  ? '#4880FF' 
                  : '#FFFFFF',
                border: isActivePath(item.path) 
                  ? '2px solid rgba(72, 128, 255, 0.5)' 
                  : '2px solid rgba(72, 128, 255, 0.15)',
                color: isActivePath(item.path) ? '#FFFFFF' : '#133E87',
                fontWeight: isActivePath(item.path) ? 700 : 600,
                fontFamily: 'Nunito Sans, sans-serif',
                boxShadow: isActivePath(item.path) 
                  ? '0 6px 25px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset' 
                  : '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
              }}
              onMouseEnter={(e) => {
                if (!isActivePath(item.path)) {
                  e.currentTarget.style.backgroundColor = '#F0F5FF';
                  e.currentTarget.style.transform = 'translateX(4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActivePath(item.path)) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateX(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.15)';
                }
              }}
            >
              {/* Bubble glow for active item */}
              {isActivePath(item.path) && (
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-30 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%)',
                    filter: 'blur(15px)'
                  }}
                ></div>
              )}
              <item.icon className="w-5 h-5 flex-shrink-0 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Sidebar Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="bubble-button w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ 
              backgroundColor: '#FEE2E2',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              color: '#B91C1C',
              fontWeight: 700,
              fontFamily: 'Nunito Sans, sans-serif',
              boxShadow: '0 6px 25px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6) inset'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FECACA';
              e.currentTarget.style.transform = 'translateX(4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.35), 0 0 0 1px rgba(239, 68, 68, 0.2) inset';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
              e.currentTarget.style.transform = 'translateX(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6) inset';
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 relative z-10" />
            <span className="relative z-10">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(72, 128, 255, 0.1)'
        }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Menu Button */}
              <button 
                className="bubble-button lg:hidden p-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(72, 128, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(72, 128, 255, 0.3)'
                }}
                onClick={() => setMobileMenuOpen(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.4)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Menu className="w-6 h-6" style={{ color: '#4880FF' }} />
              </button>

              {/* Page Title */}
              <div className="hidden sm:block">
                <h1 style={{ 
                  color: '#133E87',
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.5rem'
                }}>{title}</h1>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3 ml-auto">
                {/* Language Selector */}
                <div className="hidden md:block">
                  <Select defaultValue="id">
                    <SelectTrigger 
                      className="bubble-button px-3 py-2 h-auto text-sm font-semibold transition-all duration-300"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(72, 128, 255, 0.3)',
                        color: '#133E87',
                        fontFamily: 'Nunito Sans, sans-serif',
                        cursor: 'pointer',
                        minWidth: '80px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.4)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">ID</SelectItem>
                      <SelectItem value="en">EN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notification Dropdown */}
                <div className="relative">
                  <DropdownMenu open={notificationOpen} onOpenChange={(open) => {
                    console.log('🔔 Dropdown open state changed:', open);
                    setNotificationOpen(open);
                  }}>
                    <DropdownMenuTrigger asChild>
                      <button className="bubble-button p-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(72, 128, 255, 0.3)'
                        }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.4)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Bell className="w-5 h-5" style={{ color: '#4880FF' }} />
                      {unreadCount > 0 && (
                        <span 
                          className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: '#EF4444', fontSize: '10px' }}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    sideOffset={4} 
                    className="w-80" 
                    style={{ 
                      backgroundColor: 'white',
                      zIndex: 9999999,
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                      border: '1px solid rgba(229, 231, 235, 0.8)',
                      borderRadius: '16px',
                      padding: '8px',
                      display: 'block',
                      visibility: 'visible',
                      opacity: 1,
                      pointerEvents: 'auto',
                      minWidth: '320px',
                      maxWidth: '400px'
                    }}
                  >
                    <DropdownMenuLabel style={{ color: '#1F2937', fontWeight: 600, padding: '8px 12px' }}>
                      Notifikasi {unreadCount > 0 ? `(${unreadCount} belum dibaca)` : ''}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-y-auto" style={{ minHeight: '100px' }}>
                      {(() => {
                        console.log('🔔 Rendering notifications. Count:', notifications.length);
                        console.log('🔔 Notifications data:', notifications);
                        return null;
                      })()}
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-500">
                          <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-6 h-6 text-gray-400" />
                          </div>
                          Tidak ada notifikasi baru
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notification) => {
                          console.log('🔔 Rendering notification:', notification);
                          return (
                          <DropdownMenuItem 
                            key={notification.id}
                            className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setNotificationOpen(false);
                              navigate(`/admin/notifications/${notification.id}`);
                            }}
                            style={{ 
                              borderRadius: '8px',
                              marginBottom: '4px'
                            }}
                          >
                            <div className="flex items-start gap-2 w-full">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                notification.type === 'warning' || notification.type === 'alert' ? 'bg-yellow-500' : 
                                notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold" style={{ color: !notification.is_read ? '#1F2937' : '#6B7280' }}>
                                  {notification.title || 'Notifikasi'}
                                </p>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message || 'Tidak ada pesan'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.created_at ? formatNotificationTime(notification.created_at) : 'Baru saja'}
                                </p>
                              </div>
                              {!notification.is_read && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></span>
                              )}
                            </div>
                          </DropdownMenuItem>
                          );
                        })
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-center cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate('/admin/notifications')}
                      style={{ borderRadius: '8px', padding: '8px' }}
                    >
                      <span className="w-full" style={{ color: '#4880FF', fontWeight: 600 }}>
                        Lihat Semua Notifikasi
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* User Profile Dropdown Menu */}
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="bubble-button flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(72, 128, 255, 0.3)'
                        }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.4)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: 'linear-gradient(135deg, #4880FF, #0F5BE5)',
                          boxShadow: '0 2px 8px rgba(72, 128, 255, 0.4)'
                        }}
                      >
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="hidden lg:flex flex-col items-start">
                        <p className="text-xs font-semibold" style={{ 
                          color: '#133E87',
                          fontFamily: 'Nunito Sans, sans-serif',
                          fontWeight: 700
                        }}>{currentUser.name}</p>
                        <p className="text-xs" style={{ 
                          color: '#608BC1',
                          fontSize: '11px',
                          fontFamily: 'Nunito Sans, sans-serif'
                        }}>{currentUser.role}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 hidden lg:block" style={{ color: '#4880FF' }} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={4} className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm" style={{ color: '#1F2937' }}>{currentUser.name}</p>
                        <p className="text-xs text-gray-600">{currentUser.email}</p>
                        <p className="text-xs" style={{ color: '#4880FF' }}>{currentUser.role}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Profil Saya */}
                    <DropdownMenuItem 
                      className="cursor-pointer flex items-center"
                      onClick={() => {
                        navigate('/admin/profile');
                      }}
                    >
                      <User className="w-4 h-4 mr-2" style={{ color: '#4880FF' }} />
                      Profil Saya
                    </DropdownMenuItem>

                    {/* Pengaturan */}
                    <DropdownMenuItem 
                      className="cursor-pointer flex items-center"
                      onClick={() => {
                        navigate('/admin/settings');
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" style={{ color: '#4880FF' }} />
                      Pengaturan
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Logout */}
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative" style={{ zIndex: 1 }}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer 
          className="py-6 text-center border-t"
          style={{ 
            backgroundColor: 'transparent',
            borderColor: 'rgba(229, 231, 235, 0.5)',
            color: '#6B7280'
          }}
        >
          <p className="text-sm">© 2025 Temanikan. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}