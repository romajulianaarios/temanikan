import { ReactNode } from 'react';
import DashboardLayout from './DashboardLayout';
import DeviceSubNav from './DeviceSubNav';
import { useNavigate } from './Router';
import { ChevronLeft } from './icons';

interface DeviceLayoutProps {
  deviceId?: string;
  deviceName?: string;
  title: string;
  children: ReactNode;
  backLabel?: string;
}

export default function DeviceLayout({ deviceId, deviceName, title, children, backLabel }: DeviceLayoutProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (!deviceId) return;
    
    if (backLabel === 'Kembali ke Dashboard') {
      navigate(`/member/device/${deviceId}/dashboard`);
    } else if (backLabel === 'Kembali ke Kontrol Robot') {
      navigate(`/member/device/${deviceId}/robot`);
    } else if (backLabel === 'Kembali ke Deteksi Penyakit') {
      navigate(`/member/device/${deviceId}/disease`);
    } else {
      navigate(`/member/device/${deviceId}/dashboard`);
    }
  };

  return (
    <DashboardLayout title={title} userType="member">
      {/* Device Sub Navigation - Upper Bar */}
      {deviceId && deviceName && (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6">
          <DeviceSubNav deviceId={deviceId} deviceName={deviceName} />
        </div>
      )}
      
      {/* Back Button for Sub-Pages */}
      {backLabel && deviceId && (
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-sm hover:underline transition-colors"
            style={{ color: '#4880FF', fontWeight: 600 }}
          >
            <ChevronLeft className="w-4 h-4" />
            {backLabel}
          </button>
        </div>
      )}
      
      {/* Content */}
      <div>
        {children}
      </div>
    </DashboardLayout>
  );
}