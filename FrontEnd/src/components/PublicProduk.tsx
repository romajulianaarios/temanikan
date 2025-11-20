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
    }
  };

  const handleBuyNow = () => {
    // Check if logged in, else show login modal
    handleAuthClick('login');
  };

  return (
    <div className="min-h-screen bg-[#F3F3E0] flex flex-col">
      {/* Global Navbar */}
      <Navbar onAuthClick={onAuthClick} onSmartNavigate={onSmartNavigate} />

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <button onClick={handleNavigateHome} className="hover:text-[#608BC1]">Beranda</button>
              <span>/</span>
              <span className="text-[#608BC1]">Produk</span>
            </nav>
          </div>

          {/* Product Header */}
          <div className="mb-12">
            <div className="inline-block px-4 py-2 bg-[#CBDCEB] text-[#133E87] rounded-full text-sm mb-4">
              Produk Unggulan
            </div>
            <h1 className="text-4xl md:text-5xl mb-4">Robot Temanikan</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Solusi terpadu untuk perawatan akuarium modern Anda. Dilengkapi dengan teknologi canggih yang memudahkan pemeliharaan ikan hias.
            </p>
          </div>

          {/* Product Content */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1583899282521-0e5965167d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcml1bSUyMHJvYm90JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjMzNTA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Robot Temanikan"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Product Badge */}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm shadow-lg">
                ✨ Best Seller
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500 line-through">Rp 3.499.000</span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">Hemat 29%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl text-[#133E87]">Rp 2.499.000</span>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-gray-600">
                    Robot Pembersih Akuarium Otomatis dengan AI Navigation dan monitoring kualitas air terintegrasi.
                  </p>
                </div>

                <button 
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-[#608BC1] text-white rounded-full hover:bg-[#133E87] transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Beli Sekarang
                </button>

                <p className="text-sm text-center text-gray-500">
                  * Memerlukan login untuk melakukan pemesanan
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl shadow">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-xs text-gray-600">Garansi 1 Tahun</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow">
                  <div className="text-2xl mb-1">🚚</div>
                  <div className="text-xs text-gray-600">Gratis Ongkir</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow">
                  <div className="text-2xl mb-1">🔧</div>
                  <div className="text-xs text-gray-600">Free Maintenance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
            <h2 className="text-3xl mb-8">Fitur Unggulan</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2">Pembersihan Otomatis dengan AI Navigation</h3>
                  <p className="text-sm text-gray-600">
                    Teknologi AI canggih memungkinkan robot bergerak optimal di dalam akuarium tanpa melukai ikan atau merusak tanaman hias.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2">Sensor Kualitas Air Terintegrasi</h3>
                  <p className="text-sm text-gray-600">
                    Monitoring real-time parameter air (pH, Suhu, TDS) langsung dari smartphone dengan notifikasi otomatis jika ada anomali.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2">Kontrol via Smartphone (iOS & Android)</h3>
                  <p className="text-sm text-gray-600">
                    Aplikasi mobile user-friendly untuk mengontrol robot, menjadwalkan pembersihan, dan memantau kualitas air dari mana saja.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2">Baterai Tahan Lama (120 Menit)</h3>
                  <p className="text-sm text-gray-600">
                    Baterai lithium berkualitas tinggi dengan daya tahan hingga 2 jam per charging, cukup untuk akuarium hingga 200 liter.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2">Material Anti-Karat & Waterproof</h3>
                  <p className="text-sm text-gray-600">
                    Didesain khusus untuk lingkungan air dengan material berkualitas tinggi yang tahan lama dan aman untuk ikan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#608BC1] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2">Garansi 1 Tahun & Free Maintenance</h3>
                  <p className="text-sm text-gray-600">
                    Dapatkan garansi resmi 1 tahun dan layanan maintenance gratis untuk memastikan robot selalu dalam kondisi optimal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
            <h2 className="text-3xl mb-8">Spesifikasi Teknis</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Dimensi</span>
                <span className="font-medium">18cm x 12cm x 8cm</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Berat</span>
                <span className="font-medium">850 gram</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Kapasitas Akuarium</span>
                <span className="font-medium">50-200 liter</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Daya Baterai</span>
                <span className="font-medium">2500 mAh</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Waktu Charging</span>
                <span className="font-medium">3-4 jam</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Durasi Operasi</span>
                <span className="font-medium">120 menit</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Sensor</span>
                <span className="font-medium">pH, Suhu, TDS</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Konektivitas</span>
                <span className="font-medium">WiFi, Bluetooth</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Material</span>
                <span className="font-medium">ABS + Stainless Steel</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Garansi</span>
                <span className="font-medium">1 Tahun Resmi</span>
              </div>
            </div>
          </div>

          {/* What's in the Box */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
            <h2 className="text-3xl mb-8">Isi Paket</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#CBDCEB] rounded-full flex items-center justify-center">
                  <span className="text-[#133E87]">1</span>
                </div>
                <span className="text-gray-600">Robot Pembersih Akuarium</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#CBDCEB] rounded-full flex items-center justify-center">
                  <span className="text-[#133E87]">2</span>
                </div>
                <span className="text-gray-600">Charging Dock & Kabel USB</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#CBDCEB] rounded-full flex items-center justify-center">
                  <span className="text-[#133E87]">3</span>
                </div>
                <span className="text-gray-600">Brush Cadangan (2 pcs)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#CBDCEB] rounded-full flex items-center justify-center">
                  <span className="text-[#133E87]">4</span>
                </div>
                <span className="text-gray-600">User Manual (ID & EN)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#CBDCEB] rounded-full flex items-center justify-center">
                  <span className="text-[#133E87]">5</span>
                </div>
                <span className="text-gray-600">Kartu Garansi Resmi</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#CBDCEB] rounded-full flex items-center justify-center">
                  <span className="text-[#133E87]">6</span>
                </div>
                <span className="text-gray-600">Sticker & Quick Start Guide</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#608BC1] to-[#133E87] rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl mb-4">Siap Menjadikan Akuarium Anda Lebih Smart?</h2>
            <p className="text-lg text-[#CBDCEB] mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan 9,000+ pengguna yang telah mempercayai Robot Temanikan untuk perawatan akuarium mereka
            </p>
            <button 
              onClick={handleBuyNow}
              className="px-8 py-4 bg-white text-[#133E87] rounded-full hover:bg-[#CBDCEB] transition-colors inline-flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Beli Sekarang - Rp 2.499.000
            </button>
          </div>
        </div>
      </main>

      {/* Landing Page Footer */}
      <footer className="bg-[#133E87] text-white py-12 border-t border-[#608BC1] mt-12">
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
                <li><button onClick={handleNavigateHome} className="text-[#CBDCEB] hover:text-white transition-colors">Beranda</button></li>
                <li><a href="/#tentang" className="text-[#CBDCEB] hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="/fishpedia" className="text-[#CBDCEB] hover:text-white transition-colors">Fishpedia</a></li>
                <li><a href="/#fitur" className="text-[#CBDCEB] hover:text-white transition-colors">Fitur</a></li>
                <li><a href="/produk" className="text-[#CBDCEB] hover:text-white transition-colors">Produk</a></li>
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