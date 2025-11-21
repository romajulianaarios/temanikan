import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bell, Mail, AlertTriangle } from '../icons';

export default function SystemSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Admin Notification Settings */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6" style={{ color: '#608BC1' }} />
          <h3 style={{ color: '#133E87' }}>Notifikasi Admin</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Notifikasi Pengguna Baru</p>
              <p className="text-sm text-gray-600">Terima notifikasi saat ada pendaftaran baru</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Laporan Aktivitas Harian</p>
              <p className="text-sm text-gray-600">Ringkasan aktivitas sistem setiap hari</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Peringatan Error Sistem</p>
              <p className="text-sm text-gray-600">Notifikasi segera saat terjadi error</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Status Robot Global</p>
              <p className="text-sm text-gray-600">Update status semua robot yang terhubung</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Konten Baru Forum</p>
              <p className="text-sm text-gray-600">Notifikasi untuk moderasi konten baru</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Email Notification Settings */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6" style={{ color: '#608BC1' }} />
          <h3 style={{ color: '#133E87' }}>Notifikasi Email Admin</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Email Harian</p>
              <p className="text-sm text-gray-600">Terima ringkasan email setiap hari</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Laporan Mingguan</p>
              <p className="text-sm text-gray-600">Laporan lengkap sistem setiap minggu</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Alert Kritis</p>
              <p className="text-sm text-gray-600">Email segera untuk masalah kritis</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div>
            <label className="block mb-2" style={{ color: '#133E87' }}>
              Waktu Pengiriman Laporan Harian
            </label>
            <Select defaultValue="morning">
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
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6" style={{ color: '#608BC1' }} />
          <h3 style={{ color: '#133E87' }}>Pengaturan Peringatan Sistem</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Database Error</p>
              <p className="text-sm text-gray-600">Alert saat terjadi masalah database</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>API Failure</p>
              <p className="text-sm text-gray-600">Alert saat API eksternal gagal</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>High Server Load</p>
              <p className="text-sm text-gray-600">Peringatan saat beban server tinggi</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Storage Warning</p>
              <p className="text-sm text-gray-600">Alert saat storage hampir penuh</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div>
            <label className="block mb-2" style={{ color: '#133E87' }}>
              Tingkat Prioritas Minimum
            </label>
            <Select defaultValue="medium">
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
            <p className="text-sm text-gray-600 mt-1">
              Hanya tampilkan alert dengan prioritas ini atau lebih tinggi
            </p>
          </div>
        </div>
      </Card>

      {/* User Notification Control */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6" style={{ color: '#608BC1' }} />
          <h3 style={{ color: '#133E87' }}>Kontrol Notifikasi Pengguna</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Izinkan Notifikasi Email</p>
              <p className="text-sm text-gray-600">Pengguna dapat menerima notifikasi email</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Izinkan Push Notifications</p>
              <p className="text-sm text-gray-600">Pengguna dapat menerima push notification</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Notifikasi Broadcast</p>
              <p className="text-sm text-gray-600">Kirim notifikasi ke semua pengguna aktif</p>
            </div>
            <Switch />
          </div>

          <div>
            <label className="block mb-2" style={{ color: '#133E87' }}>
              Batas Notifikasi per Hari
            </label>
            <Select defaultValue="20">
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
            <p className="text-sm text-gray-600 mt-1">
              Batasi jumlah notifikasi yang diterima pengguna per hari
            </p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          className="text-white"
          style={{ backgroundColor: '#133E87' }}
        >
          Simpan Semua Pengaturan
        </Button>
      </div>
    </div>
  );
}
