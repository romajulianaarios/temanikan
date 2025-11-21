import { useState } from 'react';
import { Link } from '../Router';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MessageSquare, ThumbsUp, User, Plus } from '../icons';
import { ScrollArea } from '../ui/scroll-area';

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
  replies: number;
  likes: number;
  lastActivity: string;
  isPopular: boolean;
  replyList?: Reply[];
}

export default function MemberForum() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Topik');

  const forumTopics: Topic[] = [
    {
      id: 1,
      title: 'Tips Merawat Ikan Koi untuk Pemula',
      author: 'Ahmad Wijaya',
      category: 'Panduan',
      replies: 23,
      likes: 45,
      lastActivity: '2 jam yang lalu',
      isPopular: true,
      replyList: [
        {
          id: 1,
          author: 'Siti Nurhaliza',
          content: 'Terima kasih sharingnya! Saya mau tanya, untuk test kit air yang bagus mereknya apa ya?',
          likes: 8,
          time: '1 jam yang lalu'
        },
        {
          id: 2,
          author: 'Budi Santoso',
          content: 'Setuju banget sama poin karantina! Dulu saya skip ini dan akhirnya semua ikan kena white spot.',
          likes: 12,
          time: '45 menit yang lalu'
        },
        {
          id: 3,
          author: 'Dewi Lestari',
          content: 'Untuk pemula, saya sarankan mulai dari 2-3 ekor dulu.',
          likes: 15,
          time: '30 menit yang lalu'
        }
      ]
    },
    {
      id: 2,
      title: 'Cara Mengatasi White Spot Disease',
      author: 'Siti Nurhaliza',
      category: 'Kesehatan',
      replies: 18,
      likes: 32,
      lastActivity: '3 jam yang lalu',
      isPopular: true,
      replyList: [
        {
          id: 1,
          author: 'Ahmad Wijaya',
          content: 'Naikkan suhu air secara bertahap hingga 28-30°C dan gunakan obat anti-parasit.',
          likes: 10,
          time: '2 jam yang lalu'
        },
        {
          id: 2,
          author: 'Rudi Hermawan',
          content: 'Jangan lupa karantina ikan yang sakit supaya tidak menular ke ikan lain.',
          likes: 7,
          time: '1 jam yang lalu'
        }
      ]
    },
    {
      id: 3,
      title: 'Rekomendasi Filter Terbaik untuk Akuarium 100L',
      author: 'Budi Santoso',
      category: 'Peralatan',
      replies: 12,
      likes: 21,
      lastActivity: '5 jam yang lalu',
      isPopular: false,
      replyList: [
        {
          id: 1,
          author: 'Eko Prasetyo',
          content: 'Saya pakai filter canister, hasilnya bagus dan awet.',
          likes: 5,
          time: '4 jam yang lalu'
        }
      ]
    },
    {
      id: 4,
      title: 'Diskusi: Ikan Terbaik untuk Akuarium Nano',
      author: 'Dewi Lestari',
      category: 'Diskusi Umum',
      replies: 34,
      likes: 56,
      lastActivity: '6 jam yang lalu',
      isPopular: true,
      replyList: [
        {
          id: 1,
          author: 'Linda Wijaya',
          content: 'Cupang atau guppy cocok untuk akuarium nano.',
          likes: 12,
          time: '5 jam yang lalu'
        },
        {
          id: 2,
          author: 'Budi Santoso',
          content: 'Jangan lupa perhatikan kapasitas filter dan sirkulasi udara.',
          likes: 8,
          time: '4 jam yang lalu'
        }
      ]
    },
    {
      id: 5,
      title: 'Pengalaman Breeding Ikan Cupang',
      author: 'Eko Prasetyo',
      category: 'Breeding',
      replies: 28,
      likes: 41,
      lastActivity: '1 hari yang lalu',
      isPopular: false,
      replyList: [
        {
          id: 1,
          author: 'Ahmad Wijaya',
          content: 'Berapa lama biasanya telur cupang menetas?',
          likes: 6,
          time: '20 jam yang lalu'
        }
      ]
    },
  ];

  const categories = [
    { name: 'Semua Topik', count: 157 },
    { name: 'Panduan', count: 42 },
    { name: 'Kesehatan', count: 38 },
    { name: 'Peralatan', count: 25 },
    { name: 'Breeding', count: 19 },
    { name: 'Diskusi Umum', count: 33 },
  ];

  const handleViewReplies = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowReplies(true);
  };

  const getFilteredTopics = () => {
    if (selectedCategory === 'Semua Topik') {
      return forumTopics;
    }
    return forumTopics.filter(topic => topic.category === selectedCategory);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl mb-2" style={{ color: '#1F2937', fontWeight: 700 }}>
            Forum <span style={{ color: '#4880FF' }}>Komunitas</span>
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>Berbagi pengalaman dan tips dengan komunitas</p>
        </div>
        <div className="flex gap-3">
          <Link to="/member/forum/new">
            <Button 
              className="text-white hover:shadow-lg transition-all"
              style={{ backgroundColor: '#4880FF' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Topik Baru
            </Button>
          </Link>
          <Link to="/member/forum/my-topics">
            <Button 
              variant="outline"
              className="hover:bg-gray-50 transition-all"
              style={{ color: '#4880FF', borderColor: '#4880FF' }}
            >
              Lihat Topik Saya
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card className="lg:col-span-1 p-6 h-fit rounded-xl shadow-md border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
          <h3 className="mb-4 text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>Kategori</h3>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className="w-full flex items-center justify-between p-3 rounded-lg transition-all text-left"
                style={{ 
                  backgroundColor: selectedCategory === category.name ? 'rgba(72, 128, 255, 0.1)' : 'transparent',
                  color: selectedCategory === category.name ? '#4880FF' : '#1F2937',
                  fontWeight: selectedCategory === category.name ? 600 : 400,
                  border: selectedCategory === category.name ? '1px solid rgba(72, 128, 255, 0.2)' : '1px solid transparent'
                }}
              >
                <span className="text-sm">{category.name}</span>
                <Badge 
                  className="text-xs"
                  style={{
                    backgroundColor: selectedCategory === category.name ? 'rgba(72, 128, 255, 0.2)' : 'rgba(107, 114, 128, 0.1)',
                    color: selectedCategory === category.name ? '#4880FF' : '#6B7280',
                    border: 'none'
                  }}
                >
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>
        </Card>

        {/* Topics List */}
        <div className="lg:col-span-3 space-y-4">
          {getFilteredTopics().map((topic) => (
            <Card 
              key={topic.id}
              className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all"
              style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
            >
              <div className="flex gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(72, 128, 255, 0.1)' }}
                >
                  <User className="w-6 h-6" style={{ color: '#4880FF' }} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link to={`/member/forum/topic/${topic.id}`}>
                        <h4 className="mb-1 hover:underline cursor-pointer text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>
                          {topic.title}
                          {topic.isPopular && (
                            <Badge className="ml-2" style={{ backgroundColor: 'rgba(254, 197, 61, 0.1)', color: '#FEC53D', border: 'none' }}>
                              Populer
                            </Badge>
                          )}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-3 text-sm" style={{ color: '#6B7280' }}>
                        <span>{topic.author}</span>
                        <span>•</span>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            backgroundColor: 'rgba(72, 128, 255, 0.1)', 
                            color: '#4880FF', 
                            borderColor: 'rgba(72, 128, 255, 0.2)' 
                          }}
                        >
                          {topic.category}
                        </Badge>
                        <span>•</span>
                        <span>{topic.lastActivity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <button 
                      onClick={() => handleViewReplies(topic)}
                      className="flex items-center gap-2 hover:underline transition-all"
                      style={{ color: '#4880FF', fontWeight: 500 }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{topic.replies} balasan</span>
                    </button>
                    <div className="flex items-center gap-2" style={{ color: '#8280FF', fontWeight: 500 }}>
                      <ThumbsUp className="w-4 h-4" />
                      <span>{topic.likes} suka</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Replies Modal */}
      <Dialog open={showReplies} onOpenChange={setShowReplies}>
        <DialogContent className="max-w-2xl max-h-[80vh]" style={{ backgroundColor: '#F3F3E0' }}>
          {selectedTopic && (
            <>
              <DialogHeader>
                <DialogTitle style={{ color: '#133E87' }}>
                  {selectedTopic.replies} Balasan - {selectedTopic.title}
                </DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {selectedTopic.replyList && selectedTopic.replyList.length > 0 ? (
                    selectedTopic.replyList.map((reply) => (
                      <div 
                        key={reply.id}
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: 'white' }}
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
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{reply.likes} suka</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Belum ada balasan
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="pt-4 border-t" style={{ borderColor: '#CBDCEB' }}>
                <Link to={`/member/forum/topic/${selectedTopic.id}`}>
                  <Button 
                    className="w-full text-white"
                    style={{ backgroundColor: '#133E87' }}
                    onClick={() => setShowReplies(false)}
                  >
                    Lihat Detail & Balas Topik
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
