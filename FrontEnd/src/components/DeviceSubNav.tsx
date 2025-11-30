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
      className="border-b shadow-sm sticky top-0 z-20 transition-all duration-300"
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderColor: 'rgba(72, 128, 255, 0.2)',
        boxShadow: '0 4px 20px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2) inset'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Device Info Bar */}
        <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'rgba(72, 128, 255, 0.1)' }}>
          <button
            onClick={() => navigate('/member/devices')}
            className="bubble-button flex items-center gap-2 text-sm transition-all duration-300 rounded-full px-3 py-1.5"
            style={{ 
              color: '#FFFFFF',
              fontFamily: 'Nunito Sans, sans-serif',
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateX(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(72, 128, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ChevronLeft className="w-4 h-4 transition-transform" />
            <span className="font-medium">Kembali ke Perangkat</span>
          </button>

          <div 
            className="flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300"
            style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(72, 128, 255, 0.2)',
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
          >
            <Bot className="w-4 h-4" style={{ color: '#4880FF' }} />
            <span className="text-sm tracking-tight" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
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
              className="bubble-button flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap relative overflow-hidden"
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
              <item.icon className={`w-4 h-4 relative z-10 ${isActivePath(item.path) ? 'scale-110' : ''}`} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}