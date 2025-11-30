import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AddDeviceModal from '../components/AddDeviceModal';
import { useNavigate } from '../components/Router';
import { Plus, Bot, Activity, Circle } from '../components/icons';
import { Button } from '../components/ui/button';
import { useAuth } from '../components/AuthContext';
import { deviceAPI } from '../services/api';
import NotificationModal from '../components/ui/NotificationModal';

interface Device {
  id: string;
  namaPerangkat: string;
  uniqueID: string;
  status: 'online' | 'offline';
  lastActive: string;
}

export default function MemberDevices() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notification modal state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  // Fetch devices from database
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await deviceAPI.getUserDevices();

      if (response.success && response.devices) {
        setDevices(response.devices);
      }
    } catch (err: any) {
      console.error('Error fetching devices:', err);
      setError(err.response?.data?.error || 'Gagal memuat data perangkat');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async (deviceData: { namaPerangkat: string; uniqueID: string }) => {
    try {
      // Call API to add device to database
      const response = await deviceAPI.addDevice({
        name: deviceData.namaPerangkat,
        device_code: deviceData.uniqueID
      });

      if (response.message || response.device) {
        // Close modal
        setIsModalOpen(false);

        // Refresh device list from server
        await fetchDevices();

        // Show success notification modal
        setNotificationType('success');
        setNotificationTitle('Berhasil!');
        setNotificationMessage(`Perangkat "${deviceData.namaPerangkat}" berhasil didaftarkan!`);
        setShowNotification(true);
      }
    } catch (err: any) {
      console.error('Error adding device:', err);
      // Show error notification modal
      const errorMsg = err.response?.data?.error || 'Gagal mendaftarkan perangkat. Silakan coba lagi.';
      setNotificationType('error');
      setNotificationTitle('Gagal');
      setNotificationMessage(errorMsg);
      setShowNotification(true);
    }
  };

  const handleSelectDevice = (deviceId: string) => {
    // Navigate to device-specific dashboard
    navigate(`/member/device/${deviceId}/dashboard`);
  };

  return (
    <DashboardLayout title="Perangkat Saya" userType="member">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl" style={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
              Halo, {user?.name || 'Pengguna'}!
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Nunito Sans, sans-serif' }}>
              Ayo kelola semua robot Temanikan Anda dalam satu tempat
            </p>
          </div>

          {/* Show button only if devices exist */}
          {devices.length > 0 && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bubble-button flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                color: '#FFFFFF',
                fontWeight: 700,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
              }}
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Perangkat Baru</span>
            </Button>
          )}
        </div>

        {devices.length === 0 ? (
          // Empty State - Kondisi Awal untuk Member Baru
          <div
            className="bubble-card p-16 rounded-[32px] text-center mt-12 relative overflow-hidden transition-all duration-300"
            style={{ 
              backgroundColor: '#FFFFFF',
              border: '2px solid rgba(72, 128, 255, 0.2)',
              boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
          >
            {/* Bubble glow effect */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                filter: 'blur(20px)'
              }}
            ></div>
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(72, 128, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(72, 128, 255, 0.2)'
              }}
            >
              <Bot className="w-12 h-12" style={{ color: '#4880FF' }} />
            </div>
            <h2 className="text-2xl mb-3 relative z-10" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
              Anda Belum Memiliki Perangkat
            </h2>
            <p className="text-sm mb-8 max-w-md mx-auto relative z-10" style={{ color: '#608BC1', lineHeight: '1.6', fontFamily: 'Nunito Sans, sans-serif' }}>
              Silakan tambahkan perangkat Temanikan pertama Anda untuk memulai monitoring.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bubble-button inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 relative z-10"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
              }}
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Perangkat Baru</span>
            </Button>
          </div>
        ) : (
          <>
            {/* Stats Cards - Only show if devices exist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div
                className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
                }}
              >
                {/* Bubble glow effect */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                    filter: 'blur(20px)'
                  }}
                ></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Total Perangkat</p>
                    <p className="text-3xl mt-2 tracking-tight" style={{ color: '#133E87', fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif' }}>
                      {devices.length}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(72, 128, 255, 0.3)',
                      boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
                    }}
                  >
                    <Bot className="w-6 h-6" style={{ color: '#4880FF' }} />
                  </div>
                </div>
              </div>

              <div
                className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '2px solid rgba(16, 185, 129, 0.2)',
                  boxShadow: '0 10px 50px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 20px 70px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.3) inset';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 50px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                }}
              >
                {/* Bubble glow effect */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 70%)',
                    filter: 'blur(20px)'
                  }}
                ></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Perangkat Online</p>
                    <p className="text-3xl mt-2 tracking-tight" style={{ color: '#10B981', fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif' }}>
                      {devices.filter(d => d.status === 'online').length}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <Activity className="w-6 h-6" style={{ color: '#10B981' }} />
                  </div>
                </div>
              </div>

              <div
                className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '2px solid rgba(239, 68, 68, 0.2)',
                  boxShadow: '0 10px 50px rgba(239, 68, 68, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 20px 70px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.3) inset';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 50px rgba(239, 68, 68, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                }}
              >
                {/* Bubble glow effect */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4), transparent 70%)',
                    filter: 'blur(20px)'
                  }}
                ></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Perangkat Offline</p>
                    <p className="text-3xl mt-2 tracking-tight" style={{ color: '#EF4444', fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif' }}>
                      {devices.filter(d => d.status === 'offline').length}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    <Circle className="w-6 h-6" style={{ color: '#EF4444' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Devices Grid */}
            <div>
              <h2 className="text-xl mb-6" style={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
                Daftar Perangkat
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="bubble-card p-6 rounded-[32px] transition-all duration-300 group relative overflow-hidden"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid rgba(72, 128, 255, 0.2)',
                      boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                      fontFamily: 'Nunito Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
                      e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                      e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                      e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
                    }}
                  >
                    {/* Bubble glow effect */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
                        filter: 'blur(15px)'
                      }}
                    ></div>
                    {/* Device Icon */}
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 relative z-10"
                        style={{
                          background: device.status === 'online' 
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))'
                            : 'linear-gradient(135deg, rgba(156, 163, 175, 0.3), rgba(107, 114, 128, 0.2))',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${device.status === 'online' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(156, 163, 175, 0.3)'}`,
                          boxShadow: device.status === 'online' 
                            ? '0 4px 15px rgba(16, 185, 129, 0.2)'
                            : '0 4px 15px rgba(156, 163, 175, 0.2)'
                        }}
                      >
                        <Bot
                          className="w-7 h-7"
                          style={{
                            color: device.status === 'online' ? '#10B981' : '#9CA3AF'
                          }}
                        />
                      </div>

                      {/* Status Badge */}
                      <div
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border relative z-10"
                        style={{
                          backgroundColor: device.status === 'online' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: device.status === 'online' ? '#059669' : '#DC2626',
                          borderColor: device.status === 'online' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                          fontWeight: 700,
                          fontFamily: 'Nunito Sans, sans-serif',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        {device.status === 'online' ? 'Online' : 'Offline'}
                      </div>
                    </div>

                    {/* Device Name */}
                    <h3 className="text-lg mb-1 relative z-10" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
                      {device.namaPerangkat}
                    </h3>

                    {/* Unique ID */}
                    <p
                      className="text-sm mb-4 font-mono inline-block px-2 py-0.5 rounded-full relative z-10"
                      style={{
                        backgroundColor: 'rgba(72, 128, 255, 0.1)',
                        color: '#608BC1',
                        border: '1px solid rgba(72, 128, 255, 0.2)',
                        fontFamily: 'Nunito Sans, sans-serif'
                      }}
                    >
                      {device.uniqueID}
                    </p>

                    {/* Last Active */}
                    <div className="flex items-center gap-2 text-xs mb-6 relative z-10" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                      <Activity className="w-3.5 h-3.5" />
                      <span>Terakhir aktif: {device.lastActive}</span>
                    </div>

                    {/* Action Button - Only this is clickable */}
                    <div className="pt-4 border-t relative z-10" style={{ borderColor: 'rgba(72, 128, 255, 0.1)' }}>
                      <button
                        onClick={() => handleSelectDevice(device.id)}
                        className="bubble-button w-full py-2.5 rounded-full text-sm transition-all duration-300 text-center font-semibold"
                        style={{
                          background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                          color: '#FFFFFF',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 6px 20px rgba(15, 91, 229, 0.3)',
                          fontFamily: 'Nunito Sans, sans-serif'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 91, 229, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 91, 229, 0.3)';
                        }}
                      >
                        Kelola Perangkat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddDevice={handleAddDevice}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        type={notificationType}
        title={notificationTitle}
        message={notificationMessage}
      />
    </DashboardLayout>
  );
}