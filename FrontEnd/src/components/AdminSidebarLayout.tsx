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
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full transition-all duration-300 z-40 shadow-lg`}
        style={{ 
          width: sidebarCollapsed ? '80px' : '280px',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Fish className="w-7 h-7" style={{ color: '#4880FF' }} />
              <span className="text-lg" style={{ color: '#1F2937', fontWeight: 700 }}>temanikan</span>
            </div>
          )}
          {sidebarCollapsed && (
            <Fish className="w-7 h-7 mx-auto" style={{ color: '#4880FF' }} />
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-auto"
          >
            <ChevronLeft 
              className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
              style={{ color: '#6B7280' }}
            />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActivePath(item.path) ? 'shadow-sm' : ''
              }`}
              style={{ 
                backgroundColor: isActivePath(item.path) ? '#4880FF' : 'transparent',
                color: isActivePath(item.path) ? '#FFFFFF' : '#6B7280',
                fontWeight: isActivePath(item.path) ? 600 : 500,
              }}
              title={sidebarCollapsed ? item.label : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
          <Link
            to="/admin/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === '/admin/settings' ? 'shadow-sm' : ''
            }`}
            style={{ 
              backgroundColor: location.pathname === '/admin/settings' ? '#4880FF' : 'transparent',
              color: location.pathname === '/admin/settings' ? '#FFFFFF' : '#6B7280',
              fontWeight: location.pathname === '/admin/settings' ? 600 : 500,
            }}
            title={sidebarCollapsed ? 'Pengaturan' : ''}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Pengaturan</span>}
          </Link>
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
        style={{ backgroundColor: '#FFFFFF', width: '280px' }}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2">
            <Fish className="w-7 h-7" style={{ color: '#4880FF' }} />
            <span className="text-lg" style={{ color: '#1F2937', fontWeight: 700 }}>temanikan</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Mobile Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActivePath(item.path) ? 'shadow-sm' : ''
              }`}
              style={{ 
                backgroundColor: isActivePath(item.path) ? '#4880FF' : 'transparent',
                color: isActivePath(item.path) ? '#FFFFFF' : '#6B7280',
                fontWeight: isActivePath(item.path) ? 600 : 500,
              }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Sidebar Footer */}
        <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
          <Link
            to="/admin/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === '/admin/settings' ? 'shadow-sm' : ''
            }`}
            style={{ 
              backgroundColor: location.pathname === '/admin/settings' ? '#4880FF' : 'transparent',
              color: location.pathname === '/admin/settings' ? '#FFFFFF' : '#6B7280',
              fontWeight: location.pathname === '/admin/settings' ? 600 : 500,
            }}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span>Pengaturan</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" style={{ color: '#1F2937' }} />
              </button>

              {/* Page Title */}
              <div className="hidden sm:block">
                <h1 style={{ color: '#1F2937' }}>{title}</h1>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3 ml-auto">
                {/* Language Selector */}
                <select 
                  className="hidden md:block px-2.5 py-1.5 rounded-lg border text-xs"
                  style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                  defaultValue="id"
                >
                  <option value="id">ID</option>
                  <option value="en">EN</option>
                </select>

                {/* Notification Dropdown */}
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
                  <DropdownMenuContent align="end" className="w-80" style={{ backgroundColor: 'white' }}>
                    <DropdownMenuLabel style={{ color: '#1F2937' }}>
                      Notifikasi Belum Dibaca
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-y-auto">
                      {unreadNotifications.map((notification) => (
                        <DropdownMenuItem 
                          key={notification.id}
                          className="flex flex-col items-start p-3 cursor-pointer"
                        >
                          <div className="flex items-start gap-2 w-full">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm" style={{ color: '#1F2937' }}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-center cursor-pointer"
                      onClick={() => navigate('/admin/notifications')}
                    >
                      <span className="w-full" style={{ color: '#4880FF' }}>
                        Lihat Semua Notifikasi
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* User Profile Dropdown Menu */}
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
                    
                    {/* Profil Saya */}
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/admin/profile"
                        className="cursor-pointer flex items-center"
                      >
                        <User className="w-4 h-4 mr-2" style={{ color: '#4880FF' }} />
                        Profil Saya
                      </Link>
                    </DropdownMenuItem>

                    {/* Pengaturan */}
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/admin/settings"
                        className="cursor-pointer flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" style={{ color: '#4880FF' }} />
                        Pengaturan
                      </Link>
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
            color: '#6B7280'
          }}
        >
          <p className="text-sm">© 2025 Temanikan. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}