import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Droplet, Activity, Bot, Search, Menu, X, ChevronRight, Star, MessageSquare, Users, Quote, Clock, CheckCircle } from './icons';
import Navbar from './Navbar';
import landingPageImage from '../assets/Landingpage_Ikan.png';
import Fish3DBackground from './Fish3DBackground';
import logo from '../assets/logo_temanikan.png';

interface LandingPageProps {
  onAuthClick?: (mode: 'login' | 'register') => void;
  onNavigate?: (page: string) => void;
  onSmartNavigate?: (target: string) => void;
}

export default function LandingPageNew({ onAuthClick, onNavigate, onSmartNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthClick = (mode: 'login' | 'register') => {
    if (onAuthClick) {
      onAuthClick(mode);
    }
  };

  const handleNavigateToFishpedia = () => {
    if (onNavigate) {
      onNavigate('fishpedia');
    }
  };

  const handleNavigateToProduk = () => {
    if (onNavigate) {
      onNavigate('produk');
    }
  };

  const handleNavigateToForum = () => {
    if (onNavigate) {
      onNavigate('forum');
    }
  };

  const handleSmartNavigation = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    
    // Get current path - if we're on home page, just scroll
    if (window.location.pathname === '/') {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // If we're on another page, navigate to home with hash
      if (onNavigate) {
        onNavigate(`home#${anchor}`);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ 
      background: 'linear-gradient(to bottom, #87CEEB 0%, #4A90E2 15%, #357ABD 30%, #2E5C8A 50%, #1E3A5F 70%, #0F2027 100%)',
      position: 'relative'
    }}>
      {/* Background Ikan 3D Animasi */}
      <Fish3DBackground />
      
      {/* Konten */}
      <div className="relative" style={{ zIndex: 1 }}>
      <style>{`
        /* Global Bubble Button Style dengan Hover Interaktif */
        .bubble-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer;
          will-change: transform, background-color, box-shadow;
        }
        .bubble-button:hover {
          transform: translateY(-4px) scale(1.05) !important;
        }
        .bubble-button:active {
          transform: translateY(-2px) scale(1.02) !important;
        }
        
        /* Style untuk semua button yang belum menggunakan class bubble-button */
        button:not(.bubble-button):not([class*="navbar"]):not([class*="mobile"]) {
          border-radius: 9999px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        button:not(.bubble-button):not([class*="navbar"]):not([class*="mobile"]):hover {
          transform: translateY(-3px) scale(1.03) !important;
          box-shadow: 0 8px 25px rgba(72, 128, 255, 0.4) !important;
        }
      `}</style>
      {/* Header/Navigation */}
      <Navbar onAuthClick={onAuthClick} onSmartNavigate={onSmartNavigate} />
      
      {/* Spacer untuk fixed navbar */}
      <div style={{ height: '76px' }}></div>
      
      {/* Hero Section */}
      <section id="beranda" className="relative py-8 sm:py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F5BE5] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD6D6] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="md:ml-[-2.5cm]">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 font-bold" style={{ 
                color: '#FFFFFF',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
              }}>
                Platform Edukasi, Komunitas, dan Monitoring Ikan Hias Berbasis Machine Learning
              </h1>
              {/* Decorative curved line */}
              <div className="mb-4 sm:mb-6" style={{ marginLeft: '-5cm' }}>
                <svg className="w-full max-w-[300px] sm:max-w-[400px]" height="16" viewBox="0 0 400 16" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                  <path 
                    d="M0 8C60 0, 140 0, 200 8C260 16, 340 16, 400 8" 
                    stroke="#FEC53D" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    style={{ opacity: 1, filter: 'drop-shadow(0 2px 8px rgba(254, 197, 61, 0.5))' }}
                  />
                </svg>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-white mb-6 sm:mb-8 leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
                Rawat ikan hiasmu dengan cerdas! Temanikan sebagai solusi edukatif, komunitas aktif, dan sistem monitoring akuarium pintar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                <button 
                  onClick={() => handleAuthClick('register')}
                  className="bubble-button px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 font-bold text-sm sm:text-base"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(254, 197, 61, 0.95), rgba(255, 215, 0, 0.9))',
                    backdropFilter: 'blur(10px)',
                    color: '#1F2937',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 6px 25px rgba(254, 197, 61, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
                    fontWeight: 700
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 1), rgba(254, 197, 61, 0.95))';
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(254, 197, 61, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.4) inset';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(254, 197, 61, 0.95), rgba(255, 215, 0, 0.9))';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(254, 197, 61, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.3) inset';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }}
                >
                  Mulai Sekarang
                </button>
                <a 
                  href="#tentang"
                  onClick={(e) => handleSmartNavigation(e, 'tentang')}
                  className="bubble-button px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 flex items-center text-sm sm:text-base font-medium cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 2px 10px rgba(72, 128, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(72, 128, 255, 0.2)';
                  }}
                >
                  Pelajari Selengkapnya
                </a>
              </div>
            </div>
            <div className="relative md:ml-[3cm] md:mt-[-1.5cm] mt-6 md:mt-0 order-first md:order-last">
              <div 
                className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl transition-all duration-300 cursor-pointer"
                style={{
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(5px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(72, 128, 255, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.5)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1.1)';
                    img.style.filter = 'brightness(1.1) contrast(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1)';
                    img.style.filter = 'brightness(1) contrast(1)';
                  }
                }}
              >
                <ImageWithFallback
                  src={landingPageImage}
                  alt="Beautiful Underwater Aquarium Scene with Colorful Fish and Corals"
                  className="w-full h-auto transition-all duration-300"
                  style={{ 
                    maxHeight: '400px',
                    minHeight: '250px',
                    objectFit: 'cover',
                    width: '100%',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals / Stats Section */}
      <section id="stats" className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}>
              Lebih dari 10.000 penghobi ikan telah bergabung di Temanikan 🐠
            </h2>
            <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-2" style={{ color: '#FFFFFF', fontWeight: '500', textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)' }}>
              Komunitas kami terus tumbuh! Temanikan dipercaya oleh pecinta ikan hias di seluruh Indonesia untuk belajar, berdiskusi, dan memantau akuarium secara cerdas.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {/* Card 1: Pengguna */}
            <div 
              className="relative p-3 sm:p-4 md:p-6 text-center transition-all duration-300 cursor-pointer overflow-hidden"
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(72, 128, 255, 0.3)',
                borderRadius: '32px',
                boxShadow: '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(72, 128, 255, 0.4) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              {/* Bubble glow effect */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(72, 128, 255, 0.6), transparent 70%)',
                  filter: 'blur(15px)'
                }}
              ></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 182, 193, 0.5), transparent 70%)',
                  filter: 'blur(12px)'
                }}
              ></div>
              
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4 relative z-10">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.95), rgba(15, 91, 229, 0.9))',
                    boxShadow: '0 8px 24px rgba(72, 128, 255, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full opacity-60" style={{ background: 'rgba(72, 128, 255, 0.5)', filter: 'blur(8px)' }}></div>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 relative z-10" style={{ color: '#133E87', fontWeight: '600', fontFamily: 'Nunito Sans, sans-serif' }}>Pengguna</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold relative z-10" style={{ color: '#0F5BE5', fontWeight: '800', fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(72, 128, 255, 0.2)' }}>10K+</div>
            </div>

            {/* Card 2: Waktu */}
            <div 
              className="relative p-3 sm:p-4 md:p-6 text-center transition-all duration-300 cursor-pointer overflow-hidden"
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(72, 128, 255, 0.3)',
                borderRadius: '32px',
                boxShadow: '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(72, 128, 255, 0.4) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              {/* Bubble glow effect */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(72, 128, 255, 0.6), transparent 70%)',
                  filter: 'blur(15px)'
                }}
              ></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 182, 193, 0.5), transparent 70%)',
                  filter: 'blur(12px)'
                }}
              ></div>
              
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4 relative z-10">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.95), rgba(15, 91, 229, 0.9))',
                    boxShadow: '0 8px 24px rgba(72, 128, 255, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full opacity-60" style={{ background: 'rgba(72, 128, 255, 0.5)', filter: 'blur(8px)' }}></div>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 relative z-10" style={{ color: '#133E87', fontWeight: '600', fontFamily: 'Nunito Sans, sans-serif' }}>Waktu</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold relative z-10" style={{ color: '#0F5BE5', fontWeight: '800', fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(72, 128, 255, 0.2)' }}>1K jam</div>
            </div>

            {/* Card 3: Ikan */}
            <div 
              className="relative p-3 sm:p-4 md:p-6 text-center transition-all duration-300 cursor-pointer overflow-hidden"
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(72, 128, 255, 0.3)',
                borderRadius: '32px',
                boxShadow: '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(72, 128, 255, 0.4) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              {/* Bubble glow effect */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(72, 128, 255, 0.6), transparent 70%)',
                  filter: 'blur(15px)'
                }}
              ></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 182, 193, 0.5), transparent 70%)',
                  filter: 'blur(12px)'
                }}
              ></div>
              
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4 relative z-10">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.95), rgba(15, 91, 229, 0.9))',
                    boxShadow: '0 8px 24px rgba(72, 128, 255, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <img src={logo} alt="Temanikan Logo" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full opacity-60" style={{ background: 'rgba(72, 128, 255, 0.5)', filter: 'blur(8px)' }}></div>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 relative z-10" style={{ color: '#133E87', fontWeight: '600', fontFamily: 'Nunito Sans, sans-serif' }}>Ikan</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold relative z-10" style={{ color: '#0F5BE5', fontWeight: '800', fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(72, 128, 255, 0.2)' }}>500+Spesies</div>
            </div>

            {/* Card 4: Robot */}
            <div 
              className="relative p-3 sm:p-4 md:p-6 text-center transition-all duration-300 cursor-pointer overflow-hidden"
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(72, 128, 255, 0.3)',
                borderRadius: '32px',
                boxShadow: '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(72, 128, 255, 0.4) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              {/* Bubble glow effect */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(72, 128, 255, 0.6), transparent 70%)',
                  filter: 'blur(15px)'
                }}
              ></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 182, 193, 0.5), transparent 70%)',
                  filter: 'blur(12px)'
                }}
              ></div>
              
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4 relative z-10">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.95), rgba(15, 91, 229, 0.9))',
                    boxShadow: '0 8px 24px rgba(72, 128, 255, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Bot className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full opacity-60" style={{ background: 'rgba(72, 128, 255, 0.5)', filter: 'blur(8px)' }}></div>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 relative z-10" style={{ color: '#133E87', fontWeight: '600', fontFamily: 'Nunito Sans, sans-serif' }}>Robot</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold relative z-10" style={{ color: '#0F5BE5', fontWeight: '800', fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(72, 128, 255, 0.2)' }}>9000+</div>
            </div>

            {/* Card 5: Akurasi */}
            <div 
              className="relative p-3 sm:p-4 md:p-6 text-center transition-all duration-300 cursor-pointer overflow-hidden"
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(72, 128, 255, 0.3)',
                borderRadius: '32px',
                boxShadow: '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(72, 128, 255, 0.4) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              {/* Bubble glow effect */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(72, 128, 255, 0.6), transparent 70%)',
                  filter: 'blur(15px)'
                }}
              ></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 182, 193, 0.5), transparent 70%)',
                  filter: 'blur(12px)'
                }}
              ></div>
              
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4 relative z-10">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.95), rgba(15, 91, 229, 0.9))',
                    boxShadow: '0 8px 24px rgba(72, 128, 255, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full opacity-60" style={{ background: 'rgba(72, 128, 255, 0.5)', filter: 'blur(8px)' }}></div>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 relative z-10" style={{ color: '#133E87', fontWeight: '600', fontFamily: 'Nunito Sans, sans-serif' }}>Akurasi</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold relative z-10" style={{ color: '#0F5BE5', fontWeight: '800', fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(72, 128, 255, 0.2)' }}>95%Terdeteksi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section id="tentang" className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(15, 91, 229, 0.1), rgba(30, 58, 138, 0.15))'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl mb-4 sm:mb-6" style={{ color: '#FFFFFF', fontWeight: '800', textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}>Tentang Temanikan</h2>
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6" style={{ color: '#FFFFFF', fontWeight: '500', lineHeight: '1.8', textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)' }}>
                TEMANIKAN adalah platform one-stop solution yang dirancang khusus untuk para aquarist. Kami adalah jembatan yang menghubungkan kecintaan Anda pada ikan hias dengan teknologi canggih Machine Learning dan dukungan komunitas, semuanya terpusat dalam satu website.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm">4.9 / 5 rating</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: '#FFFFFF', textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)', opacity: '0.9' }}>Dipercaya oleh 10,000+ pengguna di Indonesia</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:bg-[#FFD6D6] transition-colors">
                <Activity className="w-8 h-8 text-[#0F5BE5] mb-4" />
                <h3 className="mb-2">Arsitektur Teknis</h3>
                <p className="text-sm text-gray-600">
                  Integrasi IoT dan Machine Learning untuk monitoring real-time
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:bg-[#FFD6D6] transition-colors">
                <Bot className="w-8 h-8 text-[#0F5BE5] mb-4" />
                <h3 className="mb-2">Integrasi IoT</h3>
                <p className="text-sm text-gray-600">
                  ESP32-CAM mengirim data sensor ke database terpusat
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:bg-[#FFD6D6] transition-colors col-span-2">
                <Search className="w-8 h-8 text-[#0F5BE5] mb-4" />
                <h3 className="mb-2">Modul Machine Learning</h3>
                <p className="text-sm text-gray-600">
                  Model YOLO untuk analisis kesehatan ikan dengan akurasi tinggi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Section - Redesigned dengan Tema Bubble */}
      <section id="fitur" className="py-16 md:py-24 relative overflow-hidden">
        {/* Background Bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-20" style={{ background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))', filter: 'blur(40px)' }}></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full opacity-15" style={{ background: 'linear-gradient(135deg, rgba(255, 214, 214, 0.4), rgba(255, 182, 193, 0.3))', filter: 'blur(50px)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-6xl mb-6 font-extrabold" 
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                letterSpacing: '-0.02em',
                lineHeight: '1.2',
                fontWeight: '900'
              }}
            >
              Mengapa Memilih Temanikan?
            </h2>
            <p 
              className="text-xl md:text-2xl max-w-3xl mx-auto font-semibold" 
              style={{ 
                color: '#FFFFFF',
                lineHeight: '1.6',
                fontWeight: '600',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
              }}
            >
              Platform lengkap dengan teknologi Machine Learning untuk perawatan ikan hias yang lebih cerdas dan efektif
            </p>
          </div>

          {/* Main Features - 4 Card dengan Bubble Style */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Feature 1 - Diagnosa ML */}
            <div 
              className="relative p-8 rounded-3xl transition-all duration-300 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(15, 91, 229, 0.3)',
                boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(15, 91, 229, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                  boxShadow: '0 8px 24px rgba(15, 91, 229, 0.4)'
                }}
              >
                <Search className="w-10 h-10 text-white" />
                {/* Bubble effect */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-60" style={{ background: 'rgba(72, 128, 255, 0.5)', filter: 'blur(8px)' }}></div>
              </div>
              <h3 
                className="text-2xl mb-4 font-extrabold text-center" 
                style={{ 
                  color: '#0F5BE5',
                  textShadow: '0 2px 8px rgba(15, 91, 229, 0.2)',
                  letterSpacing: '-0.01em'
                }}
              >
                Diagnosa ML
              </h3>
              <p 
                className="text-gray-800 text-center leading-relaxed font-semibold" 
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7'
                }}
              >
                Deteksi penyakit ikan secara otomatis menggunakan teknologi Machine Learning dengan akurasi hingga 95%
              </p>
            </div>

            {/* Feature 2 - Monitoring Air */}
            <div 
              className="relative p-8 rounded-3xl transition-all duration-300 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(15, 91, 229, 0.3)',
                boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15)'
              }}
              onClick={() => handleAuthClick('login')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(15, 91, 229, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                  boxShadow: '0 8px 24px rgba(15, 91, 229, 0.4)'
                }}
              >
                <Activity className="w-10 h-10 text-white" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full opacity-60" style={{ background: 'rgba(72, 128, 255, 0.5)', filter: 'blur(8px)' }}></div>
              </div>
              <h3 
                className="text-2xl mb-4 font-extrabold text-center" 
                style={{ 
                  color: '#0F5BE5',
                  textShadow: '0 2px 8px rgba(15, 91, 229, 0.2)',
                  letterSpacing: '-0.01em'
                }}
              >
                Monitoring Real-time
              </h3>
              <p 
                className="text-gray-800 text-center leading-relaxed font-semibold" 
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7'
                }}
              >
                Pantau kualitas air secara real-time dengan sensor IoT dan dapatkan notifikasi otomatis
              </p>
            </div>

            {/* Feature 3 - Komunitas */}
            <div 
              className="relative p-8 rounded-3xl transition-all duration-300 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(15, 91, 229, 0.3)',
                boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(15, 91, 229, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                  boxShadow: '0 8px 24px rgba(15, 91, 229, 0.4)'
                }}
              >
                <Users className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full opacity-60" style={{ background: 'rgba(72, 128, 255, 0.5)', filter: 'blur(8px)' }}></div>
              </div>
              <h3 
                className="text-2xl mb-4 font-extrabold text-center" 
                style={{ 
                  color: '#0F5BE5',
                  textShadow: '0 2px 8px rgba(15, 91, 229, 0.2)',
                  letterSpacing: '-0.01em'
                }}
              >
                Komunitas Aktif
              </h3>
              <p 
                className="text-gray-800 text-center leading-relaxed font-semibold" 
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7'
                }}
              >
                Bergabung dengan ribuan pecinta ikan hias untuk berbagi pengalaman dan tips perawatan
              </p>
            </div>

            {/* Feature 4 - AI Chat */}
            <div 
              className="relative p-8 rounded-3xl transition-all duration-300 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(15, 91, 229, 0.3)',
                boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(15, 91, 229, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                  boxShadow: '0 8px 24px rgba(15, 91, 229, 0.4)'
                }}
              >
                <Bot className="w-10 h-10 text-white" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full opacity-60" style={{ background: 'rgba(72, 128, 255, 0.5)', filter: 'blur(8px)' }}></div>
              </div>
              <h3 
                className="text-2xl mb-4 font-extrabold text-center" 
                style={{ 
                  color: '#0F5BE5',
                  textShadow: '0 2px 8px rgba(15, 91, 229, 0.2)',
                  letterSpacing: '-0.01em'
                }}
              >
                AI Chat Assistant
              </h3>
              <p 
                className="text-gray-800 text-center leading-relaxed font-semibold" 
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7'
                }}
              >
                Dapatkan jawaban instan tentang perawatan ikan dengan AI Chat berbasis Gemini yang siap membantu 24/7
              </p>
            </div>
          </div>

          {/* Additional Features - Horizontal Bubble List */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Search, text: 'FishPedia 500+ Spesies' },
              { icon: Bot, text: 'Robot Pembersih Otomatis' },
              { icon: Droplet, text: 'IoT Sensor 24/7' }
            ].map((item, index) => (
              <div
                key={index}
                className="px-6 py-3 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(15, 91, 229, 0.3)',
                  boxShadow: '0 4px 16px rgba(15, 91, 229, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                  e.currentTarget.style.background = 'rgba(15, 91, 229, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 91, 229, 0.15)';
                }}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-6 h-6" style={{ color: '#0F5BE5' }} />
                  <span className="text-base font-semibold" style={{ color: '#0F5BE5' }}>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forum Section - Simple & Clean dengan Search */}
      <section id="forum" className="py-16 md:py-24 relative overflow-hidden">
        {/* Background Bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-20 w-24 h-24 rounded-full opacity-15" style={{ background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))', filter: 'blur(30px)' }}></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full opacity-10" style={{ background: 'linear-gradient(135deg, rgba(255, 214, 214, 0.4), rgba(255, 182, 193, 0.3))', filter: 'blur(40px)' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl md:text-6xl mb-6 font-extrabold" 
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                letterSpacing: '-0.02em',
                fontWeight: '900'
              }}
            >
              Forum Komunitas Temanikan
            </h2>
            <p 
              className="text-xl md:text-2xl max-w-2xl mx-auto font-semibold" 
              style={{ 
                color: '#FFFFFF',
                lineHeight: '1.6',
                fontWeight: '600',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
              }}
            >
              Bergabunglah dengan komunitas pecinta ikan hias terbesar di Indonesia
            </p>
          </div>

          {/* Search Bar dengan Bubble Style */}
          <div className="mb-12">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAuthClick('login');
              }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <div 
                  className="flex items-center rounded-full overflow-hidden transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(15, 91, 229, 0.3)',
                    boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 91, 229, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15)';
                  }}
                >
                  <div className="pl-6 pr-3 flex items-center">
                    <Search className="w-6 h-6" style={{ color: '#0F5BE5' }} />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari topik, pertanyaan, atau diskusi..."
                    className="flex-1 py-4 px-4 text-base font-medium outline-none"
                    style={{
                      background: 'transparent',
                      color: '#1F2937'
                    }}
                  />
                  <button
                    type="submit"
                    className="bubble-button px-6 py-4 rounded-full transition-all duration-300 font-semibold mr-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                      color: '#FFFFFF',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(15, 91, 229, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 6px 24px rgba(15, 91, 229, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 91, 229, 0.3)';
                    }}
                  >
                    Cari
                  </button>
                </div>
                <p className="text-center text-sm mt-4" style={{ color: '#FFFFFF', textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)', opacity: '0.9' }}>
                  * Login diperlukan untuk mengakses forum
                </p>
              </div>
            </form>
          </div>

          {/* Simple Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <div 
                className="text-3xl md:text-4xl font-extrabold mb-2" 
                style={{ color: '#60A5FA' }}
              >
                10K+
              </div>
              <div className="text-sm font-medium" style={{ color: '#E5E7EB' }}>Anggota</div>
            </div>
            <div className="text-center">
              <div 
                className="text-3xl md:text-4xl font-extrabold mb-2" 
                style={{ color: '#60A5FA' }}
              >
                5K+
              </div>
              <div className="text-sm font-medium" style={{ color: '#E5E7EB' }}>Topik</div>
            </div>
            <div className="text-center">
              <div 
                className="text-3xl md:text-4xl font-extrabold mb-2" 
                style={{ color: '#60A5FA' }}
              >
                50K+
              </div>
              <div className="text-sm font-medium" style={{ color: '#E5E7EB' }}>Diskusi</div>
            </div>
          </div>

          {/* Simple CTA */}
          <div className="text-center">
            <button 
              onClick={() => handleAuthClick('login')}
              className="bubble-button px-6 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 mx-auto font-semibold text-base whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
              }}
            >
              Bergabung dengan Forum
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
      <section id="testimoni" className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(15, 91, 229, 0.1), rgba(30, 58, 138, 0.15))'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl mb-4" style={{ color: '#FFFFFF', fontWeight: '800', textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}>Apa Kata Mereka?</h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: '#FFFFFF', fontWeight: '500', textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)' }}>
              Ribuan pengguna telah merasakan manfaat Temanikan dalam merawat ikan hias mereka. Simak pengalaman mereka!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative hover:bg-[#FFD6D6] transition-colors">
              <Quote className="w-10 h-10 text-[#0F5BE5] mb-4 opacity-50" />
              <p className="text-gray-600 mb-6">
                "Temanikan sangat membantu saya dalam merawat ikan cupang. Fitur deteksi penyakit menggunakan ML sangat akurat dan cepat. Sekarang saya tidak khawatir lagi!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0F5BE5] rounded-full flex items-center justify-center text-white">
                  <span>AW</span>
                </div>
                <div>
                  <h4 className="font-semibold">Andi Wijaya</h4>
                  <p className="text-sm text-gray-500">Aquarist - Jakarta</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative hover:bg-[#FFD6D6] transition-colors">
              <Quote className="w-10 h-10 text-[#0F5BE5] mb-4 opacity-50" />
              <p className="text-gray-600 mb-6">
                "Forum komunitas di Temanikan luar biasa! Saya belajar banyak dari para expert dan bisa sharing pengalaman breeding Guppy. Recommended banget!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0F5BE5] rounded-full flex items-center justify-center text-white">
                  <span>SP</span>
                </div>
                <div>
                  <h4 className="font-semibold">Siti Permata</h4>
                  <p className="text-sm text-gray-500">Breeder - Bandung</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative hover:bg-[#FFD6D6] transition-colors">
              <Quote className="w-10 h-10 text-[#0F5BE5] mb-4 opacity-50" />
              <p className="text-gray-600 mb-6">
                "Robot Temanikan menghemat waktu saya banget! Monitoring air otomatis dan pembersihan akuarium jadi lebih mudah. Worth it!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0F5BE5] rounded-full flex items-center justify-center text-white">
                  <span>BP</span>
                </div>
                <div>
                  <h4 className="font-semibold">Budi Prasetyo</h4>
                  <p className="text-sm text-gray-500">Hobbyist - Surabaya</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Testimonial 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative hover:bg-[#FFD6D6] transition-colors">
              <Quote className="w-10 h-10 text-[#0F5BE5] mb-4 opacity-50" />
              <p className="text-gray-600 mb-6">
                "Fishpedia sangat lengkap! Saya sebagai pemula terbantu sekali dengan informasi detail setiap spesies. Plus ada panduan perawatannya juga!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0F5BE5] rounded-full flex items-center justify-center text-white">
                  <span>RN</span>
                </div>
                <div>
                  <h4 className="font-semibold">Rina Novita</h4>
                  <p className="text-sm text-gray-500">Pemula - Yogyakarta</p>
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative hover:bg-[#FFD6D6] transition-colors">
              <Quote className="w-10 h-10 text-[#0F5BE5] mb-4 opacity-50" />
              <p className="text-gray-600 mb-6">
                "Dashboard monitoring real-time sangat membantu. Saya bisa pantau kualitas air dari kantor. Notifikasi otomatis juga sangat berguna!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0F5BE5] rounded-full flex items-center justify-center text-white">
                  <span>DK</span>
                </div>
                <div>
                  <h4 className="font-semibold">Dedi Kurniawan</h4>
                  <p className="text-sm text-gray-500">Professional - Semarang</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bubble Style */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Decorative Bubbles Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-20 w-32 h-32 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4), rgba(255, 182, 193, 0.2))', filter: 'blur(40px)' }}></div>
          <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))', filter: 'blur(50px)' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="rounded-[40px] p-12 md:p-16 text-center transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.15), rgba(72, 128, 255, 0.12), rgba(135, 206, 250, 0.1))',
              backdropFilter: 'blur(20px)',
              borderRadius: '40px',
              boxShadow: '0 20px 60px rgba(15, 91, 229, 0.2), inset 0 2px 10px rgba(255, 255, 255, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 25px 70px rgba(15, 91, 229, 0.3), inset 0 2px 15px rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(15, 91, 229, 0.2), inset 0 2px 10px rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h2 
              className="text-4xl md:text-6xl mb-6 font-extrabold relative z-10"
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(15, 91, 229, 0.4)',
                letterSpacing: '-0.02em'
              }}
            >
              Siap Memulai Perjalanan Anda?
            </h2>
            <p 
              className="text-xl md:text-2xl mb-10 font-semibold relative z-10"
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                lineHeight: '1.6'
              }}
            >
              Bergabunglah dengan 10,000+ pecinta ikan hias yang telah mempercayai Temanikan untuk perawatan akuarium mereka
            </p>
            <button 
              onClick={() => handleAuthClick('register')}
              className="bubble-button px-6 py-3 text-base font-bold rounded-full transition-all duration-300 relative z-10"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFC700)',
                color: '#000000',
                boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                border: '3px solid rgba(255, 255, 255, 0.5)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #FFC700, #FFB700)';
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.6), inset 0 2px 6px rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #FFD700, #FFC700)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)';
              }}
            >
              Daftar Gratis Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Bubble Style */}
      <footer className="relative overflow-hidden">
        {/* Decorative Bubbles Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-10 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(15, 91, 229, 0.3), rgba(72, 128, 255, 0.2))', filter: 'blur(50px)' }}></div>
          <div className="absolute bottom-0 right-10 w-36 h-36 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(255, 182, 193, 0.3), rgba(255, 215, 0, 0.2))', filter: 'blur(45px)' }}></div>
        </div>

        <div 
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 relative z-10"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '40px 40px 0 0',
            boxShadow: '0 -10px 40px rgba(15, 91, 229, 0.1), inset 0 2px 10px rgba(255, 255, 255, 0.5)'
          }}
        >
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Column 1 - Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.2), rgba(72, 128, 255, 0.15))',
                    border: '2px solid rgba(15, 91, 229, 0.3)',
                    boxShadow: '0 4px 12px rgba(15, 91, 229, 0.15)'
                  }}
                >
                  <img src={logo} alt="Temanikan Logo" className="w-6 h-6 object-contain" />
                </div>
                <span 
                  className="text-2xl font-bold" 
                  style={{ 
                    fontFamily: 'Nunito Sans, sans-serif',
                    color: '#0F5BE5',
                    textShadow: '0 2px 8px rgba(15, 91, 229, 0.2)'
                  }}
                >
                  temanikan
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#374151', lineHeight: '1.6' }}>
                Platform edukasi, komunitas, dan monitoring ikan hias berbasis Machine Learning
              </p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h3 className="mb-4 font-bold text-lg" style={{ color: '#0F5BE5' }}>Navigasi Cepat</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="#tentang" 
                    className="inline-block px-4 py-2 rounded-full font-medium transition-all duration-300"
                    style={{
                      color: '#374151',
                      background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(15, 91, 229, 0.1)';
                      e.currentTarget.style.color = '#0F5BE5';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 91, 229, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <button 
                    onClick={handleNavigateToFishpedia} 
                    className="bubble-button px-4 py-2 rounded-full font-medium transition-all duration-300 text-left"
                    style={{
                      color: '#374151',
                      background: 'transparent',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(15, 91, 229, 0.1)';
                      e.currentTarget.style.color = '#0F5BE5';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 91, 229, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Fishpedia
                  </button>
                </li>
                <li>
                  <a 
                    href="#fitur" 
                    className="inline-block px-4 py-2 rounded-full font-medium transition-all duration-300"
                    style={{
                      color: '#374151',
                      background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(15, 91, 229, 0.1)';
                      e.currentTarget.style.color = '#0F5BE5';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 91, 229, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Fitur
                  </a>
                </li>
                <li>
                  <button 
                    onClick={handleNavigateToProduk} 
                    className="bubble-button px-4 py-2 rounded-full font-medium transition-all duration-300 text-left"
                    style={{
                      color: '#374151',
                      background: 'transparent',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(15, 91, 229, 0.1)';
                      e.currentTarget.style.color = '#0F5BE5';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 91, 229, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Produk
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 - Support */}
            <div>
              <h3 className="mb-4 font-bold text-lg" style={{ color: '#0F5BE5' }}>Dukungan</h3>
              <ul className="space-y-2 text-sm">
                {['FAQ', 'Kontak', 'Bantuan', 'Dokumentasi'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="inline-block px-4 py-2 rounded-full font-medium transition-all duration-300"
                      style={{
                        color: '#374151',
                        background: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(15, 91, 229, 0.1)';
                        e.currentTarget.style.color = '#0F5BE5';
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 91, 229, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Social Media */}
            <div>
              <h3 className="mb-4 font-bold text-lg" style={{ color: '#0F5BE5' }}>Ikuti Kami</h3>
              <div className="flex gap-3">
                {[
                  { name: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                  { name: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '2px solid rgba(15, 91, 229, 0.3)',
                      boxShadow: '0 4px 12px rgba(15, 91, 229, 0.15)',
                      color: '#0F5BE5'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(15, 91, 229, 0.2), rgba(72, 128, 255, 0.15))';
                      e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 91, 229, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 91, 229, 0.15)';
                    }}
                  >
                    <span className="sr-only">{social.name}</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div 
            className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
          >
            <p className="font-medium" style={{ color: '#6B7280' }}>© 2025 Temanikan. All rights reserved.</p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms & Conditions'].map((link, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="px-4 py-2 rounded-full font-medium transition-all duration-300"
                  style={{
                    color: '#6B7280'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0F5BE5';
                    e.currentTarget.style.background = 'rgba(15, 91, 229, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6B7280';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      </div>
      {/* End of Content Wrapper */}
    </div>
  );
}
