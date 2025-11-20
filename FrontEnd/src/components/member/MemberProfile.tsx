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
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#CBDCEB' }}
          >
            <User className="w-8 h-8" style={{ color: '#608BC1' }} />
          </div>
          <div>
            <h2 style={{ color: '#133E87' }}>Profil Pengguna</h2>
            <p className="text-sm text-gray-600">Kelola informasi profil Anda</p>
          </div>
        </div>
        {!isEditing ? (
          <Button 
            className="text-white"
            style={{ backgroundColor: '#133E87' }}
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button 
              className="text-white"
              style={{ backgroundColor: '#133E87' }}
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
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <h3 className="mb-6" style={{ color: '#133E87' }}>Informasi Personal</h3>
        
        <div className="space-y-6">
          {/* Nama Lengkap */}
          <div>
            <Label htmlFor="namaLengkap">Nama Lengkap</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-lg"
                style={{ backgroundColor: '#F3F3E0' }}
              >
                <p style={{ color: '#133E87' }}>{profileData.namaLengkap}</p>
              </div>
            ) : (
              <Input 
                id="namaLengkap"
                value={editData.namaLengkap}
                onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-lg"
                style={{ backgroundColor: '#F3F3E0' }}
              >
                <p style={{ color: '#133E87' }}>{profileData.email}</p>
              </div>
            ) : (
              <Input 
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Nomor HP */}
          <div>
            <Label htmlFor="nomorHP">Nomor HP</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-lg"
                style={{ backgroundColor: '#F3F3E0' }}
              >
                <p style={{ color: '#133E87' }}>{profileData.nomorHP || 'Belum diisi'}</p>
              </div>
            ) : (
              <Input 
                id="nomorHP"
                type="tel"
                value={editData.nomorHP}
                onChange={(e) => handleInputChange('nomorHP', e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Alamat */}
          <div>
            <Label htmlFor="alamat">Alamat</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-lg"
                style={{ backgroundColor: '#F3F3E0' }}
              >
                <p style={{ color: '#133E87' }}>{profileData.alamat || 'Belum diisi'}</p>
              </div>
            ) : (
              <Input 
                id="alamat"
                type="text"
                value={editData.alamat}
                onChange={(e) => handleInputChange('alamat', e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Usia */}
          <div>
            <Label htmlFor="usia">Usia</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-lg"
                style={{ backgroundColor: '#F3F3E0' }}
              >
                <p style={{ color: '#133E87' }}>{profileData.usia ? `${profileData.usia} tahun` : 'Belum diisi'}</p>
              </div>
            ) : (
              <Input 
                id="usia"
                type="number"
                value={editData.usia}
                onChange={(e) => handleInputChange('usia', e.target.value)}
                className="mt-2"
                min="1"
                max="150"
                placeholder="Masukkan usia"
              />
            )}
          </div>

          {/* Jenis Ikan Hias Utama */}
          <div>
            <Label htmlFor="jenisIkan">Jenis Ikan Hias Utama</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-lg"
                style={{ backgroundColor: '#F3F3E0' }}
              >
                <p style={{ color: '#133E87' }}>{profileData.jenisIkan || 'Belum diisi'}</p>
              </div>
            ) : (
              <select
                id="jenisIkan"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                value={editData.jenisIkan}
                onChange={(e) => handleInputChange('jenisIkan', e.target.value)}
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
