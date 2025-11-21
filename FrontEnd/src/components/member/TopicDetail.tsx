import { useState } from 'react';
import { useNavigate, useParams } from '../Router';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ThumbsUp, MessageSquare, ArrowLeft, User } from '../icons';

interface Reply {
  id: number;
  author: string;
  content: string;
  likes: number;
  time: string;
}

interface Topic {
  id: number;
  title: string;
  author: string;
  category: string;
  content: string;
  likes: number;
  replies: Reply[];
  time: string;
  badge?: string;
}

export default function TopicDetail() {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const [newReply, setNewReply] = useState('');

  // Mock data - in production, this would be fetched based on topicId
  const topic: Topic = {
    id: Number(topicId) || 1,
    title: 'Tips Merawat Ikan Koi untuk Pemula',
    author: 'Ahmad Wijaya',
    category: 'Panduan',
    content: `Halo semuanya! Saya ingin berbagi beberapa tips untuk merawat ikan Koi, terutama bagi pemula seperti saya dulu.

1. **Kualitas Air**: Ini adalah hal terpenting. Pastikan pH air berkisar 6.5-7.5 dan suhu 24-26°C. Investasi di test kit sangat worth it!

2. **Filter yang Baik**: Jangan pelit beli filter. Ikan Koi menghasilkan banyak kotoran, jadi filter yang kuat itu wajib.

3. **Pemberian Makan**: Jangan overfeeding! Beri makan 2-3 kali sehari dengan porsi yang bisa dihabiskan dalam 5 menit.

4. **Ukuran Kolam/Akuarium**: Minimal 1000 liter untuk 3-5 ekor Koi dewasa. Mereka butuh ruang untuk tumbuh.

5. **Karantina Ikan Baru**: Selalu karantina ikan baru minimal 2 minggu sebelum digabung dengan ikan lain.

Ada yang mau menambahkan? Atau ada pertanyaan tentang perawatan Koi?`,
    likes: 45,
    replies: [
      {
        id: 1,
        author: 'Siti Nurhaliza',
        content: 'Terima kasih sharingnya! Saya mau tanya, untuk test kit air yang bagus mereknya apa ya? Budget sekitar 200-300rb.',
        likes: 8,
        time: '1 jam yang lalu'
      },
      {
        id: 2,
        author: 'Budi Santoso',
        content: 'Setuju banget sama poin karantina! Dulu saya skip ini dan akhirnya semua ikan kena white spot. Pelajaran yang mahal 😅',
        likes: 12,
        time: '45 menit yang lalu'
      },
      {
        id: 3,
        author: 'Dewi Lestari',
        content: 'Untuk pemula, saya sarankan mulai dari 2-3 ekor dulu. Jangan langsung banyak, nanti kewalahan kalau ada masalah.',
        likes: 15,
        time: '30 menit yang lalu'
      },
      {
        id: 4,
        author: 'Rudi Hermawan',
        content: 'Mau nambahin: Perhatikan juga sirkulasi air dan oksigen. Pakai aerator kalau perlu, terutama saat cuaca panas.',
        likes: 9,
        time: '20 menit yang lalu'
      },
      {
        id: 5,
        author: 'Linda Wijaya',
        content: 'Untuk makanan, saya biasanya kombinasi pelet berkualitas dengan sayuran seperti wortel dan selada. Koi saya suka banget!',
        likes: 11,
        time: '15 menit yang lalu'
      }
    ],
    time: '2 jam yang lalu',
    badge: 'Populer'
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newReply.trim()) {
      // In production, this would send to backend
      console.log('New reply:', newReply);
      alert('Balasan berhasil dikirim!');
      setNewReply('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/member/forum')}
          style={{ color: '#608BC1' }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Forum
        </Button>
      </div>

      {/* Original Post */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12" style={{ backgroundColor: '#CBDCEB' }}>
            <AvatarFallback>
              <User className="w-6 h-6" style={{ color: '#608BC1' }} />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 style={{ color: '#133E87' }}>{topic.title}</h2>
                  {topic.badge && (
                    <Badge className="bg-orange-100 text-orange-600">{topic.badge}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span style={{ color: '#133E87' }}>{topic.author}</span>
                  <span>•</span>
                  <Badge variant="outline">{topic.category}</Badge>
                  <span>•</span>
                  <span>{topic.time}</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-4">
              <p className="text-gray-700 whitespace-pre-line">{topic.content}</p>
            </div>

            <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: '#CBDCEB' }}>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition">
                <ThumbsUp className="w-4 h-4" />
                <span>{topic.likes} suka</span>
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>{topic.replies.length} balasan</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Replies */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <h3 className="mb-4" style={{ color: '#133E87' }}>
          {topic.replies.length} Balasan
        </h3>

        <div className="space-y-4">
          {topic.replies.map((reply) => (
            <div 
              key={reply.id}
              className="p-4 rounded-lg"
              style={{ backgroundColor: '#F3F3E0' }}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10" style={{ backgroundColor: '#CBDCEB' }}>
                  <AvatarFallback>
                    <User className="w-5 h-5" style={{ color: '#608BC1' }} />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm" style={{ color: '#133E87' }}>{reply.author}</span>
                    <span className="text-xs text-gray-500">{reply.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{reply.content}</p>
                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{reply.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reply Form */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <h3 className="mb-4" style={{ color: '#133E87' }}>Tulis Balasan</h3>
        
        <form onSubmit={handleSubmitReply}>
          <Textarea
            placeholder="Tulis balasan Anda di sini..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            rows={5}
            className="mb-4"
          />
          
          <div className="flex gap-3">
            <Button
              type="submit"
              className="text-white"
              style={{ backgroundColor: '#133E87' }}
              disabled={!newReply.trim()}
            >
              Kirim Balasan
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewReply('')}
            >
              Batal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
