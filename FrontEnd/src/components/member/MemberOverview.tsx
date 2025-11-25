import { Link, useParams, useLocation } from '../Router';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Droplets, Thermometer, Eye, Bot, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock } from '../icons';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { deviceAPI } from '../../services/api';

export default function MemberOverview() {
  const location = useLocation();
  const { deviceId } = useParams<{ deviceId?: string }>();
  const { user } = useAuth();
  const userName = user?.name || "Pengguna";
  const [currentTime, setCurrentTime] = useState(new Date());
  const [phValue, setPhValue] = useState(7.0);
  const [tempValue, setTempValue] = useState(26.0);
  const [turbidityValue, setTurbidityValue] = useState(2.0);
  const [robotStatus, setRobotStatus] = useState('idle');
  const [robotBattery, setRobotBattery] = useState(87);
  const [deviceName, setDeviceName] = useState('Akuarium Ruang Tamu');

  // Fetch initial data from backend
  useEffect(() => {
    if (!deviceId) return;

    const fetchDashboardData = async () => {
      try {
        const numericDeviceId = parseInt(deviceId);

        // Fetch water data
        const waterResponse = await deviceAPI.getDashboardWaterLatest(numericDeviceId);
        if (waterResponse.success && waterResponse.data) {
          setPhValue(waterResponse.data.ph.value);
          setTempValue(waterResponse.data.temperature.value);
          setTurbidityValue(waterResponse.data.turbidity.value);
        }

        // Fetch robot status
        const robotResponse = await deviceAPI.getDashboardRobotStatus(numericDeviceId);
        if (robotResponse.success && robotResponse.data) {
          setRobotStatus(robotResponse.data.status);
          setRobotBattery(robotResponse.data.battery);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();

    // Refetch data every 30 seconds to get new dummy data from backend
    const fetchInterval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(fetchInterval);
  }, [deviceId]);

  // Simulate real-time updates with small fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Apply small fluctuations to create realtime effect
      setPhValue(prev => Math.max(6.8, Math.min(7.5, prev + (Math.random() - 0.5) * 0.05)));
      setTempValue(prev => Math.max(24, Math.min(28, prev + (Math.random() - 0.5) * 0.1)));
      setTurbidityValue(prev => Math.max(1.5, Math.min(3, prev + (Math.random() - 0.5) * 0.05)));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Generate chart data for the last 24 hours
  const generateChartData = () => {
    const data = [];
    for (let i = 23; i >= 0; i--) {
      data.push({
        time: `${23 - i}:00`,
        ph: 7.0 + Math.random() * 0.5,
        temp: 25 + Math.random() * 2,
        turbidity: 1.5 + Math.random() * 1
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const waterQualityData = [
    {
      label: 'pH',
      value: phValue.toFixed(1),
      unit: '',
      status: phValue >= 6.5 && phValue <= 7.5 ? 'Optimal' : 'Perlu Perhatian',
      icon: Activity,
      iconColor: '#8280FF',
      iconBgColor: 'rgba(130, 128, 255, 0.1)',
      trend: '+0.2',
      trendUp: true,
      chartColor: '#8280FF'
    },
    {
      label: 'Suhu',
      value: tempValue.toFixed(1),
      unit: '°C',
      status: tempValue >= 24 && tempValue <= 28 ? 'Optimal' : 'Perlu Perhatian',
      icon: Thermometer,
      iconColor: '#FEC53D',
      iconBgColor: 'rgba(254, 197, 61, 0.1)',
      trend: '-0.3',
      trendUp: false,
      chartColor: '#FEC53D'
    },
    {
      label: 'Kekeruhan',
      value: turbidityValue.toFixed(1),
      unit: ' NTU',
      status: turbidityValue < 5 ? 'Baik' : 'Perlu Perhatian',
      icon: Droplets,
      iconColor: '#4AD991',
      iconBgColor: 'rgba(74, 217, 145, 0.1)',
      trend: '+0.1',
      trendUp: true,
      chartColor: '#4AD991'
    },
  ];

  const notifications = [
    {
      id: 1,
      type: 'info',
      message: 'Pembersihan otomatis dijadwalkan pada 20:00',
      time: '1 jam yang lalu',
      iconColor: '#8280FF',
      icon: Clock
    },
    {
      id: 2,
      type: 'success',
      message: 'Kualitas air dalam kondisi optimal',
      time: '2 jam yang lalu',
      iconColor: '#4AD991',
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'warning',
      message: 'Terdeteksi gejala awal penyakit pada Ikan Koi',
      time: '3 jam yang lalu',
      iconColor: '#CE3939',
      icon: AlertTriangle
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Water Quality Cards with Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {waterQualityData.map((item, index) => (
          <Card
            key={index}
            className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all duration-300 cursor-pointer group"
            style={{
              backgroundColor: 'white',
              borderColor: '#E5E7EB',
              height: '100%'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm" style={{ color: '#6B7280' }}>{item.label}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp
                      className={`w-3 h-3 ${item.trendUp ? '' : 'rotate-180'}`}
                      style={{ color: item.trendUp ? '#4AD991' : '#CE3939' }}
                    />
                    <span className="text-xs" style={{ color: item.trendUp ? '#4AD991' : '#CE3939' }}>
                      {item.trend}
                    </span>
                  </div>
                </div>
                <p className="text-4xl mb-2 group-hover:scale-105 transition-transform" style={{ color: '#1F2937', fontWeight: 700 }}>
                  {item.value}<span className="text-xl">{item.unit}</span>
                </p>
                <Badge
                  className="text-xs px-2 py-1"
                  style={{
                    backgroundColor: item.status === 'Optimal' ? 'rgba(74, 217, 145, 0.1)' : 'rgba(254, 197, 61, 0.1)',
                    color: item.status === 'Optimal' ? '#4AD991' : '#FEC53D',
                    border: 'none'
                  }}
                >
                  {item.status}
                </Badge>
              </div>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: item.iconBgColor }}
              >
                <item.icon className="w-7 h-7" style={{ color: item.iconColor }} />
              </div>
            </div>

            {/* Mini Chart */}
            <div className="h-16 -mx-2 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.slice(-12)}>
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={item.chartColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={item.chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey={index === 0 ? 'ph' : index === 1 ? 'temp' : 'turbidity'}
                    stroke={item.chartColor}
                    strokeWidth={2}
                    fill={`url(#gradient-${index})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Robot Status - Enhanced */}
        <Card
          className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all duration-300"
          style={{
            backgroundColor: 'white',
            borderColor: '#E5E7EB',
            height: '100%'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>
              Status Robot Temanikan
            </h3>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
              style={{ backgroundColor: 'rgba(35, 154, 246, 0.1)' }}
            >
              <Bot className="w-6 h-6" style={{ color: '#239AF6' }} />
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(74, 217, 145, 0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#4AD991' }} />
              <span className="text-sm" style={{ color: '#4AD991', fontWeight: 600 }}>Operasi Normal</span>
            </div>
            <p className="text-xs" style={{ color: '#6B7280' }}>Robot berfungsi dengan baik</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm flex items-center gap-2" style={{ color: '#6B7280' }}>
                <CheckCircle className="w-4 h-4" style={{ color: '#4AD991' }} />
                Status Operasi
              </span>
              <span className="text-sm px-3 py-1 rounded-full" style={{
                color: '#4AD991',
                backgroundColor: 'rgba(74, 217, 145, 0.1)',
                fontWeight: 600
              }}>
                Siap
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm" style={{ color: '#6B7280' }}>Baterai</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: '87%', backgroundColor: '#4AD991' }} />
                </div>
                <span className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>87%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm" style={{ color: '#6B7280' }}>Pembersihan Terakhir</span>
              <span className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>2 jam yang lalu</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm" style={{ color: '#6B7280' }}>Jadwal Berikutnya</span>
              <span className="text-sm px-3 py-1 rounded-full" style={{
                color: '#4880FF',
                backgroundColor: 'rgba(72, 128, 255, 0.1)',
                fontWeight: 600
              }}>
                Hari ini, 20:00
              </span>
            </div>
          </div>
        </Card>

        {/* Disease Detection Latest - Enhanced */}
        <Card
          className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all duration-300"
          style={{
            backgroundColor: 'white',
            borderColor: '#E5E7EB',
            height: '100%'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>
              Deteksi Penyakit Terbaru
            </h3>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
              style={{ backgroundColor: 'rgba(206, 57, 57, 0.1)' }}
            >
              <Eye className="w-6 h-6" style={{ color: '#CE3939' }} />
            </div>
          </div>

          {/* Fish Image */}
          <div className="mb-4 rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1718632496269-6c0fd71dc29c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb2klMjBmaXNoJTIwY2xvc2UlMjB1bmRlcndhdGVyfGVufDF8fHx8MTc2MzA0MjY4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Ikan Koi Terdeteksi"
              className="w-full h-48 object-cover"
            />
          </div>

          {/* Alert Banner */}
          <div className="mb-6 p-4 rounded-lg border-l-4" style={{
            backgroundColor: 'rgba(254, 197, 61, 0.05)',
            borderColor: '#FEC53D'
          }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4" style={{ color: '#FEC53D' }} />
              <span className="text-sm" style={{ color: '#FEC53D', fontWeight: 600 }}>Perhatian Diperlukan</span>
            </div>
            <p className="text-xs" style={{ color: '#6B7280' }}>Penyakit terdeteksi pada salah satu ikan</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm" style={{ color: '#6B7280' }}>Ikan Terdeteksi</span>
              <span className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>Ikan Koi</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm" style={{ color: '#6B7280' }}>Penyakit</span>
              <span className="text-sm px-3 py-1 rounded-full" style={{
                color: '#CE3939',
                backgroundColor: 'rgba(206, 57, 57, 0.1)',
                fontWeight: 600
              }}>
                White Spot
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm" style={{ color: '#6B7280' }}>Tingkat Keparahan</span>
              <Badge
                className="text-xs px-3 py-1"
                style={{
                  backgroundColor: 'rgba(254, 197, 61, 0.1)',
                  color: '#FEC53D',
                  border: 'none',
                  fontWeight: 600
                }}
              >
                Sedang
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm" style={{ color: '#6B7280' }}>Waktu Deteksi</span>
              <span className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>1 jam yang lalu</span>
            </div>
          </div>

          <Link
            to="/member/disease"
            className="mt-4 w-full block text-center px-4 py-2 rounded-lg transition-all hover:shadow-md"
            style={{
              backgroundColor: '#4880FF',
              color: 'white',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            Lihat Detail & Rekomendasi
          </Link>
        </Card>
      </div>

      {/* Notifications - Enhanced */}
      <Card
        className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all duration-300"
        style={{
          backgroundColor: 'white',
          borderColor: '#E5E7EB'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>
            Notifikasi Terbaru
          </h3>
          <Link
            to={deviceId ? `/member/device/${deviceId}/notifications` : `/member/notifications`}
            className="text-sm hover:underline flex items-center gap-1 transition-colors"
            style={{ color: '#4880FF', fontWeight: 600 }}
          >
            Lihat Semua
            <TrendingUp className="w-4 h-4 rotate-90" />
          </Link>
        </div>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer group"
              style={{
                backgroundColor: '#FAFBFC',
                borderColor: '#E5E7EB'
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${notification.iconColor}15` }}
              >
                <notification.icon className="w-5 h-5" style={{ color: notification.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm mb-1" style={{ color: '#1F2937', fontWeight: 500 }}>
                  {notification.message}
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" style={{ color: '#9CA3AF' }} />
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>
                    {notification.time}
                  </p>
                </div>
              </div>
              <button
                className="text-xs px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                style={{ color: '#6B7280' }}
              >
                Tandai Baca
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}