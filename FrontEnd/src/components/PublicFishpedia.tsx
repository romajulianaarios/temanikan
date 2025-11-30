import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Search, ChevronRight, Menu, X } from './icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Navbar from './Navbar';
import Fish3DBackground from './Fish3DBackground';
import { fishpediaAPI, buildAssetUrl } from '../services/api';
import logo from '../assets/logo_temanikan.png';

interface PublicFishpediaProps {
  onAuthClick?: (mode: 'login' | 'register') => void;
  onNavigateHome?: () => void;
  onSmartNavigate?: (target: string) => void;
}

interface FishSpecies {
  id: number;
  name: string;
  scientificName: string;
  category: string;
  difficulty: string;
  temperament?: string;
  size?: string;
  temperature?: string;
  ph?: string;
  description: string;
  imageUrl?: string;
  image?: string;
  detailedDescription?: string;
  family?: string;
  habitat?: string;
  diet?: string;
  lifespan?: string;
  phMin?: number;
  phMax?: number;
  tempMin?: number;
  tempMax?: number;
}

export default function PublicFishpedia({ onAuthClick, onNavigateHome, onSmartNavigate }: PublicFishpediaProps) {
  const [selectedFish, setSelectedFish] = useState<FishSpecies | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Semua');
  const [fishSpecies, setFishSpecies] = useState<FishSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch fish data from API
  useEffect(() => {
    fetchFishData();
  }, []);

  const fetchFishData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fishpediaAPI.getSpecies();
      
      if (response.success && response.species) {
        // Transform data dari backend ke format komponen
        const transformedData = response.species
          .filter((fish: any) => fish.status === 'published') // Hanya tampilkan yang published
          .map((fish: any) => ({
            id: fish.id,
            name: fish.name,
            scientificName: fish.scientificName,
            category: fish.category,
            difficulty: fish.difficulty,
            description: fish.description,
            habitat: fish.habitat,
            imageUrl: buildAssetUrl(fish.image),
            image: fish.image,
            ph: fish.phMin && fish.phMax ? `${fish.phMin}-${fish.phMax}` : '7.0',
            temperature: fish.tempMin && fish.tempMax ? `${fish.tempMin}-${fish.tempMax}°C` : '25°C',
            phMin: fish.phMin,
            phMax: fish.phMax,
            tempMin: fish.tempMin,
            tempMax: fish.tempMax,
            // Field tambahan dengan default values
            temperament: 'Damai',
            size: '10-15 cm',
            detailedDescription: fish.description,
            family: 'N/A',
            diet: 'Informasi diet tidak tersedia',
            lifespan: '3-5 tahun'
          }));
        setFishSpecies(transformedData);
      }
    } catch (err: any) {
      console.error('❌ Error fetching fish data:', err);
      setError('Gagal memuat data ikan');
    } finally {
      setLoading(false);
    }
  };

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

  const fishSpeciesHardcoded: FishSpecies[] = [
    {
      id: 1,
      name: 'Ikan Koi',
      scientificName: 'Cyprinus carpio',
      category: 'Air Tawar',
      difficulty: 'Menengah',
      temperament: 'Damai',
      size: '60-90 cm',
      temperature: '15-25°C',
      ph: '6.8-7.2',
      description: 'Ikan hias populer dari Jepang dengan berbagai pola warna yang indah.',
      imageUrl: 'https://images.unsplash.com/photo-1701738504736-8f8e53148b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb2klMjBmaXNoJTIwcG9uZHxlbnwxfHx8fDE3NjIyNTI1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      detailedDescription: 'Ikan hias populer dari Jepang dengan berbagai pola warna yang indah. Koi merupakan simbol keberuntungan, kemakmuran, dan umur panjang dalam budaya Jepang. Mereka memiliki kepribadian yang unik dan dapat mengenali pemiliknya. Koi dapat hidup hingga puluhan tahun dengan perawatan yang tepat dan dapat tumbuh sangat besar di kolam yang sesuai.',
      family: 'Cyprinidae',
      habitat: 'Kolam air tawar, sungai dengan arus tenang',
      diet: 'Omnivora - pelet ikan, sayuran, buah-buahan, dan serangga',
      lifespan: '25-35 tahun (dapat mencapai 100+ tahun dengan perawatan optimal)'
    },
    {
      id: 2,
      name: 'Ikan Cupang',
      scientificName: 'Betta splendens',
      category: 'Air Tawar',
      difficulty: 'Mudah',
      temperament: 'Agresif',
      size: '5-7 cm',
      temperature: '24-28°C',
      ph: '6.5-7.5',
      description: 'Ikan cantik dengan sirip mengembang, cocok untuk pemula.',
      imageUrl: 'https://images.unsplash.com/photo-1553986187-9cb16fa33483?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXR0YSUyMGZpc2glMjBzaWFtZXNlfGVufDF8fHx8MTc2MjI1MjU4NXww&ixlib=rb-4.1.0&q=80&w=1080',
      detailedDescription: 'Ikan cantik dengan sirip mengembang yang spektakuler, cocok untuk pemula. Berasal dari Thailand dan dikenal sebagai "Ikan Petarung Siam". Cupang jantan sangat teritorial dan akan bertarung dengan jantan lain. Mereka memiliki organ labirin yang memungkinkan mereka mengambil oksigen langsung dari udara, sehingga dapat hidup di perairan dengan oksigen rendah.',
      family: 'Osphronemidae',
      habitat: 'Sawah, rawa, dan sungai dangkal di Asia Tenggara',
      diet: 'Karnivora - larva nyamuk, bloodworm, artemia, pelet protein tinggi',
      lifespan: '2-5 tahun'
    },
    {
      id: 3,
      name: 'Ikan Mas Koki',
      scientificName: 'Carassius auratus',
      category: 'Air Tawar',
      difficulty: 'Mudah',
      temperament: 'Damai',
      size: '15-20 cm',
      temperature: '18-22°C',
      ph: '7.0-7.5',
      description: 'Ikan hias klasik dengan bentuk tubuh unik dan warna cerah.',
      imageUrl: 'https://images.unsplash.com/photo-1646116917668-7e3210fad343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZmlzaCUyMGFxdWFyaXVtfGVufDF8fHx8MTc2MjE2MTAzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      detailedDescription: 'Ikan hias klasik dengan bentuk tubuh unik dan warna cerah yang beragam. Mas Koki memiliki banyak varietas seperti Oranda, Ranchu, Lionhead, dan Ryukin. Mereka adalah ikan sosial yang suka berkelompok dan sangat mudah beradaptasi. Memerlukan akuarium yang cukup besar karena menghasilkan banyak limbah dan membutuhkan filtrasi yang baik.',
      family: 'Cyprinidae',
      habitat: 'Akuarium air tawar, kolam hias',
      diet: 'Omnivora - pelet khusus goldfish, sayuran rebus, bloodworm',
      lifespan: '10-15 tahun (dapat mencapai 20+ tahun di kolam)'
    },
    {
      id: 4,
      name: 'Ikan Discus',
      scientificName: 'Symphysodon spp.',
      category: 'Air Tawar',
      difficulty: 'Sulit',
      temperament: 'Damai',
      size: '15-20 cm',
      temperature: '26-30°C',
      ph: '6.0-7.0',
      description: 'Raja akuarium air tawar dengan bentuk bulat dan warna spektakuler.',
      imageUrl: 'https://images.unsplash.com/photo-1564989769610-40bbae0aa5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjdXMlMjBmaXNoJTIwYXF1YXJpdW18ZW58MXx8fHwxNzYyMjUyNTg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      detailedDescription: 'Raja akuarium air tawar dengan bentuk bulat pipih dan warna yang spektakuler. Berasal dari Sungai Amazon, Discus memerlukan perawatan intensif dengan kualitas air yang sangat baik. Mereka adalah ikan yang sensitif terhadap perubahan parameter air dan memerlukan suhu yang lebih hangat dibanding kebanyakan ikan tropis. Discus adalah ikan berkelompok yang harus dipelihara minimal 5-6 ekor.',
      family: 'Cichlidae',
      habitat: 'Sungai Amazon dengan air hitam dan pH rendah',
      diet: 'Karnivora - bloodworm, artemia, pelet protein tinggi khusus discus',
      lifespan: '10-15 tahun'
    },
    {
      id: 5,
      name: 'Ikan Arwana',
      scientificName: 'Scleropages formosus',
      category: 'Air Tawar',
      difficulty: 'Sulit',
      temperament: 'Agresif',
      size: '60-90 cm',
      temperature: '24-30°C',
      ph: '6.0-7.0',
      description: 'Ikan legendaris yang dipercaya membawa keberuntungan.',
      imageUrl: 'https://images.unsplash.com/photo-1522720833778-7738150eb537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcm93YW5hJTIwZmlzaHxlbnwxfHx8fDE3NjIyNTI1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      detailedDescription: 'Ikan legendaris yang dipercaya membawa keberuntungan dalam budaya Asia. Arwana adalah ikan predator besar yang memerlukan akuarium sangat besar (minimal 500 liter). Mereka dikenal karena kemampuan melompat yang luar biasa dan memerlukan tutup akuarium yang kuat. Arwana adalah perenang aktif dan memerlukan ruang berenang yang luas.',
      family: 'Osteoglossidae',
      habitat: 'Sungai dan danau di Asia Tenggara',
      diet: 'Karnivora - ikan kecil, udang, serangga, jangkrik',
      lifespan: '15-20 tahun'
    },
    {
      id: 6,
      name: 'Ikan Guppy',
      scientificName: 'Poecilia reticulata',
      category: 'Air Tawar',
      difficulty: 'Mudah',
      temperament: 'Damai',
      size: '3-6 cm',
      temperature: '22-28°C',
      ph: '7.0-8.0',
      description: 'Ikan kecil berwarna-warni yang mudah berkembang biak.',
      imageUrl: 'https://images.unsplash.com/photo-1591582768075-bc8a9bf94b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndXBweSUyMGZpc2h8ZW58MXx8fHwxNzYyMjUyNTg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      detailedDescription: 'Ikan kecil yang sangat populer di kalangan aquarist pemula. Guppy jantan memiliki warna yang lebih cerah dan ekor yang lebih panjang dibanding betina. Mereka adalah livebearer (beranak) yang sangat produktif dan dapat bereproduksi dengan cepat. Guppy sangat mudah beradaptasi dan toleran terhadap berbagai kondisi air.',
      family: 'Poeciliidae',
      habitat: 'Sungai dan kolam air tawar di Amerika Selatan',
      diet: 'Omnivora - pelet kecil, kutu air, spirulina, sayuran rebus',
      lifespan: '2-3 tahun'
    },
    {
      id: 7,
      name: 'Ikan Molly',
      scientificName: 'Poecilia sphenops',
      category: 'Air Tawar',
      difficulty: 'Mudah',
      temperament: 'Damai',
      size: '8-12 cm',
      temperature: '25-28°C',
      ph: '7.5-8.5',
      description: 'Ikan damai dengan berbagai variasi warna.',
      imageUrl: 'https://images.unsplash.com/photo-1520990981767-a4c6988f5ee7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2xseSUyMGZpc2h8ZW58MXx8fHwxNzYyMjUyNTg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      detailedDescription: 'Molly adalah ikan yang sangat populer untuk akuarium komunitas karena sifatnya yang damai. Tersedia dalam berbagai varietas seperti Black Molly, Silver Molly, dan Balloon Molly. Mereka adalah livebearer yang mudah berkembang biak dan membutuhkan air dengan pH sedikit basa. Molly juga dapat hidup di air payau.',
      family: 'Poeciliidae',
      habitat: 'Sungai, danau, dan perairan payau di Amerika Tengah',
      diet: 'Omnivora dengan preferensi herbivora - spirulina, sayuran, alga, pelet',
      lifespan: '3-5 tahun'
    },
    {
      id: 8,
      name: 'Ikan Neon Tetra',
      scientificName: 'Paracheirodon innesi',
      category: 'Air Tawar',
      difficulty: 'Mudah',
      temperament: 'Damai',
      size: '3-4 cm',
      temperature: '20-26°C',
      ph: '6.0-7.0',
      description: 'Ikan kecil dengan garis neon biru yang mencolok.',
      imageUrl: 'https://images.unsplash.com/photo-1584642875245-786dc34761b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwdGV0cmElMjBmaXNofGVufDF8fHx8MTc2MjI1MjU4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      detailedDescription: 'Ikan kecil yang sangat populer dengan garis neon biru cerah yang membentang dari mata ke ekor. Neon Tetra adalah ikan schooling yang harus dipelihara dalam kelompok minimal 6 ekor. Mereka berasal dari perairan hitam Amazon dan lebih menyukai air yang sedikit asam. Sangat damai dan cocok untuk akuarium komunitas.',
      family: 'Characidae',
      habitat: 'Sungai-sungai kecil di Amazon',
      diet: 'Omnivora - pelet mikro, cacing darah kecil, kutu air',
      lifespan: '5-8 tahun'
    }
  ]; // Hardcoded data as fallback

  const difficultyLevels = ['Semua', 'Mudah', 'Menengah', 'Sulit'];

  const filteredFish = fishSpecies.filter(fish => {
    const matchesSearch = fish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fish.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'Semua' || fish.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah':
        return 'bg-green-100 text-green-800';
      case 'Menengah':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sulit':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const modalOverlayStyle = {
    backdropFilter: 'none',
    background: 'rgba(19, 62, 135, 0.4)'
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ 
      background: 'linear-gradient(to bottom, #87CEEB 0%, #4A90E2 15%, #357ABD 30%, #2E5C8A 50%, #1E3A5F 70%, #0F2027 100%)',
      position: 'relative'
    }}>
      {/* Background Ikan 3D Animasi */}
      <Fish3DBackground />
      
      {/* Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#0F5BE5] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FFD6D6] rounded-full blur-3xl"></div>
      </div>

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

      {/* Global Navbar */}
      <div className="relative" style={{ zIndex: 9999999 }}>
        <Navbar onAuthClick={onAuthClick} onSmartNavigate={onSmartNavigate} />
      </div>

      {/* Spacer untuk fixed navbar */}
      <div style={{ height: '76px' }}></div>

      {/* Main Content */}
      <main className="flex-1 py-8 relative" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-8">
              <p className="text-white font-semibold" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Memuat data ikan...</p>
            </div>
          )}
          
          {error && (
            <div 
              className="px-6 py-4 rounded-full mb-6 transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            >
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-8">
            <h1 
              className="text-4xl md:text-5xl mb-4 font-extrabold" 
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                letterSpacing: '-0.02em',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            >
              Fishpedia
            </h1>
            <p 
              className="text-lg md:text-xl font-semibold" 
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
            >
              Jelajahi database lengkap ikan hias dengan informasi detail tentang perawatan, habitat, dan karakteristik setiap spesies
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 pointer-events-none" style={{ color: '#608BC1' }} />
              <input
                type="text"
                placeholder="Cari nama ikan atau nama ilmiah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 py-6 text-base transition-all duration-300 w-full outline-none"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(15, 91, 229, 0.3)',
                  borderRadius: '9999px',
                  boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif',
                  paddingLeft: '3rem',
                  paddingRight: '1.5rem',
                  paddingTop: '1.5rem',
                  paddingBottom: '1.5rem'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 91, 229, 0.25), 0 0 0 1px rgba(15, 91, 229, 0.3) inset';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-semibold mr-2" style={{ color: '#FFFFFF', fontFamily: 'Nunito Sans, sans-serif' }}>Tingkat Kesulitan:</span>
              {difficultyLevels.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bubble-button"
                  style={{
                    backgroundColor: selectedDifficulty === difficulty 
                      ? 'rgba(15, 91, 229, 0.95)' 
                      : 'rgba(255, 255, 255, 0.95)',
                    color: selectedDifficulty === difficulty ? '#FFFFFF' : '#133E87',
                    border: selectedDifficulty === difficulty 
                      ? '2px solid rgba(15, 91, 229, 0.5)' 
                      : '2px solid rgba(15, 91, 229, 0.3)',
                    boxShadow: selectedDifficulty === difficulty
                      ? '0 8px 24px rgba(15, 91, 229, 0.4)'
                      : '0 4px 16px rgba(15, 91, 229, 0.15)',
                    backdropFilter: 'blur(10px)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedDifficulty !== difficulty) {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.25)';
                      e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDifficulty !== difficulty) {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 91, 229, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                    }
                  }}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p style={{ color: '#FFFFFF', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>
              Menampilkan <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{filteredFish.length}</span> dari <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{fishSpecies.length}</span> spesies ikan
            </p>
          </div>

          {/* Fish Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFish.map((fish) => (
              <Card 
                key={fish.id} 
                className="overflow-hidden transition-all duration-300 relative"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(15, 91, 229, 0.3)',
                  borderRadius: '32px',
                  boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif',
                  zIndex: 1,
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(15, 91, 229, 0.3), 0 0 0 1px rgba(15, 91, 229, 0.4) inset';
                  e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                  e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.3)';
                }}
              >
                {/* Bubble glow effect */}
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                    filter: 'blur(15px)'
                  }}
                ></div>
                
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-[30px] overflow-hidden">
                  <ImageWithFallback
                    src={fish.imageUrl}
                    alt={fish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge 
                      className={getDifficultyColor(fish.difficulty)}
                      style={{ 
                        borderRadius: '12px',
                        fontFamily: 'Nunito Sans, sans-serif',
                        fontWeight: 600,
                        padding: '6px 12px'
                      }}
                    >
                      {fish.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 relative" style={{ zIndex: 1 }}>
                  <h3 className="text-xl mb-1 font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{fish.name}</h3>
                  <p className="text-sm italic mb-3" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{fish.scientificName}</p>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>{fish.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <span className="text-gray-500" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Temperamen:</span>
                      <p className="font-semibold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{fish.temperament}</p>
                    </div>
                    <div>
                      <span className="text-gray-500" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Ukuran:</span>
                      <p className="font-semibold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{fish.size}</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event from bubbling to Card
                      if (onAuthClick) {
                        onAuthClick('login');
                      }
                    }}
                    className="w-full py-3 rounded-full font-semibold transition-all duration-300 bubble-button flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                      color: '#FFFFFF',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 6px 20px rgba(15, 91, 229, 0.3)',
                      fontFamily: 'Nunito Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 91, 229, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 91, 229, 0.3)';
                    }}
                  >
                    Lihat Detail
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredFish.length === 0 && (
            <div className="text-center py-12">
              <img src={logo} alt="Temanikan Logo" className="w-16 h-16 mx-auto mb-4 object-contain opacity-50" />
              <p className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF', fontFamily: 'Nunito Sans, sans-serif' }}>Tidak ada ikan yang ditemukan</p>
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Nunito Sans, sans-serif' }}>Coba ubah kata kunci pencarian atau filter kategori</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Bubble Style */}
      <footer className="relative overflow-hidden mt-12">
        {/* Decorative Bubbles Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-10 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(15, 91, 229, 0.3), rgba(72, 128, 255, 0.2))', filter: 'blur(50px)' }}></div>
          <div className="absolute bottom-0 right-10 w-36 h-36 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(255, 182, 193, 0.3), rgba(255, 215, 0, 0.2))', filter: 'blur(45px)' }}></div>
        </div>

        <div 
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 relative"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '40px 40px 0 0',
            boxShadow: '0 -10px 40px rgba(15, 91, 229, 0.1), inset 0 2px 10px rgba(255, 255, 255, 0.5)',
            zIndex: 1
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

      {/* Fish Detail Dialog */}
      <Dialog open={selectedFish !== null} onOpenChange={() => setSelectedFish(null)}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] relative overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '3px solid rgba(15, 91, 229, 0.3)',
            boxShadow: '0 20px 60px rgba(15, 91, 229, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          overlayStyle={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(19, 62, 135, 0.6)'
          }}
        >
          {/* Decorative bubbles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(72, 128, 255, 0.6), transparent 70%)', filter: 'blur(40px)' }}></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255, 182, 193, 0.5), transparent 70%)', filter: 'blur(35px)' }}></div>
          
          <DialogHeader className="border-b pb-4 relative z-10" style={{ borderColor: 'rgba(15, 91, 229, 0.2)' }}>
            <DialogTitle className="text-3xl font-extrabold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish?.name}</DialogTitle>
            <p className="text-sm italic mt-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish?.scientificName}</p>
          </DialogHeader>
          
          {selectedFish && (
            <div className="space-y-4 pt-4 relative z-10">
              {/* Image */}
              <div className="relative h-72 rounded-[30px] overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 shadow-xl" style={{ border: '2px solid rgba(15, 91, 229, 0.2)' }}>
                <ImageWithFallback
                  src={selectedFish.imageUrl}
                  alt={selectedFish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge 
                    className={getDifficultyColor(selectedFish.difficulty) + ' text-sm px-4 py-2 shadow-lg'}
                    style={{ 
                      borderRadius: '16px',
                      fontFamily: 'Nunito Sans, sans-serif',
                      fontWeight: 600
                    }}
                  >
                    {selectedFish.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Basic Info Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div 
                  className="p-5 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(15, 91, 229, 0.2)',
                    boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span className="text-xs font-semibold" style={{ color: '#608BC1' }}>Kategori</span>
                  <p className="font-bold mt-2 text-lg" style={{ color: '#133E87' }}>{selectedFish.category}</p>
                </div>
                <div 
                  className="p-5 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(15, 91, 229, 0.2)',
                    boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span className="text-xs font-semibold" style={{ color: '#608BC1' }}>Famili</span>
                  <p className="font-bold mt-2 text-lg" style={{ color: '#133E87' }}>{selectedFish.family || 'N/A'}</p>
                </div>
                <div 
                  className="p-5 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(15, 91, 229, 0.2)',
                    boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span className="text-xs font-semibold" style={{ color: '#608BC1' }}>Temperamen</span>
                  <p className="font-bold mt-2 text-lg" style={{ color: '#133E87' }}>{selectedFish.temperament || 'Damai'}</p>
                </div>
              </div>

              {/* Description */}
              <div 
                className="p-6 rounded-2xl transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(15, 91, 229, 0.2)',
                  boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <h3 className="text-lg font-bold mb-3" style={{ color: '#133E87' }}>📝 Deskripsi</h3>
                <p className="leading-relaxed text-sm" style={{ color: '#636E72' }}>{selectedFish.detailedDescription || selectedFish.description}</p>
              </div>

              {/* Parameters Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div 
                  className="p-6 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(15, 91, 229, 0.2)',
                    boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#133E87' }}>💧 Parameter Air</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.1)' }}>
                      <span className="text-sm font-semibold" style={{ color: '#608BC1' }}>Suhu</span>
                      <span className="font-bold text-sm" style={{ color: '#133E87' }}>{selectedFish.temperature}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.1)' }}>
                      <span className="text-sm font-semibold" style={{ color: '#608BC1' }}>pH</span>
                      <span className="font-bold text-sm" style={{ color: '#133E87' }}>{selectedFish.ph}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-semibold" style={{ color: '#608BC1' }}>Ukuran Maksimal</span>
                      <span className="font-bold text-sm" style={{ color: '#133E87' }}>{selectedFish.size}</span>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-6 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(15, 91, 229, 0.2)',
                    boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1)',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#133E87' }}>ℹ️ Informasi Lainnya</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(15, 91, 229, 0.1)' }}>
                      <span className="text-sm font-semibold" style={{ color: '#608BC1' }}>Temperamen</span>
                      <span className="font-bold text-sm" style={{ color: '#133E87' }}>{selectedFish.temperament}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-semibold" style={{ color: '#608BC1' }}>Lama Hidup</span>
                      <span className="font-bold text-sm" style={{ color: '#133E87' }}>{selectedFish.lifespan}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Habitat */}
              <div 
                className="p-6 rounded-2xl transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(15, 91, 229, 0.2)',
                  boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <h3 className="text-lg font-bold mb-3" style={{ color: '#133E87' }}>🌍 Habitat Alami</h3>
                <p className="leading-relaxed text-sm" style={{ color: '#636E72' }}>{selectedFish.habitat || 'Informasi habitat tidak tersedia'}</p>
              </div>

              {/* Diet */}
              <div 
                className="p-6 rounded-2xl transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(15, 91, 229, 0.2)',
                  boxShadow: '0 8px 24px rgba(15, 91, 229, 0.1)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <h3 className="text-lg font-bold mb-3" style={{ color: '#133E87' }}>🍽️ Makanan & Diet</h3>
                <p className="leading-relaxed text-sm" style={{ color: '#636E72' }}>{selectedFish.diet || 'Informasi diet tidak tersedia'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}