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
  id: number;
  order_number: string;
  product_name: string;
  quantity: number;
  total_price: number;
  status: string;
  payment_status: string;
  shipping_address?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  payment_proof?: string;  // ← ADD THIS LINE
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface OrderStats {
  total_orders: number;
  total_revenue: number;
  recent_orders: number;
  status_breakdown: { [key: string]: number };
}

export default function AdminOrders() {
  // State management
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(null);
  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false);
  
  // Data from backend
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock analytics data (will be replaced with real data later)
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
    { day: 'Rab', revenue: 37500000 },
    { day: 'Kam', revenue: 55000000 },
    { day: 'Jum', revenue: 45000000 },
    { day: 'Sab', revenue: 62500000 },
    { day: 'Min', revenue: 50000000 }
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [selectedStatus, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Admin fetching orders...');
      
      const filters: any = {};
      if (selectedStatus !== 'all') {
        filters.status = selectedStatus;
      }
      if (searchQuery) {
        filters.search = searchQuery;
      }
      
      const response = await orderAPI.getAllOrders(filters);
      
      console.log('✅ Admin orders received:', response);
      setOrders(response.data || []);
    } catch (error: any) {
      console.error('❌ Error fetching orders:', error);
      setError(error.response?.data?.error || 'Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('📡 Fetching stats...');
      
      const response = await orderAPI.getOrderStats();
      
      console.log('✅ Stats received:', response);
      setStats(response.data);
    } catch (error: any) {
      console.error('❌ Error fetching stats:', error);
    }
  };

  const handleUpdateStatus = async (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowUpdateModal(true);
  };

  const handleSaveStatus = async () => {
    if (selectedOrder && newStatus) {
      try {
        console.log('📤 Updating order status:', { orderId: selectedOrder.id, newStatus });
        
        await orderAPI.updateOrderStatus(selectedOrder.id, newStatus);
        
        alert(`Status pesanan ${selectedOrder.order_number} berhasil diupdate ke "${getStatusConfig(newStatus).label}"`);
        setShowUpdateModal(false);
        fetchOrders();
        fetchStats();
      } catch (error: any) {
        console.error('❌ Error updating status:', error);
        alert('Gagal update status: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      pending: { 
        label: 'Menunggu Pembayaran', 
        bgColor: '#FEF3C7',
        textColor: '#92400E'
      },
      confirmed: { 
        label: 'Diproses', 
        bgColor: '#DBEAFE',
        textColor: '#1E40AF'
      },
      processing: { 
        label: 'Diproses', 
        bgColor: '#DBEAFE',
        textColor: '#1E40AF'
      },
      shipping: { 
        label: 'Dikirim', 
        bgColor: '#EDE9FE',
        textColor: '#5B21B6'
      },
      delivered: { 
        label: 'Selesai', 
        bgColor: '#D1FAE5',
        textColor: '#065F46'
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
    return configs[status] || configs.pending;
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return orders.length;
    if (status === 'pending_payment') return orders.filter(o => o.payment_status === 'pending').length;
    if (status === 'processing') return orders.filter(o => o.status === 'confirmed' || o.status === 'processing').length;
    if (status === 'shipped') return orders.filter(o => o.status === 'shipping').length;
    if (status === 'completed') return orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
    return orders.filter(order => order.status === status).length;
  };

  const getTotalRevenue = () => {
    return orders
      .filter(o => o.status === 'delivered' || o.status === 'completed')
      .reduce((sum, order) => sum + order.total_price, 0);
  };

  const getStatusDistribution = () => {
    const statuses = [
      { key: 'pending_payment', label: 'Menunggu Pembayaran', color: '#F59E0B' },
      { key: 'processing', label: 'Diproses', color: '#3B82F6' },
      { key: 'shipped', label: 'Dikirim', color: '#8B5CF6' },
      { key: 'completed', label: 'Selesai', color: '#10B981' },
      { key: 'cancelled', label: 'Dibatalkan', color: '#EF4444' }
    ];
    
    return statuses.map(status => ({
      name: status.label,
      value: getStatusCount(status.key),
      color: status.color
    }));
  };

  const handleViewDetail = async (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
    
    // Load payment proof if exists
    if (order.payment_proof) {
      try {
        console.log('📥 Loading payment proof for order:', order.id);
        const response = await orderAPI.getPaymentProof(order.id);
        setPaymentProofImage(`data:${response.data.data.mime_type};base64,${response.data.data.base64}`);
      } catch (error) {
        console.error('Error loading payment proof:', error);
        setPaymentProofImage(null);
      }
    } else {
      setPaymentProofImage(null);
    }
  };

  const handleViewPaymentProof = () => {
    setShowDetailModal(false);
    setShowPaymentProofModal(true);
  };

  const handleExportData = () => {
    alert('Fitur export data akan segera tersedia!');
  };

  // Loading state
  if (loading && !stats) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-3xl" style={{ color: '#4880FF' }}>{stats?.total_orders || getStatusCount('all')}</p>
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
              <p className="text-3xl" style={{ color: '#F59E0B' }}>{getStatusCount('pending_payment')}</p>
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
              <p className="text-3xl" style={{ color: '#3B82F6' }}>{getStatusCount('processing')}</p>
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
              <p className="text-3xl" style={{ color: '#10B981' }}>{getStatusCount('completed')}</p>
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
                {formatCurrency(stats?.total_revenue || getTotalRevenue()).replace('Rp', 'Rp ')}
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
                  <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                  <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                  <SelectItem value="shipping">Dikirim</SelectItem>
                  <SelectItem value="delivered">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {error && (
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="flex items-center gap-3 text-red-800">
                <Package className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Gagal Memuat Pesanan</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
              <Button 
                onClick={fetchOrders} 
                className="mt-4"
                variant="outline"
              >
                Coba Lagi
              </Button>
            </Card>
          )}

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
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="mb-2" style={{ color: '#4880FF' }}>Tidak Ada Pesanan</h3>
                        <p className="text-gray-600">Tidak ada pesanan yang sesuai dengan filter</p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const statusConfig = getStatusConfig(order.status);
                      const customerName = order.user?.name || 'Customer';
                      const customerEmail = order.user?.email || '-';
                      
                      return (
                        <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB' }}>
                          <td className="px-6 py-4">
                            <span className="text-sm" style={{ color: '#4880FF' }}>{order.order_number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E0EAFF' }}>
                                <span style={{ color: '#4880FF' }}>{customerName.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="text-sm" style={{ color: '#2D3436' }}>{customerName}</p>
                                <p className="text-xs text-gray-500">{customerEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{order.product_name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{order.quantity} unit</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm" style={{ color: '#4880FF' }}>
                              {formatCurrency(order.total_price)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">
                              {formatDate(order.created_at)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge 
                              className="px-3 py-1"
                              style={{ 
                                backgroundColor: statusConfig.bgColor,
                                color: statusConfig.textColor
                              }}
                            >
                              {statusConfig.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                style={{ borderColor: '#4880FF', color: '#4880FF' }}
                                onClick={() => handleViewDetail(order)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Detail
                              </Button>
                              <Button
                                size="sm"
                                className="text-white"
                                style={{ backgroundColor: '#10B981' }}
                                onClick={() => handleUpdateStatus(order)}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Update
                              </Button>
                            </div>
                          </td>
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
                  <p className="text-lg" style={{ color: '#4880FF' }}>{selectedOrder.order_number}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nama Customer</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.user?.name || 'Customer'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Customer</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.user?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Produk</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.product_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Jumlah</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.quantity} unit</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tanggal Pesanan</p>
                    <p style={{ color: '#2D3436' }}>{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Metode Pembayaran</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.payment_method || '-'}</p>
                  </div>
                  {/* Payment Proof Section */}
                  {selectedOrder?.payment_proof && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Bukti Pembayaran</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm" style={{ color: '#10B981' }}>
                          <CheckCircle className="w-4 h-4" />
                          <span>Sudah Upload</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          style={{ borderColor: '#4880FF', color: '#4880FF' }}
                          onClick={handleViewPaymentProof}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Lihat Bukti
                        </Button>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Alamat Pengiriman</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.shipping_address || '-'}</p>
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
                        {formatCurrency(selectedOrder.total_price)}
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

      {/* Payment Proof Modal - MODAL BARU */}
      <Dialog open={showPaymentProofModal} onOpenChange={setShowPaymentProofModal}>
        <DialogContent className="max-w-2xl" style={{ backgroundColor: 'white' }}>
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle style={{ color: '#4880FF' }}>
                  Bukti Pembayaran - {selectedOrder.order_number}
                </DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                {paymentProofImage ? (
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#E5E7EB' }}>
                      <img 
                        src={paymentProofImage} 
                        alt="Bukti Pembayaran"
                        className="w-full h-auto max-h-[500px] object-contain bg-gray-50"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
                      <div>
                        <p className="text-sm text-gray-600">Customer</p>
                        <p style={{ color: '#2D3436' }}>{selectedOrder.user?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Pembayaran</p>
                        <p className="text-xl" style={{ color: '#4880FF' }}>
                          Rp {selectedOrder.total_price?.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Bukti pembayaran tidak tersedia</p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentProofModal(false);
                    setShowDetailModal(true);
                  }}
                >
                  Kembali
                </Button>
                {paymentProofImage && (
                  <Button
                    style={{ backgroundColor: '#4880FF', color: 'white' }}
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = paymentProofImage;
                      link.download = `bukti_pembayaran_${selectedOrder.order_number}.jpg`;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
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
                  <p style={{ color: '#4880FF' }}>{selectedOrder.order_number}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p style={{ color: '#2D3436' }}>{selectedOrder.user?.name || 'Customer'}</p>
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
                      <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                      <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                      <SelectItem value="shipping">Dikirim</SelectItem>
                      <SelectItem value="delivered">Selesai</SelectItem>
                      <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newStatus && (
                  <div className="p-3 rounded-lg" style={{ backgroundColor: getStatusConfig(newStatus).bgColor }}>
                    <p className="text-sm" style={{ color: getStatusConfig(newStatus).textColor }}>
                      Status akan diupdate menjadi: <strong>{getStatusConfig(newStatus).label}</strong>
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