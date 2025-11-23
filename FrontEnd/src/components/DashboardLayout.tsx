import { ReactNode, useState } from 'react';
import { useNavigate, Link, useLocation } from './Router';
import { useAuth } from './AuthContext';
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

  // User data from auth context
  const currentUser = {
    name: user?.name || (userType === 'admin' ? 'Admin Temanikan' : 'Roma Juliana'),
    email: user?.email || (userType === 'admin' ? 'admin@temanikan.com' : 'roma@example.com'),
    role: userType === 'admin' ? 'Administrator' : 'Member Premium'
  };

  // Mock unread notifications
  const unreadNotifications = [
    {
      id: 1,
      title: 'pH terlalu rendah',
      message: 'Parameter pH akuarium Anda berada di 6.2, disarankan untuk dinaikkan.',
      time: '5 menit yang lalu',
      type: 'warning'
    },
    {
      id: 2,
      title: 'Penyakit terdeteksi',
      message: 'Terdeteksi gejala white spot pada ikan Koi Anda.',
      time: '1 jam yang lalu',
      type: 'alert'
    },
    {
      id: 3,
      title: 'Jadwal pemberian makan',
      message: 'Waktunya memberi makan ikan Anda.',
      time: '2 jam yang lalu',
      type: 'info'
    }
  ];

  const memberMenuItems = [
    { icon: LayoutDashboard, label: 'Perangkat', path: '/member/devices' },
    { icon: BookOpen, label: 'Fishpedia', path: '/member/fishpedia' },
    { icon: MessageSquare, label: 'Forum', path: '/member/forum' },
    { icon: ShoppingCart, label: 'Pesanan Saya', path: '/member/orders' },
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

  const menuItems = userType === 'member' ? memberMenuItems : adminMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActivePath = (path: string) => {
    // Special handling for paths with sub-pages
    if (path === '/member/devices') {
      return location.pathname === path || location.pathname === '/member' || location.pathname.startsWith('/member/device/');
    }
    if (path === '/member/forum') {
      return location.pathname.startsWith('/member/forum');
    }
    if (path === '/admin/forum') {
      return location.pathname.startsWith('/admin/forum');
    }
    if (path === '/member/fishpedia') {
      return location.pathname.startsWith('/member/fishpedia');
    }
    if (path === '/member/orders') {
      return location.pathname.startsWith('/member/orders');
    }
    if (path === '/admin/orders') {
      return location.pathname.startsWith('/admin/orders');
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen dashboard-container relative overflow-hidden" style={{ 
      backgroundColor: '#F5F6FA'
    }}>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Fish className="w-7 h-7" style={{ color: '#4880FF' }} />
              <span className="text-lg hidden sm:block" style={{ color: '#1F2937', fontWeight: 700 }}>temanikan</span>
            </div>

            {/* Desktop Navigation Menu */}
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

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
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
                            notification.type === 'alert' ? 'bg-red-500' : 
                            notification.type === 'warning' ? 'bg-yellow-500' : 
                            'bg-blue-500'
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
                    onClick={() => navigate(`/${userType}/notifications`)}
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
                      to={userType === 'member' ? '/member/profile' : '/admin/profile'}
                      className="cursor-pointer flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" style={{ color: '#4880FF' }} />
                      Profil Saya
                    </Link>
                  </DropdownMenuItem>

                  {/* Pengaturan */}
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

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6" style={{ color: '#1F2937' }} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
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
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {children}
      </main>

      {/* Footer */}
      
    </div>
  );
}