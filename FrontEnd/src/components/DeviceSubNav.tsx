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
      className="border-b"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB'
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Device Info Bar */}
        <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#E5E7EB' }}>
          <button
            onClick={() => navigate('/member/devices')}
            className="flex items-center gap-2 text-sm transition-colors hover:opacity-70"
            style={{ color: '#6B7280' }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Perangkat</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4" style={{ color: '#4880FF' }} />
            <span className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>
              {deviceName}
            </span>
          </div>
        </div>

        {/* Sub Navigation Menu */}
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap"
              style={{
                backgroundColor: isActivePath(item.path) ? '#EFF6FF' : 'transparent',
                color: isActivePath(item.path) ? '#4880FF' : '#6B7280',
                fontWeight: isActivePath(item.path) ? 600 : 500,
                fontSize: '14px',
                borderBottom: isActivePath(item.path) ? '2px solid #4880FF' : '2px solid transparent'
              }}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}