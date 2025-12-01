import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from './components/Router';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPageNew from './components/LandingPageNew';
import PublicFishpedia from './components/PublicFishpedia';
import PublicProduk from './components/PublicProduk';
import MemberDashboard from './components/MemberDashboard';
import AdminDashboard from './components/AdminDashboard';
import { useState, useEffect } from 'react';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import AIChatButton from './components/AIChatButton';

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  // Handle hash scrolling after navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavigate = (page: string) => {
    if (page === 'fishpedia') {
      navigate('/fishpedia');
    } else if (page === 'produk') {
      navigate('/produk');
    } else if (page === 'forum') {
      navigate('/forum');
    } else if (page === 'home') {
      navigate('/');
    } else if (page.startsWith('home#')) {
      const hash = page.split('#')[1];
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSmartNavigate = (target: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(target === 'beranda' ? 'hero' : target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPageNew
              onAuthClick={handleAuthClick}
              onNavigate={handleNavigate}
              onSmartNavigate={handleSmartNavigate}
            />
          }
        />
        <Route
          path="/fishpedia"
          element={
            <PublicFishpedia
              onAuthClick={handleAuthClick}
              onNavigate={() => handleNavigate('home')}
              onSmartNavigate={handleSmartNavigate}
            />
          }
        />
        <Route
          path="/produk"
          element={
            <PublicProduk
              onAuthClick={handleAuthClick}
              onNavigate={() => handleNavigate('home')}
              onSmartNavigate={handleSmartNavigate}
            />
          }
        />

        <Route
          path="/member/*"
          element={
            <ProtectedRoute requiredRole="member">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* AI Chat Button - Global, muncul di semua halaman jika login */}
      <AIChatButton />

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        initialMode={authModalMode}
      />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}
