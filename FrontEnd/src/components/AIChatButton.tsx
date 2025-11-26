import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Bot } from './icons';
import AIChatWidget from './AIChatWidget';
import { useAuth } from './AuthContext';

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user, loading } = useAuth();

  // STRICT CHECK: Hanya render jika user BENAR-BENAR sudah login
  // Pastikan SEMUA kondisi terpenuhi (semua harus true):
  // 1. AuthContext sudah selesai loading
  // 2. isLoggedIn harus true (strict equality check)
  // 3. user object harus ada (bukan null atau undefined)
  // 4. user.id harus ada dan valid (number > 0)
  // 5. user.email harus ada dan valid (string non-empty)
  // 6. Token HARUS ada di storage (double check untuk keamanan)
  
  // Check token di storage
  const hasToken = typeof window !== 'undefined' && (
    sessionStorage.getItem('access_token') || 
    localStorage.getItem('access_token')
  );
  
  // Validasi user object yang lebih ketat
  const hasValidUser = user !== null && 
                       user !== undefined &&
                       typeof user === 'object' &&
                       typeof user.id === 'number' && 
                       user.id > 0 &&
                       typeof user.email === 'string' &&
                       user.email.trim().length > 0 &&
                       user.email.includes('@');
  
  // Hanya render jika SEMUA kondisi terpenuhi
  const shouldRender = !loading &&           // ✅ AuthContext sudah selesai loading
                       isLoggedIn === true && // ✅ isLoggedIn harus true (strict check)
                       hasValidUser &&       // ✅ User object valid dengan id dan email
                       hasToken;             // ✅ Token harus ada (double check)

  useEffect(() => {
    if (shouldRender) {
      console.log('✅ AIChatButton - User logged in, button visible', {
        userId: user?.id,
        userEmail: user?.email
      });
    } else {
      console.log('❌ AIChatButton - User not logged in, button hidden', {
        loading,
        isLoggedIn,
        hasValidUser,
        hasToken,
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email
      });
    }
  }, [shouldRender, loading, isLoggedIn, user, hasValidUser, hasToken]);

  // JANGAN RENDER APAPUN jika user belum login
  // Return null = tidak ada button yang muncul sama sekali
  if (!shouldRender) {
    return null;
  }

  // Jika sampai di sini, berarti shouldRender = true, jadi button boleh muncul
  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '24px', 
        right: '24px', 
        zIndex: 99999
      }}
    >
      <Button
        onClick={() => {
          console.log('🤖 AI Chat button clicked!');
          setIsOpen(true);
        }}
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          cursor: 'pointer',
          boxShadow: 'rgba(15, 91, 229, 0.3) 0px 8px 24px, rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset'
        }}
        aria-label="Buka AI Chat"
        title="Buka AI Chat Assistant"
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>
      <AIChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

