import { useParams } from '../components/Router';
import DeviceLayout from '../components/DeviceLayout';
import MemberOverview from '../components/member/MemberOverview';
import { useState, useEffect } from 'react';
import { deviceAPI } from '../services/api';

export default function MemberDeviceDashboard() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<{ id: number; name: string; device_code: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching devices for current user...');
        
        // Ambil semua devices milik user
        const response = await deviceAPI.getDevices();
        console.log('📦 Devices response:', response);
        
        // Backend mengembalikan {success: true, devices: [...], count: n}
        if (response && response.devices && response.devices.length > 0) {
          console.log(`✅ Found ${response.devices.length} device(s)`);
          
          // Jika ada deviceId di URL, cari device dengan ID tersebut
          if (deviceId) {
            console.log(`🔎 Looking for device ID: ${deviceId}`);
            const targetDevice = response.devices.find((d: any) => d.id === parseInt(deviceId));
            
            if (targetDevice) {
              console.log('✅ Device found:', targetDevice);
              setDevice(targetDevice);
            } else {
              console.log('❌ Device not found in user devices');
              setError('Device tidak ditemukan atau bukan milik Anda');
            }
          } else {
            // Jika tidak ada deviceId, ambil device pertama
            console.log('📌 No deviceId in URL, using first device');
            setDevice(response.devices[0]);
          }
        } else {
          console.log('❌ No devices found for user');
          setError('Anda belum memiliki perangkat terdaftar');
        }
      } catch (err: any) {
        console.error('❌ Error fetching devices:', err);
        setError('Gagal memuat data perangkat');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [deviceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F6FA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#4880FF' }}></div>
          <p className="mt-4" style={{ color: '#6B7280' }}>Memuat perangkat...</p>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F6FA' }}>
        <div className="text-center p-12 rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 className="text-2xl mb-4" style={{ color: '#1F2937', fontWeight: 700 }}>
            Perangkat Tidak Ditemukan
          </h2>
          <p style={{ color: '#6B7280' }}>
            Perangkat dengan ID tidak ditemukan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DeviceLayout
      deviceId={device.id.toString()}
      deviceName={device.name}
      title={`Dashboard - ${device.name}`}
    >
      {/* Use existing MemberOverview component */}
      <MemberOverview />
    </DeviceLayout>
  );
}