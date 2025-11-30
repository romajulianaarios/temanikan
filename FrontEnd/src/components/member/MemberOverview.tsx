import { Link, useParams, useLocation } from '../Router';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Droplets, Thermometer, Eye, Bot, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock } from '../icons';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { deviceAPI } from '../../services/api';
import DiseaseDetailModal from './DiseaseDetailModal';

type SeverityKey = 'low' | 'medium' | 'high' | 'none';

type DiseaseDetail = {
  fishType: string;
  disease: string;
  confidence: number;
  date: string;
  time: string;
  imageUrl: string;
  symptoms: string[];
  recommendation: string;
  statusColor: string;
  statusBg: string;
  severity: SeverityKey;
  relativeTime: string;
};

const DEFAULT_DISEASE_IMAGE = 'https://images.unsplash.com/photo-1718632496269-6c0fd71dc29c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80';

const FALLBACK_SYMPTOMS = [
  'Perubahan pola berenang dan aktivitas menurun',
  'Ikan sering menggosokkan tubuh ke permukaan akuarium'
];

const RECOMMENDATION_BY_SEVERITY: Record<Exclude<SeverityKey, 'none'>, string> = {
  high: 'Segera isolasi ikan yang terinfeksi, ganti 30% air, dan aplikasikan obat anti-parasit sesuai dosis.',
  medium: 'Pantau kondisi selama 24 jam, tingkatkan aerasi, dan tambahkan garam ikan sesuai panduan.',
  low: 'Jaga kualitas air tetap optimal dan berikan pakan bernutrisi untuk meningkatkan imunitas ikan.'
};

const SEVERITY_STYLES: Record<SeverityKey, {
  bannerBg: string;
  bannerColor: string;
  bannerTitle: string;
  bannerDescription: string;
  badgeLabel: string;
  badgeBg: string;
  badgeColor: string;
  statusColor: string;
  statusBg: string;
}> = {
  high: {
    bannerBg: 'rgba(206, 57, 57, 0.1)',
    bannerColor: '#CE3939',
    bannerTitle: 'Perhatian Diperlukan',
    bannerDescription: 'Penyakit serius terdeteksi. Segera lakukan tindakan.',
    badgeLabel: 'KRITIS',
    badgeBg: 'rgba(206, 57, 57, 0.12)',
    badgeColor: '#CE3939',
    statusColor: '#CE3939',
    statusBg: 'rgba(206, 57, 57, 0.12)'
  },
  medium: {
    bannerBg: '#FFFBEB',
    bannerColor: '#F59E0B',
    bannerTitle: 'Pantau Kondisi',
    bannerDescription: 'Gejala tingkat sedang terdeteksi. Pantau ikan secara berkala.',
    badgeLabel: 'SEDANG',
    badgeBg: '#FFFBEB',
    badgeColor: '#F59E0B',
    statusColor: '#F59E0B',
    statusBg: '#FFFBEB'
  },
  low: {
    bannerBg: 'rgba(74, 217, 145, 0.1)',
    bannerColor: '#10B981',
    bannerTitle: 'Observasi Ringan',
    bannerDescription: 'Gejala ringan terdeteksi. Tetap jaga kualitas air.',
    badgeLabel: 'RINGAN',
    badgeBg: 'rgba(74, 217, 145, 0.15)',
    badgeColor: '#10B981',
    statusColor: '#10B981',
    statusBg: 'rgba(74, 217, 145, 0.15)'
  },
  none: {
    bannerBg: '#ECFDF5',
    bannerColor: '#10B981',
    bannerTitle: 'Tidak Ada Penyakit',
    bannerDescription: 'Semua ikan dalam kondisi sehat saat ini.',
    badgeLabel: 'SEHAT',
    badgeBg: '#ECFDF5',
    badgeColor: '#10B981',
    statusColor: '#10B981',
    statusBg: '#ECFDF5'
  }
};

