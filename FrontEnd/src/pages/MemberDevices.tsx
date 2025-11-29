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
            <h1 className="text-3xl" style={{ color: '#1F2937', fontWeight: 700 }}>
              Halo, {user?.name || 'Pengguna'}!
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
              Ayo kelola semua robot Temanikan Anda dalam satu tempat
            </p>
          </div>

          {/* Show button only if devices exist */}
          {devices.length > 0 && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
              style={{
                backgroundColor: '#4880FF',
                color: '#FFFFFF',
                fontWeight: 600
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
            className="p-16 rounded-2xl text-center mt-12 border border-dashed"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"
              style={{ backgroundColor: '#EFF6FF' }}
            >
              <Bot className="w-12 h-12" style={{ color: '#4880FF' }} />
            </div>
            <h2 className="text-2xl mb-3" style={{ color: '#111827', fontWeight: 700 }}>
              Anda Belum Memiliki Perangkat
            </h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#6B7280', lineHeight: '1.6' }}>
              Silakan tambahkan perangkat Temanikan pertama Anda untuk memulai monitoring.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{
                backgroundColor: '#4880FF',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '15px'
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
                className="p-6 rounded-2xl border transition-all hover:shadow-md"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Total Perangkat</p>
                    <p className="text-3xl mt-2 tracking-tight" style={{ color: '#111827', fontWeight: 800 }}>
                      {devices.length}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: '#EFF6FF' }}
                  >
                    <Bot className="w-6 h-6" style={{ color: '#4880FF' }} />
                  </div>
                </div>
              </div>

              <div
                className="p-6 rounded-2xl border transition-all hover:shadow-md"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Perangkat Online</p>
                    <p className="text-3xl mt-2 tracking-tight" style={{ color: '#10B981', fontWeight: 800 }}>
                      {devices.filter(d => d.status === 'online').length}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: '#ECFDF5' }}
                  >
                    <Activity className="w-6 h-6" style={{ color: '#10B981' }} />
                  </div>
                </div>
              </div>

              <div
                className="p-6 rounded-2xl border transition-all hover:shadow-md"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Perangkat Offline</p>
                    <p className="text-3xl mt-2 tracking-tight" style={{ color: '#EF4444', fontWeight: 800 }}>
                      {devices.filter(d => d.status === 'offline').length}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: '#FEF2F2' }}
                  >
                    <Circle className="w-6 h-6" style={{ color: '#EF4444' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Devices Grid */}
            <div>
              <h2 className="text-xl mb-6" style={{ color: '#111827', fontWeight: 700 }}>
                Daftar Perangkat
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="p-6 rounded-2xl transition-all group hover:-translate-y-1"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                      border: '1px solid #F3F4F6'
                    }}
                  >
                    {/* Device Icon */}
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: device.status === 'online' ? '#ECFDF5' : '#F3F4F6'
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
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border"
                        style={{
                          backgroundColor: device.status === 'online' ? '#ECFDF5' : '#FEF2F2',
                          color: device.status === 'online' ? '#059669' : '#DC2626',
                          borderColor: device.status === 'online' ? '#D1FAE5' : '#FECACA',
                          fontWeight: 600
                        }}
                      >
                        <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        {device.status === 'online' ? 'Online' : 'Offline'}
                      </div>
                    </div>

                    {/* Device Name */}
                    <h3 className="text-lg mb-1" style={{ color: '#111827', fontWeight: 700 }}>
                      {device.namaPerangkat}
                    </h3>

                    {/* Unique ID */}
                    <p
                      className="text-sm mb-4 font-mono bg-gray-50 inline-block px-2 py-0.5 rounded text-gray-500"
                    >
                      {device.uniqueID}
                    </p>

                    {/* Last Active */}
                    <div className="flex items-center gap-2 text-xs mb-6" style={{ color: '#9CA3AF' }}>
                      <Activity className="w-3.5 h-3.5" />
                      <span>Terakhir aktif: {device.lastActive}</span>
                    </div>

                    {/* Action Button - Only this is clickable */}
                    <div className="pt-4 border-t" style={{ borderColor: '#F3F4F6' }}>
                      <button
                        onClick={() => handleSelectDevice(device.id)}
                        className="w-full py-2.5 rounded-xl text-sm transition-all text-center font-semibold hover:shadow-md active:scale-95"
                        style={{
                          backgroundColor: '#EFF6FF',
                          color: '#4880FF',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#4880FF';
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#EFF6FF';
                          e.currentTarget.style.color = '#4880FF';
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