import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Package, Eye, CheckCircle, Clock, Truck, Edit, Download, Search, TrendingUp, DollarSign, ShoppingBag } from '../icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: 'pending_payment' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  orderDate: string;
  paymentMethod: string;
  address: string;
  paymentProof?: string;
}

export default function AdminOrders() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Orders Data (Admin melihat semua pesanan dari semua member)
  // Real Orders Data from Backend
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [selectedStatus, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('📡 Admin fetching orders...');
      
      const filters: any = {};
      if (selectedStatus !== 'all') filters.status = mapFrontendToBackendStatus(selectedStatus);
      if (searchQuery) filters.search = searchQuery;
      
      const response = await orderAPI.getAllOrders(filters);
      console.log('✅ Orders received:', response);
      
      // Map backend data to frontend format
      const mappedOrders = response.data.map((order: any) => ({
        id: order.order_number,
        customerName: order.user?.name || 'Unknown',
        customerEmail: order.user?.email || '',
        productName: order.product_name,
        quantity: order.quantity,
        totalPrice: order.total_price,
        status: mapBackendToFrontendStatus(order.status),
        orderDate: order.created_at.split('T')[0],
        paymentMethod: order.payment_method || 'Transfer Bank',
        address: order.shipping_address || '',
        paymentProof: order.payment_status === 'paid' ? 'Uploaded' : undefined
      }));
      
      setOrders(mappedOrders);
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert('Gagal memuat pesanan: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

const fetchStats = async () => {
  try {
    const response = await orderAPI.getOrderStats();
    console.log('✅ Stats received:', response);
    setStats(response.data);
  } catch (error: any) {
    console.error('❌ Error fetching stats:', error);
  }
};

// Helper: Map frontend status to backend status
const mapFrontendToBackendStatus = (frontendStatus: string) => {
  const statusMap: { [key: string]: string } = {
    'pending_payment': 'pending',
    'processing': 'confirmed',
    'shipped': 'shipping',
    'completed': 'delivered',
    'cancelled': 'cancelled'
  };
  return statusMap[frontendStatus] || frontendStatus;
};

// Helper: Map backend status to frontend status
const mapBackendToFrontendStatus = (backendStatus: string) => {
  const statusMap: { [key: string]: string } = {
    'pending': 'pending_payment',
    'confirmed': 'processing',
    'shipping': 'shipped',
    'delivered': 'completed',
    'cancelled': 'cancelled'
  };
  return statusMap[backendStatus] || backendStatus;
};

  // Mock analytics data
  const weeklyTrend = [
    { day: 'Sen', orders: 12 },
    { day: 'Sel', orders: 19 },
    { day: 'Rab', orders: 15 },
    { day: 'Kam', orders: 22 },
    { day: 'Jum', orders: 18 },
    { day: 'Sab', orders: 25 },
    { day: 'Min', orders: 20 }
  ];

  const weeklyRevenue = [
    { day: 'Sen', revenue: 30000000 },
    { day: 'Sel', revenue: 47500000 },
    { day: 'Rab', orders: 37500000 },
    { day: 'Kam', revenue: 55000000 },
    { day: 'Jum', revenue: 45000000 },
    { day: 'Sab', revenue: 62500000 },
    { day: 'Min', revenue: 50000000 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      pending_payment: { 
        label: 'Menunggu Pembayaran', 
        bgColor: '#FEF3C7',
        textColor: '#92400E'
      },
      processing: { 
        label: 'Diproses', 
        bgColor: '#DBEAFE',
        textColor: '#1E40AF'
      },
      shipped: { 
        label: 'Dikirim', 
        bgColor: '#EDE9FE',
        textColor: '#5B21B6'
      },
      completed: { 
        label: 'Selesai', 
        bgColor: '#D1FAE5',
        textColor: '#065F46'
      },
      cancelled: { 
        label: 'Dibatalkan', 
        bgColor: '#FEE2E2',
        textColor: '#991B1B'
      }
    };
    return configs[status];
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const getTotalRevenue = () => {
    return orders
      .filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + order.totalPrice, 0);
  };

  const getStatusDistribution = () => {
    const statuses = ['pending_payment', 'processing', 'shipped', 'completed', 'cancelled'];
    return statuses.map(status => ({
      name: getStatusConfig(status as Order['status']).label,
      value: getStatusCount(status),
      color: status === 'pending_payment' ? '#F59E0B' :
             status === 'processing' ? '#3B82F6' :
             status === 'shipped' ? '#8B5CF6' :
             status === 'completed' ? '#10B981' : '#EF4444'
    }));
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowUpdateModal(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      const backendStatus = mapFrontendToBackendStatus(newStatus);
      
      // Extract order ID from order_number (ORD-YYYYMMDD-XXXXX)
      const orderId = parseInt(selectedOrder.id.split('-').pop() || '0');
      
      await orderAPI.updateOrderStatus(orderId, backendStatus);
      
      alert(`✅ Status pesanan ${selectedOrder.id} berhasil diupdate`);
      setShowUpdateModal(false);
      
      // Refresh data
      fetchOrders();
      fetchStats();
    } catch (error: any) {
      alert('❌ Gagal update status: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pesanan ${orderId}?`)) {
      setOrders(orders.filter(o => o.id !== orderId));
      alert(`Pesanan ${orderId} berhasil dihapus`);
      if (showDetailModal) setShowDetailModal(false);
    }
  };

  const handleExportData = () => {
    alert('Fitur export data akan segera tersedia!');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 style={{ color: '#1F2937' }}>Kelola Pesanan</h2>
          <p className="text-gray-600 mt-1">Kelola dan pantau semua pesanan pelanggan Robot Temanikan</p>
        </div>
        <Button 
          className="text-white flex items-center gap-2"
          style={{ backgroundColor: '#4880FF' }}
          onClick={handleExportData}
        >
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      {/* Statistics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card 
          className="p-6 rounded-xl shadow-sm border-l-4"
          style={{ 
            backgroundColor: 'white', 
            borderLeftColor: '#4880FF'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
              <p className="text-3xl" style={{ color: '#4880FF' }}>{stats ? stats.total_orders : getStatusCount('all')}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E0EAFF' }}>
              <ShoppingBag className="w-6 h-6" style={{ color: '#4880FF' }} />
            </div>
          </div>
        </Card>

        <Card 
          className="p-6 rounded-xl shadow-sm border-l-4"
          style={{ 
            backgroundColor: 'white', 
            borderLeftColor: '#F59E0B'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Menunggu Pembayaran</p>
              <p className="text-3xl" style={{ color: '#F59E0B' }}>{stats ? stats.pending_orders : getStatusCount('pending_payment')}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
              <Clock className="w-6 h-6" style={{ color: '#F59E0B' }} />
            </div>
          </div>
        </Card>

        <Card 
          className="p-6 rounded-xl shadow-sm border-l-4"
          style={{ 
            backgroundColor: 'white', 
            borderLeftColor: '#3B82F6'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Diproses</p>
              <p className="text-3xl" style={{ color: '#3B82F6' }}>{stats ? stats.confirmed_orders : getStatusCount('processing')}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
              <Package className="w-6 h-6" style={{ color: '#3B82F6' }} />
            </div>
          </div>
        </Card>

        <Card 
          className="p-6 rounded-xl shadow-sm border-l-4"
          style={{ 
            backgroundColor: 'white', 
            borderLeftColor: '#10B981'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Selesai</p>
              <p className="text-3xl" style={{ color: '#10B981' }}>{stats ? stats.delivered_orders : getStatusCount('completed')}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
              <CheckCircle className="w-6 h-6" style={{ color: '#10B981' }} />
            </div>
          </div>
        </Card>

        <Card 
          className="p-6 rounded-xl shadow-sm border-l-4"
          style={{ 
            backgroundColor: 'white', 
            borderLeftColor: '#8B5CF6'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-xl" style={{ color: '#8B5CF6' }}>
                {stats ? formatCurrency(stats.total_revenue) : formatCurrency(getTotalRevenue())}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EDE9FE' }}>
              <DollarSign className="w-6 h-6" style={{ color: '#8B5CF6' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2" style={{ backgroundColor: '#F3F4F6' }}>
          <TabsTrigger value="orders">Daftar Pesanan</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
        </TabsList>

        {/* Daftar Pesanan Tab */}
        <TabsContent value="orders" className="space-y-4 mt-6">
          {/* Search & Filter Bar */}
          <Card className="p-4" style={{ backgroundColor: 'white' }}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Cari berdasarkan nama pelanggan, no. pesanan, atau email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending_payment">Menunggu Pembayaran</SelectItem>
                  <SelectItem value="processing">Diproses</SelectItem>
                  <SelectItem value="shipped">Dikirim</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Orders Table */}
          <Card className="rounded-xl shadow-sm" style={{ backgroundColor: 'white' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: '#E5E7EB' }}>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>ID Pesanan</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Pelanggan</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Produk</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Jumlah</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Total Harga</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Tanggal Pesanan</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Status</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div 
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 mb-4"
                            style={{ borderColor: '#4880FF' }}
                          ></div>
                          <p className="text-lg font-semibold mb-2" style={{ color: '#4880FF' }}>
                            Memuat pesanan...
                          </p>
                          <p className="text-sm text-gray-600">
                            Mohon tunggu sebentar
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="mb-2" style={{ color: '#4880FF' }}>
                          Tidak Ada Pesanan
                        </h3>
                        <p className="text-gray-600">
                          Tidak ada pesanan yang sesuai dengan filter
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusConfig = getStatusConfig(order.status);
                      return (
                        <tr 
                          key={order.id} 
                          className="border-b hover:bg-gray-50 transition-colors" 
                          style={{ borderColor: '#E5E7EB' }}
                        >
                          {/* Table cells - tetap seperti sebelumnya */}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Analitik Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tren Pesanan Mingguan */}
            <Card className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" style={{ color: '#4880FF' }} />
                <h3 style={{ color: '#1F2937' }}>Tren Pesanan Mingguan</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#4880FF" 
                    strokeWidth={2}
                    dot={{ fill: '#4880FF', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Distribusi Status */}
            <Card className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'white' }}>
              <h3 className="mb-4" style={{ color: '#1F2937' }}>Distribusi Status Pesanan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getStatusDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getStatusDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue Mingguan */}
            <Card className="p-6 rounded-xl shadow-sm lg:col-span-2" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                <h3 style={{ color: '#1F2937' }}>Revenue Mingguan</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-md" style={{ backgroundColor: 'white' }}>
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle style={{ color: '#4880FF' }}>Detail Pesanan</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
                  <p className="text-sm text-gray-600 mb-1">ID Pesanan</p>
                  <p className="text-lg" style={{ color: '#4880FF' }}>{selectedOrder.id}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nama Customer</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Customer</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Produk</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Jumlah</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.quantity} unit</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tanggal Pesanan</p>
                    <p style={{ color: '#2D3436' }}>
                      {new Date(selectedOrder.orderDate).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Metode Pembayaran</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.paymentMethod}</p>
                  </div>
                  {selectedOrder.paymentProof && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Bukti Pembayaran</p>
                      <p className="text-sm" style={{ color: '#10B981' }}>✓ Sudah Upload</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Alamat Pengiriman</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge 
                      style={{ 
                        backgroundColor: getStatusConfig(selectedOrder.status).bgColor,
                        color: getStatusConfig(selectedOrder.status).textColor
                      }}
                    >
                      {getStatusConfig(selectedOrder.status).label}
                    </Badge>
                  </div>
                  <div className="border-t pt-3" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#2D3436' }}>Total Pembayaran</span>
                      <span className="text-2xl" style={{ color: '#4880FF' }}>
                        {formatCurrency(selectedOrder.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                >
                  Tutup
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleUpdateStatus(selectedOrder);
                  }}
                  style={{ backgroundColor: '#10B981', color: 'white' }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="max-w-md" style={{ backgroundColor: 'white' }}>
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle style={{ color: '#4880FF' }}>Update Status Pesanan</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
                  <p className="text-sm text-gray-600 mb-1">ID Pesanan</p>
                  <p style={{ color: '#4880FF' }}>{selectedOrder.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p style={{ color: '#2D3436' }}>{selectedOrder.customerName}</p>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: '#2D3436' }}>
                    Status Baru <span className="text-red-500">*</span>
                  </label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status baru" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending_payment">Menunggu Pembayaran</SelectItem>
                      <SelectItem value="processing">Diproses</SelectItem>
                      <SelectItem value="shipped">Dikirim</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newStatus && (
                  <div className="p-3 rounded-lg" style={{ backgroundColor: getStatusConfig(newStatus as Order['status']).bgColor }}>
                    <p className="text-sm" style={{ color: getStatusConfig(newStatus as Order['status']).textColor }}>
                      Status akan diupdate menjadi: <strong>{getStatusConfig(newStatus as Order['status']).label}</strong>
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveStatus}
                  style={{ backgroundColor: '#4880FF', color: 'white' }}
                  disabled={!newStatus || newStatus === selectedOrder.status}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
