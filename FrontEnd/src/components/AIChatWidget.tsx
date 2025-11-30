import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { X, Send, Image as ImageIcon, Bot, User, Trash2, History } from './icons';
import { aiChatAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { formatTime, formatDateTime } from '../utils/dateFormat';

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  has_image: boolean;
  image_url?: string;
  created_at: string;
  isUser: boolean;
}

interface AIChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChatWidget({ isOpen, onClose }: AIChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLimit, setHistoryLimit] = useState(50);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoggedIn } = useAuth();
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      loadChatHistory(historyLimit);
    }
  }, [isOpen, isLoggedIn]);

  useEffect(() => {
    // Only auto-scroll if user hasn't manually scrolled up
    if (shouldAutoScroll && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages, shouldAutoScroll]);

  // Check if user is scrolling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async (limit: number = 50) => {
    try {
      setIsLoadingMore(true);
      const data = await aiChatAPI.getHistory(limit);
      const historyMessages: ChatMessage[] = [];
      
      data.chats.forEach((chat: any) => {
        historyMessages.push({
          id: `user-${chat.id}`,
          message: chat.message,
          response: '',
          has_image: chat.has_image,
          image_url: chat.image_url,
          created_at: chat.created_at,
          isUser: true
        });
        historyMessages.push({
          id: `ai-${chat.id}`,
          message: '',
          response: chat.response,
          has_image: false,
          created_at: chat.created_at,
          isUser: false
        });
      });
      
      // Reverse to show oldest first, newest last
      setMessages(historyMessages.reverse());
      setShouldAutoScroll(true);
    } catch (error: any) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreHistory = async () => {
    const newLimit = historyLimit + 50;
    setHistoryLimit(newLimit);
    await loadChatHistory(newLimit);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;
    if (isLoading) return;

    const userMessage = inputMessage.trim();
    const imageBase64 = selectedImage;

    // Add user message to UI immediately
    const tempUserMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      message: userMessage,
      response: '',
      has_image: !!imageBase64,
      image_url: imageBase64 || undefined,
      created_at: new Date().toISOString(),
      isUser: true
    };

    setMessages(prev => [...prev, tempUserMessage]);
    setInputMessage('');
    setSelectedImage(null);
    setIsLoading(true);
    setShouldAutoScroll(true);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      message: '',
      response: 'Mengetik...',
      has_image: false,
      created_at: new Date().toISOString(),
      isUser: false
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await aiChatAPI.sendMessage(userMessage, imageBase64 || undefined);
      
      // Remove loading message and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        const newMessages = [...filtered, {
          id: `ai-${response.chat_id}`,
          message: '',
          response: response.response,
          has_image: !!imageBase64,
          image_url: imageBase64 || undefined,
          created_at: response.created_at,
          isUser: false
        }];
        // Auto-scroll to bottom when new message arrives
        setShouldAutoScroll(true);
        return newMessages;
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Get error message
      let errorMessage = error.response?.data?.error || error.response?.data?.message || 'Gagal mengirim pesan. Silakan coba lagi.';
      
      // Check if it's a token error
      const isTokenError = errorMessage.includes('Token') || errorMessage.includes('token') || error.response?.status === 401 || error.response?.status === 422;
      
      // Check if it's an API key error (403)
      const isAPIKeyError = error.response?.status === 403 || errorMessage.includes('API key') || errorMessage.includes('403') || errorMessage.includes('Forbidden');
      
      // Check if it's a quota error (429)
      const isQuotaError = error.response?.status === 429 || errorMessage.includes('quota') || errorMessage.includes('Quota');
      
      // Format error message based on type
      let formattedError = '';
      if (isTokenError) {
        formattedError = `⚠️ ${errorMessage}\n\nSilakan logout dan login kembali untuk memperbarui token Anda.`;
      } else if (isAPIKeyError) {
        formattedError = `⚠️ API Key perlu diperbarui.\n\nUntuk menggunakan AI Chat dengan Gemini API, silakan:\n\n1. Dapatkan API Key baru di:\n   https://makersuite.google.com/app/apikey\n\n2. Update API Key di backend:\n   - Buka folder BackEnd/\n   - Edit file .env atau config.py\n   - Tambahkan: GEMINI_API_KEY=your-api-key\n   - Restart backend server\n\nAtau gunakan script:\n   python BackEnd/update_api_key.py YOUR_API_KEY\n\nSementara ini, sistem menggunakan informasi dari database.`;
      } else if (isQuotaError) {
        formattedError = `⚠️ Quota API telah habis.\n\nTerlalu banyak request ke layanan AI. Silakan tunggu beberapa saat dan coba lagi nanti.`;
      } else {
        // Remove technical error details for user-friendly message
        if (errorMessage.includes('AI service error:')) {
          errorMessage = errorMessage.replace('AI service error:', '').trim();
        }
        formattedError = `⚠️ ${errorMessage}\n\nSilakan coba lagi dalam beberapa saat. Jika masalah berlanjut, hubungi administrator.`;
      }
      
      // Remove loading message and add error
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
          id: `error-${Date.now()}`,
          message: '',
          response: formattedError,
          has_image: false,
          created_at: new Date().toISOString(),
          isUser: false
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    const id = parseInt(chatId.split('-')[1]);
    if (isNaN(id)) return;

    try {
      await aiChatAPI.deleteChat(id);
      loadChatHistory();
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  if (!isOpen) return null;

  // Pastikan hanya bisa dibuka jika sudah login
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed right-4 z-50" style={{ width: '320px', maxWidth: '90vw', top: '80px' }}>
      <Card 
        className="flex flex-col shadow-2xl" 
        style={{ 
          height: '500px', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: 'rgba(15, 91, 229, 0.15) 0px 8px 32px, rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 flex-shrink-0 rounded-t-3xl" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.9), rgba(72, 128, 255, 0.85))',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold">AI Assistant - Temanikan</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-white hover:bg-white/30 rounded-full transition-all"
              style={{ 
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                padding: 0
              }}
            >
              <History className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/30 rounded-full transition-all"
              style={{ 
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                padding: 0
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1" 
          style={{ 
            background: 'linear-gradient(to bottom, rgba(249, 250, 251, 0.8), rgba(243, 244, 246, 0.9))',
            backdropFilter: 'blur(10px)',
            minHeight: 0,
            flex: '1 1 auto',
            overflowY: 'scroll',
            overflowX: 'hidden',
            position: 'relative',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          <div className="p-4 space-y-2" style={{ minHeight: '100%' }}>
            {/* Load More Button */}
            {messages.length > 0 && messages.length >= historyLimit && (
              <div className="flex justify-center py-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadMoreHistory}
                  disabled={isLoadingMore}
                  className="text-xs rounded-full"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(15, 91, 229, 0.3)',
                    borderRadius: '20px',
                    padding: '6px 16px'
                  }}
                >
                  {isLoadingMore ? 'Memuat...' : 'Muat Riwayat Lebih Banyak'}
                </Button>
              </div>
            )}

            {messages.length === 0 && !isLoadingMore && (
              <div className="text-center mt-8 px-4">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.9), rgba(72, 128, 255, 0.85))',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'rgba(15, 91, 229, 0.3) 0px 8px 24px'
                  }}
                >
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div 
                  className="max-w-xs mx-auto p-4 rounded-3xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(15, 91, 229, 0.2)',
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 16px'
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: '#0F5BE5' }}>Halo! Saya AI Assistant Temanikan.</p>
                  <p className="text-sm mt-2" style={{ color: '#4B5563' }}>Saya bisa membantu Anda dengan:</p>
                  <ul className="text-sm mt-2 space-y-1 text-left" style={{ color: '#6B7280' }}>
                    <li>• Diagnosis penyakit ikan</li>
                    <li>• Tips perawatan ikan hias</li>
                    <li>• Informasi tentang kualitas air</li>
                    <li>• Pertanyaan tentang ikan di FishPedia</li>
                  </ul>
                  <p className="text-sm mt-4 font-semibold" style={{ color: '#0F5BE5' }}>Silakan tanyakan apa saja!</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 flex-shrink-0 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
              {!msg.isUser && (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg" 
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.9), rgba(72, 128, 255, 0.85))',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'rgba(15, 91, 229, 0.3) 0px 4px 12px'
                  }}
                >
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${msg.isUser ? 'order-2' : ''}`}>
                {msg.has_image && msg.image_url && (
                  <div className="mb-2 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={msg.image_url}
                      alt="Uploaded"
                      className="max-w-full h-auto max-h-48 object-contain"
                    />
                  </div>
                )}
                
                <div
                  className={`p-4 ${
                    msg.isUser
                      ? 'text-white'
                      : ''
                  }`}
                  style={msg.isUser ? {
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    backdropFilter: 'blur(10px)',
                    color: '#FFFFFF',
                    borderRadius: '20px 20px 4px 20px',
                    boxShadow: 'rgba(15, 91, 229, 0.25) 0px 4px 12px',
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                  } : {
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(15, 91, 229, 0.2)',
                    borderRadius: '20px 20px 20px 4px',
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px',
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                  }}
                >
                  {msg.isUser ? (
                    <p 
                      className="text-sm whitespace-pre-wrap font-medium"
                      style={{ 
                        color: '#FFFFFF',
                        fontWeight: 500
                      }}
                    >
                      {msg.message}
                    </p>
                  ) : (
                    <div>
                      <div 
                        className="text-sm text-gray-700 leading-relaxed"
                        style={{ 
                          lineHeight: '1.7'
                        }}
                      >
                        {msg.response.split('\n\n').map((paragraph, idx) => {
                          if (paragraph.trim() === '') return null;
                          
                          // Remove markdown formatting and clean up
                          let cleanText = paragraph
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
                            .replace(/^[-•]\s*/gm, '')
                            .trim();
                          
                          // Split by single newlines within paragraph
                          const lines = cleanText.split('\n').filter(line => line.trim() !== '');
                          
                          return (
                            <div key={idx} className="mb-3 last:mb-0">
                              {lines.map((line, lineIdx) => (
                                <p 
                                  key={lineIdx} 
                                  className="mb-1.5 last:mb-0"
                                  dangerouslySetInnerHTML={{ __html: line }}
                                />
                              ))}
                            </div>
                          );
                        })}
                      </div>
                      {msg.id.startsWith('ai-') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 px-3 text-xs rounded-full"
                          style={{
                            borderRadius: '16px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#DC2626',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                          }}
                          onClick={() => handleDeleteChat(msg.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Hapus
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-400 mt-1 px-1">
                  {formatTime(msg.created_at)}
                </p>
              </div>

              {msg.isUser && (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 order-3 shadow-lg" 
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(229, 231, 235, 0.9), rgba(209, 213, 219, 0.85))',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'
                  }}
                >
                  <User className="w-5 h-5" style={{ color: '#4B5563' }} />
                </div>
              )}
            </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div 
            className="px-4 py-2"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(15, 91, 229, 0.2)'
            }}
          >
            <div className="relative inline-block rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src={selectedImage}
                alt="Preview"
                className="max-w-full h-24 object-contain"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600 rounded-full"
                style={{
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  padding: 0,
                  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 8px'
                }}
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div 
          className="p-4 flex-shrink-0 rounded-b-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(15, 91, 229, 0.2)'
          }}
        >
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 rounded-full"
              style={{
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                padding: 0,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(15, 91, 229, 0.3)',
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px'
              }}
            >
              <ImageIcon className="w-4 h-4" style={{ color: '#0F5BE5' }} />
            </Button>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tanyakan tentang ikan, penyakit, atau perawatan..."
              className="flex-1 rounded-full"
              disabled={isLoading}
              style={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(15, 91, 229, 0.2)',
                padding: '10px 16px',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 8px'
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
              className="flex-shrink-0 rounded-full"
              style={{ 
                background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                padding: 0,
                border: 'none',
                boxShadow: 'rgba(15, 91, 229, 0.3) 0px 4px 12px'
              }}
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

