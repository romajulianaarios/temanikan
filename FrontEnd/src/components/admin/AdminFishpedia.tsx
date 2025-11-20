import { useState } from 'react';
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
  image?: string;
  phMin?: number;
  phMax?: number;
  tempMin?: number;
  tempMax?: number;
}

export default function AdminFishpedia() {
  const [fishEntries, setFishEntries] = useState<FishEntry[]>([
    {
      id: 1,
      name: 'Ikan Koi',
      scientificName: 'Cyprinus carpio',
      category: 'Air Tawar',
      difficulty: 'Menengah',
      status: 'published',
      views: 1245,
      lastUpdated: '1 Nov 2025',
      description: 'Ikan koi adalah ikan hias yang populer dengan berbagai warna indah.',
      phMin: 7.0,
      phMax: 8.0,
      tempMin: 15,
      tempMax: 25
    },
    {
      id: 2,
      name: 'Ikan Cupang',
      scientificName: 'Betta splendens',
      category: 'Air Tawar',
      difficulty: 'Mudah',
      status: 'published',
      views: 987,
      lastUpdated: '28 Okt 2025',
      description: 'Ikan cupang dikenal dengan siripnya yang indah dan sifat agresifnya.',
      phMin: 6.5,
      phMax: 7.5,
      tempMin: 24,
      tempMax: 28
    },
    {
      id: 3,
      name: 'Ikan Mas Koki',
      scientificName: 'Carassius auratus',
      category: 'Air Tawar',
      difficulty: 'Mudah',
      status: 'published',
      views: 854,
      lastUpdated: '25 Okt 2025',
      description: 'Ikan mas koki adalah ikan hias yang mudah dipelihara.',
      phMin: 6.5,
      phMax: 7.5,
      tempMin: 18,
      tempMax: 24
    },
    {
      id: 4,
      name: 'Ikan Discus',
      scientificName: 'Symphysodon spp.',
      category: 'Air Tawar',
      difficulty: 'Sulit',
      status: 'draft',
      views: 0,
      lastUpdated: '4 Nov 2025',
      description: 'Ikan discus adalah ikan air tawar yang cantik namun memerlukan perawatan khusus.',
      phMin: 6.0,
      phMax: 7.0,
      tempMin: 26,
      tempMax: 30
    },
    {
      id: 5,
      name: 'Ikan Guppy',
      scientificName: 'Poecilia reticulata',
      category: 'Air Tawar',
      difficulty: 'Mudah',
      status: 'published',
      views: 723,
      lastUpdated: '20 Okt 2025',
      description: 'Ikan guppy adalah ikan kecil yang mudah berkembang biak.',
      phMin: 7.0,
      phMax: 8.0,
      tempMin: 22,
      tempMax: 28
    },
  ]);

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
  const [formCategory, setFormCategory] = useState('Air Tawar');
  const [formDifficulty, setFormDifficulty] = useState<'Mudah' | 'Menengah' | 'Sulit'>('Mudah');
  const [formDescription, setFormDescription] = useState('');
  const [formPhMin, setFormPhMin] = useState('6.5');
  const [formPhMax, setFormPhMax] = useState('7.5');
  const [formTempMin, setFormTempMin] = useState('22');
  const [formTempMax, setFormTempMax] = useState('28');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('draft');

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
  const handleAddFish = (e: React.FormEvent) => {
    e.preventDefault();
    const newFish: FishEntry = {
      id: fishEntries.length + 1,
      name: formName,
      scientificName: formScientificName,
      category: formCategory,
      difficulty: formDifficulty,
      status: formStatus,
      views: 0,
      lastUpdated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: formDescription,
      phMin: parseFloat(formPhMin),
      phMax: parseFloat(formPhMax),
      tempMin: parseFloat(formTempMin),
      tempMax: parseFloat(formTempMax)
    };
    setFishEntries([...fishEntries, newFish]);
    setShowAddModal(false);
    resetForm();
  };

  // Handle Edit Fish
  const handleEditFish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFish) return;
    
    setFishEntries(fishEntries.map(fish => 
      fish.id === selectedFish.id 
        ? {
            ...fish,
            name: formName,
            scientificName: formScientificName,
            category: formCategory,
            difficulty: formDifficulty,
            description: formDescription,
            phMin: parseFloat(formPhMin),
            phMax: parseFloat(formPhMax),
            tempMin: parseFloat(formTempMin),
            tempMax: parseFloat(formTempMax),
            status: formStatus,
            lastUpdated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          }
        : fish
    ));
    setShowEditModal(false);
    setSelectedFish(null);
    resetForm();
  };

  // Handle Delete Fish
  const handleDeleteFish = () => {
    if (!selectedFish) return;
    setFishEntries(fishEntries.filter(fish => fish.id !== selectedFish.id));
    setShowDeleteConfirm(false);
    setSelectedFish(null);
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
    setFormPhMin(fish.phMin?.toString() || '6.5');
    setFormPhMax(fish.phMax?.toString() || '7.5');
    setFormTempMin(fish.tempMin?.toString() || '22');
    setFormTempMax(fish.tempMax?.toString() || '28');
    setFormStatus(fish.status);
    setShowEditModal(true);
  };

  // Open Delete Confirm
  const openDeleteConfirm = (fish: FishEntry) => {
    setSelectedFish(fish);
    setShowDeleteConfirm(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormName('');
    setFormScientificName('');
    setFormCategory('Air Tawar');
    setFormDifficulty('Mudah');
    setFormDescription('');
    setFormPhMin('6.5');
    setFormPhMax('7.5');
    setFormTempMin('22');
    setFormTempMax('28');
    setFormStatus('draft');
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <p className="text-sm text-gray-600 mb-1">Total Entri</p>
          <p className="text-3xl" style={{ color: '#133E87' }}>{totalEntries}</p>
        </Card>
        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <p className="text-sm text-gray-600 mb-1">Dipublikasi</p>
          <p className="text-3xl" style={{ color: '#133E87' }}>{publishedCount}</p>
        </Card>
        <Card className="p-6" style={{ backgroundColor: 'white' }}>
          <p className="text-sm text-gray-600 mb-1">Draft</p>
          <p className="text-3xl" style={{ color: '#133E87' }}>{draftCount}</p>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex flex-col md:flex-row gap-4">
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
      <Card className="overflow-hidden" style={{ backgroundColor: 'white' }}>
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
                  placeholder="Ikan Koi"
                />
              </div>
              <div>
                <Label htmlFor="add-scientific">Nama Ilmiah</Label>
                <Input 
                  id="add-scientific"
                  value={formScientificName}
                  onChange={(e) => setFormScientificName(e.target.value)}
                  required
                  placeholder="Cyprinus carpio"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="add-category">Kategori</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger id="add-category">
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
              <Label htmlFor="add-difficulty">Kesulitan</Label>
              <Select value={formDifficulty} onValueChange={setFormDifficulty}>
                <SelectTrigger id="add-difficulty">
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
              <Label htmlFor="add-description">Deskripsi</Label>
              <Textarea 
                id="add-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
                placeholder="Deskripsi lengkap tentang ikan..."
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
              <div className="mt-2 flex items-center gap-4">
                <Button type="button" variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Gambar
                </Button>
                <span className="text-sm text-gray-500">Format: JPG, PNG (Max 2MB)</span>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Detail Ikan</DialogTitle>
          </DialogHeader>
          {selectedFish && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Ikan</p>
                  <p style={{ color: '#133E87' }}>{selectedFish.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nama Ilmiah</p>
                  <p className="italic text-gray-700">{selectedFish.scientificName}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Kategori</p>
                <Badge variant="outline">{selectedFish.category}</Badge>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Kesulitan</p>
                {selectedFish.difficulty === 'Mudah' ? (
                  <Badge className="bg-green-100 text-green-800">Mudah</Badge>
                ) : selectedFish.difficulty === 'Menengah' ? (
                  <Badge className="bg-yellow-100 text-yellow-800">Menengah</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Sulit</Badge>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                {selectedFish.status === 'published' ? (
                  <Badge className="bg-green-100 text-green-800">Published</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Deskripsi</p>
                <p className="text-gray-700">{selectedFish.description || 'Tidak ada deskripsi'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#F3F3E0' }}
                >
                  <p className="text-sm text-gray-600 mb-1">Rentang pH</p>
                  <p style={{ color: '#133E87' }}>
                    {selectedFish.phMin} - {selectedFish.phMax}
                  </p>
                </div>
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#F3F3E0' }}
                >
                  <p className="text-sm text-gray-600 mb-1">Rentang Suhu</p>
                  <p style={{ color: '#133E87' }}>
                    {selectedFish.tempMin}°C - {selectedFish.tempMax}°C
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p style={{ color: '#133E87' }}>{selectedFish.views}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Terakhir Diupdate</p>
                  <p style={{ color: '#133E87' }}>{selectedFish.lastUpdated}</p>
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