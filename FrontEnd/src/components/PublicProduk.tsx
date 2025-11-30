import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Fish, Menu, X, ShoppingCart, Check } from './icons';
import Navbar from './Navbar';

interface PublicProdukProps {
  onAuthClick?: (mode: 'login' | 'register') => void;
  onNavigateHome?: () => void;
  onSmartNavigate?: (target: string) => void;
}

export default function PublicProduk({ onAuthClick, onNavigateHome, onSmartNavigate }: PublicProdukProps) {

  const handleAuthClick = (mode: 'login' | 'register') => {
    if (onAuthClick) {
      onAuthClick(mode);
    }
  };

  const handleNavigateHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else if (onSmartNavigate) {
      onSmartNavigate('/');
    }
  };

  const handleNavigateToFishpedia = () => {
    if (onSmartNavigate) {
      onSmartNavigate('/fishpedia');
    }
  };

  const handleBuyNow = () => {
    // Check if logged in, else show login modal
    handleAuthClick('login');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ 
      background: 'linear-gradient(to bottom, #87CEEB 0%, #4A90E2 15%, #357ABD 30%, #2E5C8A 50%, #1E3A5F 70%, #0F2027 100%)',
      position: 'relative'
    }}>
      {/* Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#0F5BE5] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FFD6D6] rounded-full blur-3xl"></div>
      </div>

      {/* Global Navbar */}
      <div className="relative z-10">
        <Navbar onAuthClick={onAuthClick} onSmartNavigate={onSmartNavigate} />
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Nunito Sans, sans-serif' }}>
              <button 
                onClick={handleNavigateHome} 
                className="hover:text-white transition-colors font-semibold"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              >
                Beranda
              </button>
              <span>/</span>
              <span className="text-white font-bold">Produk</span>
            </nav>
          </div>

          {/* Product Header */}
          <div className="mb-12">
            <div 
              className="inline-block px-5 py-2.5 rounded-full text-sm mb-4 font-semibold transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(15, 91, 229, 0.3)',
                boxShadow: '0 6px 20px rgba(15, 91, 229, 0.2)',
                color: '#133E87',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            >
              Produk Unggulan
            </div>
            <h1 
              className="text-4xl md:text-5xl mb-4 font-extrabold" 
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                letterSpacing: '-0.02em',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            >
              Robot Temanikan
            </h1>
            <p 
              className="text-xl max-w-3xl font-semibold" 
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            >
              Solusi terpadu untuk perawatan akuarium modern Anda. Dilengkapi dengan teknologi canggih yang memudahkan pemeliharaan ikan hias.
            </p>
          </div>

          {/* Product Content */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="relative">
              <div 
                className="rounded-[40px] overflow-hidden relative transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '3px solid rgba(15, 91, 229, 0.3)',
                  boxShadow: '0 12px 40px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 16px 50px rgba(15, 91, 229, 0.3), 0 0 0 1px rgba(15, 91, 229, 0.4) inset';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset';
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1583899282521-0e5965167d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcml1bSUyMHJvYm90JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjMzNTA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Robot Temanikan"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Product Badge */}
              <div 
                className="absolute top-4 right-4 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.9))',
                  color: '#FFFFFF',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                ✨ Best Seller
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div 
                className="p-8 rounded-[40px] mb-6 transition-all duration-300 relative overflow-hidden bubble-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '3px solid rgba(15, 91, 229, 0.3)',
                  boxShadow: '0 12px 40px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(15, 91, 229, 0.3), 0 0 0 2px rgba(15, 91, 229, 0.4) inset';
                  e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset';
                  e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                }}
              >
                {/* Multiple bubble glow effects */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                    filter: 'blur(20px)'
                  }}
                ></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 182, 193, 0.3), transparent 70%)',
                    filter: 'blur(15px)'
                  }}
                ></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(72, 128, 255, 0.2), transparent 70%)',
                    filter: 'blur(25px)'
                  }}
                ></div>
                
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm line-through" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Rp 3.499.000</span>
                      <span 
                        className="px-3 py-1.5 rounded-full text-sm font-bold"
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#dc2626',
                          border: '2px solid rgba(239, 68, 68, 0.3)',
                          fontFamily: 'Nunito Sans, sans-serif'
                        }}
                      >
                        Hemat 29%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Rp 2.499.000</span>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                    <p style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>
                      Robot Pembersih Akuarium Otomatis dengan AI Navigation dan monitoring kualitas air terintegrasi.
                    </p>
                  </div>

                  <button 
                    onClick={handleBuyNow}
                    className="w-full py-4 rounded-full font-bold transition-all duration-300 bubble-button flex items-center justify-center gap-2 mb-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                      color: '#FFFFFF',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 24px rgba(15, 91, 229, 0.3)',
                      fontFamily: 'Nunito Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
                    }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Beli Sekarang
                  </button>

                  <p className="text-sm text-center" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                    * Memerlukan login untuk melakukan pemesanan
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className="text-center p-5 transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(15, 91, 229, 0.2)',
                    borderRadius: '32px',
                    boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(15, 91, 229, 0.3) inset';
                    e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                    e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.2)';
                  }}
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-20 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
                      filter: 'blur(10px)'
                    }}
                  ></div>
                  <div className="text-2xl mb-1 relative z-10">⚡</div>
                  <div className="text-xs font-semibold relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Garansi 1 Tahun</div>
                </div>
                <div 
                  className="text-center p-5 transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(15, 91, 229, 0.2)',
                    borderRadius: '32px',
                    boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(15, 91, 229, 0.3) inset';
                    e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                    e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.2)';
                  }}
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-20 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
                      filter: 'blur(10px)'
                    }}
                  ></div>
                  <div className="text-2xl mb-1 relative z-10">🚚</div>
                  <div className="text-xs font-semibold relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Gratis Ongkir</div>
                </div>
                <div 
                  className="text-center p-5 transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(15, 91, 229, 0.2)',
                    borderRadius: '32px',
                    boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(15, 91, 229, 0.3) inset';
                    e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                    e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.2)';
                  }}
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-20 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
                      filter: 'blur(10px)'
                    }}
                  ></div>
                  <div className="text-2xl mb-1 relative z-10">🔧</div>
                  <div className="text-xs font-semibold relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Free Maintenance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div 
            className="rounded-[40px] p-8 md:p-12 mb-16 transition-all duration-300 relative overflow-hidden bubble-card"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(15, 91, 229, 0.3)',
              boxShadow: '0 12px 40px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(15, 91, 229, 0.3), 0 0 0 2px rgba(15, 91, 229, 0.4) inset';
              e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset';
              e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
            }}
          >
            {/* Multiple bubble glow effects */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                filter: 'blur(30px)'
              }}
            ></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255, 182, 193, 0.3), transparent 70%)',
                filter: 'blur(20px)'
              }}
            ></div>
            
            <h2 className="text-3xl mb-8 font-extrabold relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Fitur Unggulan</h2>
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    boxShadow: '0 6px 20px rgba(15, 91, 229, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Check className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Pembersihan Otomatis dengan AI Navigation</h3>
                  <p className="text-sm" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>
                    Teknologi AI canggih memungkinkan robot bergerak optimal di dalam akuarium tanpa melukai ikan atau merusak tanaman hias.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    boxShadow: '0 6px 20px rgba(15, 91, 229, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Check className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Sensor Kualitas Air Terintegrasi</h3>
                  <p className="text-sm" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>
                    Monitoring real-time parameter air (pH, Suhu, TDS) langsung dari smartphone dengan notifikasi otomatis jika ada anomali.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    boxShadow: '0 6px 20px rgba(15, 91, 229, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Check className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Kontrol via Smartphone (iOS & Android)</h3>
                  <p className="text-sm" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>
                    Aplikasi mobile user-friendly untuk mengontrol robot, menjadwalkan pembersihan, dan memantau kualitas air dari mana saja.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    boxShadow: '0 6px 20px rgba(15, 91, 229, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Check className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Baterai Tahan Lama (120 Menit)</h3>
                  <p className="text-sm" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>
                    Baterai lithium berkualitas tinggi dengan daya tahan hingga 2 jam per charging, cukup untuk akuarium hingga 200 liter.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    boxShadow: '0 6px 20px rgba(15, 91, 229, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Check className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Material Anti-Karat & Waterproof</h3>
                  <p className="text-sm" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>
                    Didesain khusus untuk lingkungan air dengan material berkualitas tinggi yang tahan lama dan aman untuk ikan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    boxShadow: '0 6px 20px rgba(15, 91, 229, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Check className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Garansi 1 Tahun & Free Maintenance</h3>
                  <p className="text-sm" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>
                    Dapatkan garansi resmi 1 tahun dan layanan maintenance gratis untuk memastikan robot selalu dalam kondisi optimal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div 
            className="rounded-[40px] p-8 md:p-12 mb-16 transition-all duration-300 relative overflow-hidden bubble-card"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(15, 91, 229, 0.3)',
              boxShadow: '0 12px 40px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(15, 91, 229, 0.3), 0 0 0 2px rgba(15, 91, 229, 0.4) inset';
              e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset';
              e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
            }}
          >
            {/* Multiple bubble glow effects */}
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                filter: 'blur(30px)'
              }}
            ></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255, 182, 193, 0.3), transparent 70%)',
                filter: 'blur(20px)'
              }}
            ></div>
            
            <h2 className="text-3xl mb-8 font-extrabold relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Spesifikasi Teknis</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 relative z-10">
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Dimensi</span>
                <span className="font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>18cm x 12cm x 8cm</span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Berat</span>
                <span className="font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>850 gram</span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Kapasitas Akuarium</span>
                <span className="font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>50-200 liter</span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Daya Baterai</span>
                <span className="font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>2500 mAh</span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Waktu Charging</span>
                <span className="font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>3-4 jam</span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Durasi Operasi</span>
                <span className="font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>120 menit</span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Sensor</span>
                <span className="font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>pH, Suhu, TDS</span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Konektivitas</span>
                <span className="font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>WiFi, Bluetooth</span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Material</span>
                <span className="font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>ABS + Stainless Steel</span>
              </div>
              <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
                <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Garansi</span>
                <span className="font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>1 Tahun Resmi</span>
              </div>
            </div>
          </div>

          {/* What's in the Box */}
          <div 
            className="rounded-[40px] p-8 md:p-12 mb-16 transition-all duration-300 relative overflow-hidden bubble-card"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(15, 91, 229, 0.3)',
              boxShadow: '0 12px 40px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(15, 91, 229, 0.3), 0 0 0 2px rgba(15, 91, 229, 0.4) inset';
              e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 91, 229, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset';
              e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
            }}
          >
            {/* Multiple bubble glow effects */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                filter: 'blur(30px)'
              }}
            ></div>
            <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255, 182, 193, 0.3), transparent 70%)',
                filter: 'blur(20px)'
              }}
            ></div>
            
            <h2 className="text-3xl mb-8 font-extrabold relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>Isi Paket</h2>
            <div className="grid md:grid-cols-2 gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(15, 91, 229, 0.3)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span>1</span>
                </div>
                <span style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>Robot Pembersih Akuarium</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(15, 91, 229, 0.3)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span>2</span>
                </div>
                <span style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>Charging Dock & Kabel USB</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(15, 91, 229, 0.3)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span>3</span>
                </div>
                <span style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>Brush Cadangan (2 pcs)</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(15, 91, 229, 0.3)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span>4</span>
                </div>
                <span style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>User Manual (ID & EN)</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(15, 91, 229, 0.3)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span>5</span>
                </div>
                <span style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>Kartu Garansi Resmi</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(15, 91, 229, 0.3)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span>6</span>
                </div>
                <span style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>Sticker & Quick Start Guide</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div 
            className="rounded-[40px] p-12 text-center text-white relative overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 12px 40px rgba(15, 91, 229, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 16px 50px rgba(15, 91, 229, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3) inset';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 91, 229, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset';
            }}
          >
            {/* Decorative bubbles */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%)', filter: 'blur(40px)' }}></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255, 182, 193, 0.3), transparent 70%)', filter: 'blur(35px)' }}></div>
            
            <h2 className="text-3xl md:text-4xl mb-4 font-extrabold relative z-10" style={{ fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>Siap Menjadikan Akuarium Anda Lebih Smart?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto relative z-10" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 500 }}>
              Bergabunglah dengan 9,000+ pengguna yang telah mempercayai Robot Temanikan untuk perawatan akuarium mereka
            </p>
            <button 
              onClick={handleBuyNow}
              className="px-8 py-4 rounded-full font-bold transition-all duration-300 bubble-button inline-flex items-center gap-2 relative z-10"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                color: '#133E87',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              }}
            >
              <ShoppingCart className="w-5 h-5" />
              Beli Sekarang - Rp 2.499.000
            </button>
          </div>
        </div>
      </main>

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
                  <Fish className="w-6 h-6" style={{ color: '#0F5BE5' }} />
                </div>
                <span 
                  className="text-2xl font-extrabold" 
                  style={{ 
                    fontFamily: 'Allura, cursive',
                    color: '#0F5BE5',
                    textShadow: '0 2px 8px rgba(15, 91, 229, 0.2)'
                  }}
                >
                  Temanikan
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
                  <button 
                    onClick={handleNavigateHome} 
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
                    Beranda
                  </button>
                </li>
                <li>
                  <a 
                    href="/#tentang" 
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
                    href="/#fitur" 
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
                  <a 
                    href="/produk" 
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
                    Produk
                  </a>
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
  );
}