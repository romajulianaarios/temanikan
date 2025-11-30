import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bell } from '../icons';

export default function MemberSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Email Notifications */}
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
          <h3 style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Notifikasi Email</h3>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Notifikasi Kualitas Air</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Terima email saat kualitas air berubah</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Notifikasi Deteksi Penyakit</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Terima email saat penyakit terdeteksi</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Notifikasi Robot</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Terima email tentang status pembersihan robot</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Notifikasi Forum</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Terima email saat ada balasan di forum</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Newsletter Mingguan</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Terima tips perawatan ikan dan update fitur</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Dashboard Notifications */}
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
          <h3 style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Notifikasi Dashboard</h3>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Notifikasi Real-time</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Tampilkan notifikasi langsung di dashboard</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Suara Notifikasi</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Mainkan suara saat ada notifikasi penting</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Badge Notifikasi</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Tampilkan jumlah notifikasi yang belum dibaca</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Notification Frequency */}
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
          <h3 style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Frekuensi Notifikasi</h3>
        </div>

        <div className="space-y-4 relative z-10">
          <div>
            <label className="block mb-2" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>
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
            <p className="text-sm mt-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
              Terima ringkasan aktivitas harian sekali sehari
            </p>
          </div>

          <div>
            <label className="block mb-2" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>
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
            <p className="text-sm mt-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
              Terima laporan lengkap kondisi akuarium setiap minggu
            </p>
          </div>
        </div>
      </Card>

      {/* Priority Notifications */}
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
          <h3 style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Notifikasi Prioritas</h3>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Peringatan Kritis</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                Notifikasi segera untuk kondisi darurat (pH ekstrem, suhu berbahaya)
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Penyakit Terdeteksi</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                Notifikasi prioritas tinggi saat sistem mendeteksi penyakit
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Gangguan Robot</p>
              <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
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
          className="bubble-button text-white px-8 py-3 rounded-full font-bold transition-all duration-300"
          style={{ 
            background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
          }}
        >
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}
