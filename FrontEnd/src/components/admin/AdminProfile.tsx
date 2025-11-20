import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User, Edit, Save, X } from '../icons';
import { useState } from 'react';

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    namaLengkap: 'Admin Temanikan',
    email: 'admin@temanikan.com',
    nomorHP: '+62 811 1234 5678',
    jabatan: 'Administrator Sistem'
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
            <h2 style={{ color: '#133E87' }}>Profil Admin</h2>
            <p className="text-sm text-gray-600">Kelola informasi profil administrator</p>
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

          {/* Jabatan */}
          <div>
            <Label htmlFor="jabatan">Jabatan</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-lg"
                style={{ backgroundColor: '#F3F3E0' }}
              >
                <p style={{ color: '#133E87' }}>{profileData.jabatan}</p>
              </div>
            ) : (
              <Input 
                id="jabatan"
                value={editData.jabatan}
                onChange={(e) => handleInputChange('jabatan', e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        </div>
      </Card>

      {/* Additional Info */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <h3 className="mb-4" style={{ color: '#133E87' }}>Informasi Akun</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Role</span>
            <span style={{ color: '#133E87' }}>Administrator</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <span className="text-green-600">Aktif</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Level Akses</span>
            <span style={{ color: '#133E87' }}>Full Access</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
