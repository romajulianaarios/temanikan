import DeviceLayout from '../components/DeviceLayout';
import AllNotifications from '../components/member/AllNotifications';
import { useParams } from '../components/Router';

// Mock device data
const mockDevices: Record<string, { id: string; name: string }> = {
  'dev-001': { id: 'dev-001', name: 'Akuarium Ruang Tamu' },
  'dev-002': { id: 'dev-002', name: 'Akuarium Karantina' }
};

export default function MemberDeviceNotifications() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const device = deviceId ? mockDevices[deviceId] : null;

  if (!device) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Perangkat tidak ditemukan</p>
      </div>
    );
  }

  return (
    <DeviceLayout 
      deviceId={device.id}
      deviceName={device.name}
      title="Semua Notifikasi" 
      backLabel="Kembali ke Dashboard"
    >
      <AllNotifications deviceId={deviceId} />
    </DeviceLayout>
  );
}