const formatRelativeTime = (date: Date) => {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari yang lalu`;
};

const formatDetectionTimestamp = (iso?: string) => {
  if (!iso) {
    return { date: '-', time: '-', relative: '-' };
  }
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '-', time: '-', relative: '-' };
  }
  return {
    date: parsed.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: parsed.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    relative: formatRelativeTime(parsed)
  };
};

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

  // Disease detail modal state
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [diseaseData, setDiseaseData] = useState<DiseaseDetail | null>(null);

  const [notifications, setNotifications] = useState<any[]>([]);

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

        // Fetch latest disease detection
        const diseaseResponse = await deviceAPI.getDashboardDiseaseLatest(numericDeviceId);
        if (diseaseResponse.success && diseaseResponse.has_detection && diseaseResponse.data) {
          const detail = diseaseResponse.data;
          const severityRaw = detail.severity as SeverityKey;
          const severity: Exclude<SeverityKey, 'none'> = severityRaw === 'low' || severityRaw === 'high' ? severityRaw : 'medium';
          const severityStyle = SEVERITY_STYLES[severity];
          const timestamp = formatDetectionTimestamp(detail.detected_at);
          const confidenceRaw = typeof detail.confidence === 'number' ? detail.confidence : 0;
          const confidencePercent = Math.round(confidenceRaw <= 1 ? confidenceRaw * 100 : confidenceRaw);

          setDiseaseData({
            fishType: detail.fish_type || 'Ikan Hias',
            disease: detail.disease_name || 'Tidak diketahui',
            confidence: confidencePercent,
            date: timestamp.date,
            time: timestamp.time,
            imageUrl: detail.image_url || DEFAULT_DISEASE_IMAGE,
            symptoms: Array.isArray(detail.symptoms) && detail.symptoms.length > 0 ? detail.symptoms : FALLBACK_SYMPTOMS,
            recommendation: detail.recommendation || RECOMMENDATION_BY_SEVERITY[severity],
            statusColor: severityStyle.statusColor,
            statusBg: severityStyle.statusBg,
            severity,
            relativeTime: detail.detected_at_text || timestamp.relative
          });
        } else {
          setDiseaseData(null);
        }

        // Fetch recent notifications
        const notifResponse = await deviceAPI.getDashboardNotificationsRecent(numericDeviceId);
        if (notifResponse.success && notifResponse.data) {
          const formattedNotifs = notifResponse.data.map((n: any) => ({
            id: n.id,
            type: n.type || 'info',
            message: n.message,
            time: new Date(n.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            iconColor: n.type === 'warning' ? '#CE3939' : n.type === 'success' ? '#4AD991' : '#8280FF',
            icon: n.type === 'warning' ? AlertTriangle : n.type === 'success' ? CheckCircle : Clock
          }));
          setNotifications(formattedNotifs);
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

  const hasDiseaseDetection = Boolean(diseaseData);
  const diseaseSeverityStyle = hasDiseaseDetection
    ? SEVERITY_STYLES[diseaseData?.severity || 'medium']
    : SEVERITY_STYLES.none;
  const diseaseImage = diseaseData?.imageUrl || DEFAULT_DISEASE_IMAGE;
  const diseaseButtonDisabled = !hasDiseaseDetection;
  const BannerIcon = hasDiseaseDetection ? AlertTriangle : CheckCircle;
  const diseaseBannerDescription = hasDiseaseDetection
    ? `${diseaseSeverityStyle.bannerDescription} Terakhir terdeteksi ${diseaseData?.relativeTime || 'baru saja'}.`
    : diseaseSeverityStyle.bannerDescription;
  const handleOpenDiseaseModal = () => {
    if (!diseaseButtonDisabled) {
      setShowDiseaseModal(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Water Quality Cards with Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {waterQualityData.map((item, index) => (
          <Card
            key={index}
            className="bubble-card p-6 rounded-[32px] transition-all duration-300 cursor-pointer group relative overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid rgba(72, 128, 255, 0.2)',
              boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
              fontFamily: 'Nunito Sans, sans-serif',
              height: '100%'
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
            {/* Bubble glow effect */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
                filter: 'blur(20px)'
              }}
            ></div>
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif', fontWeight: 600 }}>{item.label}</p>
                  <div 
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full transition-all duration-300"
                    style={{ 
                      background: 'rgba(72, 128, 255, 0.1)',
                      border: '1px solid rgba(72, 128, 255, 0.2)',
                      boxShadow: '0 2px 8px rgba(72, 128, 255, 0.1)'
                    }}
                  >
                    <TrendingUp
                      className={`w-3 h-3 ${item.trendUp ? '' : 'rotate-180'}`}
                      style={{ color: item.trendUp ? '#10B981' : '#EF4444' }}
                    />
                    <span className="text-xs font-semibold" style={{ color: item.trendUp ? '#10B981' : '#EF4444', fontFamily: 'Nunito Sans, sans-serif' }}>
                      {item.trend}
                    </span>
                  </div>
                </div>
                <p className="text-4xl mb-2 group-hover:scale-105 transition-transform origin-left tracking-tight relative z-10" style={{ color: '#133E87', fontWeight: 800, fontFamily: 'Nunito Sans, sans-serif' }}>
                  {item.value}<span className="text-xl ml-1 font-normal" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{item.unit}</span>
                </p>
                <Badge
                  className="text-xs px-2.5 py-1 rounded-full font-medium relative z-10"
                  style={{
                    backgroundColor: item.status === 'Optimal' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: item.status === 'Optimal' ? '#10B981' : '#F59E0B',
                    border: `1px solid ${item.status === 'Optimal' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                    fontFamily: 'Nunito Sans, sans-serif',
                    fontWeight: 600
                  }}
                >
                  {item.status}
                </Badge>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative z-10"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(72, 128, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
                }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.iconColor }} />
              </div>
            </div>

            {/* Mini Chart */}
            <div className="h-16 -mx-2 mt-6 opacity-80 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData.slice(-12)}>
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={item.chartColor} stopOpacity={0.2} />
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
          className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif',
            height: '100%'
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
          {/* Bubble glow effect */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
              Status Robot Temanikan
            </h3>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer relative z-10"
              style={{ 
                background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(72, 128, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
              }}
            >
              <Bot className="w-5 h-5" style={{ color: '#4880FF' }} />
            </div>
          </div>

          {/* Status Indicator */}
          <div 
            className="mb-6 p-4 rounded-2xl border relative z-10 transition-all duration-300"
            style={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: '#10B981' }} />
              <span className="text-sm" style={{ color: '#10B981', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>Operasi Normal</span>
            </div>
            <p className="text-xs" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Robot berfungsi dengan baik</p>
          </div>

          <div className="space-y-3 relative z-10">
            <div 
              className="flex items-center justify-between p-3 rounded-2xl transition-all duration-200 bubble-button"
              style={{
                backgroundColor: 'rgba(72, 128, 255, 0.05)',
                border: '1px solid rgba(72, 128, 255, 0.15)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.15)';
              }}
            >
              <span className="text-sm flex items-center gap-3 font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
                Status Operasi
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-bold" style={{
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                SIAP
              </span>
            </div>
            <div 
              className="flex items-center justify-between p-3 rounded-2xl transition-all duration-200 bubble-button"
              style={{
                backgroundColor: 'rgba(72, 128, 255, 0.05)',
                border: '1px solid rgba(72, 128, 255, 0.15)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Baterai</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(72, 128, 255, 0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '87%', background: 'linear-gradient(90deg, #10B981, #4AD991)' }} />
                </div>
                <span className="text-sm" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>87%</span>
              </div>
            </div>
            <div 
              className="flex items-center justify-between p-3 rounded-2xl transition-all duration-200 bubble-button"
              style={{
                backgroundColor: 'rgba(72, 128, 255, 0.05)',
                border: '1px solid rgba(72, 128, 255, 0.15)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Pembersihan Terakhir</span>
              <span className="text-sm" style={{ color: '#133E87', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>2 jam yang lalu</span>
            </div>
            <div 
              className="flex items-center justify-between p-3 rounded-2xl transition-all duration-200 bubble-button"
              style={{
                backgroundColor: 'rgba(72, 128, 255, 0.05)',
                border: '1px solid rgba(72, 128, 255, 0.15)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Jadwal Berikutnya</span>
              <span className="text-xs px-3 py-1 rounded-full font-bold" style={{
                color: '#4880FF',
                backgroundColor: 'rgba(72, 128, 255, 0.15)',
                border: '1px solid rgba(72, 128, 255, 0.3)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                HARI INI, 20:00
              </span>
            </div>
          </div>
        </Card>

        {/* Disease Detection Latest - Enhanced */}
        <Card
          className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(72, 128, 255, 0.2)',
            boxShadow: '0 10px 50px rgba(72, 128, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            fontFamily: 'Nunito Sans, sans-serif',
            height: '100%'
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
          {/* Bubble glow effect */}
          <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
              filter: 'blur(20px)'
            }}
          ></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
              Deteksi Penyakit Terbaru
            </h3>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer relative z-10"
              style={{ 
                background: 'linear-gradient(135deg, rgba(72, 128, 255, 0.3), rgba(15, 91, 229, 0.2))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(72, 128, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(72, 128, 255, 0.2)'
              }}
            >
              <Eye className="w-5 h-5" style={{ color: '#4880FF' }} />
            </div>
          </div>

          {/* Fish Image */}
          <div className="mb-5 rounded-xl overflow-hidden shadow-sm relative group">
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
            <ImageWithFallback
              src={diseaseImage}
              alt={diseaseData?.fishType || 'Data penyakit terbaru'}
              className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Alert Banner */}
          <div
            className="mb-6 p-4 rounded-2xl border relative z-10 transition-all duration-300"
            style={{
              backgroundColor: diseaseSeverityStyle.bannerBg,
              borderColor: `${diseaseSeverityStyle.bannerColor}33`,
              boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <BannerIcon className="w-4 h-4" style={{ color: diseaseSeverityStyle.bannerColor }} />
              <span className="text-sm" style={{ color: diseaseSeverityStyle.bannerColor, fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
                {diseaseSeverityStyle.bannerTitle}
              </span>
            </div>
            <p className="text-xs" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>{diseaseBannerDescription}</p>
          </div>

          <div className="space-y-3 relative z-10">
            <div 
              className="flex items-center justify-between p-3 rounded-2xl transition-all duration-200 bubble-button"
              style={{
                backgroundColor: 'rgba(72, 128, 255, 0.05)',
                border: '1px solid rgba(72, 128, 255, 0.15)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Ikan Terdeteksi</span>
              <span className="text-sm" style={{ color: '#133E87', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>{diseaseData?.fishType || '-'}</span>
            </div>
            <div 
              className="flex items-center justify-between p-3 rounded-2xl transition-all duration-200 bubble-button"
              style={{
                backgroundColor: 'rgba(72, 128, 255, 0.05)',
                border: '1px solid rgba(72, 128, 255, 0.15)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Penyakit</span>
              <span className="text-xs px-3 py-1 rounded-full font-bold" style={{
                color: diseaseSeverityStyle.badgeColor,
                backgroundColor: diseaseSeverityStyle.badgeBg,
                border: diseaseButtonDisabled ? '1px dashed #D1D5DB' : `1px solid ${diseaseSeverityStyle.badgeColor}33`,
                fontFamily: 'Nunito Sans, sans-serif'
              }}>
                {diseaseData ? diseaseData.disease.toUpperCase() : 'TIDAK ADA'}
              </span>
            </div>
            <div 
              className="flex items-center justify-between p-3 rounded-2xl transition-all duration-200 bubble-button"
              style={{
                backgroundColor: 'rgba(72, 128, 255, 0.05)',
                border: '1px solid rgba(72, 128, 255, 0.15)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Tingkat Keparahan</span>
              <Badge
                className="text-xs px-3 py-1 rounded-full font-bold"
                style={{
                  backgroundColor: diseaseSeverityStyle.badgeBg,
                  color: diseaseSeverityStyle.badgeColor,
                  border: `1px solid ${diseaseSeverityStyle.badgeColor}33`,
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
              >
                {diseaseSeverityStyle.badgeLabel}
              </Badge>
            </div>
            <div 
              className="flex items-center justify-between p-3 rounded-2xl transition-all duration-200 bubble-button"
              style={{
                backgroundColor: 'rgba(72, 128, 255, 0.05)',
                border: '1px solid rgba(72, 128, 255, 0.15)',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span className="text-sm font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>Waktu Deteksi</span>
              <span className="text-sm" style={{ color: '#133E87', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>
                {diseaseData ? `${diseaseData.date} • ${diseaseData.time}` : '-'}
              </span>
            </div>
          </div>

          <button
            onClick={handleOpenDiseaseModal}
            disabled={diseaseButtonDisabled}
            className="bubble-button mt-6 w-full block text-center px-4 py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
            style={{
              background: diseaseButtonDisabled 
                ? 'rgba(72, 128, 255, 0.2)' 
                : 'linear-gradient(135deg, rgba(15, 91, 229, 0.95), rgba(72, 128, 255, 0.9))',
              color: 'white',
              fontWeight: 700,
              fontSize: '14px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: diseaseButtonDisabled 
                ? '0 4px 15px rgba(72, 128, 255, 0.1)' 
                : '0 8px 24px rgba(15, 91, 229, 0.3)',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
            onMouseEnter={(e) => {
              if (!diseaseButtonDisabled) {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(15, 91, 229, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!diseaseButtonDisabled) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 91, 229, 0.3)';
              }
            }}
          >
            {diseaseButtonDisabled ? 'Belum Ada Deteksi' : 'Lihat Detail & Rekomendasi'}
          </button>
        </Card>
      </div>

      {/* Notifications - Enhanced */}
      <Card
        className="bubble-card p-6 rounded-[32px] transition-all duration-300 relative overflow-hidden"
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid rgba(72, 128, 255, 0.2)',
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
        {/* Bubble glow effect */}
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(72, 128, 255, 0.4), transparent 70%)',
            filter: 'blur(20px)'
          }}
        ></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg" style={{ color: '#133E87', fontWeight: 700, fontFamily: 'Nunito Sans, sans-serif' }}>
            Notifikasi Terbaru
          </h3>
          <Link
            to={deviceId ? `/member/device/${deviceId}/notifications` : `/member/notifications`}
            className="bubble-button text-sm flex items-center gap-1 transition-all duration-300 px-3 py-1.5 rounded-full"
            style={{ 
              color: '#133E87', 
              fontWeight: 600,
              backgroundColor: 'rgba(72, 128, 255, 0.1)',
              border: '1px solid rgba(72, 128, 255, 0.2)',
              fontFamily: 'Nunito Sans, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(72, 128, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Lihat Semua
            <TrendingUp className="w-4 h-4 rotate-90" />
          </Link>
        </div>
        <div className="space-y-3 relative z-10">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bubble-button flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(72, 128, 255, 0.2)',
                boxShadow: '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                fontFamily: 'Nunito Sans, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F5FF';
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(72, 128, 255, 0.3) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(72, 128, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset';
                e.currentTarget.style.borderColor = 'rgba(72, 128, 255, 0.2)';
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative z-10"
                style={{ 
                  background: `linear-gradient(135deg, ${notification.iconColor}40, ${notification.iconColor}20)`,
                  border: `1px solid ${notification.iconColor}50`,
                  boxShadow: `0 4px 12px ${notification.iconColor}30`
                }}
              >
                <notification.icon className="w-5 h-5" style={{ color: notification.iconColor }} />
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <p className="text-sm mb-1.5" style={{ color: '#133E87', fontWeight: 600, fontFamily: 'Nunito Sans, sans-serif' }}>
                  {notification.message}
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" style={{ color: '#608BC1' }} />
                  <p className="text-xs font-medium" style={{ color: '#608BC1', fontFamily: 'Nunito Sans, sans-serif' }}>
                    {notification.time}
                  </p>
                </div>
              </div>
              <button
                className="bubble-button text-xs px-3 py-1.5 rounded-full transition-all duration-300 font-medium opacity-0 group-hover:opacity-100 relative z-10"
                style={{ 
                  color: '#133E87',
                  backgroundColor: 'rgba(72, 128, 255, 0.1)',
                  border: '1px solid rgba(72, 128, 255, 0.2)',
                  fontFamily: 'Nunito Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(72, 128, 255, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Tandai Baca
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Disease Detail Modal */}
      <DiseaseDetailModal
        isOpen={showDiseaseModal}
        onClose={() => setShowDiseaseModal(false)}
        disease={diseaseData}
      />
    </div>
  );
}