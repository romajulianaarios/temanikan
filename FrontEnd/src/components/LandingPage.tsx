import { Eye, BookOpen, Users, Menu, X, Star, Mail, MapPin, ArrowRight, ShoppingCart, CheckCircle } from './icons';
import logo from '../assets/logo_temanikan.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import AuthModal from './AuthModal';
import { useAuth } from './AuthContext';
import { useNavigate } from './Router';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all sections with scroll-animated class
    const animatedElements = document.querySelectorAll('.scroll-animated');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openAuthModal = (mode: 'login' | 'register', redirectTo?: string) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    if (redirectTo) {
      setRedirectAfterLogin(redirectTo);
    }
  };

  const handleBuyNow = () => {
    if (isLoggedIn) {
      navigate('/member/orders');
    } else {
      openAuthModal('login', '/member/orders');
    }
  };

  const features = [
    {
      icon: Eye,
      title: 'Deteksi Penyakit Ikan',
      description: 'Sistem computer vision canggih untuk mendeteksi penyakit ikan hias Anda secara otomatis dan memberikan rekomendasi penanganan.'
    },
    {
      icon: BookOpen,
      title: 'Fishpedia',
      description: 'Ensiklopedia lengkap tentang berbagai jenis ikan hias, panduan perawatan, dan tips memelihara akuarium yang sehat.'
    },
    {
      icon: Users,
      title: 'Forum Komunitas',
      description: 'Bergabung dengan komunitas pecinta ikan hias, berbagi pengalaman, dan dapatkan saran dari para ahli dan hobbyist.'
    }
  ];

  const testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Pecinta Ikan Hias',
      text: 'Temanikan sangat membantu saya dalam merawat akuarium. Deteksi penyakit otomatisnya sangat akurat!',
      rating: 5
    },
    {
      name: 'Siti Nurhaliza',
      role: 'Pemilik Toko Ikan',
      text: 'Platform yang luar biasa! Fishpedia-nya sangat lengkap dan membantu pelanggan saya.',
      rating: 5
    },
    {
      name: 'Ahmad Wijaya',
      role: 'Pemula Akuarium',
      text: 'Sebagai pemula, Temanikan membuat saya lebih percaya diri dalam memelihara ikan hias.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 shadow-sm bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src={logo} alt="Temanikan Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl" style={{ color: '#133E87' }}>temanikan</span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#beranda" className="nav-link" style={{ color: '#133E87' }}>Beranda</a>
              <a href="#tentang" className="nav-link" style={{ color: '#133E87' }}>Tentang Kami</a>
              <a href="#fitur" className="nav-link" style={{ color: '#133E87' }}>Fitur</a>
              <a href="#produk" className="nav-link" style={{ color: '#133E87' }}>Produk</a>
              <a href="#fishpedia" className="nav-link" style={{ color: '#133E87' }}>Fishpedia</a>
              <a href="#testimoni" className="nav-link" style={{ color: '#133E87' }}>Testimoni</a>
              <Button 
                className="text-white btn-hover-lift" 
                style={{ backgroundColor: '#133E87' }}
                onClick={() => openAuthModal('login')}
              >
                Login / Daftar
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: '#133E87' }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-4">
              <a href="#beranda" className="hover:opacity-80" style={{ color: '#133E87' }}>Beranda</a>
              <a href="#tentang" className="hover:opacity-80" style={{ color: '#133E87' }}>Tentang Kami</a>
              <a href="#fitur" className="hover:opacity-80" style={{ color: '#133E87' }}>Fitur</a>
              <a href="#produk" className="hover:opacity-80" style={{ color: '#133E87' }}>Produk</a>
              <a href="#fishpedia" className="hover:opacity-80" style={{ color: '#133E87' }}>Fishpedia</a>
              <a href="#testimoni" className="hover:opacity-80" style={{ color: '#133E87' }}>Testimoni</a>
              <Button 
                className="w-full text-white" 
                style={{ backgroundColor: '#133E87' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
              >
                Login / Daftar
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - New Two Column Layout */}
      <section id="beranda" className="relative py-20 bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="scroll-animated animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl mb-6" style={{ color: '#133E87' }}>
                Temanikan, solusi cerdas pelihara ikan hias.
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-700">
                Platform edukasi, komunitas, dan monitoring akuarium dan ikan hias berbasis computer vision.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  className="px-8 py-6 text-lg border-2 btn-hover-scale"
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: '#133E87',
                    borderColor: '#133E87'
                  }}
                  onClick={() => scrollToSection('tentang')}
                >
                  Pelajari Lebih Lanjut
                </Button>
                <Button 
                  className="text-white px-8 py-6 text-lg btn-hover-lift"
                  style={{ backgroundColor: '#133E87' }}
                  onClick={() => openAuthModal('register')}
                >
                  Mulai Sekarang
                </Button>
              </div>

              {/* Trust Signals - Integrated into Hero */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-2xl md:text-3xl mb-1" style={{ color: '#133E87' }}>95%+</p>
                  <p className="text-sm text-gray-600">Akurasi Deteksi</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl mb-1" style={{ color: '#133E87' }}>10K+</p>
                  <p className="text-sm text-gray-600">Jam Monitoring</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl mb-1" style={{ color: '#133E87' }}>1.000+</p>
                  <p className="text-sm text-gray-600">Pengguna Aktif</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl mb-1" style={{ color: '#133E87' }}>500+</p>
                  <p className="text-sm text-gray-600">Robot Terpasang</p>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="scroll-animated animate-fade-in-up stagger-1">
              <div className="rounded-2xl overflow-hidden floating-shadow">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1636045466232-539c7bd7817e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcml1bSUyMGZpc2glMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjI4Mzg4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Beautiful Aquarium with Colorful Fish"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section id="tentang" className="py-20 scroll-animated animate-fade-in" style={{ backgroundColor: '#F3F3E0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="scroll-animated animate-slide-in-left">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1537017469405-7faf1912af7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcml1bSUyMHRlY2hub2xvZ3klMjBibHVlcHJpbnR8ZW58MXx8fHwxNzYyMjQyMzk4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Temanikan Robot System"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="scroll-animated animate-slide-in-right">
              <h2 className="text-3xl md:text-4xl mb-6" style={{ color: '#133E87' }}>
                Tentang Temanikan: Revolusi Perawatan Akuarium Anda
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Temanikan adalah platform inovatif yang mengintegrasikan teknologi computer vision dan robotika untuk membantu Anda merawat akuarium dengan lebih mudah dan efisien.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Dengan robot pembersih otomatis, sistem deteksi penyakit canggih, dan monitoring kualitas air real-time, Temanikan memastikan ikan hias Anda selalu sehat dan lingkungan akuarium tetap optimal.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Bergabunglah dengan komunitas pecinta ikan hias dan akses ensiklopedia lengkap untuk menjadi ahli perawatan akuarium.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="py-20 scroll-animated animate-fade-in" style={{ backgroundColor: '#CBDCEB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl text-center mb-12 scroll-animated animate-fade-in-up" style={{ color: '#133E87' }}>
            Fitur Unggulan Temanikan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`p-8 rounded-lg card-hover-interactive text-left w-full scroll-animated animate-fade-in-up stagger-${index + 1}`}
                style={{ backgroundColor: '#F3F3E0' }}
                onClick={() => openAuthModal('login')}
              >
                <feature.icon 
                  className="w-16 h-16 mb-4" 
                  style={{ color: '#608BC1' }}
                />
                <h3 className="text-xl mb-4" style={{ color: '#133E87' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Produk Section */}
      <section id="produk" className="py-20 scroll-animated animate-fade-in" style={{ backgroundColor: '#F3F3E0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 scroll-animated animate-slide-in-left">
              <h2 className="text-3xl md:text-4xl mb-6" style={{ color: '#133E87' }}>
                Produk Unggulan: Robot Temanikan
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Robot Temanikan adalah solusi terpadu untuk perawatan akuarium modern Anda. Dilengkapi dengan teknologi canggih yang memudahkan pemeliharaan ikan hias.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full" style={{ backgroundColor: '#CBDCEB' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: '#133E87' }} />
                  </div>
                  <div>
                    <h4 style={{ color: '#133E87' }}>Pembersihan Otomatis</h4>
                    <p className="text-gray-600 text-sm">Robot membersihkan akuarium secara berkala, menjaga kebersihan tanpa campur tangan manual</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full" style={{ backgroundColor: '#CBDCEB' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: '#133E87' }} />
                  </div>
                  <div>
                    <h4 style={{ color: '#133E87' }}>Monitoring Real-Time</h4>
                    <p className="text-gray-600 text-sm">Pantau kualitas air (pH, suhu, kekeruhan) secara langsung melalui dashboard</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full" style={{ backgroundColor: '#CBDCEB' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: '#133E87' }} />
                  </div>
                  <div>
                    <h4 style={{ color: '#133E87' }}>Deteksi Penyakit AI</h4>
                    <p className="text-gray-600 text-sm">Sistem computer vision mendeteksi penyakit ikan secara dini dan memberikan rekomendasi penanganan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full" style={{ backgroundColor: '#CBDCEB' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: '#133E87' }} />
                  </div>
                  <div>
                    <h4 style={{ color: '#133E87' }}>Kontrol Jarak Jauh</h4>
                    <p className="text-gray-600 text-sm">Atur jadwal pembersihan dan monitor akuarium dari mana saja melalui aplikasi</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Harga Spesial</p>
                  <p className="text-3xl mb-4" style={{ color: '#133E87' }}>
                    Rp 2.500.000
                  </p>
                </div>
              </div>

              <Button 
                className="text-white px-8 py-6 text-lg w-full sm:w-auto btn-hover-lift"
                style={{ backgroundColor: '#133E87' }}
                onClick={handleBuyNow}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Beli Sekarang
              </Button>
            </div>

            <div className="order-1 md:order-2 scroll-animated animate-slide-in-right">
              <div className="rounded-lg overflow-hidden shadow-2xl image-hover-zoom">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1712512161600-cd767fcc37a1?w=800"
                  alt="Robot Temanikan Smart Aquarium Cleaner"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fishpedia Preview Section */}
      <section id="fishpedia" className="py-20 scroll-animated animate-fade-in" style={{ backgroundColor: '#CBDCEB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-6 scroll-animated animate-fade-in-up" style={{ color: '#133E87' }}>
            Jelajahi Fishpedia
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto scroll-animated animate-fade-in-up stagger-1">
            Akses informasi lengkap tentang ratusan jenis ikan hias, panduan perawatan, dan tips membangun ekosistem akuarium yang sempurna.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Ikan Koi */}
            <button
              onClick={() => openAuthModal('login')}
              className="card-hover-interactive rounded-lg overflow-hidden text-left scroll-animated animate-fade-in-up stagger-1"
              style={{ backgroundColor: 'white' }}
            >
              <div className="w-full h-48 overflow-hidden image-hover-zoom">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1701738504736-8f8e53148b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb2klMjBmaXNoJTIwcG9uZHxlbnwxfHx8fDE3NjIyNTI1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Ikan Koi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 style={{ color: '#133E87' }}>Ikan Koi</h4>
                <p className="text-sm italic text-gray-600 mb-3">Cyprinus carpio</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ukuran:</span>
                    <span style={{ color: '#133E87' }}>60-90 cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suhu:</span>
                    <span style={{ color: '#133E87' }}>15-25°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">pH:</span>
                    <span style={{ color: '#133E87' }}>6.8-7.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sifat:</span>
                    <span style={{ color: '#133E87' }}>Damai</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Ikan Cupang */}
            <button
              onClick={() => openAuthModal('login')}
              className="card-hover-interactive rounded-lg overflow-hidden text-left scroll-animated animate-fade-in-up stagger-2"
              style={{ backgroundColor: 'white' }}
            >
              <div className="w-full h-48 overflow-hidden image-hover-zoom">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1553986187-9cb16fa33483?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXR0YSUyMGZpc2glMjBzaWFtZXNlfGVufDF8fHx8MTc2MjI1MjU4NXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Ikan Cupang"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 style={{ color: '#133E87' }}>Ikan Cupang</h4>
                <p className="text-sm italic text-gray-600 mb-3">Betta splendens</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ukuran:</span>
                    <span style={{ color: '#133E87' }}>5-7 cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suhu:</span>
                    <span style={{ color: '#133E87' }}>24-28°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">pH:</span>
                    <span style={{ color: '#133E87' }}>6.5-7.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sifat:</span>
                    <span style={{ color: '#133E87' }}>Agresif</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Ikan Guppy */}
            <button
              onClick={() => openAuthModal('login')}
              className="card-hover-interactive rounded-lg overflow-hidden text-left scroll-animated animate-fade-in-up stagger-3"
              style={{ backgroundColor: 'white' }}
            >
              <div className="w-full h-48 overflow-hidden image-hover-zoom">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1760256687633-069b7f56c9d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndXBweSUyMGZpc2glMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjIxNjYyMTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Ikan Guppy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 style={{ color: '#133E87' }}>Ikan Guppy</h4>
                <p className="text-sm italic text-gray-600 mb-3">Poecilia reticulata</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ukuran:</span>
                    <span style={{ color: '#133E87' }}>3-6 cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suhu:</span>
                    <span style={{ color: '#133E87' }}>22-28°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">pH:</span>
                    <span style={{ color: '#133E87' }}>6.8-7.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sifat:</span>
                    <span style={{ color: '#133E87' }}>Damai</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Lihat selengkapnya link - moved here */}
          <div className="text-center mt-8 scroll-animated animate-fade-in-up stagger-4">
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-2 hover:opacity-80 transition"
              style={{ color: '#608BC1' }}
            >
              <span>Lihat selengkapnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
      <section id="testimoni" className="py-20 scroll-animated animate-fade-in" style={{ backgroundColor: '#CBDCEB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl text-center mb-12 scroll-animated animate-fade-in-up" style={{ color: '#133E87' }}>
            Apa Kata Mereka Tentang Temanikan?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`p-6 rounded-lg scroll-animated animate-fade-in-up stagger-${index + 1}`}
                style={{ backgroundColor: '#F3F3E0' }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#608BC1' }} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p style={{ color: '#133E87' }}>{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-primary-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Temanikan Logo" className="w-6 h-6 object-contain" />
                <span style={{ color: '#F3F3E0' }}>temanikan</span>
              </div>
              <p className="text-sm" style={{ color: '#F3F3E0' }}>
                Solusi cerdas untuk perawatan akuarium dan ikan hias Anda.
              </p>
            </div>
            <div>
              <h4 className="mb-4" style={{ color: '#F3F3E0' }}>Link Cepat</h4>
              <div className="flex flex-col gap-2">
                <a href="#beranda" className="text-sm hover:opacity-80" style={{ color: '#F3F3E0' }}>Beranda</a>
                <a href="#tentang" className="text-sm hover:opacity-80" style={{ color: '#F3F3E0' }}>Tentang Kami</a>
                <a href="#fitur" className="text-sm hover:opacity-80" style={{ color: '#F3F3E0' }}>Fitur</a>
                <a href="#produk" className="text-sm hover:opacity-80" style={{ color: '#F3F3E0' }}>Produk</a>
                <a href="#" className="text-sm hover:opacity-80" style={{ color: '#F3F3E0' }}>Hubungi Kami</a>
              </div>
            </div>
            <div>
              <h4 className="mb-4" style={{ color: '#F3F3E0' }}>Kontak</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: '#F3F3E0' }} />
                  <span className="text-sm" style={{ color: '#F3F3E0' }}>info@temanikan.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: '#F3F3E0' }} />
                  <span className="text-sm" style={{ color: '#F3F3E0' }}>Jakarta, Indonesia</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t pt-8" style={{ borderColor: '#608BC1' }}>
            <p className="text-center text-sm" style={{ color: '#F3F3E0' }}>
              © 2025 Temanikan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        initialMode={authModalMode}
        redirectTo={redirectAfterLogin || undefined}
      />
    </div>
  );
}