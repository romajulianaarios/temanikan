import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Edit, Save, X } from '../icons';
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function MemberProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    namaLengkap: '',
    email: '',
    nomorHP: '',
    alamat: '',
    usia: '',
    jenisIkan: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load profile data from user context
  useEffect(() => {
    if (user) {
      setProfileData({
        namaLengkap: user.name || '',
        email: user.email || '',
        nomorHP: user.phone || '',
        alamat: user.address || '',
        usia: user.age ? user.age.toString() : '',
        jenisIkan: user.primary_fish_type || ''
      });
    }
  }, [user]);

  const [editData, setEditData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending update data:', {
        name: editData.namaLengkap,
        phone: editData.nomorHP,
        address: editData.alamat,
        age: editData.usia ? parseInt(editData.usia) : undefined,
        primary_fish_type: editData.jenisIkan
      });

      const result = await updateProfile({
        name: editData.namaLengkap,
        phone: editData.nomorHP,
        address: editData.alamat,
        age: editData.usia ? parseInt(editData.usia) : undefined,
        primary_fish_type: editData.jenisIkan
      });

      console.log('Update result:', result);

      if (result.success) {
        // Update local state
        setProfileData({ ...editData });
        setSuccess(result.message);
        setIsEditing(false);
      } else {
        setError(result.message || 'Gagal memperbarui profil');
      }
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.message || 'Terjadi kesalahan saat memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const fishTypes = [
    'Ikan Koi',
    'Ikan Mas Koki',
    'Ikan Guppy',
    'Ikan Cupang',
    'Ikan Molly',
    'Ikan Neon Tetra',
    'Ikan Discus',
    'Ikan Arwana',
    'Ikan Louhan',
    'Ikan Oscar',
    'Lainnya'
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div 
          className="bubble-card p-4 rounded-2xl transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
        >
          <p style={{ color: '#059669', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>{success}</p>
        </div>
      )}
      {error && (
        <div 
          className="bubble-card p-4 rounded-2xl transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
        >
          <p style={{ color: '#DC2626', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(72, 128, 255, 0.3)',
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
            }}
          >
            <User className="w-8 h-8" style={{ color: '#4880FF' }} />
          </div>
          <div>
            <h2 style={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>Profil Pengguna</h2>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Nunito Sans, sans-serif' }}>Kelola informasi profil Anda</p>
          </div>
        </div>
        {!isEditing ? (
          <Button 
            className="bubble-button text-white rounded-full transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)',
              fontFamily: 'Nunito Sans, sans-serif',
              fontWeight: 700
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
            }}
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              className="bubble-button rounded-full transition-all duration-300"
              variant="outline"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(72, 128, 255, 0.2)',
                color: '#133E87',
                fontFamily: 'Nunito Sans, sans-serif',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F5FF';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button 
              className="bubble-button text-white rounded-full transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)',
                fontFamily: 'Nunito Sans, sans-serif',
                fontWeight: 700
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
              }}
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Information Card */}
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
        <h3 className="mb-6 relative z-10" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Informasi Personal</h3>
        
        <div className="space-y-6">
          {/* Nama Lengkap */}
          <div>
            <Label htmlFor="namaLengkap">Nama Lengkap</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-xl transition-all duration-300 relative z-10"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <p style={{ color: '#133E87', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>{profileData.namaLengkap}</p>
              </div>
            ) : (
              <Input 
                id="namaLengkap"
                value={editData.namaLengkap}
                onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
                className="mt-2 rounded-xl"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              />
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-xl transition-all duration-300 relative z-10"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <p style={{ color: '#133E87', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>{profileData.email}</p>
              </div>
            ) : (
              <Input 
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-2 rounded-xl"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              />
            )}
          </div>

          {/* Nomor HP */}
          <div>
            <Label htmlFor="nomorHP">Nomor HP</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-xl transition-all duration-300 relative z-10"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <p style={{ color: '#133E87', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>{profileData.nomorHP || 'Belum diisi'}</p>
              </div>
            ) : (
              <Input 
                id="nomorHP"
                type="tel"
                value={editData.nomorHP}
                onChange={(e) => handleInputChange('nomorHP', e.target.value)}
                className="mt-2 rounded-xl"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              />
            )}
          </div>

          {/* Alamat */}
          <div>
            <Label htmlFor="alamat">Alamat</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-xl transition-all duration-300 relative z-10"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <p style={{ color: '#133E87', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>{profileData.alamat || 'Belum diisi'}</p>
              </div>
            ) : (
              <Input 
                id="alamat"
                type="text"
                value={editData.alamat}
                onChange={(e) => handleInputChange('alamat', e.target.value)}
                className="mt-2 rounded-xl"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              />
            )}
          </div>

          {/* Usia */}
          <div>
            <Label htmlFor="usia" style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600, color: '#133E87' }}>Usia</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-xl transition-all duration-300 relative z-10"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <p style={{ color: '#133E87', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>{profileData.usia ? `${profileData.usia} tahun` : 'Belum diisi'}</p>
              </div>
            ) : (
              <Input 
                id="usia"
                type="number"
                value={editData.usia}
                onChange={(e) => handleInputChange('usia', e.target.value)}
                className="mt-2 rounded-xl"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
                min="1"
                max="150"
                placeholder="Masukkan usia"
              />
            )}
          </div>

          {/* Jenis Ikan Hias Utama */}
          <div>
            <Label htmlFor="jenisIkan" style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600, color: '#133E87' }}>Jenis Ikan Hias Utama</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-xl transition-all duration-300 relative z-10"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(72, 128, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(72, 128, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <p style={{ color: '#133E87', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>{profileData.jenisIkan || 'Belum diisi'}</p>
              </div>
            ) : (
              <select
                id="jenisIkan"
                className="flex h-10 w-full rounded-full border px-3 py-2 text-sm mt-2 transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 600,
                  color: '#133E87',
                  outline: 'none'
                }}
                value={editData.jenisIkan}
                onChange={(e) => handleInputChange('jenisIkan', e.target.value)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                }}
              >
                <option value="">Pilih jenis ikan</option>
                {fishTypes.map((fish) => (
                  <option key={fish} value={fish}>{fish}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </Card>

      {/* Additional Info */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <h3 className="mb-4" style={{ color: '#133E87' }}>Informasi Akun</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status Akun</span>
            <span className="text-green-600">Aktif</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Role</span>
            <span style={{ color: '#133E87' }}>{user?.role === 'member' ? 'Member Premium' : 'Admin'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">User ID</span>
            <span style={{ color: '#133E87' }}>{user?.id || '-'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
