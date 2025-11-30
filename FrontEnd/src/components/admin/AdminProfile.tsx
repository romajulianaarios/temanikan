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
            <h2 style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Profil Admin</h2>
            <p className="text-sm" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Kelola informasi profil administrator</p>
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
        <h3 className="mb-6 relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Informasi Personal</h3>
        
        <div className="space-y-6 relative z-10">
          {/* Nama Lengkap */}
          <div>
            <Label htmlFor="namaLengkap" style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600, color: '#133E87' }}>Nama Lengkap</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(72, 128, 255, 0.08)',
                  border: '1px solid rgba(72, 128, 255, 0.2)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>{profileData.namaLengkap}</p>
              </div>
            ) : (
              <Input 
                id="namaLengkap"
                value={editData.namaLengkap}
                onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
                className="mt-2"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              />
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600, color: '#133E87' }}>Email</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(72, 128, 255, 0.08)',
                  border: '1px solid rgba(72, 128, 255, 0.2)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>{profileData.email}</p>
              </div>
            ) : (
              <Input 
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-2"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              />
            )}
          </div>

          {/* Nomor HP */}
          <div>
            <Label htmlFor="nomorHP" style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600, color: '#133E87' }}>Nomor HP</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(72, 128, 255, 0.08)',
                  border: '1px solid rgba(72, 128, 255, 0.2)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>{profileData.nomorHP}</p>
              </div>
            ) : (
              <Input 
                id="nomorHP"
                type="tel"
                value={editData.nomorHP}
                onChange={(e) => handleInputChange('nomorHP', e.target.value)}
                className="mt-2"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              />
            )}
          </div>

          {/* Jabatan */}
          <div>
            <Label htmlFor="jabatan" style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600, color: '#133E87' }}>Jabatan</Label>
            {!isEditing ? (
              <div 
                className="mt-2 p-3 rounded-xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(72, 128, 255, 0.08)',
                  border: '1px solid rgba(72, 128, 255, 0.2)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <p style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>{profileData.jabatan}</p>
              </div>
            ) : (
              <Input 
                id="jabatan"
                value={editData.jabatan}
                onChange={(e) => handleInputChange('jabatan', e.target.value)}
                className="mt-2"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Additional Info */}
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
        <h3 className="mb-4 relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Informasi Akun</h3>
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between items-center">
            <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>Role</span>
            <span style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Administrator</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>Status</span>
            <span style={{ color: '#16a34a', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Aktif</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>Level Akses</span>
            <span style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Full Access</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
