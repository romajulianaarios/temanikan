import { useState, useEffect, useRef } from 'react';
import { Fish, Menu, X, ChevronDown } from './icons';
import { useLocation, useNavigate } from './Router';

interface NavbarProps {
  onAuthClick?: (mode: 'login' | 'register') => void;
  onSmartNavigate?: (target: string) => void;
}

export default function Navbar({ onAuthClick, onSmartNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

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
    // Style is now handled by CSS with !important, but keeping as fallback
    return {
      fontSize: '13px',
      fontWeight: 500,
      textDecoration: 'none' as const
    };
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={(e) => handleSmartNavigate(e, 'beranda', true)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ marginLeft: '-3cm' }}
          >
            <Fish className="w-7 h-7" style={{ color: '#4880FF' }} />
            <span className="text-lg" style={{ color: '#1F2937', fontWeight: 700 }}>temanikan</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5" style={{ marginLeft: '0cm' }}>
            {/* Beranda with Dropdown */}
            <div 
              className="relative"
              ref={(el) => { dropdownRefs.current['beranda'] = el; }}
              onMouseEnter={() => setOpenDropdown('beranda')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href="#beranda"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmartNavigate(e, 'beranda', true);
                }}
                className={`${getNavItemClass('beranda')} navbar-link ${activeSection === 'beranda' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('beranda')}
              >
                Beranda
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {openDropdown === 'beranda' && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
                  <a
                    href="#beranda"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, 'beranda', true);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Beranda Utama
                  </a>
                  <a
                    href="#tentang"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, 'tentang', true);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Tentang Kami
                  </a>
                </div>
              )}
            </div>

            {/* Tentang with Dropdown */}
            <div 
              className="relative"
              ref={(el) => { dropdownRefs.current['tentang'] = el; }}
              onMouseEnter={() => setOpenDropdown('tentang')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href="#tentang"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmartNavigate(e, 'tentang', true);
                }}
                className={`${getNavItemClass('tentang')} navbar-link ${activeSection === 'tentang' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('tentang')}
              >
                Tentang
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {openDropdown === 'tentang' && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
                  <a
                    href="#tentang"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, 'tentang', true);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Tentang Kami
                  </a>
                  <a
                    href="#fitur"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, 'fitur', true);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Fitur Kami
                  </a>
                </div>
              )}
            </div>

            {/* FishPedia with Dropdown */}
            <div 
              className="relative"
              ref={(el) => { dropdownRefs.current['fishpedia'] = el; }}
              onMouseEnter={() => setOpenDropdown('fishpedia')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href="/fishpedia"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmartNavigate(e, '/fishpedia', false);
                }}
                className={`${getNavItemClass('fishpedia')} navbar-link ${activeSection === 'fishpedia' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('fishpedia')}
              >
                FishPedia
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {openDropdown === 'fishpedia' && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
                  <a
                    href="/fishpedia"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, '/fishpedia', false);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Semua Ikan
                  </a>
                  <a
                    href="/fishpedia"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, '/fishpedia', false);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Kategori Ikan
                  </a>
                </div>
              )}
            </div>

            {/* Fitur with Dropdown */}
            <div 
              className="relative"
              ref={(el) => { dropdownRefs.current['fitur'] = el; }}
              onMouseEnter={() => setOpenDropdown('fitur')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href="#fitur"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmartNavigate(e, 'fitur', true);
                }}
                className={`${getNavItemClass('fitur')} navbar-link ${activeSection === 'fitur' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('fitur')}
              >
                Fitur
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {openDropdown === 'fitur' && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
                  <a
                    href="#fitur"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, 'fitur', true);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Semua Fitur
                  </a>
                  <a
                    href="#fitur"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, 'fitur', true);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Monitoring
                  </a>
                </div>
              )}
            </div>

            {/* Produk with Dropdown */}
            <div 
              className="relative"
              ref={(el) => { dropdownRefs.current['produk'] = el; }}
              onMouseEnter={() => setOpenDropdown('produk')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href="/produk"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmartNavigate(e, '/produk', false);
                }}
                className={`${getNavItemClass('produk')} navbar-link ${activeSection === 'produk' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('produk')}
              >
                Produk
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {openDropdown === 'produk' && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
                  <a
                    href="/produk"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, '/produk', false);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Semua Produk
                  </a>
                  <a
                    href="/produk"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, '/produk', false);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Kategori Produk
                  </a>
                </div>
              )}
            </div>

            {/* Forum with Dropdown */}
            <div 
              className="relative"
              ref={(el) => { dropdownRefs.current['forum'] = el; }}
              onMouseEnter={() => setOpenDropdown('forum')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href="#forum"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmartNavigate(e, 'forum', true);
                }}
                className={`${getNavItemClass('forum')} navbar-link ${activeSection === 'forum' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('forum')}
              >
                Forum
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {openDropdown === 'forum' && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
                  <a
                    href="#forum"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, 'forum', true);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Forum Diskusi
                  </a>
                  <a
                    href="#forum"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmartNavigate(e, 'forum', true);
                      setOpenDropdown(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Topik Populer
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3" style={{ marginRight: '-3cm' }}>
            <button 
              onClick={() => handleAuthClick('login')}
              className="px-4 py-2 rounded-lg transition-colors navbar-login-btn"
              style={{ 
                fontSize: '13px', 
                color: 'rgb(72, 128, 255)', 
                fontWeight: 500,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Masuk
            </button>
            <button 
              onClick={() => handleAuthClick('register')}
              className="px-4 py-2 rounded-lg transition-colors navbar-register-btn"
              style={{ 
                fontSize: '13px', 
                backgroundColor: '#78B0E8', 
                color: '#000000', 
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
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