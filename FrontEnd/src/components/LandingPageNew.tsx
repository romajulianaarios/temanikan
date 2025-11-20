import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Fish, Droplet, Activity, Bot, Search, Menu, X, ChevronRight, Star, MessageSquare, Users, Quote } from './icons';
import Navbar from './Navbar';

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
    <div className="min-h-screen bg-[#F3F3E0]">
      {/* Header/Navigation */}
      <Navbar onAuthClick={onAuthClick} onSmartNavigate={onSmartNavigate} />
      
      {/* Hero Section */}
      <section id="beranda" className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#608BC1] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CBDCEB] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
                Platform Edukasi, Komunitas, dan Monitoring Ikan Hias Berbasis Machine Learning
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Rawat ikan hiasmu dengan cerdas! Temanikan sebagai solusi edukatif, komunitas aktif, dan sistem monitoring akuarium pintar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleAuthClick('register')}
                  className="px-8 py-4 bg-[#608BC1] text-white rounded-full hover:bg-[#133E87] transition-colors flex items-center justify-center gap-2"
                >
                  Mulai Sekarang
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => handleSmartNavigation(e, 'tentang')}
                  className="px-8 py-4 border-2 border-[#608BC1] text-[#133E87] rounded-full hover:bg-[#608BC1] hover:text-white transition-colors"
                >
                  Pelajari Selengkapnya
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1631300692372-d96d2d13c20c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZpc2glMjBhcXVhcml1bXxlbnwxfHx8fDE3NjMzNTA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Tropical Fish Aquarium"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals / Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-[#F3F3E0]">
              <div className="text-3xl md:text-4xl text-[#133E87] mb-2">10K+</div>
              <div className="text-sm text-gray-600">Pengguna Aktif</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#F3F3E0]">
              <div className="text-3xl md:text-4xl text-[#133E87] mb-2">500+</div>
              <div className="text-sm text-gray-600">Spesies Ikan</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#F3F3E0]">
              <div className="text-3xl md:text-4xl text-[#133E87] mb-2">9000+</div>
              <div className="text-sm text-gray-600">Robot Terpasang</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-[#F3F3E0]">
              <div className="text-3xl md:text-4xl text-[#133E87] mb-2">95%</div>
              <div className="text-sm text-gray-600">Akurasi Deteksi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section id="tentang" className="py-16 md:py-24 bg-[#F3F3E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl mb-6">Tentang Temanikan</h2>
              <p className="text-lg text-gray-600 mb-6">
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
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Activity className="w-8 h-8 text-[#133E87] mb-4" />
                <h3 className="mb-2">Arsitektur Teknis</h3>
                <p className="text-sm text-gray-600">
                  Integrasi IoT dan Machine Learning untuk monitoring real-time
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Bot className="w-8 h-8 text-[#133E87] mb-4" />
                <h3 className="mb-2">Integrasi IoT</h3>
                <p className="text-sm text-gray-600">
                  ESP32-CAM mengirim data sensor ke database terpusat
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg col-span-2">
                <Search className="w-8 h-8 text-[#133E87] mb-4" />
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
      <section id="fitur" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl mb-4">Mengapa Memilih Temanikan?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Platform lengkap dengan teknologi Machine Learning untuk perawatan ikan hias yang lebih cerdas dan efektif
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-[#F3F3E0] hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#CBDCEB] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-[#133E87]" />
              </div>
              <h3 className="text-xl mb-4">Diagnosa ML</h3>
              <p className="text-gray-600">
                Deteksi penyakit ikan secara otomatis menggunakan teknologi Machine Learning dengan akurasi hingga 95%. Upload foto ikan dan dapatkan diagnosis instan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-[#F3F3E0] hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#CBDCEB] rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-[#133E87]" />
              </div>
              <h3 className="text-xl mb-4">Monitoring Kualitas Air</h3>
              <p className="text-gray-600">
                Pantau parameter air seperti suhu, pH, dan TDS secara real-time melalui dashboard. Dapatkan notifikasi otomatis jika ada parameter yang tidak normal.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-[#F3F3E0] hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#CBDCEB] rounded-full flex items-center justify-center mx-auto mb-6">
                <Fish className="w-8 h-8 text-[#133E87]" />
              </div>
              <h3 className="text-xl mb-4">Komunitas Pecinta Ikan</h3>
              <p className="text-gray-600">
                Bergabung dengan ribuan pecinta ikan hias. Berbagi pengalaman, bertanya, dan berdiskusi tentang perawatan ikan favorit Anda.
              </p>
            </div>
          </div>

          {/* Additional Features List */}
          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-[#F3F3E0]">
              <div className="w-10 h-10 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="mb-2">Deteksi Penyakit Ikan</h4>
                <p className="text-sm text-gray-600">Identifikasi penyakit ikan dengan akurat menggunakan AI</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-[#F3F3E0]">
              <div className="w-10 h-10 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                <Fish className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="mb-2">FishPedia</h4>
                <p className="text-sm text-gray-600">Ensiklopedia lengkap 500+ spesies ikan hias</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-[#F3F3E0]">
              <div className="w-10 h-10 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="mb-2">Kontrol Robot</h4>
                <p className="text-sm text-gray-600">Kendalikan robot pembersih akuarium dari smartphone</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-[#F3F3E0]">
              <div className="w-10 h-10 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                <Droplet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="mb-2">Monitoring Air</h4>
                <p className="text-sm text-gray-600">Pantau kualitas air 24/7 dengan sensor IoT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forum Section (Teaser) */}
      <section id="forum" className="py-16 md:py-24 bg-[#F3F3E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl mb-4">Forum Komunitas Temanikan</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Bergabunglah dengan komunitas pecinta ikan hias terbesar di Indonesia. Berbagi pengalaman, bertanya, dan berdiskusi dengan sesama aquarist.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Forum Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl mb-3">Diskusi Interaktif</h3>
                  <p className="text-gray-600">
                    Tanyakan apa saja tentang perawatan ikan hias, penyakit, atau tips membangun akuarium. Dapatkan jawaban dari komunitas yang berpengalaman.
                  </p>
                </div>
              </div>
            </div>

            {/* Forum Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl mb-3">Komunitas Aktif</h3>
                  <p className="text-gray-600">
                    10,000+ anggota aktif siap membantu Anda. Dari pemula hingga expert, semua berkumpul untuk berbagi passion tentang ikan hias.
                  </p>
                </div>
              </div>
            </div>

            {/* Forum Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                  <Fish className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl mb-3">Tips & Trik Perawatan</h3>
                  <p className="text-gray-600">
                    Akses ribuan thread diskusi tentang perawatan ikan, teknik breeding, water parameters, dan berbagai tips dari para ahli.
                  </p>
                </div>
              </div>
            </div>

            {/* Forum Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl mb-3">Update Real-time</h3>
                  <p className="text-gray-600">
                    Dapatkan notifikasi real-time ketika ada balasan di thread Anda. Ikuti topik favorit dan jangan lewatkan diskusi menarik.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Forum Stats */}
          <div className="grid grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-3xl text-[#133E87] mb-2">10K+</div>
              <div className="text-sm text-gray-600">Anggota Aktif</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-3xl text-[#133E87] mb-2">5K+</div>
              <div className="text-sm text-gray-600">Topik Diskusi</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-3xl text-[#133E87] mb-2">50K+</div>
              <div className="text-sm text-gray-600">Komentar</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button 
              onClick={() => handleAuthClick('login')}
              className="px-8 py-4 bg-[#608BC1] text-white rounded-full hover:bg-[#133E87] transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              Bergabung dengan Forum
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-500 mt-4">* Login diperlukan untuk mengakses forum</p>
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
      <section id="testimoni" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl mb-4">Apa Kata Mereka?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ribuan pengguna telah merasakan manfaat Temanikan dalam merawat ikan hias mereka. Simak pengalaman mereka!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#F3F3E0] p-8 rounded-2xl shadow-lg relative">
              <Quote className="w-10 h-10 text-[#608BC1] mb-4 opacity-50" />
              <p className="text-gray-600 mb-6">
                "Temanikan sangat membantu saya dalam merawat ikan cupang. Fitur deteksi penyakit menggunakan ML sangat akurat dan cepat. Sekarang saya tidak khawatir lagi!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center text-white">
                  <span>AW</span>
                </div>
                <div>
                  <h4 className="font-semibold">Andi Wijaya</h4>
                  <p className="text-sm text-gray-500">Aquarist - Jakarta</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#F3F3E0] p-8 rounded-2xl shadow-lg relative">
              <Quote className="w-10 h-10 text-[#608BC1] mb-4 opacity-50" />
              <p className="text-gray-600 mb-6">
                "Forum komunitas di Temanikan luar biasa! Saya belajar banyak dari para expert dan bisa sharing pengalaman breeding Guppy. Recommended banget!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center text-white">
                  <span>SP</span>
                </div>
                <div>
                  <h4 className="font-semibold">Siti Permata</h4>
                  <p className="text-sm text-gray-500">Breeder - Bandung</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#F3F3E0] p-8 rounded-2xl shadow-lg relative">
              <Quote className="w-10 h-10 text-[#608BC1] mb-4 opacity-50" />
              <p className="text-gray-600 mb-6">
                "Robot Temanikan menghemat waktu saya banget! Monitoring air otomatis dan pembersihan akuarium jadi lebih mudah. Worth it!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center text-white">
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
            <div className="bg-[#F3F3E0] p-8 rounded-2xl shadow-lg relative">
              <Quote className="w-10 h-10 text-[#608BC1] mb-4 opacity-50" />
              <p className="text-gray-600 mb-6">
                "Fishpedia sangat lengkap! Saya sebagai pemula terbantu sekali dengan informasi detail setiap spesies. Plus ada panduan perawatannya juga!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center text-white">
                  <span>RN</span>
                </div>
                <div>
                  <h4 className="font-semibold">Rina Novita</h4>
                  <p className="text-sm text-gray-500">Pemula - Yogyakarta</p>
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-[#F3F3E0] p-8 rounded-2xl shadow-lg relative">
              <Quote className="w-10 h-10 text-[#608BC1] mb-4 opacity-50" />
              <p className="text-gray-600 mb-6">
                "Dashboard monitoring real-time sangat membantu. Saya bisa pantau kualitas air dari kantor. Notifikasi otomatis juga sangat berguna!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center text-white">
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
      <section className="py-16 md:py-24 bg-[#133E87] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl mb-6">
            Siap Memulai Perjalanan Anda?
          </h2>
          <p className="text-lg md:text-xl text-[#CBDCEB] mb-8">
            Bergabunglah dengan 10,000+ pecinta ikan hias yang telah mempercayai Temanikan untuk perawatan akuarium mereka
          </p>
          <button 
            onClick={() => handleAuthClick('register')}
            className="px-8 py-4 bg-white text-[#133E87] rounded-full hover:bg-[#CBDCEB] transition-colors"
          >
            Daftar Gratis Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#133E87] text-white py-12 border-t border-[#608BC1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Column 1 - Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Fish className="w-8 h-8" />
                <span className="text-2xl" style={{ fontFamily: 'Allura, cursive' }}>Temanikan</span>
              </div>
              <p className="text-sm text-[#CBDCEB]">
                Platform edukasi, komunitas, dan monitoring ikan hias berbasis Machine Learning
              </p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h3 className="mb-4">Navigasi Cepat</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#tentang" className="text-[#CBDCEB] hover:text-white transition-colors">Tentang Kami</a></li>
                <li><button onClick={handleNavigateToFishpedia} className="text-[#CBDCEB] hover:text-white transition-colors">Fishpedia</button></li>
                <li><a href="#fitur" className="text-[#CBDCEB] hover:text-white transition-colors">Fitur</a></li>
                <li><button onClick={handleNavigateToProduk} className="text-[#CBDCEB] hover:text-white transition-colors">Produk</button></li>
              </ul>
            </div>

            {/* Column 3 - Support */}
            <div>
              <h3 className="mb-4">Dukungan</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#CBDCEB] hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-[#CBDCEB] hover:text-white transition-colors">Kontak</a></li>
                <li><a href="#" className="text-[#CBDCEB] hover:text-white transition-colors">Bantuan</a></li>
                <li><a href="#" className="text-[#CBDCEB] hover:text-white transition-colors">Dokumentasi</a></li>
              </ul>
            </div>

            {/* Column 4 - Social Media */}
            <div>
              <h3 className="mb-4">Ikuti Kami</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-[#608BC1] rounded-full flex items-center justify-center hover:bg-[#CBDCEB] transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#608BC1] rounded-full flex items-center justify-center hover:bg-[#CBDCEB] transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#608BC1] rounded-full flex items-center justify-center hover:bg-[#CBDCEB] transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#608BC1] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#CBDCEB]">
            <p>© 2025 Temanikan. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}