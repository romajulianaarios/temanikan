import { useState } from 'react';
import { useNavigate } from '../Router';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { ArrowLeft } from '../icons';

export default function NewTopic() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In production, this would send data to backend
    console.log('New topic submitted:', formData);
    
    // Show success message and redirect
    alert('Topik baru berhasil dibuat!');
    navigate('/member/forum');
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
              required
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
              disabled={!formData.title || !formData.category || !formData.content}
            >
              Publikasikan Topik
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Batal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
