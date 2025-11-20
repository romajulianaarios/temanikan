import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Search, Plus, Edit, Trash2, Power, Eye } from '../icons';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  robots: number;
  joinDate: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Ahmad Wijaya',
      email: 'ahmad@example.com',
      phone: '+62 812 3456 7890',
      status: 'active',
      robots: 2,
      joinDate: '15 Jan 2024'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      phone: '+62 813 4567 8901',
      status: 'active',
      robots: 1,
      joinDate: '23 Feb 2024'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      email: 'budi@example.com',
      phone: '+62 814 5678 9012',
      status: 'active',
      robots: 3,
      joinDate: '10 Mar 2024'
    },
    {
      id: 4,
      name: 'Dewi Lestari',
      email: 'dewi@example.com',
      phone: '+62 815 6789 0123',
      status: 'inactive',
      robots: 1,
      joinDate: '5 Apr 2024'
    },
    {
      id: 5,
      name: 'Eko Prasetyo',
      email: 'eko@example.com',
      phone: '+62 816 7890 1234',
      status: 'active',
      robots: 2,
      joinDate: '18 Mei 2024'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === 'Aktif') matchesStatus = user.status === 'active';
    else if (statusFilter === 'Tidak Aktif') matchesStatus = user.status === 'inactive';
    return matchesSearch && matchesStatus;
  });

  // Handle Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: users.length + 1,
      name: formName,
      email: formEmail,
      phone: formPhone,
      status: 'active',
      robots: 0,
      joinDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    resetForm();
  };

  // Handle Edit User
  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, name: formName, email: formEmail, phone: formPhone }
        : user
    ));
    setShowEditModal(false);
    setSelectedUser(null);
    resetForm();
  };

  // Handle Delete User
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  // Handle Toggle Status
  const handleToggleStatus = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };

  // Open Edit Modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setShowEditModal(true);
  };

  // Open Delete Confirm
  const openDeleteConfirm = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card className="p-6" style={{ backgroundColor: 'white' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Cari pengguna..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Status">Semua Status</SelectItem>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="text-white"
            style={{ backgroundColor: '#133E87' }}
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pengguna
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden" style={{ backgroundColor: 'white' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Robot</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>#{user.id}</TableCell>
                <TableCell style={{ color: '#133E87' }}>{user.name}</TableCell>
                <TableCell className="text-gray-600">{user.email}</TableCell>
                <TableCell>
                  {user.status === 'active' ? (
                    <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Tidak Aktif</Badge>
                  )}
                </TableCell>
                <TableCell>{user.robots}</TableCell>
                <TableCell className="text-gray-600">{user.joinDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditModal(user)}
                      className="hover:bg-gray-100"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" style={{ color: '#133E87' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleStatus(user)}
                      className="hover:bg-gray-100"
                      title={user.status === 'active' ? 'Non-aktifkan' : 'Aktifkan'}
                    >
                      <Power className="w-4 h-4" style={{ color: user.status === 'active' ? '#f59e0b' : '#10b981' }} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openDeleteConfirm(user)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Tidak ada pengguna ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Tambah Pengguna Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <Label htmlFor="add-name">Nama Lengkap</Label>
              <Input 
                id="add-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="add-email">Email</Label>
              <Input 
                id="add-email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="add-phone">No HP</Label>
              <Input 
                id="add-phone"
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="add-password">Password</Label>
              <Input 
                id="add-password"
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                required
                minLength={8}
              />
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

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Edit Pengguna</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input 
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">No HP</Label>
              <Input 
                id="edit-phone"
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
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

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: '#133E87' }}>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser?.name}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setSelectedUser(null);
              }}
            >
              Batal
            </Button>
            <Button 
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteUser}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}