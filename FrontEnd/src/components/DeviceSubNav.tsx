import { Link, useLocation } from './Router';
import { Home, Droplets, Bot, Camera, ChevronLeft } from './icons';
import { useNavigate } from './Router';

interface DeviceSubNavProps {
  deviceId: string;
  deviceName: string;
}

export default function DeviceSubNav({ deviceId, deviceName }: DeviceSubNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: `/member/device/${deviceId}/dashboard`
    },
    {
      icon: Droplets,
      label: 'Monitoring Air',
      path: `/member/device/${deviceId}/monitoring`
    },
    {
      icon: Bot,
      label: 'Kontrol Robot',
      path: `/member/device/${deviceId}/robot`
    },
    {
      icon: Camera,
      label: 'Deteksi Penyakit',
      path: `/member/device/${deviceId}/disease`
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className="border-b shadow-sm sticky top-0 z-20"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#F3F4F6'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Device Info Bar */}
        <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#F3F4F6' }}>
          <button
            onClick={() => navigate('/member/devices')}
            className="flex items-center gap-2 text-sm transition-all hover:translate-x-[-2px] group"
            style={{ color: '#6B7280' }}
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium">Kembali ke Perangkat</span>
          </button>

          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
            <Bot className="w-4 h-4" style={{ color: '#4880FF' }} />
            <span className="text-sm tracking-tight" style={{ color: '#111827', fontWeight: 600 }}>
              {deviceName}
            </span>
          </div>
        </div>

        {/* Sub Navigation Menu */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${isActivePath(item.path)
                  ? 'shadow-sm ring-1 ring-blue-100'
                  : 'hover:bg-gray-50'
                }`}
              style={{
                backgroundColor: isActivePath(item.path) ? '#EFF6FF' : 'transparent',
                color: isActivePath(item.path) ? '#4880FF' : '#6B7280',
                fontWeight: isActivePath(item.path) ? 600 : 500,
                fontSize: '14px',
              }}
            >
              <item.icon className={`w-4 h-4 ${isActivePath(item.path) ? 'scale-110' : ''}`} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}