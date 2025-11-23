import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Fish, Droplet, Activity, Bot, Search, Menu, X, ChevronRight, Star, MessageSquare, Users, Quote, Clock, CheckCircle } from './icons';
import Navbar from './Navbar';
import landingPageImage from '../assets/Landingpage_Ikan.png';

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
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #dbeafe 0%, #cfe2ff 10%, #bfdbfe 20%, #bfdbfe 30%, #a5d8ff 40%, #93c5fd 50%, #93c5fd 60%, #a5d8ff 70%, #bfdbfe 80%, #cfe2ff 90%, #dbeafe 100%)' }}>
      {/* Header/Navigation */}
      <Navbar onAuthClick={onAuthClick} onSmartNavigate={onSmartNavigate} />
      
      {/* Hero Section */}
      <section id="beranda" className="relative py-8 sm:py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F5BE5] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD6D6] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="md:ml-[-2.5cm]">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 font-bold" style={{ color: '#000000' }}>
                Platform Edukasi, Komunitas, dan Monitoring Ikan Hias Berbasis Machine Learning
              </h1>
              {/* Decorative curved line */}
              <div className="mb-4 sm:mb-6">
                <svg className="w-full max-w-[300px] sm:max-w-[400px]" height="16" viewBox="0 0 400 16" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                  <path 
                    d="M0 8C60 0, 140 0, 200 8C260 16, 340 16, 400 8" 
                    stroke="#0F5BE5" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    style={{ opacity: 0.9 }}
                  />
                </svg>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Rawat ikan hiasmu dengan cerdas! Temanikan sebagai solusi edukatif, komunitas aktif, dan sistem monitoring akuarium pintar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                <button 
                  onClick={() => handleAuthClick('register')}
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#0D4BC4] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-bold text-sm sm:text-base hover:scale-105 hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#78B0E8', color: '#000000' }}
                >
                  Mulai Sekarang
                </button>
                <a 
                  href="#tentang"
                  onClick={(e) => handleSmartNavigation(e, 'tentang')}
                  className="flex items-center text-sm sm:text-base text-gray-600 hover:text-[#0F5BE5] transition-colors underline decoration-gray-400 hover:decoration-[#0F5BE5] font-medium cursor-pointer"
                >
                  Pelajari Selengkapnya
                </a>
              </div>
            </div>
            <div className="relative md:ml-[3cm] md:mt-[-1.5cm] mt-6 md:mt-0 order-first md:order-last">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl">
                <ImageWithFallback
                  src={landingPageImage}
                  alt="Beautiful Underwater Aquarium Scene with Colorful Fish and Corals"
                  className="w-full h-auto"
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
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-4 px-2">
              Lebih dari 10.000 penghobi ikan telah bergabung di Temanikan 🐠
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Komunitas kami terus tumbuh! Temanikan dipercaya oleh pecinta ikan hias di seluruh Indonesia untuk belajar, berdiskusi, dan memantau akuarium secara cerdas.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {/* Card 1: Pengguna */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md text-center hover:bg-blue-50 transition-colors">
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: '#78B0E8' }} />
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Pengguna</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-black">10K+</div>
            </div>

            {/* Card 2: Waktu */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md text-center hover:bg-blue-50 transition-colors">
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: '#78B0E8' }} />
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Waktu</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-black">1K jam</div>
            </div>

            {/* Card 3: Ikan */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md text-center hover:bg-blue-50 transition-colors">
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
                <Fish className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: '#78B0E8' }} />
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Ikan</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-black">500+Spesies</div>
            </div>

            {/* Card 4: Robot */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md text-center hover:bg-blue-50 transition-colors">
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
                <Bot className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: '#78B0E8' }} />
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Robot</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-black">9000+Robot</div>
            </div>

            {/* Card 5: Akurasi */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md text-center hover:bg-blue-50 transition-colors">
              <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: '#78B0E8' }} />
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Akurasi</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-black">95%Terdeteksi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section id="tentang" className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl mb-4 sm:mb-6" style={{ color: '#0F5BE5' }}>Tentang Temanikan</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
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
                <p className="text-sm text-gray-500">Dipercaya oleh 10,000+ pengguna di Indonesia</p>
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

      {/* Fitur Section */}
      <section id="fitur" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl mb-4">Mengapa Memilih Temanikan?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Platform lengkap dengan teknologi Machine Learning untuk perawatan ikan hias yang lebih cerdas dan efektif
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:bg-[#FFD6D6] hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#0F5BE5] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-4" style={{ color: '#0F5BE5' }}>Diagnosa ML</h3>
              <p className="text-gray-600">
                Deteksi penyakit ikan secara otomatis menggunakan teknologi Machine Learning dengan akurasi hingga 95%. Upload foto ikan dan dapatkan diagnosis instan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:bg-[#FFD6D6] hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#0F5BE5] rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-4" style={{ color: '#0F5BE5' }}>Monitoring Kualitas Air</h3>
              <p className="text-gray-600">
                Pantau parameter air seperti suhu, pH, dan TDS secara real-time melalui dashboard. Dapatkan notifikasi otomatis jika ada parameter yang tidak normal.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:bg-[#FFD6D6] hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#0F5BE5] rounded-full flex items-center justify-center mx-auto mb-6">
                <Fish className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-4" style={{ color: '#0F5BE5' }}>Komunitas Pecinta Ikan</h3>
              <p className="text-gray-600">
                Bergabung dengan ribuan pecinta ikan hias. Berbagi pengalaman, bertanya, dan berdiskusi tentang perawatan ikan favorit Anda.
              </p>
            </div>
          </div>

          {/* Additional Features List */}
          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-100 hover:bg-[#FFD6D6] transition-colors">
              <div className="w-10 h-10 bg-[#0F5BE5] rounded-full flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="mb-2" style={{ color: '#0F5BE5' }}>Deteksi Penyakit Ikan</h4>
                <p className="text-sm text-gray-600">Identifikasi penyakit ikan dengan akurat menggunakan AI</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-100 hover:bg-[#FFD6D6] transition-colors">
              <div className="w-10 h-10 bg-[#0F5BE5] rounded-full flex items-center justify-center flex-shrink-0">
                <Fish className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="mb-2" style={{ color: '#0F5BE5' }}>FishPedia</h4>
                <p className="text-sm text-gray-600">Ensiklopedia lengkap 500+ spesies ikan hias</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-100 hover:bg-[#FFD6D6] transition-colors">
              <div className="w-10 h-10 bg-[#0F5BE5] rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="mb-2" style={{ color: '#0F5BE5' }}>Kontrol Robot</h4>
                <p className="text-sm text-gray-600">Kendalikan robot pembersih akuarium dari smartphone</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-100 hover:bg-[#FFD6D6] transition-colors">
              <div className="w-10 h-10 bg-[#0F5BE5] rounded-full flex items-center justify-center flex-shrink-0">
                <Droplet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="mb-2" style={{ color: '#0F5BE5' }}>Monitoring Air</h4>
                <p className="text-sm text-gray-600">Pantau kualitas air 24/7 dengan sensor IoT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forum Section (Teaser) */}
      <section id="forum" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl mb-4" style={{ color: '#0F5BE5' }}>Forum Komunitas Temanikan</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Bergabunglah dengan komunitas pecinta ikan hias terbesar di Indonesia. Berbagi pengalaman, bertanya, dan berdiskusi dengan sesama aquarist.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Forum Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:bg-[#FFD6D6] hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0F5BE5] rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl mb-3" style={{ color: '#0F5BE5' }}>Diskusi Interaktif</h3>
                  <p className="text-gray-600">
                    Tanyakan apa saja tentang perawatan ikan hias, penyakit, atau tips membangun akuarium. Dapatkan jawaban dari komunitas yang berpengalaman.
                  </p>
                </div>
              </div>
            </div>

            {/* Forum Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:bg-[#FFD6D6] hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0F5BE5] rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl mb-3" style={{ color: '#0F5BE5' }}>Komunitas Aktif</h3>
                  <p className="text-gray-600">
                    10,000+ anggota aktif siap membantu Anda. Dari pemula hingga expert, semua berkumpul untuk berbagi passion tentang ikan hias.
                  </p>
                </div>
              </div>
            </div>

            {/* Forum Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:bg-[#FFD6D6] hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0F5BE5] rounded-full flex items-center justify-center flex-shrink-0">
                  <Fish className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl mb-3" style={{ color: '#0F5BE5' }}>Tips & Trik Perawatan</h3>
                  <p className="text-gray-600">
                    Akses ribuan thread diskusi tentang perawatan ikan, teknik breeding, water parameters, dan berbagai tips dari para ahli.
                  </p>
                </div>
              </div>
            </div>

            {/* Forum Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:bg-[#FFD6D6] hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0F5BE5] rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl mb-3" style={{ color: '#0F5BE5' }}>Update Real-time</h3>
                  <p className="text-gray-600">
                    Dapatkan notifikasi real-time ketika ada balasan di thread Anda. Ikuti topik favorit dan jangan lewatkan diskusi menarik.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Forum Stats */}
          <div className="grid grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="text-3xl text-[#0F5BE5] mb-2 font-bold">10K+</div>
              <div className="text-sm text-gray-600">Anggota Aktif</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="text-3xl text-[#0F5BE5] mb-2 font-bold">5K+</div>
              <div className="text-sm text-gray-600">Topik Diskusi</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="text-3xl text-[#0F5BE5] mb-2 font-bold">50K+</div>
              <div className="text-sm text-gray-600">Komentar</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button 
              onClick={() => handleAuthClick('login')}
              className="px-8 py-4 bg-[#0F5BE5] text-white rounded-full hover:bg-[#0D4BC4] transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              Bergabung dengan Forum
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-500 mt-4">* Login diperlukan untuk mengakses forum</p>
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
      <section id="testimoni" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl mb-4">Apa Kata Mereka?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl mb-6 text-black">
            Siap Memulai Perjalanan Anda?
          </h2>
          <p className="text-lg md:text-xl text-black mb-8">
            Bergabunglah dengan 10,000+ pecinta ikan hias yang telah mempercayai Temanikan untuk perawatan akuarium mereka
          </p>
          <button 
            onClick={() => handleAuthClick('register')}
            className="px-8 py-4 text-white rounded-full hover:shadow-lg transition-all duration-300 font-semibold shadow-md"
            style={{ backgroundColor: '#3B82F6' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
          >
            Daftar Gratis Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-black py-12 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Column 1 - Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Fish className="w-8 h-8 text-black" />
                <span className="text-2xl text-black" style={{ fontFamily: 'Allura, cursive' }}>Temanikan</span>
              </div>
              <p className="text-sm text-black">
                Platform edukasi, komunitas, dan monitoring ikan hias berbasis Machine Learning
              </p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h3 className="mb-4 text-black">Navigasi Cepat</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#tentang" className="text-black hover:text-gray-600 transition-colors">Tentang Kami</a></li>
                <li><button onClick={handleNavigateToFishpedia} className="text-black hover:text-gray-600 transition-colors">Fishpedia</button></li>
                <li><a href="#fitur" className="text-black hover:text-gray-600 transition-colors">Fitur</a></li>
                <li><button onClick={handleNavigateToProduk} className="text-black hover:text-gray-600 transition-colors">Produk</button></li>
              </ul>
            </div>

            {/* Column 3 - Support */}
            <div>
              <h3 className="mb-4 text-black">Dukungan</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">FAQ</a></li>
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">Kontak</a></li>
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">Bantuan</a></li>
                <li><a href="#" className="text-black hover:text-gray-600 transition-colors">Dokumentasi</a></li>
              </ul>
            </div>

            {/* Column 4 - Social Media */}
            <div>
              <h3 className="mb-4 text-black">Ikuti Kami</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-[#78B0E8] rounded-full flex items-center justify-center hover:bg-[#0F5BE5] transition-colors text-black">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#78B0E8] rounded-full flex items-center justify-center hover:bg-[#0F5BE5] transition-colors text-black">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#78B0E8] rounded-full flex items-center justify-center hover:bg-[#0F5BE5] transition-colors text-black">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-black">
            <p>© 2025 Temanikan. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-black hover:text-gray-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-black hover:text-gray-600 transition-colors">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}