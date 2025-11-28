import DeviceLayout from '../components/DeviceLayout';
import DetectionHistory from '../components/member/DetectionHistory';
import { useParams } from '../components/Router';
import { useState, useEffect } from 'react';
import { deviceAPI } from '../services/api';

export default function MemberDeviceDetectionHistory() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<{ id: number; name: string; device_code: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await deviceAPI.getDevices();
        if (response && response.devices && response.devices.length > 0) {
          if (deviceId) {
            const targetDevice = response.devices.find((d: any) => d.id === parseInt(deviceId));
            if (targetDevice) setDevice(targetDevice);
          } else {
            setDevice(response.devices[0]);
          }
        }
      } catch (err: any) {
        console.error('Error fetching devices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, [deviceId]);

  if (loading || !device) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Memuat perangkat...</p>
      </div>
    );
  }

  return (
    <DeviceLayout 
      deviceId={device.id.toString()}
      deviceName={device.name}
      title="Riwayat Deteksi Penyakit" 
      backLabel="Kembali ke Deteksi Penyakit"
    >
      <DetectionHistory deviceId={device.id.toString()} />
    </DeviceLayout>
  );
}