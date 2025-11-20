import { useState } from 'react';
import { Link, useNavigate } from '../Router';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { MessageSquare, ThumbsUp, User, Edit, Trash2, ArrowLeft } from '../icons';

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
  replies: number;
  likes: number;
  lastActivity: string;
  isPopular: boolean;
  replyList?: Reply[];
}

export default function MyTopics() {
  const navigate = useNavigate();
  const [myTopics, setMyTopics] = useState<Topic[]>([
    {
      id: 1,
      title: 'Tips Merawat Ikan Koi untuk Pemula',
      author: 'Ahmad Wijaya',
      category: 'Panduan',
      content: 'Halo semuanya! Saya ingin berbagi beberapa tips untuk merawat ikan Koi...',
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
        }
      ]
    },
    {
      id: 5,
      title: 'Pengalaman Breeding Ikan Cupang',
      author: 'Ahmad Wijaya',
      category: 'Breeding',
      content: 'Saya baru saja berhasil breeding ikan cupang untuk pertama kalinya...',
      replies: 28,
      likes: 41,
      lastActivity: '1 hari yang lalu',
      isPopular: false,
      replyList: [
        {
          id: 1,
          author: 'Dewi Lestari',
          content: 'Berapa lama biasanya telur cupang menetas?',
          likes: 6,
          time: '20 jam yang lalu'
        }
      ]
    },
  ]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReplyDialogOpen, setDeleteReplyDialogOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
  const [replyToDelete, setReplyToDelete] = useState<{ topicId: number; replyId: number } | null>(null);

  const handleDeleteTopic = (topic: Topic) => {
    setTopicToDelete(topic);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTopic = () => {
    if (topicToDelete) {
      setMyTopics(myTopics.filter(t => t.id !== topicToDelete.id));
      setDeleteDialogOpen(false);
      setTopicToDelete(null);
    }
  };

  const handleDeleteReply = (topicId: number, replyId: number) => {
    setReplyToDelete({ topicId, replyId });
    setDeleteReplyDialogOpen(true);
  };

  const confirmDeleteReply = () => {
    if (replyToDelete) {
      setMyTopics(myTopics.map(topic => {
        if (topic.id === replyToDelete.topicId && topic.replyList) {
          return {
            ...topic,
            replyList: topic.replyList.filter(r => r.id !== replyToDelete.replyId),
            replies: topic.replies - 1
          };
        }
        return topic;
      }));
      setDeleteReplyDialogOpen(false);
      setReplyToDelete(null);
    }
  };

  const handleEditTopic = (topicId: number) => {
    // Navigate to edit page (you could create a separate edit page or reuse NewTopic with edit mode)
    navigate(`/member/forum/edit/${topicId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ color: '#133E87' }}>Topik Saya</h2>
          <p className="text-gray-600">Kelola semua topik yang Anda buat</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/member/forum')}
          style={{ color: '#608BC1' }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Forum
        </Button>
      </div>

      {/* Topics List */}
      {myTopics.length === 0 ? (
        <Card className="p-12 text-center" style={{ backgroundColor: 'white' }}>
          <p className="text-gray-500 mb-4">Anda belum membuat topik apapun</p>
          <Link to="/member/forum/new">
            <Button 
              className="text-white"
              style={{ backgroundColor: '#133E87' }}
            >
              Buat Topik Pertama
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {myTopics.map((topic) => (
            <Card 
              key={topic.id}
              className="p-6"
              style={{ backgroundColor: 'white' }}
            >
              <div className="flex gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#CBDCEB' }}
                >
                  <User className="w-6 h-6" style={{ color: '#608BC1' }} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <Link to={`/member/forum/topic/${topic.id}`}>
                        <h4 className="mb-1 hover:underline cursor-pointer" style={{ color: '#133E87' }}>
                          {topic.title}
                          {topic.isPopular && (
                            <Badge className="ml-2 bg-orange-100 text-orange-800">
                              Populer
                            </Badge>
                          )}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{topic.author}</span>
                        <span>•</span>
                        <Badge variant="outline">{topic.category}</Badge>
                        <span>•</span>
                        <span>{topic.lastActivity}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTopic(topic.id)}
                        style={{ color: '#608BC1', borderColor: '#608BC1' }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTopic(topic)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{topic.content}</p>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2" style={{ color: '#608BC1' }}>
                      <MessageSquare className="w-4 h-4" />
                      <span>{topic.replies} balasan</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: '#608BC1' }}>
                      <ThumbsUp className="w-4 h-4" />
                      <span>{topic.likes} suka</span>
                    </div>
                  </div>

                  {/* Replies Section */}
                  {topic.replyList && topic.replyList.length > 0 && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: '#CBDCEB' }}>
                      <h5 className="text-sm mb-3" style={{ color: '#133E87' }}>
                        Balasan ({topic.replyList.length})
                      </h5>
                      <div className="space-y-3">
                        {topic.replyList.map((reply) => (
                          <div 
                            key={reply.id}
                            className="p-3 rounded-lg flex items-start justify-between"
                            style={{ backgroundColor: '#F3F3E0' }}
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <Avatar className="w-8 h-8" style={{ backgroundColor: '#CBDCEB' }}>
                                <AvatarFallback>
                                  <User className="w-4 h-4" style={{ color: '#608BC1' }} />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs" style={{ color: '#133E87' }}>{reply.author}</span>
                                  <span className="text-xs text-gray-500">{reply.time}</span>
                                </div>
                                <p className="text-xs text-gray-700">{reply.content}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReply(topic.id, reply.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Topic Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent style={{ backgroundColor: 'white' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Hapus Topik</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            Apakah Anda yakin ingin menghapus topik "{topicToDelete?.title}"? 
            Semua balasan juga akan terhapus. Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={confirmDeleteTopic}
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Hapus Topik
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Reply Confirmation Dialog */}
      <Dialog open={deleteReplyDialogOpen} onOpenChange={setDeleteReplyDialogOpen}>
        <DialogContent style={{ backgroundColor: 'white' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Hapus Balasan</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            Apakah Anda yakin ingin menghapus balasan ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteReplyDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={confirmDeleteReply}
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Hapus Balasan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
