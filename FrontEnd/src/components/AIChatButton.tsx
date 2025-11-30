import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Bot } from './icons';
import AIChatWidget from './AIChatWidget';
import { useAuth } from './AuthContext';

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user, loading } = useAuth();

  // Hanya render jika user sudah login
  // Kondisi: AuthContext sudah selesai loading DAN user sudah login
  const shouldRender = !loading && isLoggedIn && user !== null && user !== undefined;

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
        className="bubble-button transition-all duration-300 flex items-center justify-center relative overflow-hidden"
        style={{ 
          width: '64px',
          height: '64px',
          minWidth: '64px',
          minHeight: '64px',
          maxWidth: '64px',
          maxHeight: '64px',
          padding: '0',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.95), rgba(15, 91, 229, 0.9))',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
          fontFamily: 'Nunito Sans, sans-serif'
        }}
        aria-label="Buka AI Chat"
        title="Buka AI Chat Assistant"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(72, 128, 255, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3) inset';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        }}
      >
        {/* Bubble glow effect */}
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-50 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent 70%)',
            filter: 'blur(12px)'
          }}
        ></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 214, 214, 0.5), transparent 70%)',
            filter: 'blur(10px)'
          }}
        ></div>
        <Bot className="w-7 h-7 text-white relative z-10" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }} />
      </Button>
      <AIChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

