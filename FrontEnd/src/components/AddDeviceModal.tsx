import { useState } from 'react';
import { X, Plus } from './icons';
import { Button } from './ui/button';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevice: (deviceData: { namaPerangkat: string; uniqueID: string }) => void;
}

export default function AddDeviceModal({ isOpen, onClose, onAddDevice }: AddDeviceModalProps) {
  const [namaPerangkat, setNamaPerangkat] = useState('');
  const [uniqueID, setUniqueID] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!namaPerangkat.trim()) {
      setError('Nama perangkat harus diisi');
      return;
    }

    if (!uniqueID.trim()) {
      setError('Kode unik perangkat harus diisi');
      return;
    }

    // Format validation for uniqueID (e.g., TMNKN-XXXX-XXXX)
    const uniqueIDPattern = /^TMNKN-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
    if (!uniqueIDPattern.test(uniqueID.trim())) {
      setError('Format kode unik tidak valid. Contoh: TMNKN-A1B2-C3D4');
      return;
    }

    // Submit
    onAddDevice({
      namaPerangkat: namaPerangkat.trim(),
      uniqueID: uniqueID.trim().toUpperCase()
    });

    // Reset form
    setNamaPerangkat('');
    setUniqueID('');
    setError('');
  };

  const handleClose = () => {
    setNamaPerangkat('');
    setUniqueID('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-md rounded-lg shadow-lg p-6"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" style={{ color: '#6B7280' }} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#EFF6FF' }}
          >
            <Plus className="w-6 h-6" style={{ color: '#4880FF' }} />
          </div>
          <div>
            <h2 className="text-xl" style={{ color: '#1F2937', fontWeight: 700 }}>
              Tambah Perangkat Baru
            </h2>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Daftarkan robot Temanikan Anda
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div 
              className="p-3 rounded-lg text-sm"
              style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
            >
              {error}
            </div>
          )}

          {/* Nama Perangkat */}
          <div>
            <label 
              htmlFor="namaPerangkat" 
              className="block text-sm mb-2"
              style={{ color: '#374151', fontWeight: 600 }}
            >
              Nama Perangkat <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              id="namaPerangkat"
              value={namaPerangkat}
              onChange={(e) => setNamaPerangkat(e.target.value)}
              placeholder="Contoh: Akuarium Ruang Tamu"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all"
              style={{ 
                borderColor: '#E5E7EB',
                color: '#1F2937'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4880FF'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
              Beri nama yang mudah Anda kenali
            </p>
          </div>

          {/* Kode Unik Perangkat */}
          <div>
            <label 
              htmlFor="uniqueID" 
              className="block text-sm mb-2"
              style={{ color: '#374151', fontWeight: 600 }}
            >
              Kode Unik Perangkat <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              id="uniqueID"
              value={uniqueID}
              onChange={(e) => setUniqueID(e.target.value)}
              placeholder="TMNKN-XXXX-XXXX"
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all font-mono"
              style={{ 
                borderColor: '#E5E7EB',
                color: '#1F2937'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4880FF'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              maxLength={15}
            />
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
              Masukkan kode seri yang tertera pada perangkat
            </p>
          </div>

          {/* Info Box */}
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: '#F0F9FF', borderLeft: '3px solid #4880FF' }}
          >
            <p className="text-sm" style={{ color: '#1E40AF' }}>
              <span style={{ fontWeight: 600 }}>💡 Tips:</span> Kode unik terletak pada stiker di bagian belakang robot atau di dalam kotak produk.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: '#F3F4F6',
                color: '#374151',
                fontWeight: 600
              }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: '#4880FF',
                color: '#FFFFFF',
                fontWeight: 600
              }}
            >
              Daftarkan Perangkat
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
