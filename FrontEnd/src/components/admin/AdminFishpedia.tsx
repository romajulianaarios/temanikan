import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Edit, Trash2, Eye, Upload } from '../icons';
import { fishpediaAPI } from '../../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface FishEntry {
  id: number;
  name: string;
  scientificName: string;
  category: string;
  difficulty: 'Mudah' | 'Menengah' | 'Sulit';
  status: 'published' | 'draft';
  views: number;
  lastUpdated: string;
  description?: string;
  family?: string;
  habitat?: string;
  image?: string;
  phMin?: number;
  phMax?: number;
  tempMin?: number;
  tempMax?: number;
}

export default function AdminFishpedia() {
  const [fishEntries, setFishEntries] = useState<FishEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFish, setSelectedFish] = useState<FishEntry | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formScientificName, setFormScientificName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'Mudah' | 'Menengah' | 'Sulit'>('Mudah');
  const [formDescription, setFormDescription] = useState('');
  const [formFamily, setFormFamily] = useState('');
  const [formHabitat, setFormHabitat] = useState('');
  const [formPhMin, setFormPhMin] = useState('');
  const [formPhMax, setFormPhMax] = useState('');
  const [formTempMin, setFormTempMin] = useState('');
  const [formTempMax, setFormTempMax] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('draft');
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string>('');

  // Fetch fish data from API
  useEffect(() => {
    fetchFishData();
  }, []);

  const fetchFishData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Use correct public endpoint that returns all species
      const response = await fishpediaAPI.getSpecies();
      
      console.log('📥 Fishpedia response:', response);
      
      if (response.success && response.species) {
        // Backend sudah return format yang benar (camelCase)
        setFishEntries(response.species);
      }
    } catch (err: any) {
      console.error('❌ Error fetching fish data:', err);
      setError(err.message || 'Gagal memuat data ikan');
    } finally {
      setLoading(false);
    }
  };



  // Filter fish entries
  const filteredEntries = fishEntries.filter(fish => {
    const matchesSearch = 
      fish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fish.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'Semua' || fish.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Stats
  const totalEntries = fishEntries.length;
  const publishedCount = fishEntries.filter(f => f.status === 'published').length;
  const draftCount = fishEntries.filter(f => f.status === 'draft').length;

  // Handle Add Fish
  const handleAddFish = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', formName);
      formData.append('scientific_name', formScientificName);
      formData.append('category', formCategory);
      formData.append('difficulty', formDifficulty);
      formData.append('description', formDescription);
      formData.append('family', formFamily);
      formData.append('habitat', formHabitat);
      formData.append('ph_min', formPhMin);
      formData.append('ph_max', formPhMax);
      formData.append('temp_min', formTempMin);
      formData.append('temp_max', formTempMax);
      formData.append('status', formStatus);
      
      if (formImage) {
        formData.append('image', formImage);
      }

      const response = await api.post('/fishpedia', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        await fetchFishData();
        setShowAddModal(false);
        resetForm();
        alert('Ikan berhasil ditambahkan!');
      } else {
        alert(response.data.message || 'Gagal menambahkan ikan');
      }
    } catch (err: any) {
      console.error('❌ Error adding fish:', err);
      alert(err.response?.data?.message || err.message || 'Gagal menambahkan ikan');
    }
  };

  // Handle Edit Fish
  const handleEditFish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFish) return;
    
    try {
      const formData = new FormData();
      formData.append('name', formName);
      formData.append('scientific_name', formScientificName);
      formData.append('category', formCategory);
      formData.append('difficulty', formDifficulty);
      formData.append('description', formDescription);
      formData.append('family', formFamily);
      formData.append('habitat', formHabitat);
      formData.append('ph_min', formPhMin);
      formData.append('ph_max', formPhMax);
      formData.append('temp_min', formTempMin);
      formData.append('temp_max', formTempMax);
      formData.append('status', formStatus);
      
      if (formImage) {
        formData.append('image', formImage);
      }

      const response = await api.put(`/fishpedia/${selectedFish.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        await fetchFishData();
        setShowEditModal(false);
        setSelectedFish(null);
        resetForm();
        alert('Ikan berhasil diupdate!');
      } else {
        alert(response.data.message || 'Gagal mengupdate ikan');
      }
    } catch (err: any) {
      console.error('❌ Error updating fish:', err);
      alert(err.response?.data?.message || err.message || 'Gagal mengupdate ikan');
    }
  };

  // Handle Delete Fish
  const handleDeleteFish = async () => {
    if (!selectedFish) return;
    
    try {
      const response = await api.delete(`/fishpedia/${selectedFish.id}`);
      
      if (response.data.success) {
        await fetchFishData();
        setShowDeleteConfirm(false);
        setSelectedFish(null);
        alert('Ikan berhasil dihapus!');
      } else {
        alert(response.data.message || 'Gagal menghapus ikan');
      }
    } catch (err: any) {
      console.error('❌ Error deleting fish:', err);
      alert(err.response?.data?.message || err.message || 'Gagal menghapus ikan');
    }
  };

  // Open View Modal
  const openViewModal = (fish: FishEntry) => {
    setSelectedFish(fish);
    setShowViewModal(true);
  };

  // Open Edit Modal
  const openEditModal = (fish: FishEntry) => {
    setSelectedFish(fish);
    setFormName(fish.name);
    setFormScientificName(fish.scientificName);
    setFormCategory(fish.category);
    setFormDifficulty(fish.difficulty);
    setFormDescription(fish.description || '');
    setFormFamily(fish.family || '');
    setFormHabitat(fish.habitat || '');
    setFormPhMin(fish.phMin?.toString() || '');
    setFormPhMax(fish.phMax?.toString() || '');
    setFormTempMin(fish.tempMin?.toString() || '');
    setFormTempMax(fish.tempMax?.toString() || '');
    setFormStatus(fish.status);
    setFormImage(null);
    setFormImagePreview(fish.image || '');
    setShowEditModal(true);
  };

  // Open Delete Confirm
  const openDeleteConfirm = (fish: FishEntry) => {
    setSelectedFish(fish);
    setShowDeleteConfirm(true);
  };

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormName('');
    setFormScientificName('');
    setFormCategory('');
    setFormDifficulty('Mudah');
    setFormDescription('');
    setFormFamily('');
    setFormHabitat('');
    setFormPhMin('');
    setFormPhMax('');
    setFormTempMin('');
    setFormTempMax('');
    setFormStatus('draft');
    setFormImage(null);
    setFormImagePreview('');
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Memuat data ikan...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
            e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
          }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <p className="text-sm font-semibold mb-1 relative z-10" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Total Entri</p>
          <p className="text-3xl font-bold relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{totalEntries}</p>
        </Card>
        <Card 
          className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
            e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
          }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <p className="text-sm font-semibold mb-1 relative z-10" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Dipublikasi</p>
          <p className="text-3xl font-bold relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{publishedCount}</p>
        </Card>
        <Card 
          className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
            e.currentTarget.style.boxShadow = '0 20px 70px rgba(72, 128, 255, 0.3), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
            e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
          }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <p className="text-sm font-semibold mb-1 relative z-10" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Draft</p>
          <p className="text-3xl font-bold relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{draftCount}</p>
        </Card>
      </div>

      {/* Header Section */}
      <div className="mb-4">
        <h2 
          className="text-2xl font-bold"
          style={{ 
            color: '#FFFFFF', 
            fontFamily: 'Nunito Sans, sans-serif',
            fontWeight: 800
          }}
        >
          Kelola Entri Fishpedia
        </h2>
        <p 
          className="text-sm mt-1"
          style={{ 
            color: '#FFFFFF', 
            fontFamily: 'Nunito Sans, sans-serif'
          }}
        >
          Cari, tambah, atau edit entri ikan di database Fishpedia
        </p>
      </div>

      {/* Search and Actions */}
      <Card 
        className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          borderRadius: '32px',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          fontFamily: 'Nunito Sans, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
          e.currentTarget.style.boxShadow = '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
        }}
      >
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Cari jenis ikan..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger id="difficulty-filter">
              <SelectValue placeholder="Filter Kesulitan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua</SelectItem>
              <SelectItem value="Mudah">Mudah</SelectItem>
              <SelectItem value="Menengah">Menengah</SelectItem>
              <SelectItem value="Sulit">Sulit</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="text-white"
            style={{ backgroundColor: '#133E87' }}
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Entri Baru
          </Button>
        </div>
      </Card>

      {/* Entries Table */}
      <Card 
        className="bubble-card overflow-hidden transition-all duration-300 relative"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
          borderRadius: '32px',
          boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          fontFamily: 'Nunito Sans, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
          e.currentTarget.style.boxShadow = '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
          e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
        }}
      >
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
            filter: 'blur(15px)'
          }}
        ></div>
        <div className="relative z-10">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Nama Ilmiah</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Kesulitan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Terakhir Diupdate</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>#{entry.id}</TableCell>
                <TableCell style={{ color: '#133E87' }}>{entry.name}</TableCell>
                <TableCell className="italic text-gray-600">{entry.scientificName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{entry.category}</Badge>
                </TableCell>
                <TableCell>
                  {entry.difficulty === 'Mudah' ? (
                    <Badge className="bg-green-100 text-green-800">Mudah</Badge>
                  ) : entry.difficulty === 'Menengah' ? (
                    <Badge className="bg-yellow-100 text-yellow-800">Menengah</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Sulit</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {entry.status === 'published' ? (
                    <Badge className="bg-green-100 text-green-800">Published</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">{entry.views}</TableCell>
                <TableCell className="text-gray-600">{entry.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openViewModal(entry)}
                      className="hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4" style={{ color: '#608BC1' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditModal(entry)}
                      className="hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" style={{ color: '#133E87' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openDeleteConfirm(entry)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredEntries.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  Tidak ada ikan ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </Card>

      {/* Add Fish Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Tambah Ikan Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddFish} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-name">Nama Ikan</Label>
                <Input 
                  id="add-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-scientific">Nama Ilmiah</Label>
                <Input 
                  id="add-scientific"
                  value={formScientificName}
                  onChange={(e) => setFormScientificName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="add-category">Kategori</Label>
              <Select value={formCategory} onValueChange={setFormCategory} required>
                <SelectTrigger id="add-category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Air Tawar">Air Tawar</SelectItem>
                  <SelectItem value="Air Laut">Air Laut</SelectItem>
                  <SelectItem value="Air Payau">Air Payau</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="add-difficulty">Kesulitan</Label>
              <Select value={formDifficulty} onValueChange={setFormDifficulty} required>
                <SelectTrigger id="add-difficulty">
                  <SelectValue placeholder="Pilih tingkat kesulitan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mudah">Mudah</SelectItem>
                  <SelectItem value="Menengah">Menengah</SelectItem>
                  <SelectItem value="Sulit">Sulit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="add-description">Deskripsi</Label>
              <Textarea 
                id="add-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="add-family">Famili</Label>
              <Input 
                id="add-family"
                value={formFamily}
                onChange={(e) => setFormFamily(e.target.value)}
                placeholder="Contoh: Cyprinidae, Poeciliidae"
                required
              />
            </div>

            <div>
              <Label htmlFor="add-habitat">Habitat</Label>
              <Textarea 
                id="add-habitat"
                value={formHabitat}
                onChange={(e) => setFormHabitat(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-ph-min">pH Minimum</Label>
                <Input 
                  id="add-ph-min"
                  type="number"
                  step="0.1"
                  value={formPhMin}
                  onChange={(e) => setFormPhMin(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-ph-max">pH Maximum</Label>
                <Input 
                  id="add-ph-max"
                  type="number"
                  step="0.1"
                  value={formPhMax}
                  onChange={(e) => setFormPhMax(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-temp-min">Suhu Minimum (°C)</Label>
                <Input 
                  id="add-temp-min"
                  type="number"
                  value={formTempMin}
                  onChange={(e) => setFormTempMin(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-temp-max">Suhu Maximum (°C)</Label>
                <Input 
                  id="add-temp-max"
                  type="number"
                  value={formTempMax}
                  onChange={(e) => setFormTempMax(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="add-status">Status</Label>
              <Select value={formStatus} onValueChange={(v) => setFormStatus(v as 'published' | 'draft')}>
                <SelectTrigger id="add-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="add-image">Gambar Ikan</Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="add-image"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageChange}
                    required
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('add-image')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Gambar
                  </Button>
                  <span className="text-sm text-gray-500">Format: JPG, PNG (Max 2MB)</span>
                </div>
                {formImagePreview && (
                  <div className="mt-2">
                    <img 
                      src={formImagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button 
                type="submit"
                className="text-white"
                style={{ backgroundColor: '#133E87' }}
              >
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Fish Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Edit Ikan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditFish} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nama Ikan</Label>
                <Input 
                  id="edit-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-scientific">Nama Ilmiah</Label>
                <Input 
                  id="edit-scientific"
                  value={formScientificName}
                  onChange={(e) => setFormScientificName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-category">Kategori</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger id="edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Air Tawar">Air Tawar</SelectItem>
                  <SelectItem value="Air Laut">Air Laut</SelectItem>
                  <SelectItem value="Air Payau">Air Payau</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-difficulty">Kesulitan</Label>
              <Select value={formDifficulty} onValueChange={setFormDifficulty}>
                <SelectTrigger id="edit-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mudah">Mudah</SelectItem>
                  <SelectItem value="Menengah">Menengah</SelectItem>
                  <SelectItem value="Sulit">Sulit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Textarea 
                id="edit-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-family">Famili</Label>
              <Input 
                id="edit-family"
                value={formFamily}
                onChange={(e) => setFormFamily(e.target.value)}
                placeholder="Contoh: Cyprinidae, Poeciliidae"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-habitat">Habitat</Label>
              <Textarea 
                id="edit-habitat"
                value={formHabitat}
                onChange={(e) => setFormHabitat(e.target.value)}
                rows={3}
                placeholder="Masukkan habitat alami ikan"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-ph-min">pH Minimum</Label>
                <Input 
                  id="edit-ph-min"
                  type="number"
                  step="0.1"
                  value={formPhMin}
                  onChange={(e) => setFormPhMin(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-ph-max">pH Maximum</Label>
                <Input 
                  id="edit-ph-max"
                  type="number"
                  step="0.1"
                  value={formPhMax}
                  onChange={(e) => setFormPhMax(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-temp-min">Suhu Minimum (°C)</Label>
                <Input 
                  id="edit-temp-min"
                  type="number"
                  value={formTempMin}
                  onChange={(e) => setFormTempMin(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-temp-max">Suhu Maximum (°C)</Label>
                <Input 
                  id="edit-temp-max"
                  type="number"
                  value={formTempMax}
                  onChange={(e) => setFormTempMax(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formStatus} onValueChange={(v) => setFormStatus(v as 'published' | 'draft')}>
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-image">Update Gambar Ikan</Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="edit-image"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('edit-image')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Gambar Baru
                  </Button>
                  <span className="text-sm text-gray-500">Format: JPG, PNG (Max 2MB)</span>
                </div>
                {formImagePreview && (
                  <div className="mt-2">
                    <img 
                      src={formImagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedFish(null);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button 
                type="submit"
                className="text-white"
                style={{ backgroundColor: '#133E87' }}
              >
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Fish Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#F3F3E0', border: 'none' }}>
          <DialogHeader className="border-b pb-4" style={{ borderColor: '#CBDCEB' }}>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold" style={{ color: '#133E87' }}>Detail Ikan</DialogTitle>
                {selectedFish && (
                  <p className="text-sm italic text-gray-600 mt-1">{selectedFish.scientificName}</p>
                )}
              </div>
              {selectedFish && (
                <div>
                  {selectedFish.status === 'published' ? (
                    <Badge className="bg-green-100 text-green-800">Published</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>
          {selectedFish && (
            <div className="space-y-4 pt-4">
              {/* Basic Info Cards */}
              <div className="grid md:grid-cols-4 gap-3">
                <div 
                  className="p-4 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span className="text-xs font-semibold relative z-10" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Nama Ikan</span>
                  <p className="font-bold mt-1 relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.name}</p>
                </div>
                <div 
                  className="p-4 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span className="text-xs font-semibold relative z-10" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Famili</span>
                  <p className="font-bold mt-1 relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.family || 'N/A'}</p>
                </div>
                <div 
                  className="p-4 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span className="text-xs font-semibold relative z-10" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Kategori</span>
                  <p className="font-bold mt-1 relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.category}</p>
                </div>
                <div 
                  className="p-4 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <span className="text-xs font-semibold relative z-10" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Kesulitan</span>
                  <div className="mt-1 relative z-10">
                    {selectedFish.difficulty === 'Mudah' ? (
                      <Badge className="bg-green-100 text-green-800 font-semibold" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Mudah</Badge>
                    ) : selectedFish.difficulty === 'Menengah' ? (
                      <Badge className="bg-yellow-100 text-yellow-800 font-semibold" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Menengah</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 font-semibold" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Sulit</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div 
                className="p-5 rounded-2xl transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 4px 20px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <h3 className="text-base font-bold mb-3 relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>📝 Deskripsi</h3>
                <p className="leading-relaxed text-sm relative z-10" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.description || 'Tidak ada deskripsi'}</p>
              </div>

              {/* Habitat */}
              <div 
                className="p-5 rounded-2xl transition-all duration-300 relative overflow-hidden"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '2px solid rgba(72, 128, 255, 0.2)',
                  boxShadow: '0 4px 20px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                <h3 className="text-base font-bold mb-3 relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>🌍 Habitat</h3>
                <p className="leading-relaxed text-sm relative z-10" style={{ color: '#636E72', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.habitat || 'Tidak ada informasi habitat'}</p>
              </div>

              {/* Parameters */}
              <div className="grid md:grid-cols-2 gap-4">
                <div 
                  className="p-5 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <h3 className="text-base font-bold mb-4 relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>💧 Parameter Air</h3>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#E5E7EB' }}>
                      <span className="text-sm font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>pH Range</span>
                      <span className="font-bold text-sm" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.phMin} - {selectedFish.phMax}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Suhu</span>
                      <span className="font-bold text-sm" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.tempMin}°C - {selectedFish.tempMax}°C</span>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-5 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif'
                  }}
                >
                  <h3 className="text-base font-bold mb-4 relative z-10" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>📊 Statistik</h3>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#E5E7EB' }}>
                      <span className="text-sm font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Views</span>
                      <span className="font-bold text-sm" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.views}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-semibold" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Last Updated</span>
                      <span className="font-bold text-sm" style={{ color: '#133E87', fontFamily: 'Nunito Sans, sans-serif' }}>{selectedFish.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                setShowViewModal(false);
                setSelectedFish(null);
              }}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus entri <strong>{selectedFish?.name}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setSelectedFish(null);
              }}
            >
              Batal
            </Button>
            <Button 
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteFish}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}