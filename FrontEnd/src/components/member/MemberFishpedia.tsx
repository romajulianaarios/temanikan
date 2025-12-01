import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ChevronRight } from '../icons';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { fishpediaAPI, buildAssetUrl } from '../../services/api';
import { useTranslation } from '../../contexts/LanguageContext';
import logo from '../../assets/logo_temanikan.png';

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

export default function MemberFishpedia() {
  const t = useTranslation();
  const [selectedFish, setSelectedFish] = useState<FishSpecies | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(t('fishpedia.all'));
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
      setError(t('fishpedia.error'));
    } finally {
      setLoading(false);
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

  const difficultyLevels = [t('fishpedia.all'), t('fishpedia.easy'), t('fishpedia.medium'), t('fishpedia.hard')];

  const filteredFish = fishSpecies.filter(fish => {
    const matchesSearch = fish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fish.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === t('fishpedia.all') || fish.difficulty === selectedDifficulty;
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

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">{t('fishpedia.loading')}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl mb-3" style={{ color: '#FFFFFF', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>{t('fishpedia.title')}</h1>
        <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Nunito Sans, sans-serif' }}>
          {t('fishpedia.subtitle')}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            placeholder={t('fishpedia.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-6 py-6 text-base rounded-full transition-all duration-300 w-full"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(15, 91, 229, 0.7)',
              boxShadow: 'rgba(15, 91, 229, 0.35) 0px 15px 50px, rgba(15, 91, 229, 0.5) 0px 0px 0px 1px inset',
              fontFamily: 'Nunito Sans, sans-serif',
              outline: 'none',
              color: '#133E87'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.9)';
              e.currentTarget.style.boxShadow = 'rgba(15, 91, 229, 0.45) 0px 18px 60px, rgba(15, 91, 229, 0.6) 0px 0px 0px 1px inset';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.7)';
              e.currentTarget.style.boxShadow = 'rgba(15, 91, 229, 0.35) 0px 15px 50px, rgba(15, 91, 229, 0.5) 0px 0px 0px 1px inset';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm self-center mr-2" style={{ color: '#FFFFFF', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>{t('fishpedia.difficulty')}</span>
          {difficultyLevels.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className="bubble-button px-4 py-2 rounded-full text-sm transition-all duration-300"
              style={{
                backgroundColor: selectedDifficulty === difficulty 
                  ? '#4880FF' 
                  : 'rgba(255, 255, 255, 0.9)',
                color: selectedDifficulty === difficulty ? '#FFFFFF' : '#133E87',
                border: selectedDifficulty === difficulty 
                  ? '2px solid rgba(72, 128, 255, 0.5)' 
                  : '2px solid rgba(72, 128, 255, 0.15)',
                fontWeight: selectedDifficulty === difficulty ? 700 : 600,
                fontFamily: 'Nunito Sans, sans-serif',
                boxShadow: selectedDifficulty === difficulty
                  ? '0 6px 25px rgba(72, 128, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset'
                  : '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
              }}
              onMouseEnter={(e) => {
                if (selectedDifficulty !== difficulty) {
                  e.currentTarget.style.backgroundColor = '#F0F5FF';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.2) inset';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedDifficulty !== difficulty) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
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
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Nunito Sans, sans-serif' }}>
          {t('fishpedia.showing')} <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{filteredFish.length}</span> {t('fishpedia.of')} <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{fishSpecies.length}</span> {t('fishpedia.species')}
        </p>
      </div>

      {/* Fish Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFish.map((fish) => (
          <Card 
            key={fish.id} 
            className="bubble-card overflow-hidden transition-all duration-300 cursor-pointer relative"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid rgba(72, 128, 255, 0.2)',
              borderRadius: '32px',
              boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(15, 91, 229, 0.3), 0 0 0 1px rgba(15, 91, 229, 0.4) inset';
              e.currentTarget.style.borderColor = 'rgba(15, 91, 229, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8) inset';
              e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
            }}
            onClick={() => setSelectedFish(fish)}
          >
            {/* Bubble glow effect */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
                filter: 'blur(15px)'
              }}
            ></div>
            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
              <ImageWithFallback
                src={fish.imageUrl}
                alt={fish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge className={getDifficultyColor(fish.difficulty)}>
                  {fish.difficulty}
                </Badge>
              </div>
            </div>
            <div className="p-5 relative z-10">
              <h3 className="text-xl mb-1" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>{fish.name}</h3>
              <p className="text-sm italic mb-3" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{fish.scientificName}</p>
              <p className="text-sm mb-4 line-clamp-2" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{fish.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.temperament')}:</span>
                  <p className="font-medium" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{fish.temperament}</p>
                </div>
                <div>
                  <span style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.size')}:</span>
                  <p className="font-medium" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{fish.size}</p>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling to Card
                  setSelectedFish(fish);
                }}
                className="bubble-button mt-4 flex items-center gap-2 group w-full justify-center rounded-full py-2 transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
                  color: '#FFFFFF',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 6px 20px rgba(15, 91, 229, 0.3)',
                  fontFamily: 'Nunito Sans, sans-serif',
                  fontWeight: 600
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
                {t('fishpedia.viewDetails')}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredFish.length === 0 && (
        <div className="text-center py-12">
          <img src={logo} alt="Temanikan Logo" className="w-16 h-16 mx-auto mb-4 object-contain opacity-50" />
          <p className="text-lg" style={{ color: '#FFFFFF', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>{t('fishpedia.noFishFound')}</p>
          <p className="text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.changeSearch')}</p>
        </div>
      )}

      {/* Fish Detail Dialog */}
      <Dialog open={selectedFish !== null} onOpenChange={() => setSelectedFish(null)}>
        <DialogContent
          className="max-w-4xl max-h-[85vh] overflow-y-auto p-0"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif',
            zIndex: 99999999,
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxHeight: 'calc(100vh - 120px)',
            margin: '0'
          } as React.CSSProperties}
          overlayStyle={{
            backdropFilter: 'blur(8px)',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99999998
          }}
        >
          <div className="relative px-6 py-5">
            <div className="pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full bg-[#608BC1]/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-4 h-40 w-40 rounded-full bg-[#133E87]/10 blur-3xl" />
            <div className="relative z-10">
              <DialogHeader className="border-b pb-4 mb-4" style={{ borderColor: 'rgba(72, 128, 255, 0.2)' }}>
                <DialogTitle className="text-2xl font-bold" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>{selectedFish?.name}</DialogTitle>
                <p className="text-sm italic mt-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish?.scientificName}</p>
              </DialogHeader>
              
              {selectedFish && (
                <div className="space-y-4 pt-4">
              {/* Image */}
              <div 
                className="relative h-72 rounded-2xl overflow-hidden shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.1), rgba(15, 91, 229, 0.05))',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(15, 91, 229, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
                }}
              >
                <ImageWithFallback
                  src={selectedFish.imageUrl}
                  alt={selectedFish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={getDifficultyColor(selectedFish.difficulty) + ' text-sm px-3 py-1 shadow-md'}>
                    {selectedFish.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Basic Info Cards */}
              <div className="grid md:grid-cols-3 gap-3">
                <div 
                  className="p-4 rounded-2xl transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span className="text-xs font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.categoryLabel')}</span>
                  <p className="font-medium mt-1" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.category}</p>
                </div>
                <div 
                  className="p-4 rounded-2xl transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span className="text-xs font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.family')}</span>
                  <p className="font-medium mt-1" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.family || 'N/A'}</p>
                </div>
                <div 
                  className="p-4 rounded-2xl transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span className="text-xs font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.temperament')}</span>
                  <p className="font-medium mt-1" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.temperament || 'Damai'}</p>
                </div>
              </div>

              {/* Description */}
              <div 
                className="p-5 rounded-2xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <h3 className="text-base font-bold mb-3" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>📝 {t('fishpedia.description')}</h3>
                <p className="leading-relaxed text-sm" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.detailedDescription || selectedFish.description}</p>
              </div>

              {/* Parameters Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div 
                  className="p-5 rounded-2xl transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <h3 className="text-base font-bold mb-4" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>💧 {t('fishpedia.waterParams')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(72, 128, 255, 0.2)' }}>
                      <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.temperature')}</span>
                      <span className="font-semibold text-sm" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.temperature}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(72, 128, 255, 0.2)' }}>
                      <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.ph')}</span>
                      <span className="font-semibold text-sm" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.ph}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.maxSize')}</span>
                      <span className="font-semibold text-sm" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.size}</span>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-5 rounded-2xl transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <h3 className="text-base font-bold mb-4" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>ℹ️ {t('common.otherInfo')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(72, 128, 255, 0.2)' }}>
                      <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.temperament')}</span>
                      <span className="font-semibold text-sm" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.temperament}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{t('fishpedia.lifespanLabel')}</span>
                      <span className="font-semibold text-sm" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.lifespan}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Habitat */}
              <div 
                className="p-5 rounded-2xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <h3 className="text-base font-bold mb-3" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>🌍 {t('fishpedia.naturalHabitat')}</h3>
                <p className="leading-relaxed text-sm" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.habitat || 'Informasi habitat tidak tersedia'}</p>
              </div>

              {/* Diet */}
              <div 
                className="p-5 rounded-2xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <h3 className="text-base font-bold mb-3" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>🍽️ {t('fishpedia.foodDiet')}</h3>
                <p className="leading-relaxed text-sm" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.diet || 'Informasi diet tidak tersedia'}</p>
              </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}