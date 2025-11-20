import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Edit, Save, X } from '../icons';
import { useState } from 'react';

export default function MemberProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    namaLengkap: 'Ahmad Wijaya',
    email: 'ahmad@example.com',
    nomorHP: '+62 812 3456 7890',
    usia: '28',
    jenisIkan: 'koi'
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const jenisIkanLabel: Record<string, string> = {
    koi: 'Ikan Koi',
    cupang: 'Ikan Cupang',
    'mas-koki': 'Ikan Mas Koki',
    discus: 'Ikan Discus',
    guppy: 'Ikan Guppy',
    arwana: 'Ikan Arwana',
    louhan: 'Ikan Louhan',
    lainnya: 'Lainnya'
  };

  return (
    <div className="max-w-3xl space-y-6">
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
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button 
              className="text-white"
              style={{ backgroundColor: '#133E87' }}
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Perubahan
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
                <p style={{ color: '#133E87' }}>{profileData.nomorHP}</p>
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

          {/* Usia */}
          <div>
            <Label htmlFor="usia">Usia</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-lg"
                style={{ backgroundColor: '#F3F3E0' }}
              >
                <p style={{ color: '#133E87' }}>{profileData.usia} tahun</p>
              </div>
            ) : (
              <Input 
                id="usia"
                type="number"
                value={editData.usia}
                onChange={(e) => handleInputChange('usia', e.target.value)}
                className="mt-2"
                min="1"
                max="120"
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
                <p style={{ color: '#133E87' }}>{jenisIkanLabel[profileData.jenisIkan] || profileData.jenisIkan}</p>
              </div>
            ) : (
              <Select 
                value={editData.jenisIkan}
                onValueChange={(value) => handleInputChange('jenisIkan', value)}
              >
                <SelectTrigger id="jenisIkan" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="koi">Ikan Koi</SelectItem>
                  <SelectItem value="cupang">Ikan Cupang</SelectItem>
                  <SelectItem value="mas-koki">Ikan Mas Koki</SelectItem>
                  <SelectItem value="discus">Ikan Discus</SelectItem>
                  <SelectItem value="guppy">Ikan Guppy</SelectItem>
                  <SelectItem value="arwana">Ikan Arwana</SelectItem>
                  <SelectItem value="louhan">Ikan Louhan</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
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
            <span className="text-gray-600">Paket</span>
            <span style={{ color: '#133E87' }}>Member Premium</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tanggal Bergabung</span>
            <span style={{ color: '#133E87' }}>15 Januari 2024</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
