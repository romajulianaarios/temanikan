import { useParams } from '../components/Router';
import DeviceLayout from '../components/DeviceLayout';
import MemberOverview from '../components/member/MemberOverview';

// Mock device data
const mockDevices: Record<string, { id: string; name: string; uniqueID: string }> = {
  'dev-001': { id: 'dev-001', name: 'Akuarium Ruang Tamu', uniqueID: 'TMNKN-A1B2-C3D4' },
  'dev-002': { id: 'dev-002', name: 'Akuarium Karantina', uniqueID: 'TMNKN-X5Y6-Z7W8' }
};

export default function MemberDeviceDashboard() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const device = deviceId ? mockDevices[deviceId] : null;

  if (!device) {
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
      deviceId={device.id} 
      deviceName={device.name}
      title={`Dashboard - ${device.name}`}
    >
      {/* Use existing MemberOverview component */}
      <MemberOverview />
    </DeviceLayout>
  );
}