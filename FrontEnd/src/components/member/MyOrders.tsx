import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Package, ShoppingCart, CheckCircle, XCircle, Clock, Truck, CreditCard, Plus, Eye, Upload } from '../icons';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface Order {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: 'pending_payment' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  orderDate: string;
  paymentMethod: string;
  address?: string;
  customerName?: string;
}

export default function MyOrders() {
  const [activeView, setActiveView] = useState<'create' | 'list'>('create');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderId, setNewOrderId] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  
  // Store the confirmed order data for success modal
  const [confirmedOrderData, setConfirmedOrderData] = useState({
    quantity: 1,
    address: '',
    city: '',
    province: '',
    postalCode: '',
    paymentMethod: '',
    customerName: 'Roma Juliana' // From auth context in real app
  });
  
  // Order Form State
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    address: '',
    city: '',
    province: '',
    postalCode: '',
    paymentMethod: ''
  });

  // Product Info
  const product = {
    name: 'Robot Temanikan - Smart Aquarium Cleaner',
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400',
    price: 2500000,
    description: 'Robot pembersih akuarium otomatis dengan AI detection terintegrasi'
  };

  // Mock Orders Data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-2023-11-20-001',
      productName: 'Robot Temanikan',
      quantity: 1,
      totalPrice: 2500000,
      status: 'completed',
      orderDate: '2023-11-20',
      paymentMethod: 'Transfer Bank',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110',
      customerName: 'Roma Juliana'
    },
    {
      id: 'ORD-2023-11-15-002',
      productName: 'Robot Temanikan',
      quantity: 1,
      totalPrice: 2500000,
      status: 'shipped',
      orderDate: '2023-11-15',
      paymentMethod: 'E-Wallet',
      address: 'Jl. Gatot Subroto No. 456, Jakarta Selatan, DKI Jakarta 12950',
      customerName: 'Roma Juliana'
    },
    {
      id: 'ORD-2023-11-10-003',
      productName: 'Robot Temanikan',
      quantity: 2,
      totalPrice: 5000000,
      status: 'processing',
      orderDate: '2023-11-10',
      paymentMethod: 'Transfer Bank',
      address: 'Jl. Thamrin No. 789, Jakarta Pusat, DKI Jakarta 10230',
      customerName: 'Roma Juliana'
    },
    {
      id: 'ORD-2023-11-05-004',
      productName: 'Robot Temanikan',
      quantity: 1,
      totalPrice: 2500000,
      status: 'pending_payment',
      orderDate: '2023-11-05',
      paymentMethod: 'Transfer Bank',
      address: 'Jl. Kuningan No. 321, Jakarta Selatan, DKI Jakarta 12940',
      customerName: 'Roma Juliana'
    },
    {
      id: 'ORD-2023-11-01-005',
      productName: 'Robot Temanikan',
      quantity: 1,
      totalPrice: 2500000,
      status: 'cancelled',
      orderDate: '2023-11-01',
      paymentMethod: 'E-Wallet',
      address: 'Jl. Rasuna Said No. 654, Jakarta Selatan, DKI Jakarta 12920',
      customerName: 'Roma Juliana'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    return product.price * orderForm.quantity;
  };

  const isFormValid = () => {
    return (
      orderForm.address.trim() !== '' &&
      orderForm.city.trim() !== '' &&
      orderForm.province !== '' &&
      orderForm.postalCode.trim() !== '' &&
      orderForm.paymentMethod !== ''
    );
  };

  const generateOrderId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}-${month}-${day}-${random}`;
  };

  const getPaymentMethodLabel = (method: string) => {
    if (method === 'bank_transfer') return 'Transfer Bank';
    if (method === 'ewallet') return 'E-Wallet';
    if (method === 'credit_card') return 'Kartu Kredit';
    return method;
  };

  const handleSubmitOrder = () => {
    if (!isFormValid()) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Generate new order
    const orderId = generateOrderId();
    setNewOrderId(orderId);

    // Store confirmed order data for modal display
    setConfirmedOrderData({
      ...orderForm,
      customerName: 'Roma Juliana'
    });

    const newOrder: Order = {
      id: orderId,
      productName: product.name,
      quantity: orderForm.quantity,
      totalPrice: calculateTotal(),
      status: 'pending_payment',
      orderDate: new Date().toISOString().split('T')[0],
      paymentMethod: getPaymentMethodLabel(orderForm.paymentMethod),
      address: `${orderForm.address}, ${orderForm.city}, ${orderForm.province} ${orderForm.postalCode}`,
      customerName: 'Roma Juliana'
    };

    setOrders([newOrder, ...orders]);
    setShowSuccessModal(true);

    // Reset form
    setOrderForm({
      quantity: 1,
      address: '',
      city: '',
      province: '',
      postalCode: '',
      paymentMethod: ''
    });
  };

  const handleViewOrders = () => {
    setShowSuccessModal(false);
    setActiveView('list');
  };

  const handlePayNow = () => {
    setShowSuccessModal(false);
    // Find the newly created order
    const newOrder = orders.find(o => o.id === newOrderId);
    if (newOrder) {
      setSelectedOrder(newOrder);
      setShowPaymentModal(true);
    }
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handlePayOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmitPaymentProof = () => {
    if (!paymentProof) {
      alert('Mohon upload bukti pembayaran terlebih dahulu');
      return;
    }
    alert(`Bukti pembayaran "${paymentProof.name}" berhasil diupload! Pembayaran akan diverifikasi dalam 1x24 jam.`);
    setShowPaymentModal(false);
    setPaymentProof(null);
  };

  const getPaymentInstructions = (paymentMethod: string) => {
    if (paymentMethod.includes('Transfer Bank') || paymentMethod === 'bank_transfer') {
      return {
        title: 'Instruksi Transfer Bank',
        steps: [
          'Transfer ke rekening berikut:',
          'Bank BCA: 1234567890',
          'A.n. PT Temanikan Indonesia',
          `Total yang harus dibayar: ${selectedOrder ? formatCurrency(selectedOrder.totalPrice) : ''}`,
          'Setelah transfer, upload bukti pembayaran di bawah ini'
        ]
      };
    } else if (paymentMethod.includes('E-Wallet') || paymentMethod === 'ewallet') {
      return {
        title: 'Instruksi E-Wallet',
        steps: [
          'Scan QR Code berikut menggunakan aplikasi GoPay/OVO/DANA:',
          '[QR CODE PLACEHOLDER]',
          `Total yang harus dibayar: ${selectedOrder ? formatCurrency(selectedOrder.totalPrice) : ''}`,
          'Setelah pembayaran berhasil, upload screenshot bukti pembayaran'
        ]
      };
    } else {
      return {
        title: 'Instruksi Pembayaran Kartu Kredit',
        steps: [
          'Masukkan detail kartu kredit Anda',
          'Verifikasi dengan OTP yang dikirim ke nomor HP terdaftar',
          `Total yang harus dibayar: ${selectedOrder ? formatCurrency(selectedOrder.totalPrice) : ''}`,
          'Klik "Bayar" untuk menyelesaikan transaksi'
        ]
      };
    }
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
    if (status === 'total') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const formValid = isFormValid();

  return (
    <div className="space-y-6">
      {/* Large Toggle Tabs */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveView('create')}
          className={`p-6 rounded-xl transition-all border-2 ${
            activeView === 'create'
              ? 'border-[#4880FF] shadow-lg'
              : 'border-transparent bg-white hover:border-[#CBDCEB]'
          }`}
          style={{ 
            backgroundColor: activeView === 'create' ? '#F3F3E0' : 'white'
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <Plus className="w-6 h-6" style={{ color: '#4880FF' }} />
            <div className="text-left">
              <h3 style={{ color: '#4880FF' }}>Buat Pesanan Baru</h3>
              <p className="text-sm text-gray-600">Pesan Robot Temanikan</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setActiveView('list')}
          className={`p-6 rounded-xl transition-all border-2 ${
            activeView === 'list'
              ? 'border-[#4880FF] shadow-lg'
              : 'border-transparent bg-white hover:border-[#CBDCEB]'
          }`}
          style={{ 
            backgroundColor: activeView === 'list' ? '#F3F3E0' : 'white'
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <Package className="w-6 h-6" style={{ color: '#4880FF' }} />
            <div className="text-left">
              <h3 style={{ color: '#4880FF' }}>Pesanan Saya</h3>
              <p className="text-sm text-gray-600">Lihat riwayat pesanan</p>
            </div>
          </div>
        </button>
      </div>

      {/* View A: Buat Pesanan Baru */}
      {activeView === 'create' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6" style={{ backgroundColor: 'white' }}>
              <h3 className="mb-4" style={{ color: '#4880FF' }}>Produk</h3>
              <div className="flex gap-6">
                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden" style={{ backgroundColor: '#CBDCEB' }}>
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="mb-2" style={{ color: '#2D3436' }}>{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  <p className="text-2xl" style={{ color: '#4880FF' }}>
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6" style={{ backgroundColor: 'white' }}>
              <h3 className="mb-6" style={{ color: '#4880FF' }}>Detail Pesanan</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#2D3436' }}>
                    Jumlah
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOrderForm({ ...orderForm, quantity: Math.max(1, orderForm.quantity - 1) })}
                      disabled={orderForm.quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 1 })}
                      className="w-20 text-center"
                      min="1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOrderForm({ ...orderForm, quantity: orderForm.quantity + 1 })}
                    >
                      +
                    </Button>
                    <span className="text-sm text-gray-600 ml-2">
                      Total: <span style={{ color: '#4880FF' }}>{formatCurrency(calculateTotal())}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: '#2D3436' }}>
                    Alamat Pengiriman <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                    placeholder="Jalan, nomor rumah, RT/RW"
                    rows={3}
                    className={orderForm.address ? 'border-green-300' : ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#2D3436' }}>
                      Kota <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={orderForm.city}
                      onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })}
                      placeholder="Nama kota"
                      className={orderForm.city ? 'border-green-300' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#2D3436' }}>
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <Select 
                      value={orderForm.province} 
                      onValueChange={(value) => setOrderForm({ ...orderForm, province: value })}
                    >
                      <SelectTrigger className={orderForm.province ? 'border-green-300' : ''}>
                        <SelectValue placeholder="Pilih provinsi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DKI Jakarta">DKI Jakarta</SelectItem>
                        <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                        <SelectItem value="Jawa Tengah">Jawa Tengah</SelectItem>
                        <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
                        <SelectItem value="Bali">Bali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: '#2D3436' }}>
                    Kode Pos <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={orderForm.postalCode}
                    onChange={(e) => setOrderForm({ ...orderForm, postalCode: e.target.value })}
                    placeholder="12345"
                    className={orderForm.postalCode ? 'border-green-300' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: '#2D3436' }}>
                    Metode Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    value={orderForm.paymentMethod} 
                    onValueChange={(value) => setOrderForm({ ...orderForm, paymentMethod: value })}
                  >
                    <SelectTrigger className={orderForm.paymentMethod ? 'border-green-300' : ''}>
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
                      <SelectItem value="ewallet">E-Wallet (GoPay/OVO/DANA)</SelectItem>
                      <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card 
              className={`p-6 sticky top-20 transition-all ${formValid ? '' : 'opacity-50'}`}
              style={{ backgroundColor: 'white' }}
            >
              <h3 className="mb-4" style={{ color: '#4880FF' }}>Ringkasan Pesanan</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Produk</span>
                  <span style={{ color: '#2D3436' }}>{product.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jumlah</span>
                  <span style={{ color: '#2D3436' }}>{orderForm.quantity} unit</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span style={{ color: '#4880FF' }}>{formatCurrency(calculateTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className="text-green-600">Gratis</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6" style={{ borderColor: '#CBDCEB' }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#2D3436' }}>Total</span>
                  <span className="text-2xl" style={{ color: '#4880FF' }}>
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>

              {!formValid && (
                <p className="text-xs text-red-500 mb-3 text-center">
                  Lengkapi semua field yang wajib diisi (*)
                </p>
              )}

              <Button
                className={`w-full text-white transition-all ${formValid ? '' : 'cursor-not-allowed'}`}
                style={{ backgroundColor: formValid ? '#4880FF' : '#9CA3AF' }}
                onClick={handleSubmitOrder}
                disabled={!formValid}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buat Pesanan
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* View B: Pesanan Saya */}
      {activeView === 'list' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-4 text-center" style={{ backgroundColor: 'white', borderLeft: '4px solid #4880FF' }}>
              <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
              <p className="text-3xl" style={{ color: '#4880FF' }}>{getStatusCount('total')}</p>
            </Card>
            <Card className="p-4 text-center" style={{ backgroundColor: 'white', borderLeft: '4px solid #F59E0B' }}>
              <p className="text-sm text-gray-600 mb-1">Menunggu Pembayaran</p>
              <p className="text-3xl" style={{ color: '#F59E0B' }}>{getStatusCount('pending_payment')}</p>
            </Card>
            <Card className="p-4 text-center" style={{ backgroundColor: 'white', borderLeft: '4px solid #3B82F6' }}>
              <p className="text-sm text-gray-600 mb-1">Diproses</p>
              <p className="text-3xl" style={{ color: '#3B82F6' }}>{getStatusCount('processing')}</p>
            </Card>
            <Card className="p-4 text-center" style={{ backgroundColor: 'white', borderLeft: '4px solid #8B5CF6' }}>
              <p className="text-sm text-gray-600 mb-1">Dikirim</p>
              <p className="text-3xl" style={{ color: '#8B5CF6' }}>{getStatusCount('shipped')}</p>
            </Card>
            <Card className="p-4 text-center" style={{ backgroundColor: 'white', borderLeft: '4px solid #10B981' }}>
              <p className="text-sm text-gray-600 mb-1">Selesai</p>
              <p className="text-3xl" style={{ color: '#10B981' }}>{getStatusCount('completed')}</p>
            </Card>
          </div>

          <Card style={{ backgroundColor: 'white' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: '#CBDCEB' }}>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>ID Pesanan</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Tanggal</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Produk</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Jumlah</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Total</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Status</th>
                    <th className="px-6 py-4 text-left text-sm" style={{ color: '#4880FF' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="mb-2" style={{ color: '#4880FF' }}>Belum Ada Pesanan</h3>
                        <p className="text-gray-600 mb-4">Anda belum memiliki riwayat pesanan</p>
                        <Button
                          onClick={() => setActiveView('create')}
                          style={{ backgroundColor: '#4880FF', color: 'white' }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Buat Pesanan Pertama
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const statusConfig = getStatusConfig(order.status);
                      return (
                        <tr key={order.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#CBDCEB' }}>
                          <td className="px-6 py-4">
                            <span className="text-sm" style={{ color: '#4880FF' }}>{order.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">
                              {new Date(order.orderDate).toLocaleDateString('id-ID')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{order.productName}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{order.quantity} unit</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm" style={{ color: '#4880FF' }}>
                              {formatCurrency(order.totalPrice)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge 
                              className="px-2 py-1"
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
                              {order.status === 'pending_payment' && (
                                <Button
                                  size="sm"
                                  className="text-white"
                                  style={{ backgroundColor: '#4880FF' }}
                                  onClick={() => handlePayOrder(order)}
                                >
                                  <CreditCard className="w-3 h-3 mr-1" />
                                  Bayar
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                style={{ borderColor: '#4880FF', color: '#4880FF' }}
                                onClick={() => handleViewDetail(order)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Detail
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
        </div>
      )}

      {/* Success Modal - Dynamic Data */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md" style={{ backgroundColor: 'white' }}>
          <DialogHeader>
            <div className="flex justify-between items-start">
              <DialogTitle className="flex items-center gap-3" style={{ color: '#4880FF' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                  <CheckCircle className="w-7 h-7" style={{ color: '#10B981' }} />
                </div>
                <span>Pesanan Berhasil Dibuat!</span>
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
              <p className="text-sm text-gray-600 mb-1">ID Pesanan</p>
              <p className="text-xl" style={{ color: '#4880FF' }}>{newOrderId}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nama Pemesan</span>
                <span style={{ color: '#2D3436' }}>{confirmedOrderData.customerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Produk</span>
                <span style={{ color: '#2D3436' }}>{product.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Jumlah</span>
                <span style={{ color: '#2D3436' }}>{confirmedOrderData.quantity} unit</span>
              </div>
              <div className="text-sm">
                <p className="text-gray-600 mb-1">Alamat Pengiriman</p>
                <p style={{ color: '#2D3436' }}>
                  {confirmedOrderData.address}, {confirmedOrderData.city}, {confirmedOrderData.province} {confirmedOrderData.postalCode}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Metode Pembayaran</span>
                <span style={{ color: '#2D3436' }}>
                  {getPaymentMethodLabel(confirmedOrderData.paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2" style={{ borderColor: '#CBDCEB' }}>
                <span style={{ color: '#2D3436' }}>Total</span>
                <span className="text-xl" style={{ color: '#4880FF' }}>
                  {formatCurrency(product.price * confirmedOrderData.quantity)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
              <Badge style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                Menunggu Pembayaran
              </Badge>
            </div>

            <div className="text-sm text-gray-600 p-3 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
              <p className="mb-2">Langkah selanjutnya:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Lakukan pembayaran sesuai metode yang dipilih</li>
                <li>Upload bukti pembayaran pada halaman pembayaran</li>
                <li>Pesanan akan diproses setelah pembayaran terverifikasi</li>
              </ol>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleViewOrders}
              style={{ borderColor: '#4880FF', color: '#4880FF' }}
            >
              Lihat Pesanan Saya
            </Button>
            <Button
              onClick={handlePayNow}
              style={{ backgroundColor: '#4880FF', color: 'white' }}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Bayar Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    <p className="text-sm text-gray-600 mb-1">Nama Pemesan</p>
                    <p style={{ color: '#2D3436' }}>{selectedOrder.customerName}</p>
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
                  {selectedOrder.address && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Alamat Pengiriman</p>
                      <p style={{ color: '#2D3436' }}>{selectedOrder.address}</p>
                    </div>
                  )}
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
                  <div className="border-t pt-3" style={{ borderColor: '#CBDCEB' }}>
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#2D3436' }}>Total Pembayaran</span>
                      <span className="text-2xl" style={{ color: '#4880FF' }}>
                        {formatCurrency(selectedOrder.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                >
                  Tutup
                </Button>
                {selectedOrder.status === 'pending_payment' && (
                  <Button
                    onClick={() => {
                      setShowDetailModal(false);
                      handlePayOrder(selectedOrder);
                    }}
                    style={{ backgroundColor: '#4880FF', color: 'white' }}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Bayar Sekarang
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Instruction Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-lg" style={{ backgroundColor: 'white' }}>
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle style={{ color: '#4880FF' }}>
                  {getPaymentInstructions(selectedOrder.paymentMethod).title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
                  <p className="text-sm text-gray-600 mb-1">ID Pesanan</p>
                  <p style={{ color: '#4880FF' }}>{selectedOrder.id}</p>
                </div>

                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#4880FF', backgroundColor: '#F0F9FF' }}>
                  <ol className="space-y-2">
                    {getPaymentInstructions(selectedOrder.paymentMethod).steps.map((step, index) => (
                      <li key={index} className="text-sm" style={{ color: '#2D3436' }}>
                        {step.includes('QR CODE') ? (
                          <div className="mt-2 p-8 bg-white rounded-lg text-center border" style={{ borderColor: '#CBDCEB' }}>
                            <div className="w-48 h-48 mx-auto flex items-center justify-center" style={{ backgroundColor: '#F3F4F6' }}>
                              <p className="text-sm text-gray-500">QR Code Placeholder</p>
                            </div>
                          </div>
                        ) : (
                          step
                        )}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 style={{ color: '#2D3436' }}>Upload Bukti Pembayaran</h4>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: '#CBDCEB' }}>
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-3">
                      {paymentProof ? paymentProof.name : 'Pilih file atau drag & drop di sini'}
                    </p>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Format: JPG, PNG, atau PDF (Max 5MB)
                  </p>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentProof(null);
                  }}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSubmitPaymentProof}
                  style={{ backgroundColor: '#4880FF', color: 'white' }}
                  disabled={!paymentProof}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Bukti Pembayaran
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
