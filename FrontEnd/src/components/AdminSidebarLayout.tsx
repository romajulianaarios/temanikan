import { ReactNode, useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from './Router';
import { useAuth } from './AuthContext';
import { useLanguage, useTranslation } from '../contexts/LanguageContext';
import {
  Fish,
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
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // User data from auth context
  const currentUser = {
    name: user?.name || 'Admin Temanikan',
    email: user?.email || 'admin@temanikan.com',
    role: t('profile.administrator')
  };

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { notificationAPI } = await import('../services/api');
        const response = await notificationAPI.getNotifications(10, false);

        if (response.notifications) {
          setNotifications(response.notifications);
          setUnreadCount(response.unread_count || 0);
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    if (user) {
      fetchNotifications();
      // Optional: Poll every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (id: number) => {
    try {
      const { notificationAPI } = await import('../services/api');
      await notificationAPI.markAsRead(id);

      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const { notificationAPI } = await import('../services/api');
      await notificationAPI.markAllAsRead();

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const adminMenuItems = useMemo(() => [
    { icon: LayoutDashboard, label: t('admin.dashboard'), path: '/admin' },
    { icon: UsersIcon, label: t('admin.userManagement'), path: '/admin/users' },
    { icon: Bot, label: t('admin.robotStatus'), path: '/admin/robots' },
    { icon: Camera, label: t('admin.diseaseTrends'), path: '/admin/disease-trends' },
    { icon: BookOpen, label: t('admin.fishpedia'), path: '/admin/fishpedia' },
    { icon: MessageSquare, label: t('admin.forum'), path: '/admin/forum' },
    { icon: ShoppingCart, label: t('admin.orders'), path: '/admin/orders' },
  ], [t, language]);

  const handleLogout = () => {
    logout();
    navigate('/');
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (notificationOpen && !target.closest('.notification-dropdown-container')) {
        setNotificationOpen(false);
      }
      if (languageOpen && !target.closest('.language-dropdown-container')) {
        setLanguageOpen(false);
      }
    };

    if (notificationOpen || languageOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [notificationOpen, languageOpen]);

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
              <Fish className="w-7 h-7" style={{ color: '#4880FF' }} />
              <span className="text-lg font-bold" style={{
                color: '#133E87',
                fontFamily: 'Nunito Sans, sans-serif',
                fontWeight: 700
              }}>temanikan</span>
            </div>
          )}
          {sidebarCollapsed && (
            <Fish className="w-7 h-7 mx-auto" style={{ color: '#4880FF' }} />
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
            {!sidebarCollapsed && <span className="relative z-10">{t('common.logout')}</span>}
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
        className={`lg:hidden fixed left-0 top-0 h-full w-280px z-50 shadow-lg transform transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.3)',
          width: '280px'
        }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
          <div className="flex items-center gap-2">
            <Fish className="w-7 h-7" style={{ color: '#4880FF' }} />
            <span className="text-lg font-bold" style={{ color: '#133E87' }}>temanikan</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2">
            <X className="w-6 h-6" style={{ color: '#133E87' }} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: isActivePath(item.path) ? '#4880FF' : 'transparent',
                color: isActivePath(item.path) ? '#FFFFFF' : '#133E87',
                fontWeight: isActivePath(item.path) ? 700 : 600
              }}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
            style={{
              backgroundColor: '#FEE2E2',
              color: '#B91C1C',
              fontWeight: 700
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>{t('common.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'
        }`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.5)'
          }}
        >
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" style={{ color: '#133E87' }} />
            </button>

            <div className="flex flex-col">
              <h1 className="text-xl font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>
                {title}
              </h1>
              {breadcrumbs && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {index > 0 && <span className="text-gray-400">/</span>}
                      {crumb.path ? (
                        <Link to={crumb.path} className="hover:text-blue-600 transition-colors">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative language-dropdown-container hidden md:block">
              <button
                className="px-3 py-2 rounded-full text-xs font-medium outline-none transition-all duration-300 bubble-button flex items-center gap-2"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(72, 128, 255, 0.4)',
                  color: '#133E87',
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.5)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => setLanguageOpen(!languageOpen)}
              >
                <span>{language.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${languageOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {languageOpen && (
                <div 
                  className="absolute right-0 mt-2 min-w-[80px] rounded-2xl shadow-xl z-50 overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif',
                    top: '100%'
                  }}
                >
                  <button
                    className={`w-full px-4 py-2.5 text-left text-xs font-medium transition-all duration-200 ${
                      language === 'id' ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    style={{
                      color: language === 'id' ? '#133E87' : '#608BC1',
                      fontFamily: 'Nunito Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      if (language !== 'id') {
                        e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (language !== 'id') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    onClick={() => {
                      setLanguage('id');
                      setLanguageOpen(false);
                    }}
                  >
                    ID
                  </button>
                  <div className="h-px" style={{ backgroundColor: 'rgba(72, 128, 255, 0.1)' }}></div>
                  <button
                    className={`w-full px-4 py-2.5 text-left text-xs font-medium transition-all duration-200 ${
                      language === 'en' ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    style={{
                      color: language === 'en' ? '#133E87' : '#608BC1',
                      fontFamily: 'Nunito Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      if (language !== 'en') {
                        e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (language !== 'en') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    onClick={() => {
                      setLanguage('en');
                      setLanguageOpen(false);
                    }}
                  >
                    EN
                  </button>
                </div>
              )}
            </div>

            {/* Notification Dropdown */}
            <div className="relative notification-dropdown-container">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="bubble-button relative p-3 rounded-full transition-all duration-300"
                style={{
                  background: notificationOpen 
                    ? 'linear-gradient(135deg, rgba(72, 128, 255, 0.4), rgba(15, 91, 229, 0.3))'
                    : 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(72, 128, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)',
                  color: '#4880FF'
                }}
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Content */}
              {notificationOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right transition-all duration-200 animate-in fade-in zoom-in-95"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <div className="p-4 border-b flex justify-between items-center bg-white/50">
                    <h3 className="font-bold text-gray-800">{t('common.notifications')}</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {t('common.seeAll')}
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleMarkAsRead(notif.id)}
                          className={`p-4 border-b last:border-0 hover:bg-blue-50/50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                            <div className="flex-1">
                              <h4 className={`text-sm ${!notif.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {notif.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-2 block">
                                {new Date(notif.created_at).toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">{t('common.noNotifications')}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t bg-gray-50/50 text-center">
                    <Link to="/admin/notifications" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                      {t('notification.seeAll')}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bubble-button flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.8) inset'
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-gray-800 leading-tight">{currentUser.name}</p>
                    <p className="text-[9px] text-gray-500 font-medium">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-white/50 bg-white/90 backdrop-blur-xl">
                <DropdownMenuLabel>{t('profile.myAccount')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={() => navigate('/admin/profile')}
                >
                  <User className="w-4 h-4 mr-2" /> {t('profile.myProfile')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={() => navigate('/admin/settings')}
                >
                  <Settings className="w-4 h-4 mr-2" /> {t('settings.title')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> {t('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}