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
  const [clickedDropdown, setClickedDropdown] = useState<string | null>(null); // Track clicked dropdowns
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const closeTimeoutRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({}); // Timeout refs for delayed close

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

  // Close dropdown when clicking outside (but respect clicked state)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Use a small delay to ensure onClick handlers have executed
      setTimeout(() => {
        // Check all dropdowns
        Object.keys(dropdownRefs.current).forEach((key) => {
          const ref = dropdownRefs.current[key];
          if (ref) {
            // Check if click is outside the dropdown container
            const clickedElement = event.target as Node;
            if (!ref.contains(clickedElement)) {
              // Only close if it's not a clicked dropdown (clicked dropdowns stay open)
              if (clickedDropdown !== key) {
                // Clear any pending timeout
                if (closeTimeoutRefs.current[key]) {
                  clearTimeout(closeTimeoutRefs.current[key]);
                  closeTimeoutRefs.current[key] = null;
                }
                setOpenDropdown((prev) => prev === key ? null : prev);
              }
            }
          }
        });
      }, 10); // Small delay to let onClick handlers execute first
    };

    // Use 'click' event instead of 'mousedown' to allow onClick to execute first
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [clickedDropdown]);

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
    return `px-4 py-2 rounded-full transition-all ${
      isActive ? 'bg-white/25' : 'hover:bg-white/20'
    }`;
  };

  const getNavItemStyle = (itemName: string) => {
    return {
      fontSize: '13px',
      fontWeight: 500,
      textDecoration: 'none' as const,
      color: '#FFFFFF'
    };
  };

  return (
    <header className="relative" style={{ background: 'transparent', zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center justify-between sticky top-3"
          style={{
            minHeight: '60px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '30px',
            padding: '10px 20px',
            margin: '8px auto',
            boxShadow: 'rgba(72, 128, 255, 0.15) 0px 4px 20px, rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset',
            maxWidth: '95%'
          }}
        >
          {/* Logo */}
          <button 
            onClick={(e) => handleSmartNavigate(e, 'beranda', true)}
            className="flex items-center gap-2 rounded-full px-4 py-2 transition-all hover:bg-white/20"
            style={{ 
              color: '#FFFFFF',
              backdropFilter: 'blur(5px)'
            }}
          >
            <Fish className="w-7 h-7" style={{ color: '#FFFFFF' }} />
            <span className="text-lg font-bold" style={{ color: '#FFFFFF' }}>temanikan</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5" style={{ marginLeft: '0cm' }}>
            {/* Beranda with Dropdown */}
            <div 
              className="relative"
              ref={(el) => { dropdownRefs.current['beranda'] = el; }}
              onMouseEnter={() => {
                // Clear any pending close timeout
                if (closeTimeoutRefs.current['beranda']) {
                  clearTimeout(closeTimeoutRefs.current['beranda']);
                  closeTimeoutRefs.current['beranda'] = null;
                }
                setOpenDropdown('beranda');
              }}
              onMouseLeave={() => {
                // Only close on mouse leave if it's not clicked
                if (clickedDropdown !== 'beranda') {
                  // Add delay before closing to allow mouse to move to dropdown
                  closeTimeoutRefs.current['beranda'] = setTimeout(() => {
                    setOpenDropdown(null);
                  }, 200); // 200ms delay
                }
              }}
            >
              <a
                href="#beranda"
                onClick={(e) => {
                  e.preventDefault();
                  // Toggle dropdown on click
                  if (clickedDropdown === 'beranda') {
                    setClickedDropdown(null);
                    setOpenDropdown(null);
                  } else {
                    setClickedDropdown('beranda');
                    setOpenDropdown('beranda');
                  }
                  handleSmartNavigate(e, 'beranda', true);
                }}
                className={`${getNavItemClass('beranda')} navbar-link ${activeSection === 'beranda' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('beranda')}
              >
                Beranda
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {(openDropdown === 'beranda' || clickedDropdown === 'beranda') && (
                <div 
                  className="absolute top-full left-0 mt-1 rounded-2xl shadow-xl py-2 min-w-[180px] z-50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 32px',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}
                  onMouseEnter={() => {
                    // Clear any pending close timeout
                    if (closeTimeoutRefs.current['beranda']) {
                      clearTimeout(closeTimeoutRefs.current['beranda']);
                      closeTimeoutRefs.current['beranda'] = null;
                    }
                    setOpenDropdown('beranda');
                  }}
                  onMouseLeave={() => {
                    // Only close on mouse leave if it's not clicked
                    if (clickedDropdown !== 'beranda') {
                      // Add delay before closing
                      closeTimeoutRefs.current['beranda'] = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200); // 200ms delay
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation(); // Prevent mousedown from triggering outside click
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from bubbling up
                  }}
                >
                  <a
                    href="#beranda"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent event from bubbling up
                      handleSmartNavigate(e, 'beranda', true);
                      // Don't close dropdown - let user continue browsing
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); // Prevent mousedown from triggering outside click
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
                  >
                    Beranda Utama
                  </a>
                  <a
                    href="#tentang"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent event from bubbling up
                      handleSmartNavigate(e, 'tentang', true);
                      // Don't close dropdown - let user continue browsing
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); // Prevent mousedown from triggering outside click
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
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
              onMouseEnter={() => {
                if (closeTimeoutRefs.current['tentang']) {
                  clearTimeout(closeTimeoutRefs.current['tentang']);
                  closeTimeoutRefs.current['tentang'] = null;
                }
                setOpenDropdown('tentang');
              }}
              onMouseLeave={() => {
                if (clickedDropdown !== 'tentang') {
                  closeTimeoutRefs.current['tentang'] = setTimeout(() => {
                    setOpenDropdown(null);
                  }, 200);
                }
              }}
            >
              <a
                href="#tentang"
                onClick={(e) => {
                  e.preventDefault();
                  if (clickedDropdown === 'tentang') {
                    setClickedDropdown(null);
                    setOpenDropdown(null);
                  } else {
                    setClickedDropdown('tentang');
                    setOpenDropdown('tentang');
                  }
                  handleSmartNavigate(e, 'tentang', true);
                }}
                className={`${getNavItemClass('tentang')} navbar-link ${activeSection === 'tentang' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('tentang')}
              >
                Tentang
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {(openDropdown === 'tentang' || clickedDropdown === 'tentang') && (
                <div 
                  className="absolute top-full left-0 mt-1 rounded-2xl shadow-xl py-2 min-w-[180px] z-50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 32px',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}
                  onMouseEnter={() => {
                    if (closeTimeoutRefs.current['tentang']) {
                      clearTimeout(closeTimeoutRefs.current['tentang']);
                      closeTimeoutRefs.current['tentang'] = null;
                    }
                    setOpenDropdown('tentang');
                  }}
                  onMouseLeave={() => {
                    if (clickedDropdown !== 'tentang') {
                      closeTimeoutRefs.current['tentang'] = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <a
                    href="#tentang"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSmartNavigate(e, 'tentang', true);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
                  >
                    Tentang Kami
                  </a>
                  <a
                    href="#fitur"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSmartNavigate(e, 'fitur', true);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
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
              onMouseEnter={() => {
                if (closeTimeoutRefs.current['fishpedia']) {
                  clearTimeout(closeTimeoutRefs.current['fishpedia']);
                  closeTimeoutRefs.current['fishpedia'] = null;
                }
                setOpenDropdown('fishpedia');
              }}
              onMouseLeave={() => {
                if (clickedDropdown !== 'fishpedia') {
                  closeTimeoutRefs.current['fishpedia'] = setTimeout(() => {
                    setOpenDropdown(null);
                  }, 200);
                }
              }}
            >
              <a
                href="/fishpedia"
                onClick={(e) => {
                  e.preventDefault();
                  if (clickedDropdown === 'fishpedia') {
                    setClickedDropdown(null);
                    setOpenDropdown(null);
                  } else {
                    setClickedDropdown('fishpedia');
                    setOpenDropdown('fishpedia');
                  }
                  handleSmartNavigate(e, '/fishpedia', false);
                }}
                className={`${getNavItemClass('fishpedia')} navbar-link ${activeSection === 'fishpedia' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('fishpedia')}
              >
                FishPedia
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {(openDropdown === 'fishpedia' || clickedDropdown === 'fishpedia') && (
                <div 
                  className="absolute top-full left-0 mt-1 rounded-2xl shadow-xl py-2 min-w-[180px] z-50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 32px',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}
                  onMouseEnter={() => {
                    if (closeTimeoutRefs.current['fishpedia']) {
                      clearTimeout(closeTimeoutRefs.current['fishpedia']);
                      closeTimeoutRefs.current['fishpedia'] = null;
                    }
                    setOpenDropdown('fishpedia');
                  }}
                  onMouseLeave={() => {
                    if (clickedDropdown !== 'fishpedia') {
                      closeTimeoutRefs.current['fishpedia'] = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <a
                    href="/fishpedia"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSmartNavigate(e, '/fishpedia', false);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
                  >
                    Semua Ikan
                  </a>
                  <a
                    href="/fishpedia"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSmartNavigate(e, '/fishpedia', false);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
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
              onMouseEnter={() => {
                if (closeTimeoutRefs.current['fitur']) {
                  clearTimeout(closeTimeoutRefs.current['fitur']);
                  closeTimeoutRefs.current['fitur'] = null;
                }
                setOpenDropdown('fitur');
              }}
              onMouseLeave={() => {
                if (clickedDropdown !== 'fitur') {
                  closeTimeoutRefs.current['fitur'] = setTimeout(() => {
                    setOpenDropdown(null);
                  }, 200);
                }
              }}
            >
              <a
                href="#fitur"
                onClick={(e) => {
                  e.preventDefault();
                  if (clickedDropdown === 'fitur') {
                    setClickedDropdown(null);
                    setOpenDropdown(null);
                  } else {
                    setClickedDropdown('fitur');
                    setOpenDropdown('fitur');
                  }
                  handleSmartNavigate(e, 'fitur', true);
                }}
                className={`${getNavItemClass('fitur')} navbar-link ${activeSection === 'fitur' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('fitur')}
              >
                Fitur
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {(openDropdown === 'fitur' || clickedDropdown === 'fitur') && (
                <div 
                  className="absolute top-full left-0 mt-1 rounded-2xl shadow-xl py-2 min-w-[180px] z-50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 32px',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}
                  onMouseEnter={() => {
                    if (closeTimeoutRefs.current['fitur']) {
                      clearTimeout(closeTimeoutRefs.current['fitur']);
                      closeTimeoutRefs.current['fitur'] = null;
                    }
                    setOpenDropdown('fitur');
                  }}
                  onMouseLeave={() => {
                    if (clickedDropdown !== 'fitur') {
                      closeTimeoutRefs.current['fitur'] = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <a
                    href="#fitur"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSmartNavigate(e, 'fitur', true);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
                  >
                    Semua Fitur
                  </a>
                  <a
                    href="#fitur"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSmartNavigate(e, 'fitur', true);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
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
              onMouseEnter={() => {
                if (closeTimeoutRefs.current['produk']) {
                  clearTimeout(closeTimeoutRefs.current['produk']);
                  closeTimeoutRefs.current['produk'] = null;
                }
                setOpenDropdown('produk');
              }}
              onMouseLeave={() => {
                if (clickedDropdown !== 'produk') {
                  closeTimeoutRefs.current['produk'] = setTimeout(() => {
                    setOpenDropdown(null);
                  }, 200);
                }
              }}
            >
              <a
                href="/produk"
                onClick={(e) => {
                  e.preventDefault();
                  if (clickedDropdown === 'produk') {
                    setClickedDropdown(null);
                    setOpenDropdown(null);
                  } else {
                    setClickedDropdown('produk');
                    setOpenDropdown('produk');
                  }
                  handleSmartNavigate(e, '/produk', false);
                }}
                className={`${getNavItemClass('produk')} navbar-link ${activeSection === 'produk' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('produk')}
              >
                Produk
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {(openDropdown === 'produk' || clickedDropdown === 'produk') && (
                <div 
                  className="absolute top-full left-0 mt-1 rounded-2xl shadow-xl py-2 min-w-[180px] z-50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 32px',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}
                  onMouseEnter={() => {
                    if (closeTimeoutRefs.current['produk']) {
                      clearTimeout(closeTimeoutRefs.current['produk']);
                      closeTimeoutRefs.current['produk'] = null;
                    }
                    setOpenDropdown('produk');
                  }}
                  onMouseLeave={() => {
                    if (clickedDropdown !== 'produk') {
                      closeTimeoutRefs.current['produk'] = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <a
                    href="/produk"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSmartNavigate(e, '/produk', false);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
                  >
                    Semua Produk
                  </a>
                  <a
                    href="/produk"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSmartNavigate(e, '/produk', false);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
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
              onMouseEnter={() => {
                if (closeTimeoutRefs.current['forum']) {
                  clearTimeout(closeTimeoutRefs.current['forum']);
                  closeTimeoutRefs.current['forum'] = null;
                }
                setOpenDropdown('forum');
              }}
              onMouseLeave={() => {
                if (clickedDropdown !== 'forum') {
                  closeTimeoutRefs.current['forum'] = setTimeout(() => {
                    setOpenDropdown(null);
                  }, 200);
                }
              }}
            >
              <a
                href="#forum"
                onClick={(e) => {
                  e.preventDefault();
                  if (clickedDropdown === 'forum') {
                    setClickedDropdown(null);
                    setOpenDropdown(null);
                  } else {
                    setClickedDropdown('forum');
                    setOpenDropdown('forum');
                  }
                  handleSmartNavigate(e, 'forum', true);
                }}
                className={`${getNavItemClass('forum')} navbar-link ${activeSection === 'forum' ? 'active' : ''} flex items-center gap-1`}
                style={getNavItemStyle('forum')}
              >
                Forum
                <ChevronDown className="w-3 h-3" style={{ color: 'inherit' }} />
              </a>
              {(openDropdown === 'forum' || clickedDropdown === 'forum') && (
                <div 
                  className="absolute top-full left-0 mt-1 rounded-2xl shadow-xl py-2 min-w-[180px] z-50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 32px',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}
                  onMouseEnter={() => {
                    if (closeTimeoutRefs.current['forum']) {
                      clearTimeout(closeTimeoutRefs.current['forum']);
                      closeTimeoutRefs.current['forum'] = null;
                    }
                    setOpenDropdown('forum');
                  }}
                  onMouseLeave={() => {
                    if (clickedDropdown !== 'forum') {
                      closeTimeoutRefs.current['forum'] = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <a
                    href="#forum"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSmartNavigate(e, 'forum', true);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
                  >
                    Forum Diskusi
                  </a>
                  <a
                    href="#forum"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSmartNavigate(e, 'forum', true);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    className="block px-4 py-2 text-sm rounded-full mx-2 hover:bg-white/30 transition-all"
                    style={{ color: '#FFFFFF' }}
                  >
                    Topik Populer
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => handleAuthClick('login')}
              className="px-3 py-1 rounded-full transition-all hover:bg-white/25"
              style={{ 
                fontSize: '13px', 
                color: '#FFFFFF', 
                fontWeight: 500,
                backgroundColor: 'transparent',
                backdropFilter: 'blur(5px)',
                cursor: 'pointer',
                lineHeight: '1.5'
              }}
            >
              Masuk
            </button>
            <button 
              onClick={() => handleAuthClick('register')}
              className="px-3 py-1 rounded-full transition-all hover:bg-white/30"
              style={{ 
                fontSize: '13px', 
                backgroundColor: 'rgba(255, 255, 255, 0.25)', 
                color: '#FFFFFF', 
                fontWeight: 500,
                backdropFilter: 'blur(5px)',
                cursor: 'pointer',
                boxShadow: 'rgba(255, 255, 255, 0.2) 0px 2px 8px',
                lineHeight: '1.5'
              }}
            >
              Daftar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/20 transition-all"
            style={{ color: '#FFFFFF' }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden rounded-3xl mt-2 mx-4"
          style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 32px'
          }}
        >
          <nav className="flex flex-col px-4 py-4 gap-2">
            {/* Anchor Links - Landing Page Sections */}
            <a
              href="#beranda"
              onClick={(e) => handleSmartNavigate(e, 'beranda', true)}
              className="py-2 px-4 rounded-full hover:bg-white/30 text-left transition-all"
              style={{ fontSize: '13px', color: '#FFFFFF' }}
            >
              Beranda
            </a>
            <a
              href="#tentang"
              onClick={(e) => handleSmartNavigate(e, 'tentang', true)}
              className="py-2 px-4 rounded-full hover:bg-white/30 text-left transition-all"
              style={{ fontSize: '13px', color: '#FFFFFF' }}
            >
              Tentang
            </a>
            <a
              href="#fitur"
              onClick={(e) => handleSmartNavigate(e, 'fitur', true)}
              className="py-2 px-4 rounded-full hover:bg-white/30 text-left transition-all"
              style={{ fontSize: '13px', color: '#FFFFFF' }}
            >
              Fitur
            </a>
            <a
              href="#forum"
              onClick={(e) => handleSmartNavigate(e, 'forum', true)}
              className="py-2 px-4 rounded-full hover:bg-white/30 text-left transition-all"
              style={{ fontSize: '13px', color: '#FFFFFF' }}
            >
              Forum
            </a>
            <a
              href="#testimoni"
              onClick={(e) => handleSmartNavigate(e, 'testimoni', true)}
              className="py-2 px-4 rounded-full hover:bg-white/30 text-left transition-all"
              style={{ fontSize: '13px', color: '#FFFFFF' }}
            >
              Testimoni
            </a>

            {/* Route Links - Standalone Pages */}
            <a
              href="/fishpedia"
              onClick={(e) => handleSmartNavigate(e, '/fishpedia', false)}
              className="py-2 px-4 rounded-full hover:bg-white/30 text-left transition-all"
              style={{ fontSize: '13px', color: '#FFFFFF' }}
            >
              Fishpedia
            </a>
            <a
              href="/produk"
              onClick={(e) => handleSmartNavigate(e, '/produk', false)}
              className="py-2 px-4 rounded-full hover:bg-white/30 text-left transition-all"
              style={{ fontSize: '13px', color: '#FFFFFF' }}
            >
              Produk
            </a>

            <div className="flex flex-col gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <button 
                onClick={() => handleAuthClick('login')}
                className="w-full py-2 px-4 rounded-full border transition-all hover:bg-white/20"
                style={{ fontSize: '13px', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.5)' }}
              >
                Masuk
              </button>
              <button 
                onClick={() => handleAuthClick('register')}
                className="w-full py-2 px-4 rounded-full transition-all hover:bg-white/30"
                style={{ fontSize: '13px', backgroundColor: 'rgba(255, 255, 255, 0.25)', color: '#FFFFFF' }}
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