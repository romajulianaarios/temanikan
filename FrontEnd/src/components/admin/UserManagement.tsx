import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Search, Plus, Edit, Trash2, Power, Eye } from '../icons';
import { adminAPI } from '../../services/api';
import NotificationModal from '../ui/NotificationModal';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  devices?: any[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Notification Modal states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');

  // Fetch users from database
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminAPI.getUsers();
      console.log('📥 Users response:', response);

      if (response.users) {
        setUsers(response.users);
      }
    } catch (err: any) {
      console.error('❌ Error fetching users:', err);
      setError(err.message || 'Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === 'Member') matchesStatus = user.role === 'member';
    else if (statusFilter === 'Admin') matchesStatus = user.role === 'admin';
    return matchesSearch && matchesStatus;
  });

  // Handle Add User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await adminAPI.createUser({
        name: formName,
        email: formEmail,
        phone: formPhone,
        password: formPassword,
      });

      if (response.success) {
        // Refresh user list
        await fetchUsers();
        setShowAddModal(false);
        resetForm();
        // Show success notification
        setNotificationType('success');
        setNotificationTitle('Berhasil!');
        setNotificationMessage('Pengguna berhasil ditambahkan');
        setShowNotification(true);
      } else {
        // Show error notification
        setNotificationType('error');
        setNotificationTitle('Gagal');
        setNotificationMessage(response.message || 'Gagal menambahkan pengguna');
        setShowNotification(true);
      }
    } catch (err: any) {
      console.error('Error adding user:', err);
      // Show error notification
      setNotificationType('error');
      setNotificationTitle('Gagal');
      setNotificationMessage(err.response?.data?.message || 'Gagal menambahkan pengguna');
      setShowNotification(true);
    }
  };

  // Handle Edit User
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await adminAPI.updateUser(selectedUser.id, {
        name: formName,
        email: formEmail,
        phone: formPhone,
      });

      if (response.success) {
        // Refresh user list
        await fetchUsers();
        setShowEditModal(false);
        setSelectedUser(null);
        resetForm();
        // Show success notification
        setNotificationType('success');
        setNotificationTitle('Berhasil!');
        setNotificationMessage('Data pengguna berhasil diperbarui');
        setShowNotification(true);
      } else {
        // Show error notification
        setNotificationType('error');
        setNotificationTitle('Gagal');
        setNotificationMessage(response.message || 'Gagal memperbarui data pengguna');
        setShowNotification(true);
      }
    } catch (err: any) {
      console.error('Error updating user:', err);
      // Show error notification
      setNotificationType('error');
      setNotificationTitle('Gagal');
      setNotificationMessage(err.response?.data?.message || 'Gagal memperbarui data pengguna');
      setShowNotification(true);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await adminAPI.deleteUser(selectedUser.id);

      if (response.success) {
        // Refresh user list
        await fetchUsers();
        setShowDeleteConfirm(false);
        setSelectedUser(null);
        // Show success notification
        setNotificationType('success');
        setNotificationTitle('Berhasil!');
        setNotificationMessage('Pengguna berhasil dihapus');
        setShowNotification(true);
      } else {
        // Show error notification
        setNotificationType('error');
        setNotificationTitle('Gagal');
        setNotificationMessage(response.message || 'Gagal menghapus pengguna');
        setShowNotification(true);
      }
    } catch (err: any) {
      console.error('Error deleting user:', err);
      // Show error notification
      setNotificationType('error');
      setNotificationTitle('Gagal');
      setNotificationMessage(err.response?.data?.message || 'Gagal menghapus pengguna');
      setShowNotification(true);
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = async (user: User) => {
    try {
      const response = await adminAPI.toggleUserStatus(user.id);

      if (response.success) {
        // Refresh user list
        await fetchUsers();
        const statusText = response.user?.is_active ? 'diaktifkan' : 'dinonaktifkan';
        // Show success notification
        setNotificationType('success');
        setNotificationTitle('Berhasil!');
        setNotificationMessage(`Akun ${user.name} berhasil ${statusText}`);
        setShowNotification(true);
      } else {
        // Show error notification
        setNotificationType('error');
        setNotificationTitle('Gagal');
        setNotificationMessage(response.message || 'Gagal mengubah status pengguna');
        setShowNotification(true);
      }
    } catch (err: any) {
      console.error('Error toggling user status:', err);
      // Show error notification
      setNotificationType('error');
      setNotificationTitle('Gagal');
      setNotificationMessage(err.response?.data?.message || 'Gagal mengubah status pengguna');
      setShowNotification(true);
    }
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {loading && (
        <Card 
          className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
        >
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.3), transparent 70%)',
              filter: 'blur(15px)'
            }}
          ></div>
          <div className="text-center py-8 relative z-10">
            <p style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>Memuat data pengguna...</p>
          </div>
        </Card>
      )}

      {error && (
        <Card 
          className="bubble-card p-6 transition-all duration-300 relative overflow-hidden"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '32px',
            boxShadow: '0 10px 50px rgba(239, 68, 68, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif'
          }}
        >
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3), transparent 70%)',
              filter: 'blur(15px)'
            }}
          ></div>
          <p className="text-red-700 font-semibold relative z-10" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>{error}</p>
        </Card>
      )}

      {/* Filters and Actions */}
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
        <div className="relative z-10">
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
              <SelectItem value="Semua Status">Semua Role</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
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
        </div>
      </Card>

      {/* Users Table */}
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
              <TableHead>Email</TableHead>
              <TableHead>No HP</TableHead>
              <TableHead>Role</TableHead>
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
                <TableCell className="text-gray-600">{user.phone || 'N/A'}</TableCell>
                <TableCell>
                  {user.role === 'admin' ? (
                    <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-800">Member</Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">{formatDate(user.created_at)}</TableCell>
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
                      title="Toggle Status"
                    >
                      <Power className="w-4 h-4" style={{ color: '#f59e0b' }} />
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
                  {loading ? 'Memuat data...' : 'Tidak ada pengguna ditemukan'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
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

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        type={notificationType}
        title={notificationTitle}
        message={notificationMessage}
      />
    </div>
  );
}