import { useState, useEffect } from 'react';
import { Fish, Menu, X } from './icons';
import { useLocation, useNavigate } from './Router';

interface NavbarProps {
  onAuthClick?: (mode: 'login' | 'register') => void;
  onSmartNavigate?: (target: string) => void;
}

export default function Navbar({ onAuthClick, onSmartNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const location = useLocation();
  const navigate = useNavigate();

  // Track scroll position for active section highlighting on landing page
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['hero', 'tentang', 'fitur', 'forum', 'testimoni'];
      const scrollPosition = window.scrollY + 100; // offset for navbar height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i] === 'hero' ? 'beranda' : sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Update active section based on current route
  useEffect(() => {
    if (location.pathname === '/produk') {
      setActiveSection('produk');
    } else if (location.pathname === '/fishpedia') {
      setActiveSection('fishpedia');
    } else if (location.pathname === '/') {
      // Will be handled by scroll listener
      setActiveSection('beranda');
    }
  }, [location.pathname]);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setMobileMenuOpen(false);
    if (onAuthClick) {
      onAuthClick(mode);
    }
  };

  // Smart Navigation Handler
  const handleSmartNavigate = (e: React.MouseEvent, target: string, isAnchor: boolean) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (isAnchor) {
      // Category A: Anchor Links (Landing Page Sections)
      if (location.pathname === '/') {
        // Already on landing page - just scroll
        const element = document.getElementById(target === 'beranda' ? 'hero' : target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // On standalone page - navigate to home with hash
        if (onSmartNavigate) {
          onSmartNavigate(target);
        } else {
          // Fallback: direct navigation with hash
          navigate('/');
          setTimeout(() => {
            const element = document.getElementById(target === 'beranda' ? 'hero' : target);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    } else {
      // Category B: Route Links (Standalone Pages)
      navigate(target);
    }
  };

  const getNavItemClass = (itemName: string) => {
    const isActive = activeSection === itemName;
    return `px-3 py-2 rounded-lg transition-all hover:bg-[#F3F4F6] ${
      isActive ? 'bg-[#F3F4F6]' : ''
    }`;
  };

  const getNavItemStyle = (itemName: string) => {
    const isActive = activeSection === itemName;
    return {
      fontSize: '13px',
      fontWeight: 500,
      color: isActive ? '#4880FF' : '#6B7280'
    };
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={(e) => handleSmartNavigate(e, 'beranda', true)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Fish className="w-7 h-7" style={{ color: '#4880FF' }} />
            <span className="text-lg" style={{ color: '#1F2937', fontWeight: 700 }}>temanikan</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {/* Anchor Links - Landing Page Sections */}
            <a
              href="#beranda"
              onClick={(e) => handleSmartNavigate(e, 'beranda', true)}
              className={getNavItemClass('beranda')}
              style={getNavItemStyle('beranda')}
            >
              Beranda
            </a>
            <a
              href="#tentang"
              onClick={(e) => handleSmartNavigate(e, 'tentang', true)}
              className={getNavItemClass('tentang')}
              style={getNavItemStyle('tentang')}
            >
              Tentang
            </a>
            <a
              href="#fitur"
              onClick={(e) => handleSmartNavigate(e, 'fitur', true)}
              className={getNavItemClass('fitur')}
              style={getNavItemStyle('fitur')}
            >
              Fitur
            </a>
            <a
              href="#forum"
              onClick={(e) => handleSmartNavigate(e, 'forum', true)}
              className={getNavItemClass('forum')}
              style={getNavItemStyle('forum')}
            >
              Forum
            </a>
            <a
              href="#testimoni"
              onClick={(e) => handleSmartNavigate(e, 'testimoni', true)}
              className={getNavItemClass('testimoni')}
              style={getNavItemStyle('testimoni')}
            >
              Testimoni
            </a>

            {/* Route Links - Standalone Pages */}
            <a
              href="/fishpedia"
              onClick={(e) => handleSmartNavigate(e, '/fishpedia', false)}
              className={getNavItemClass('fishpedia')}
              style={getNavItemStyle('fishpedia')}
            >
              Fishpedia
            </a>
            <a
              href="/produk"
              onClick={(e) => handleSmartNavigate(e, '/produk', false)}
              className={getNavItemClass('produk')}
              style={getNavItemStyle('produk')}
            >
              Produk
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => handleAuthClick('login')}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ fontSize: '13px', color: '#4880FF', fontWeight: 500 }}
            >
              Masuk
            </button>
            <button 
              onClick={() => handleAuthClick('register')}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ fontSize: '13px', backgroundColor: '#4880FF', color: '#FFFFFF', fontWeight: 500 }}
            >
              Daftar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            style={{ color: '#4880FF' }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white" style={{ borderColor: '#E5E7EB' }}>
          <nav className="flex flex-col px-4 py-4 gap-2">
            {/* Anchor Links - Landing Page Sections */}
            <a
              href="#beranda"
              onClick={(e) => handleSmartNavigate(e, 'beranda', true)}
              className="py-2 px-3 rounded-lg hover:bg-[#F3F4F6] text-left"
              style={{ fontSize: '13px', color: activeSection === 'beranda' ? '#4880FF' : '#6B7280' }}
            >
              Beranda
            </a>
            <a
              href="#tentang"
              onClick={(e) => handleSmartNavigate(e, 'tentang', true)}
              className="py-2 px-3 rounded-lg hover:bg-[#F3F4F6] text-left"
              style={{ fontSize: '13px', color: activeSection === 'tentang' ? '#4880FF' : '#6B7280' }}
            >
              Tentang
            </a>
            <a
              href="#fitur"
              onClick={(e) => handleSmartNavigate(e, 'fitur', true)}
              className="py-2 px-3 rounded-lg hover:bg-[#F3F4F6] text-left"
              style={{ fontSize: '13px', color: activeSection === 'fitur' ? '#4880FF' : '#6B7280' }}
            >
              Fitur
            </a>
            <a
              href="#forum"
              onClick={(e) => handleSmartNavigate(e, 'forum', true)}
              className="py-2 px-3 rounded-lg hover:bg-[#F3F4F6] text-left"
              style={{ fontSize: '13px', color: activeSection === 'forum' ? '#4880FF' : '#6B7280' }}
            >
              Forum
            </a>
            <a
              href="#testimoni"
              onClick={(e) => handleSmartNavigate(e, 'testimoni', true)}
              className="py-2 px-3 rounded-lg hover:bg-[#F3F4F6] text-left"
              style={{ fontSize: '13px', color: activeSection === 'testimoni' ? '#4880FF' : '#6B7280' }}
            >
              Testimoni
            </a>

            {/* Route Links - Standalone Pages */}
            <a
              href="/fishpedia"
              onClick={(e) => handleSmartNavigate(e, '/fishpedia', false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F3F4F6] text-left"
              style={{ fontSize: '13px', color: activeSection === 'fishpedia' ? '#4880FF' : '#6B7280' }}
            >
              Fishpedia
            </a>
            <a
              href="/produk"
              onClick={(e) => handleSmartNavigate(e, '/produk', false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F3F4F6] text-left"
              style={{ fontSize: '13px', color: activeSection === 'produk' ? '#4880FF' : '#6B7280' }}
            >
              Produk
            </a>

            <div className="flex flex-col gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
              <button 
                onClick={() => handleAuthClick('login')}
                className="w-full py-2 px-4 rounded-lg border"
                style={{ fontSize: '13px', color: '#4880FF', borderColor: '#4880FF' }}
              >
                Masuk
              </button>
              <button 
                onClick={() => handleAuthClick('register')}
                className="w-full py-2 px-4 rounded-lg"
                style={{ fontSize: '13px', backgroundColor: '#4880FF', color: '#FFFFFF' }}
              >
                Daftar
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}