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
  payment_proof?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface OrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState<any[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(null);
  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false);

  const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending', label: 'Menunggu Pembayaran' },
    { value: 'confirmed', label: 'Dikonfirmasi' },
    { value: 'shipping', label: 'Dikirim' },
    { value: 'delivered', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' }
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders({
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        search: searchQuery,
        date: selectedDate,
        per_page: rowsPerPage
      });
      if (response.success) {
        setOrders(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data pesanan');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await orderAPI.getOrderStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      console.log('📊 Fetching analytics...');
      const response = await orderAPI.getOrderAnalytics();
      console.log('✅ Analytics received:', response);

      if (response.success && response.data) {
        setWeeklyTrend(response.data.weekly_trend || []);
        setWeeklyRevenue(response.data.weekly_revenue || []);
        setStatusDistribution(response.data.status_distribution || null);
      }
    } catch (error: any) {
      console.error('❌ Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchAnalytics();
  }, [selectedStatus, searchQuery, selectedDate, rowsPerPage]);

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

        setSuccessMessage(`Status pesanan ${selectedOrder.order_number} berhasil diupdate ke "${getStatusConfig(newStatus).label}"`);
        setShowUpdateModal(false);
        setShowSuccessModal(true);
        fetchOrders();
        fetchStats();
        fetchAnalytics();
      } catch (error: any) {
        console.error('❌ Error updating status:', error);
        alert('Gagal update status: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleCloseSuccessModal = async () => {
    setShowSuccessModal(false);

    // Refresh data pesanan yang dipilih dengan data terbaru
    if (selectedOrder) {
      try {
        const response = await orderAPI.getAllOrders({});
        const updatedOrder = response.data.find((o: Order) => o.id === selectedOrder.id);
        if (updatedOrder) {
          setSelectedOrder(updatedOrder);
        }
      } catch (error) {
        console.error('Error refreshing order:', error);
      }
    }

    setShowDetailModal(true);
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

  const dialogOverlayStyle = {
    backdropFilter: 'none',
    background: 'rgba(15, 23, 42, 0.45)'
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
    // If we have data from backend, use it
    if (statusDistribution) {
      const statuses = [
        { key: 'pending_payment', label: 'Menunggu Pembayaran', color: '#F59E0B' },
        { key: 'processing', label: 'Diproses', color: '#3B82F6' },
        { key: 'shipped', label: 'Dikirim', color: '#8B5CF6' },
        { key: 'completed', label: 'Selesai', color: '#10B981' },
        { key: 'cancelled', label: 'Dibatalkan', color: '#EF4444' }
      ];

      return statuses.map(status => ({
        name: status.label,
        value: statusDistribution[status.key] || 0,
        color: status.color
      }));
    }

    // Fallback to local calculation
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

        // ✅ FIX: Correct response structure
        console.log('✅ Payment proof response:', response);

        if (response.success && response.data) {
          // Use correct path: response.data.mimetype (not response.data.data.mime_type)
          setPaymentProofImage(`data:${response.data.mimetype};base64,${response.data.base64}`);
        } else {
          console.warn('⚠️ No payment proof data in response');
          setPaymentProofImage(null);
        }
      } catch (error) {
        console.error('❌ Error loading payment proof:', error);
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
    try {
      // Prepare data untuk export
      const exportData = orders.map(order => ({
        'No. Pesanan': order.order_number,
        'Tanggal': formatDate(order.created_at),
        'Customer': order.user?.name || 'Customer',
        'Email': order.user?.email || '-',
        'Produk': order.product_name,
        'Jumlah': order.quantity,
        'Total Harga': order.total_price,
        'Metode Pembayaran': order.payment_method || '-',
        'Status Pesanan': getStatusConfig(order.status).label,
        'Status Pembayaran': order.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas',
        'Alamat Pengiriman': order.shipping_address || '-',
        'Catatan': order.notes || '-'
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row =>
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Handle values with commas or quotes
            const stringValue = String(value).replace(/"/g, '""');
            return stringValue.includes(',') || stringValue.includes('"')
              ? `"${stringValue}"`
              : stringValue;
          }).join(',')
        )
      ].join('\n');

      // Create BOM for Excel UTF-8 support
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

      // Download file
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `Pesanan_Temanikan_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
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
          <h2 style={{ color: '#FFFFFF', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>Kelola Pesanan</h2>
          <p className="mt-1" style={{ color: '#FFFFFF', fontFamily: 'Nunito Sans, sans-serif' }}>Kelola dan pantau semua pesanan pelanggan Robot Temanikan</p>
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
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Total Pesanan</p>
              <p className="text-3xl font-bold" style={{ color: '#4880FF', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{stats?.total_orders || getStatusCount('all')}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(72, 128, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
              }}
            >
              <ShoppingBag className="w-6 h-6" style={{ color: '#4880FF' }} />
            </div>
          </div>
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
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Menunggu Pembayaran</p>
              <p className="text-3xl font-bold" style={{ color: '#F59E0B', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{getStatusCount('pending_payment')}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)'
              }}
            >
              <Clock className="w-6 h-6" style={{ color: '#F59E0B' }} />
            </div>
          </div>
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
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Diproses</p>
              <p className="text-3xl font-bold" style={{ color: '#3B82F6', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{getStatusCount('processing')}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)'
              }}
            >
              <Package className="w-6 h-6" style={{ color: '#3B82F6' }} />
            </div>
          </div>
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
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Selesai</p>
              <p className="text-3xl font-bold" style={{ color: '#10B981', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>{getStatusCount('completed')}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
              }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: '#10B981' }} />
            </div>
          </div>
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
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Total Revenue</p>
              <p className="text-xl font-bold" style={{ color: '#8B5CF6', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 800 }}>
                {formatCurrency(stats?.total_revenue || getTotalRevenue()).replace('Rp', 'Rp ')}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(109, 40, 217, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)'
              }}
            >
              <DollarSign className="w-6 h-6" style={{ color: '#8B5CF6' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Section - Large Toggle Buttons */}
      <Tabs defaultValue="orders" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TabsList className="h-auto p-0 bg-transparent">
            <TabsTrigger
              value="orders"
              className="w-full data-[state=active]:bg-[#F3F3E0] data-[state=active]:border-2 data-[state=active]:border-[#4880FF] data-[state=active]:shadow-lg data-[state=inactive]:bg-white data-[state=inactive]:border-2 data-[state=inactive]:border-transparent hover:border-[#CBDCEB] p-6 rounded-xl transition-all shadow-sm h-auto"
            >
              <div className="flex items-center justify-center gap-3">
                <ShoppingBag className="w-6 h-6" style={{ color: '#4880FF' }} />
                <div className="text-left">
                  <h3 style={{ color: '#4880FF' }}>Daftar Pesanan</h3>
                  <p className="text-sm text-gray-600">Kelola semua pesanan</p>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsList className="h-auto p-0 bg-transparent">
            <TabsTrigger
              value="analytics"
              className="w-full data-[state=active]:bg-[#F3F3E0] data-[state=active]:border-2 data-[state=active]:border-[#4880FF] data-[state=active]:shadow-lg data-[state=inactive]:bg-white data-[state=inactive]:border-2 data-[state=inactive]:border-transparent hover:border-[#CBDCEB] p-6 rounded-xl transition-all shadow-sm h-auto"
            >
              <div className="flex items-center justify-center gap-3">
                <TrendingUp className="w-6 h-6" style={{ color: '#4880FF' }} />
                <div className="text-left">
                  <h3 style={{ color: '#4880FF' }}>Analitik</h3>
                  <p className="text-sm text-gray-600">Lihat statistik & tren</p>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="orders" className="space-y-6 mt-6">
          {/* Search and Filter Bar */}
          <Card 
            className="bubble-card p-4 transition-all duration-300 relative overflow-hidden"
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
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari pesanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Date Picker */}
              <div className="w-full md:w-[200px]">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter Status">
                    {statusFilterOptions.find(option => option.value === selectedStatus)?.label || 'Filter Status'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusFilterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Rows Per Page */}
              <Select value={rowsPerPage.toString()} onValueChange={(val) => setRowsPerPage(Number(val))}>
                <SelectTrigger className="w-full md:w-[100px]">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Rows</SelectItem>
                  <SelectItem value="25">25 Rows</SelectItem>
                  <SelectItem value="50">50 Rows</SelectItem>
                  <SelectItem value="80">80 Rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

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
              <div className="flex items-center gap-3 text-red-800 relative z-10">
                <Package className="w-5 h-5" />
                <div>
                  <p className="font-semibold" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>Gagal Memuat Pesanan</p>
                  <p className="text-sm" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>{error}</p>
                </div>
              </div>
              <Button
                onClick={fetchOrders}
                className="mt-4 relative z-10"
                variant="outline"
              >
                Coba Lagi
              </Button>
            </Card>
          )}

          {/* Orders Table */}
          <Card 
            className="bubble-card rounded-xl transition-all duration-300 relative overflow-hidden"
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
            <div className="overflow-x-auto relative z-10">
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
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <TrendingUp className="w-5 h-5" style={{ color: '#4880FF' }} />
                <h3 style={{ color: '#1F2937', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Tren Pesanan Mingguan</h3>
              </div>
              <div className="relative z-10">
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
              </div>
            </Card>

            {/* Distribusi Status */}
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
              <h3 className="mb-4 relative z-10" style={{ color: '#1F2937', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Distribusi Status Pesanan</h3>
              <div className="relative z-10">
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
              </div>
            </Card>

            {/* Revenue Mingguan */}
            <Card 
              className="bubble-card p-6 transition-all duration-300 relative overflow-hidden lg:col-span-2"
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
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <DollarSign className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                <h3 style={{ color: '#1F2937', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>Revenue Mingguan</h3>
              </div>
              <div className="relative z-10">
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[8, 8, 0, 0]}                   />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent
          className="w-[92vw] sm:max-w-md text-[12px] md:text-[13px] max-h-[80vh] overflow-y-auto"
          style={{ backgroundColor: 'white', fontFamily: '"Nunito Sans", sans-serif', borderRadius: '12px' }}
          overlayStyle={dialogOverlayStyle}
        >
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-semibold" style={{ color: '#4880FF', fontFamily: 'inherit' }}>
                  Detail Pesanan
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
                  <p className="text-gray-600 mb-1">ID Pesanan</p>
                  <p className="text-[13px] font-semibold" style={{ color: '#4880FF' }}>{selectedOrder.order_number}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 mb-1">Nama Customer</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.user?.name || 'Customer'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Email Customer</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.user?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Produk</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.product_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Jumlah</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.quantity} unit</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Tanggal Pesanan</p>
                    <p style={{ color: '#2D3436' }}>{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Metode Pembayaran</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.payment_method || '-'}</p>
                  </div>
                  {/* Payment Proof Section */}
                  {selectedOrder?.payment_proof && (
                    <div>
                      <p className="text-gray-600 mb-2">Bukti Pembayaran</p>
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
                    <p className="text-gray-600 mb-1">Alamat Pengiriman</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.shipping_address || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Status</p>
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
                      <span className="font-semibold" style={{ color: '#2D3436' }}>Total Pembayaran</span>
                      <span className="text-base md:text-lg font-bold" style={{ color: '#4880FF' }}>
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
        <DialogContent
          className="w-[95vw] sm:max-w-2xl text-[12px] md:text-[13px] max-h-[85vh] overflow-y-auto"
          style={{ backgroundColor: 'white', fontFamily: '"Nunito Sans", sans-serif', borderRadius: '12px' }}
          overlayStyle={dialogOverlayStyle}
        >
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-semibold" style={{ color: '#4880FF', fontFamily: 'inherit' }}>
                  Bukti Pembayaran - {selectedOrder.order_number}
                </DialogTitle>
              </DialogHeader>

              <div className="py-4 space-y-4">
                {paymentProofImage ? (
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#E5E7EB' }}>
                      <img
                        src={paymentProofImage}
                        alt="Bukti Pembayaran"
                        className="w-full h-auto max-h-[500px] object-contain bg-gray-50"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
                      <div>
                        <p className="text-gray-600">Customer</p>
                        <p style={{ color: '#2D3436' }}>{selectedOrder.user?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Pembayaran</p>
                        <p className="text-base md:text-lg font-semibold" style={{ color: '#4880FF' }}>
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

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
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

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md" style={{ backgroundColor: 'white' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#10B981' }}>Status Berhasil Diupdate</DialogTitle>
          </DialogHeader>

          <div className="py-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                <CheckCircle className="w-10 h-10" style={{ color: '#10B981' }} />
              </div>
              <p className="text-lg" style={{ color: '#2D3436' }}>
                {successMessage}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleCloseSuccessModal}
              style={{ backgroundColor: '#4880FF', color: 'white' }}
              className="w-full"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}