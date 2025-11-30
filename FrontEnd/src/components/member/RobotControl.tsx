import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from '../Router';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bot, Play, Pause, Battery, Clock, CheckCircle, RotateCcw, AlertCircle } from '../icons';
import { deviceAPI, robotAPI } from '../../services/api';
import { mockCleaningRecords, defaultAutoSchedule, AutoScheduleConfig, MockCleaningRecord, CleaningStatus } from './data/robotMockData';

type ActionLoadingState = {
  start: boolean;
  stop: boolean;
  dock: boolean;
};

type ActionFeedback = {
  type: 'start' | 'stop' | 'dock';
  message: string;
};

const scheduleKey = (deviceId?: string | null) => (deviceId ? `robotSchedule:${deviceId}` : null);

export default function RobotControl() {
  const { deviceId } = useParams<{ deviceId?: string }>();
  const numericDeviceId = deviceId ? parseInt(deviceId, 10) : null;

  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [robotMetrics, setRobotMetrics] = useState({
    status: 'idle',
    statusText: 'Siap',
    battery: 0,
    lastCleaningText: '-',
    lastCleaningAt: '',
    nextCleaningText: '',
    nextCleaningAt: ''
  });
  const [statusLoading, setStatusLoading] = useState(true);

  const [autoSchedule, setAutoSchedule] = useState<AutoScheduleConfig>(defaultAutoSchedule);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState('');
  const [scheduleError, setScheduleError] = useState('');

  const [cleaningHistory, setCleaningHistory] = useState<MockCleaningRecord[]>(mockCleaningRecords);
  const [historySource, setHistorySource] = useState<'api' | 'dummy'>('dummy');

  const [actionLoading, setActionLoading] = useState<ActionLoadingState>({ start: false, stop: false, dock: false });
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
  const [actionError, setActionError] = useState('');

  const loadDeviceDetails = useCallback(async () => {
    if (!numericDeviceId) return;
    try {
      const response = await deviceAPI.getDevice(numericDeviceId);
      setDevice(response.device);
    } catch (error) {
      console.error('Error fetching device data:', error);
    }
  }, [numericDeviceId]);

  const fetchRobotStatus = useCallback(async () => {
    if (!numericDeviceId) return;
    setStatusLoading(true);
    try {
      const response = await deviceAPI.getDashboardRobotStatus(numericDeviceId);
      if (response?.success && response.data) {
        const data = response.data;
        setRobotMetrics({
          status: data.status || 'idle',
          statusText: data.status_text || 'Siap',
          battery: data.battery ?? 0,
          lastCleaningText: data.last_cleaning_text || '-',
          lastCleaningAt: data.last_cleaning || '',
          nextCleaningText: data.next_cleaning_text || '',
          nextCleaningAt: data.next_cleaning || ''
        });
      }
    } catch (error) {
      console.error('Error fetching robot status:', error);
    } finally {
      setStatusLoading(false);
    }
  }, [numericDeviceId]);

  const normalizeHistory = (items: any[]): MockCleaningRecord[] => {
    return items.map((item, index) => ({
      id: item.id ?? index + 1,
      started_at: item.started_at || item.start_time || new Date().toISOString(),
      completed_at: item.completed_at || item.finished_at || item.completed_time || undefined,
      duration_minutes: typeof item.duration_minutes === 'number'
        ? item.duration_minutes
        : item.duration
          ? Math.round(item.duration / 60)
          : 0,
      status: (item.status || 'completed') as CleaningStatus,
      battery_used: item.battery_used ?? 30,
      areas_cleaned: item.areas_cleaned?.length ? item.areas_cleaned : ['Dasar kolam', 'Dinding kolam'],
      notes: item.notes
    }));
  };

  const fetchCleaningHistory = useCallback(async () => {
    if (!numericDeviceId) {
      setCleaningHistory(mockCleaningRecords);
      setHistorySource('dummy');
      return;
    }
    try {
      const response = await robotAPI.getCleaningHistory(numericDeviceId, 8);
      const list = Array.isArray(response?.history) ? response.history : [];
      if (list.length > 0) {
        setCleaningHistory(normalizeHistory(list));
        setHistorySource('api');
      } else {
        setCleaningHistory(mockCleaningRecords);
        setHistorySource('dummy');
      }
    } catch (error) {
      console.error('Error fetching cleaning history:', error);
      setCleaningHistory(mockCleaningRecords);
      setHistorySource('dummy');
    }
  }, [numericDeviceId]);

  useEffect(() => {
    if (!deviceId) return;
    const key = scheduleKey(deviceId);
    if (!key) return;

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setAutoSchedule(JSON.parse(stored));
      } else {
        setAutoSchedule(defaultAutoSchedule);
      }
    } catch (error) {
      console.warn('Failed to parse stored schedule:', error);
      setAutoSchedule(defaultAutoSchedule);
    }
  }, [deviceId]);

  useEffect(() => {
    if (!numericDeviceId) return;
    let isMounted = true;

    const bootstrap = async () => {
      setLoading(true);
      await Promise.all([loadDeviceDetails(), fetchRobotStatus(), fetchCleaningHistory()]);
      if (isMounted) {
        setLoading(false);
      }
    };

    bootstrap();
    const statusInterval = setInterval(fetchRobotStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(statusInterval);
    };
  }, [numericDeviceId, loadDeviceDetails, fetchRobotStatus, fetchCleaningHistory]);

  const handleSaveSchedule = async () => {
    if (!deviceId) return;
    const key = scheduleKey(deviceId);
    if (!key) return;

    setScheduleMessage('');
    setScheduleError('');
    setScheduleSaving(true);

    try {
      localStorage.setItem(key, JSON.stringify(autoSchedule));
      setScheduleMessage('Jadwal otomatis tersimpan dan akan ditampilkan di dashboard.');
    } catch (error) {
      console.error('Failed to save schedule:', error);
      setScheduleError('Gagal menyimpan jadwal. Coba lagi.');
    } finally {
      setScheduleSaving(false);
    }
  };

  const withActionLoading = (key: keyof ActionLoadingState, value: boolean) => {
    setActionLoading((prev) => ({ ...prev, [key]: value }));
  };

  const shouldSuppressError = (message?: string) =>
    typeof message === 'string' && message.toLowerCase().includes('unauthorized');

  const handleManualClean = async () => {
    if (!numericDeviceId) return;
    withActionLoading('start', true);
    setActionError('');
    const deviceName = device?.name || 'perangkat Anda';
    setActionFeedback({
      type: 'start',
      message: `Memulai proses pembersihan akuarium ${deviceName}.`
    });
    try {
      await robotAPI.startCleaning(numericDeviceId, { cleaning_type: 'manual' });
      setRobotMetrics((prev) => ({ ...prev, status: 'cleaning', statusText: 'Sedang Membersihkan' }));
      await fetchCleaningHistory();
    } catch (error: any) {
      console.error('Error starting cleaning:', error);
      const message = error?.response?.data?.error || 'Gagal memulai pembersihan.';
      if (!shouldSuppressError(message)) {
        setActionError(message);
      }
    } finally {
      withActionLoading('start', false);
      fetchRobotStatus();
    }
  };

  const handleStopClean = async () => {
    if (!numericDeviceId) return;
    withActionLoading('stop', true);
    setActionError('');
    setActionFeedback({
      type: 'stop',
      message: 'Operasi dibatalkan. Robot berhenti dan menunggu instruksi selanjutnya.'
    });
    try {
      await robotAPI.stopCleaning(numericDeviceId, { status: 'completed' });
      setRobotMetrics((prev) => ({ ...prev, status: 'idle', statusText: 'Siap' }));
      await fetchCleaningHistory();
    } catch (error: any) {
      console.error('Error stopping cleaning:', error);
      const message = error?.response?.data?.error || 'Gagal menghentikan pembersihan.';
      if (!shouldSuppressError(message)) {
        setActionError(message);
      }
    } finally {
      withActionLoading('stop', false);
      fetchRobotStatus();
    }
  };

  const handleReturnToDock = async () => {
    if (!numericDeviceId) return;
    withActionLoading('dock', true);
    setActionError('');
    setActionFeedback({
      type: 'dock',
      message: 'Robot sedang menuju docking station untuk pengisian daya.'
    });
    try {
      if (robotMetrics.status === 'cleaning') {
        await robotAPI.stopCleaning(numericDeviceId, { status: 'docking', notes: 'Returning to dock' });
      }
      setRobotMetrics((prev) => ({ ...prev, status: 'charging', statusText: 'Menuju Dock' }));
    } catch (error: any) {
      console.error('Error sending robot to dock:', error);
      const message = error?.response?.data?.error || 'Gagal mengirim robot ke dock.';
      if (!shouldSuppressError(message)) {
        setActionError(message);
      }
    } finally {
      withActionLoading('dock', false);
      fetchRobotStatus();
    }
  };

  if (!deviceId) {
    return <div className="p-8 text-center">Perangkat tidak ditemukan.</div>;
  }

  if (loading && !device) {
    return <div className="p-8 text-center">Memuat data robot...</div>;
  }

  const robotStatus = robotMetrics.status;
  const batteryLevel = robotMetrics.battery;
  const previewHistory = cleaningHistory.slice(0, 3);

  const statusLabel = (status: string) => {
    if (status === 'cleaning') return 'Sedang Membersihkan';
    if (status === 'charging') return 'Mengisi Daya';
    return 'Siap';
  };

  const statusColor = (status: string) => {
    if (status === 'cleaning') return { bg: 'rgba(72, 128, 255, 0.1)', color: '#4880FF' };
    if (status === 'charging') return { bg: 'rgba(254, 197, 61, 0.1)', color: '#FEC53D' };
    return { bg: 'rgba(74, 217, 145, 0.1)', color: '#4AD991' };
  };

  const { bg: statusBg, color: statusColorValue } = statusColor(robotStatus);

  const formatHistoryDate = (iso: string) => {
    const date = new Date(iso);
    return {
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const durationLabel = (minutes: number) => `${minutes || 0} menit`;
  const statusBadge = (status: CleaningStatus) => {
    switch (status) {
      case 'completed':
        return { label: 'Selesai', color: '#4AD991', bg: 'rgba(74, 217, 145, 0.15)' };
      case 'failed':
        return { label: 'Gagal', color: '#CE3939', bg: 'rgba(206, 57, 57, 0.15)' };
      case 'interrupted':
        return { label: 'Terputus', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
      default:
        return { label: status, color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)' };
    }
  };

  const nextScheduleLabel = autoSchedule.enabled
    ? robotMetrics.nextCleaningText || `Hari ini, ${autoSchedule.time} WIB`
    : 'Tidak ada jadwal aktif';

  const actionFeedbackStyles = {
    start: { bg: 'rgba(74, 217, 145, 0.12)', border: '#4AD991', text: '#065F46' },
    stop: { bg: 'rgba(206, 57, 57, 0.12)', border: '#CE3939', text: '#7F1D1D' },
    dock: { bg: 'rgba(72, 128, 255, 0.12)', border: '#4880FF', text: '#1E3A8A' }
  } as const;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl mb-2" style={{ color: '#1F2937', fontWeight: 700 }}>
          Kontrol <span style={{ color: '#4880FF' }}>Robot</span>
        </h2>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Kelola robot pembersih akuarium Anda
        </p>
      </div>

      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          fontFamily: 'Nunito Sans, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
          e.currentTarget.style.boxShadow = '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
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
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(35, 154, 246, 0.3), rgba(72, 128, 255, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(35, 154, 246, 0.3)',
                boxShadow: '0 4px 15px rgba(35, 154, 246, 0.2)'
              }}
            >
              <Bot className="w-7 h-7" style={{ color: '#239AF6' }} />
            </div>
            <div>
              <h3 className="text-lg" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Status Robot Terkini</h3>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{device?.name || 'Perangkat'}</p>
            </div>
          </div>
          {statusLoading && (
            <p className="text-xs" style={{ color: '#6B7280' }}>Memperbarui status...</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={{ backgroundColor: statusBg }}>
              {robotStatus === 'idle' && <CheckCircle className="w-6 h-6" style={{ color: statusColorValue }} />}
              {robotStatus === 'cleaning' && <Play className="w-6 h-6" style={{ color: statusColorValue }} />}
              {robotStatus === 'charging' && <Battery className="w-6 h-6" style={{ color: statusColorValue }} />}
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Status</p>
              <p style={{ color: '#1F2937', fontWeight: 600 }}>{statusLabel(robotStatus)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(130, 128, 255, 0.1)' }}>
              <Battery className="w-6 h-6" style={{ color: '#8280FF' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Baterai</p>
              <p style={{ color: '#1F2937', fontWeight: 600 }}>{batteryLevel}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(254, 197, 61, 0.1)' }}>
              <Clock className="w-6 h-6" style={{ color: '#FEC53D' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Pembersihan Terakhir</p>
              <p style={{ color: '#1F2937', fontWeight: 600 }}>{robotMetrics.lastCleaningText}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          fontFamily: 'Nunito Sans, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
          e.currentTarget.style.boxShadow = '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
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
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Jadwal Pembersihan Otomatis</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: '#6B7280', fontWeight: 600 }}>
              {autoSchedule.enabled ? 'Aktif' : 'Nonaktif'}
            </span>
            <Switch
              checked={autoSchedule.enabled}
              onCheckedChange={(checked) => setAutoSchedule((prev) => ({ ...prev, enabled: checked }))}
            />
          </div>
        </div>

        {autoSchedule.enabled ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: '#1F2937', fontWeight: 600 }}>Frekuensi</label>
                <Select
                  value={autoSchedule.frequency}
                  onValueChange={(value) => setAutoSchedule((prev) => ({ ...prev, frequency: value as AutoScheduleConfig['frequency'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Setiap Hari</SelectItem>
                    <SelectItem value="alternate">Setiap 2 Hari</SelectItem>
                    <SelectItem value="weekly">Setiap Minggu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: '#1F2937', fontWeight: 600 }}>Waktu</label>
                <Select
                  value={autoSchedule.time}
                  onValueChange={(value) => setAutoSchedule((prev) => ({ ...prev, time: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih waktu" />
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
                <strong>Jadwal Berikutnya:</strong> {nextScheduleLabel}
              </p>
            </div>

            <div className="space-y-2">
              <Button
                className="text-white hover:shadow-lg transition-all"
                style={{ backgroundColor: '#4880FF' }}
                onClick={handleSaveSchedule}
                disabled={scheduleSaving}
              >
                {scheduleSaving ? 'Menyimpan...' : 'Simpan Jadwal'}
              </Button>
              {scheduleMessage && <p className="text-xs" style={{ color: '#10B981' }}>{scheduleMessage}</p>}
              {scheduleError && <p className="text-xs" style={{ color: '#CE3939' }}>{scheduleError}</p>}
            </div>
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#6B7280' }}>Aktifkan jadwal otomatis untuk mengatur pembersihan rutin.</p>
        )}
      </Card>

      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          fontFamily: 'Nunito Sans, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
          e.currentTarget.style.boxShadow = '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
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
        <h3 className="mb-6 text-lg relative z-10" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Operasi Manual</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            className="text-white py-6 hover:shadow-lg transition-all"
            style={{ backgroundColor: '#4AD991' }}
            onClick={handleManualClean}
            disabled={robotStatus === 'cleaning' || actionLoading.start}
          >
            <Play className="w-5 h-5 mr-2" />
            {actionLoading.start ? 'Memulai...' : 'Mulai Pembersihan'}
          </Button>

          <Button
            className="py-6 hover:bg-gray-50 transition-all"
            style={{ backgroundColor: 'white', color: '#CE3939', border: '2px solid #CE3939', fontWeight: 600 }}
            onClick={handleStopClean}
            disabled={robotStatus !== 'cleaning' || actionLoading.stop}
          >
            <Pause className="w-5 h-5 mr-2" />
            {actionLoading.stop ? 'Menghentikan...' : 'Hentikan'}
          </Button>

          <Button
            className="py-6 hover:bg-gray-50 transition-all"
            style={{ backgroundColor: 'white', color: '#4880FF', border: '2px solid #4880FF', fontWeight: 600 }}
            onClick={handleReturnToDock}
            disabled={actionLoading.dock}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {actionLoading.dock ? 'Mengirim...' : 'Kembali ke Dock'}
          </Button>
        </div>

        {actionFeedback && (
          <div
            className="mt-4 p-4 rounded-lg border"
            style={{
              backgroundColor: actionFeedbackStyles[actionFeedback.type].bg,
              borderColor: actionFeedbackStyles[actionFeedback.type].border
            }}
          >
            <p className="text-sm" style={{ color: actionFeedbackStyles[actionFeedback.type].text }}>
              {actionFeedback.message}
            </p>
          </div>
        )}

        {actionError && (
          <div
            className="mt-4 p-4 rounded-lg border"
            style={{ backgroundColor: 'rgba(206, 57, 57, 0.08)', borderColor: 'rgba(206, 57, 57, 0.4)' }}
          >
            <p className="text-sm" style={{ color: '#CE3939' }}>
              {actionError}
            </p>
          </div>
        )}

        {robotStatus === 'cleaning' && !actionError && (
          <div className="mt-4 p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: 'rgba(72, 128, 255, 0.05)' }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#4880FF' }} />
            <p className="text-sm" style={{ color: '#1F2937' }}>
              Robot sedang melakukan pembersihan manual. Proses dipantau hingga selesai.
            </p>
          </div>
        )}
      </Card>

      <Card 
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          fontFamily: 'Nunito Sans, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
          e.currentTarget.style.boxShadow = '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
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
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-lg" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Riwayat Pembersihan</h3>
          <Link
            to={deviceId ? `/member/device/${deviceId}/cleaning-history` : `/member/cleaning-history`}
            className="text-sm hover:underline"
            style={{ color: '#4880FF', fontWeight: 600 }}
          >
            Lihat Semua
          </Link>
        </div>
        <div className="space-y-3">
          {previewHistory.length > 0 ? (
            previewHistory.map((item) => {
              const display = formatHistoryDate(item.started_at);
              const badge = statusBadge(item.status);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:shadow-md transition-all"
                  style={{ backgroundColor: 'rgba(74, 217, 145, 0.05)', border: '1px solid rgba(74, 217, 145, 0.1)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 217, 145, 0.1)' }}>
                      <CheckCircle className="w-5 h-5" style={{ color: '#4AD991' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>
                        {display.date} • {display.time}
                      </p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>Durasi: {durationLabel(item.duration_minutes)}</p>
                    </div>
                  </div>
                  <span
                    className="text-sm px-3 py-1 rounded-full"
                    style={{ color: badge.color, backgroundColor: badge.bg, fontWeight: 600 }}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-4">Belum ada riwayat pembersihan.</p>
          )}
        </div>
        {historySource === 'dummy' && (
          <p className="text-xs text-right mt-3" style={{ color: '#6B7280' }}>
            Menampilkan data simulasi karena perangkat belum aktif.
          </p>
        )}
      </Card>
    </div>
  );
}