import { useState, useEffect } from 'react';
import { Link, useParams } from '../Router';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bot, Play, Pause, Battery, Clock, CheckCircle, RotateCcw, AlertCircle } from '../icons';
import { deviceAPI, robotAPI } from '../../services/api';

export default function RobotControl() {
  const { deviceId } = useParams<{ deviceId?: string }>();
  const [autoCleanEnabled, setAutoCleanEnabled] = useState(true);
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cleaningHistory, setCleaningHistory] = useState<any[]>([]);

  const fetchDeviceData = async () => {
    if (!deviceId) return;
    try {
      const deviceData = await deviceAPI.getDevice(parseInt(deviceId));
      setDevice(deviceData.device);

      const historyData = await robotAPI.getCleaningHistory(parseInt(deviceId), 5);
      setCleaningHistory(historyData.history || []);
    } catch (error) {
      console.error('Error fetching device data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceData();
    // Poll for status updates every 5 seconds
    const interval = setInterval(fetchDeviceData, 5000);
    return () => clearInterval(interval);
  }, [deviceId]);

  const handleManualClean = async () => {
    if (!deviceId) return;
    try {
      await robotAPI.startCleaning(parseInt(deviceId));
      fetchDeviceData(); // Refresh immediately
    } catch (error) {
      console.error('Error starting cleaning:', error);
    }
  };

  const handleStopClean = async () => {
    if (!deviceId) return;
    try {
      await robotAPI.stopCleaning(parseInt(deviceId));
      fetchDeviceData(); // Refresh immediately
    } catch (error) {
      console.error('Error stopping cleaning:', error);
    }
  };

  if (loading && !device) {
    return <div className="p-8 text-center">Memuat data robot...</div>;
  }

  const robotStatus = device?.robot_status || 'idle';
  const batteryLevel = device?.battery_level || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl mb-2" style={{ color: '#1F2937', fontWeight: 700 }}>
          Kontrol <span style={{ color: '#4880FF' }}>Robot</span>
        </h2>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Kelola robot pembersih akuarium Anda
        </p>
      </div>

      {/* Robot Status */}
      <Card className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(35, 154, 246, 0.1)' }}
          >
            <Bot className="w-7 h-7" style={{ color: '#239AF6' }} />
          </div>
          <div>
            <h3 className="text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>Status Robot Terkini</h3>
            <p className="text-sm" style={{ color: '#6B7280' }}>{device?.name || 'Device'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: robotStatus === 'idle' ? 'rgba(74, 217, 145, 0.1)' : robotStatus === 'cleaning' ? 'rgba(72, 128, 255, 0.1)' : 'rgba(254, 197, 61, 0.1)' }}
            >
              {robotStatus === 'idle' && <CheckCircle className="w-6 h-6" style={{ color: '#4AD991' }} />}
              {robotStatus === 'cleaning' && <Play className="w-6 h-6" style={{ color: '#4880FF' }} />}
              {robotStatus === 'charging' && <Battery className="w-6 h-6" style={{ color: '#FEC53D' }} />}
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Status</p>
              <p style={{ color: '#1F2937', fontWeight: 600 }}>
                {robotStatus === 'idle' && 'Siap'}
                {robotStatus === 'cleaning' && 'Sedang Membersihkan'}
                {robotStatus === 'charging' && 'Mengisi Daya'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: 'rgba(130, 128, 255, 0.1)' }}
            >
              <Battery className="w-6 h-6" style={{ color: '#8280FF' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Baterai</p>
              <p style={{ color: '#1F2937', fontWeight: 600 }}>{batteryLevel}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: 'rgba(254, 197, 61, 0.1)' }}
            >
              <Clock className="w-6 h-6" style={{ color: '#FEC53D' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Pembersihan Terakhir</p>
              <p style={{ color: '#1F2937', fontWeight: 600 }}>
                {cleaningHistory.length > 0
                  ? new Date(cleaningHistory[0].finished_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Automatic Cleaning Schedule */}
      <Card className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>Jadwal Pembersihan Otomatis</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: '#6B7280', fontWeight: 600 }}>
              {autoCleanEnabled ? 'Aktif' : 'Nonaktif'}
            </span>
            <Switch
              checked={autoCleanEnabled}
              onCheckedChange={setAutoCleanEnabled}
            />
          </div>
        </div>

        {autoCleanEnabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: '#1F2937', fontWeight: 600 }}>
                  Frekuensi
                </label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Setiap Hari</SelectItem>
                    <SelectItem value="alternate">Setiap 2 Hari</SelectItem>
                    <SelectItem value="weekly">Setiap Minggu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: '#1F2937', fontWeight: 600 }}>
                  Waktu
                </label>
                <Select defaultValue="20:00">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="20:00">20:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(72, 128, 255, 0.05)' }}>
              <p className="text-sm" style={{ color: '#1F2937' }}>
                <strong>Jadwal Berikutnya:</strong> Hari ini, 20:00 WIB
              </p>
            </div>

            <Button
              className="text-white hover:shadow-lg transition-all"
              style={{ backgroundColor: '#4880FF' }}
            >
              Simpan Jadwal
            </Button>
          </div>
        )}
      </Card>

      {/* Manual Operation */}
      <Card className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <h3 className="mb-6 text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>Operasi Manual</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            className="text-white py-6 hover:shadow-lg transition-all"
            style={{ backgroundColor: '#4AD991' }}
            onClick={handleManualClean}
            disabled={robotStatus === 'cleaning'}
          >
            <Play className="w-5 h-5 mr-2" />
            Mulai Pembersihan
          </Button>

          <Button
            className="py-6 hover:bg-gray-50 transition-all"
            style={{
              backgroundColor: 'white',
              color: '#CE3939',
              border: '2px solid #CE3939',
              fontWeight: 600
            }}
            onClick={handleStopClean}
            disabled={robotStatus !== 'cleaning'}
          >
            <Pause className="w-5 h-5 mr-2" />
            Hentikan
          </Button>

          <Button
            className="py-6 hover:bg-gray-50 transition-all"
            style={{
              backgroundColor: 'white',
              color: '#4880FF',
              border: '2px solid #4880FF',
              fontWeight: 600
            }}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Kembali ke Dock
          </Button>
        </div>

        {robotStatus === 'cleaning' && (
          <div className="mt-4 p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: 'rgba(72, 128, 255, 0.05)' }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#4880FF' }} />
            <p className="text-sm" style={{ color: '#1F2937' }}>
              Robot sedang melakukan pembersihan manual. Proses akan selesai dalam beberapa menit.
            </p>
          </div>
        )}
      </Card>

      {/* Maintenance History */}
      <Card className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>Riwayat Pembersihan</h3>
          <Link
            to={deviceId ? `/member/device/${deviceId}/cleaning-history` : `/member/cleaning-history`}
            className="text-sm hover:underline"
            style={{ color: '#4880FF', fontWeight: 600 }}
          >
            Lihat Semua
          </Link>
        </div>
        <div className="space-y-3">
          {cleaningHistory.length > 0 ? (
            cleaningHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:shadow-md transition-all"
                style={{ backgroundColor: 'rgba(74, 217, 145, 0.05)', border: '1px solid rgba(74, 217, 145, 0.1)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(74, 217, 145, 0.1)' }}
                  >
                    <CheckCircle className="w-5 h-5" style={{ color: '#4AD991' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>
                      {new Date(item.started_at).toLocaleDateString()} - {new Date(item.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>Durasi: {item.duration} menit</p>
                  </div>
                </div>
                <span className="text-sm px-3 py-1 rounded-full" style={{ color: '#4AD991', backgroundColor: 'rgba(74, 217, 145, 0.1)', fontWeight: 600 }}>
                  {item.status === 'completed' ? 'Selesai' : item.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Belum ada riwayat pembersihan.</p>
          )}
        </div>
      </Card>
    </div>
  );
}