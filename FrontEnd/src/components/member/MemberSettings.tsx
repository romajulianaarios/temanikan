import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bell } from '../icons';

export default function MemberSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Email Notifications */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6" style={{ color: '#608BC1' }} />
          <h3 style={{ color: '#133E87' }}>Notifikasi Email</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Notifikasi Kualitas Air</p>
              <p className="text-sm text-gray-600">Terima email saat kualitas air berubah</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Notifikasi Deteksi Penyakit</p>
              <p className="text-sm text-gray-600">Terima email saat penyakit terdeteksi</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Notifikasi Robot</p>
              <p className="text-sm text-gray-600">Terima email tentang status pembersihan robot</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Notifikasi Forum</p>
              <p className="text-sm text-gray-600">Terima email saat ada balasan di forum</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Newsletter Mingguan</p>
              <p className="text-sm text-gray-600">Terima tips perawatan ikan dan update fitur</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Dashboard Notifications */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6" style={{ color: '#608BC1' }} />
          <h3 style={{ color: '#133E87' }}>Notifikasi Dashboard</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Notifikasi Real-time</p>
              <p className="text-sm text-gray-600">Tampilkan notifikasi langsung di dashboard</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Suara Notifikasi</p>
              <p className="text-sm text-gray-600">Mainkan suara saat ada notifikasi penting</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Badge Notifikasi</p>
              <p className="text-sm text-gray-600">Tampilkan jumlah notifikasi yang belum dibaca</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Notification Frequency */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6" style={{ color: '#608BC1' }} />
          <h3 style={{ color: '#133E87' }}>Frekuensi Notifikasi</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2" style={{ color: '#133E87' }}>
              Ringkasan Harian
            </label>
            <Select defaultValue="morning">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disabled">Nonaktif</SelectItem>
                <SelectItem value="morning">Pagi (08:00)</SelectItem>
                <SelectItem value="afternoon">Siang (12:00)</SelectItem>
                <SelectItem value="evening">Sore (18:00)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 mt-1">
              Terima ringkasan aktivitas harian sekali sehari
            </p>
          </div>

          <div>
            <label className="block mb-2" style={{ color: '#133E87' }}>
              Laporan Mingguan
            </label>
            <Select defaultValue="monday">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disabled">Nonaktif</SelectItem>
                <SelectItem value="monday">Senin</SelectItem>
                <SelectItem value="wednesday">Rabu</SelectItem>
                <SelectItem value="friday">Jumat</SelectItem>
                <SelectItem value="sunday">Minggu</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 mt-1">
              Terima laporan lengkap kondisi akuarium setiap minggu
            </p>
          </div>
        </div>
      </Card>

      {/* Priority Notifications */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6" style={{ color: '#608BC1' }} />
          <h3 style={{ color: '#133E87' }}>Notifikasi Prioritas</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Peringatan Kritis</p>
              <p className="text-sm text-gray-600">
                Notifikasi segera untuk kondisi darurat (pH ekstrem, suhu berbahaya)
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Penyakit Terdeteksi</p>
              <p className="text-sm text-gray-600">
                Notifikasi prioritas tinggi saat sistem mendeteksi penyakit
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87' }}>Gangguan Robot</p>
              <p className="text-sm text-gray-600">
                Notifikasi saat robot mengalami masalah atau error
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          className="text-white"
          style={{ backgroundColor: '#133E87' }}
        >
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}
