import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bell, Mail, AlertTriangle } from '../icons';
import { useState } from 'react';

export default function SystemSettings() {
  // State untuk semua pengaturan
  const [settings, setSettings] = useState({
    // Admin Notifications
    newUserNotification: true,
    dailyActivityReport: true,
    systemErrorAlert: true,
    globalRobotStatus: true,
    newForumContent: false,
    
    // Email Notifications
    dailyEmail: true,
    weeklyReport: true,
    criticalAlert: true,
    dailyReportTime: 'morning',
    
    // System Alerts
    databaseError: true,
    apiFailure: true,
    highServerLoad: true,
    storageWarning: true,
    minPriority: 'medium',
    
    // User Notifications
    allowEmailNotifications: true,
    allowPushNotifications: true,
    broadcastNotifications: false,
    notificationLimit: '20'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Simulasi API call (bisa diganti dengan API call yang sebenarnya)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Di sini bisa ditambahkan API call ke backend
      // const response = await api.saveSystemSettings(settings);
      
      setSaveMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' });
      
      // Hapus pesan setelah 3 detik
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Gagal menyimpan pengaturan. Silakan coba lagi.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Admin Notification Settings */}
      <Card 
        className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          borderRadius: '32px',
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
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div 
            className="p-3 rounded-full transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(72, 128, 255, 0.3)',
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
            }}
          >
            <Bell className="w-6 h-6" style={{ color: '#608BC1' }} />
          </div>
          <h3 style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Notifikasi Admin</h3>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Notifikasi Pengguna Baru</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Terima notifikasi saat ada pendaftaran baru</p>
            </div>
            <Switch 
              checked={settings.newUserNotification}
              onCheckedChange={(checked) => setSettings({ ...settings, newUserNotification: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Laporan Aktivitas Harian</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Ringkasan aktivitas sistem setiap hari</p>
            </div>
            <Switch 
              checked={settings.dailyActivityReport}
              onCheckedChange={(checked) => setSettings({ ...settings, dailyActivityReport: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Peringatan Error Sistem</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Notifikasi segera saat terjadi error</p>
            </div>
            <Switch 
              checked={settings.systemErrorAlert}
              onCheckedChange={(checked) => setSettings({ ...settings, systemErrorAlert: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Status Robot Global</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Update status semua robot yang terhubung</p>
            </div>
            <Switch 
              checked={settings.globalRobotStatus}
              onCheckedChange={(checked) => setSettings({ ...settings, globalRobotStatus: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Konten Baru Forum</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Notifikasi untuk moderasi konten baru</p>
            </div>
            <Switch 
              checked={settings.newForumContent}
              onCheckedChange={(checked) => setSettings({ ...settings, newForumContent: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Email Notification Settings */}
      <Card 
        className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          borderRadius: '32px',
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
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div 
            className="p-3 rounded-full transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(72, 128, 255, 0.3)',
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
            }}
          >
            <Mail className="w-6 h-6" style={{ color: '#608BC1' }} />
          </div>
          <h3 style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Notifikasi Email Admin</h3>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Email Harian</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Terima ringkasan email setiap hari</p>
            </div>
            <Switch 
              checked={settings.dailyEmail}
              onCheckedChange={(checked) => setSettings({ ...settings, dailyEmail: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Laporan Mingguan</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Laporan lengkap sistem setiap minggu</p>
            </div>
            <Switch 
              checked={settings.weeklyReport}
              onCheckedChange={(checked) => setSettings({ ...settings, weeklyReport: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Alert Kritis</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Email segera untuk masalah kritis</p>
            </div>
            <Switch 
              checked={settings.criticalAlert}
              onCheckedChange={(checked) => setSettings({ ...settings, criticalAlert: checked })}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>
              Waktu Pengiriman Laporan Harian
            </label>
            <Select value={settings.dailyReportTime} onValueChange={(value) => setSettings({ ...settings, dailyReportTime: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Pagi (08:00)</SelectItem>
                <SelectItem value="afternoon">Siang (13:00)</SelectItem>
                <SelectItem value="evening">Sore (17:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* System Alert Settings */}
      <Card 
        className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          borderRadius: '32px',
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
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div 
            className="p-3 rounded-full transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(72, 128, 255, 0.3)',
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
            }}
          >
            <AlertTriangle className="w-6 h-6" style={{ color: '#608BC1' }} />
          </div>
          <h3 style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Pengaturan Peringatan Sistem</h3>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Database Error</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Alert saat terjadi masalah database</p>
            </div>
            <Switch 
              checked={settings.databaseError}
              onCheckedChange={(checked) => setSettings({ ...settings, databaseError: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>API Failure</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Alert saat API eksternal gagal</p>
            </div>
            <Switch 
              checked={settings.apiFailure}
              onCheckedChange={(checked) => setSettings({ ...settings, apiFailure: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>High Server Load</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Peringatan saat beban server tinggi</p>
            </div>
            <Switch 
              checked={settings.highServerLoad}
              onCheckedChange={(checked) => setSettings({ ...settings, highServerLoad: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Storage Warning</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Alert saat storage hampir penuh</p>
            </div>
            <Switch 
              checked={settings.storageWarning}
              onCheckedChange={(checked) => setSettings({ ...settings, storageWarning: checked })}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>
              Tingkat Prioritas Minimum
            </label>
            <Select value={settings.minPriority} onValueChange={(value) => setSettings({ ...settings, minPriority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Rendah</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
                <SelectItem value="critical">Kritis</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm mt-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
              Hanya tampilkan alert dengan prioritas ini atau lebih tinggi
            </p>
          </div>
        </div>
      </Card>

      {/* User Notification Control */}
      <Card 
        className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          borderRadius: '32px',
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
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div 
            className="p-3 rounded-full transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(72, 128, 255, 0.3)',
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
            }}
          >
            <Bell className="w-6 h-6" style={{ color: '#608BC1' }} />
          </div>
          <h3 style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Kontrol Notifikasi Pengguna</h3>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Izinkan Notifikasi Email</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Pengguna dapat menerima notifikasi email</p>
            </div>
            <Switch 
              checked={settings.allowEmailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, allowEmailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Izinkan Push Notifications</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Pengguna dapat menerima push notification</p>
            </div>
            <Switch 
              checked={settings.allowPushNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, allowPushNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Notifikasi Broadcast</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Kirim notifikasi ke semua pengguna aktif</p>
            </div>
            <Switch 
              checked={settings.broadcastNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, broadcastNotifications: checked })}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>
              Batas Notifikasi per Hari
            </label>
            <Select value={settings.notificationLimit} onValueChange={(value) => setSettings({ ...settings, notificationLimit: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 notifikasi</SelectItem>
                <SelectItem value="20">20 notifikasi</SelectItem>
                <SelectItem value="50">50 notifikasi</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm mt-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
              Batasi jumlah notifikasi yang diterima pengguna per hari
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex flex-col items-end gap-3">
        {saveMessage && (
          <div 
            className="px-4 py-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: saveMessage.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `2px solid ${saveMessage.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: saveMessage.type === 'success' ? '#16a34a' : '#dc2626',
              fontFamily: 'Nunito Sans, sans-serif',
              fontWeight: 600,
              boxShadow: `0 4px 15px ${saveMessage.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
            }}
          >
            {saveMessage.text}
          </div>
        )}
        <Button 
          className="bubble-button text-white transition-all duration-300"
          style={{ 
            backgroundColor: '#133E87',
            borderRadius: '9999px',
            padding: '12px 32px',
            fontFamily: 'Nunito Sans, sans-serif',
            fontWeight: 600,
            boxShadow: '0 6px 25px rgba(19, 62, 135, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
            border: '2px solid rgba(72, 128, 255, 0.3)',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.7 : 1
          }}
          onClick={handleSave}
          disabled={isSaving}
          onMouseEnter={(e) => {
            if (!isSaving) {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(19, 62, 135, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3) inset';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSaving) {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(19, 62, 135, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset';
            }
          }}
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
        </Button>
      </div>
    </div>
  );
}
