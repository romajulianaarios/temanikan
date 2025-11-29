import { useParams } from '../components/Router';
import DeviceLayout from '../components/DeviceLayout';
import RobotControl from '../components/member/RobotControl';
import { useState, useEffect } from 'react';
import { deviceAPI } from '../services/api';

export default function MemberDeviceRobot() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<{ id: number; name: string; device_code: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const response = await deviceAPI.getDevices();
        
        if (response && response.devices && response.devices.length > 0) {
          if (deviceId) {
            const targetDevice = response.devices.find((d: any) => d.id === parseInt(deviceId));
            if (targetDevice) {
              setDevice(targetDevice);
            } else {
              setError('Device tidak ditemukan atau bukan milik Anda');
            }
          } else {
            setDevice(response.devices[0]);
          }
        } else {
          setError('Anda belum memiliki perangkat terdaftar');
        }
      } catch (err: any) {
        console.error('Error fetching devices:', err);
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
      title={`Kontrol Robot - ${device.name}`}
    >
      {/* Use existing RobotControl component */}
      <RobotControl />
    </DeviceLayout>
  );
}