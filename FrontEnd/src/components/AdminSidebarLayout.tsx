import { ReactNode, useState } from 'react';
import { useNavigate, Link, useLocation } from './Router';
import { useAuth } from './AuthContext';
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

  // User data from auth context
  const currentUser = {
    name: user?.name || 'Admin Temanikan',
    email: user?.email || 'admin@temanikan.com',
    role: 'Administrator'
  };

  // Mock unread notifications
  const unreadNotifications = [
    {
      id: 1,
      title: 'Pesanan baru masuk',
      message: 'Roma Juliana melakukan pemesanan Robot Temanikan',
      time: '5 menit yang lalu',
      type: 'info'
    },
    {
      id: 2,
      title: 'Laporan deteksi penyakit',
      message: 'Terdeteksi peningkatan kasus white spot 15%',
      time: '1 jam yang lalu',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Pengguna baru terdaftar',
      message: '3 pengguna baru mendaftar hari ini',
      time: '2 jam yang lalu',
      type: 'info'
    }
  ];

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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full transition-all duration-300 z-40 shadow-xl border-r`}
        style={{
          width: sidebarCollapsed ? '80px' : '280px',
          backgroundColor: '#FFFFFF',
          borderColor: '#F3F4F6'
        }}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b" style={{ borderColor: '#F3F4F6' }}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <Fish className="w-8 h-8" style={{ color: '#4880FF' }} />
              <span className="text-xl tracking-tight" style={{ color: '#111827', fontWeight: 800 }}>temanikan</span>
            </div>
          )}
          {sidebarCollapsed && (
            <Fish className="w-8 h-8 mx-auto" style={{ color: '#4880FF' }} />
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-600 ml-auto"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActivePath(item.path) ? 'shadow-md shadow-blue-100 translate-x-1' : 'hover:bg-gray-50 hover:translate-x-1'
                }`}
              style={{
                backgroundColor: isActivePath(item.path) ? '#4880FF' : 'transparent',
                color: isActivePath(item.path) ? '#FFFFFF' : '#6B7280',
              }}
              title={sidebarCollapsed ? item.label : ''}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform ${isActivePath(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
              {!sidebarCollapsed && <span className={`font-semibold text-sm`}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t bg-gray-50/50" style={{ borderColor: '#F3F4F6' }}>
          <Link
            to="/admin/settings"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${location.pathname === '/admin/settings' ? 'shadow-md shadow-blue-100 bg-blue-600 text-white' : 'hover:bg-white hover:shadow-sm text-gray-500'
              }`}
            title={sidebarCollapsed ? 'Pengaturan' : ''}
          >
            <Settings className={`w-5 h-5 flex-shrink-0 transition-transform ${location.pathname === '/admin/settings' ? 'scale-110' : 'group-hover:rotate-90'}`} />
            {!sidebarCollapsed && <span className="font-semibold text-sm">Pengaturan</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-[280px] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Mobile Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b" style={{ borderColor: '#F3F4F6' }}>
          <div className="flex items-center gap-3">
            <Fish className="w-8 h-8" style={{ color: '#4880FF' }} />
            <span className="text-xl tracking-tight" style={{ color: '#111827', fontWeight: 800 }}>temanikan</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActivePath(item.path) ? 'shadow-md shadow-blue-100 bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-500'
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Sidebar Footer */}
        <div className="p-4 border-t bg-gray-50/50" style={{ borderColor: '#F3F4F6' }}>
          <Link
            to="/admin/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${location.pathname === '/admin/settings' ? 'shadow-md shadow-blue-100 bg-blue-600 text-white' : 'hover:bg-white hover:shadow-sm text-gray-500'
              }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-sm">Pengaturan</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'
          }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b shadow-sm" style={{ borderColor: '#F3F4F6' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden hover:bg-gray-50 p-2 rounded-xl transition-colors text-gray-600"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Page Title */}
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight" style={{ color: '#111827' }}>{title}</h1>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4 ml-auto">
                {/* Language Selector */}
                <select
                  className="hidden md:block px-3 py-2 rounded-lg border text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  style={{ borderColor: '#E5E7EB', color: '#4B5563' }}
                  defaultValue="id"
                >
                  <option value="id">ID</option>
                  <option value="en">EN</option>
                </select>

                {/* Notification Dropdown */}
                <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className="relative hover:bg-gray-50 p-2.5 rounded-xl transition-all duration-200 group">
                      <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: '#6B7280' }} />
                      <span
                        className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white"
                        style={{ backgroundColor: '#EF4444', display: unreadNotifications.length > 0 ? 'block' : 'none' }}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl shadow-xl border-gray-100">
                    <div className="p-4 border-b border-gray-50">
                      <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {unreadNotifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-500">
                          <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-6 h-6 text-gray-400" />
                          </div>
                          Tidak ada notifikasi baru
                        </div>
                      ) : (
                        unreadNotifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className={`cursor-pointer flex flex-col items-start p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors`}
                            onClick={() => navigate(`/admin/notifications/${notification.id}`)}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 mb-0.5">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 leading-relaxed mb-1.5 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-50 bg-gray-50/50">
                      <DropdownMenuItem
                        className="cursor-pointer justify-center py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-center w-full"
                        onClick={() => {
                          setNotificationOpen(false);
                          navigate('/admin/notifications');
                        }}
                      >
                        <span className="text-sm font-medium" style={{ color: '#4880FF' }}>
                          Lihat Semua Notifikasi
                        </span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Profile Dropdown Menu */}
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

                    {/* Profil Saya */}
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin/profile"
                        className="cursor-pointer flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="font-medium text-gray-700">Profil Saya</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Pengaturan */}
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin/settings"
                        className="cursor-pointer flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="font-medium text-gray-700">Pengaturan</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2" />

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 focus:text-red-700 focus:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      <span className="font-medium">Keluar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
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
            color: '#9CA3AF'
          }}
        >
          <p className="text-xs font-medium">© 2025 Temanikan. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}