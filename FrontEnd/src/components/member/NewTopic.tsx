import { useState, useEffect } from 'react';
import { useNavigate } from '../Router';
import { useAuth } from '../AuthContext';
import { forumAPI } from '../../services/api';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Dialog, DialogContent } from '../ui/dialog';
import { ArrowLeft } from '../icons';

export default function NewTopic() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.title.trim()) {
      setError('Judul topik harus diisi');
      return;
    }
    
    if (!formData.category) {
      setError('Kategori harus dipilih');
      return;
    }
    
    if (formData.content.length < 20) {
      setError('Isi topik minimal 20 karakter');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      console.log('📤 Sending topic data:', {
        title: formData.title,
        content: formData.content,
        category: formData.category
      });

      // Kirim data ke backend
      const response = await forumAPI.createTopic({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category
      });

      console.log('✅ Topic created successfully:', response);

      if (response.message || response.success || response.topic) {
        setShowSuccessModal(true);
      } else {
        setError('Response tidak valid dari server');
      }
    } catch (err: any) {
      console.error('❌ Error creating topic:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Gagal membuat topik';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/member/forum/my-topics');
  };

  const handleCancel = () => {
    navigate('/member/forum');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleCancel}
          style={{ color: '#608BC1' }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Forum
        </Button>
      </div>

      {/* Form */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <h2 className="mb-6" style={{ color: '#133E87' }}>Buat Topik Baru</h2>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm mb-2" style={{ color: '#133E87' }}>
              Judul Topik <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Masukkan judul topik yang menarik..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-sm mb-2" style={{ color: '#133E87' }}>
              Kategori <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Pilih kategori topik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="panduan">Panduan</SelectItem>
                <SelectItem value="kesehatan">Kesehatan</SelectItem>
                <SelectItem value="peralatan">Peralatan</SelectItem>
                <SelectItem value="breeding">Breeding</SelectItem>
                <SelectItem value="diskusi-umum">Diskusi Umum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className="text-sm mb-2" style={{ color: '#133E87' }}>
              Isi Topik <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Tulis pertanyaan atau diskusi Anda di sini..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={10}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              Minimal 20 karakter. Sertakan detail yang jelas untuk mendapatkan respon yang lebih baik.
            </p>
          </div>

          {/* Tips */}
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: '#F3F3E0' }}
          >
            <h4 className="mb-2" style={{ color: '#133E87' }}>Tips Membuat Topik yang Baik:</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Gunakan judul yang jelas dan deskriptif</li>
              <li>Pilih kategori yang sesuai agar mudah ditemukan</li>
              <li>Jelaskan masalah atau pertanyaan dengan detail</li>
              <li>Sertakan informasi relevan seperti jenis ikan, ukuran akuarium, dll</li>
              <li>Gunakan bahasa yang sopan dan mudah dipahami</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="text-white"
              style={{ backgroundColor: '#133E87' }}
              disabled={!formData.title || !formData.category || !formData.content || submitting}
            >
              {submitting ? 'Mempublikasikan...' : 'Publikasikan Topik'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={submitting}
            >
              Batal
            </Button>
          </div>
        </form>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center text-center p-6">
            {/* Success Icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#CBFFA9' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: '#133E87' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Success Message */}
            <h3 className="text-xl font-bold mb-2" style={{ color: '#133E87' }}>
              Topik baru berhasil dibuat!
            </h3>
            <p className="text-gray-600 mb-6">
              Topik Anda telah dipublikasikan dan dapat dilihat oleh member lain.
            </p>

            {/* OK Button */}
            <Button
              onClick={handleSuccessModalClose}
              className="w-full text-white font-semibold"
              style={{ backgroundColor: '#4880FF' }}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
