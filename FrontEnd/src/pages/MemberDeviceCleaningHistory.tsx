import DeviceLayout from '../components/DeviceLayout';
import CleaningHistory from '../components/member/CleaningHistory';
import { useParams } from '../components/Router';

// Mock device data
const mockDevices: Record<string, { id: string; name: string }> = {
  'dev-001': { id: 'dev-001', name: 'Akuarium Ruang Tamu' },
  'dev-002': { id: 'dev-002', name: 'Akuarium Karantina' }
};

export default function MemberDeviceCleaningHistory() {
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
      title="Riwayat Pembersihan Lengkap" 
      backLabel="Kembali ke Kontrol Robot"
    >
      <CleaningHistory deviceId={deviceId} />
    </DeviceLayout>
  );
}