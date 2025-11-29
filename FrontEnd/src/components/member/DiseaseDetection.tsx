import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from '../Router';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Camera, Video, Eye, AlertTriangle, CheckCircle, TrendingUp, Calendar, Monitor } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { deviceAPI, diseaseAPI } from '../../services/api';

export default function DiseaseDetection() {
  const { deviceId } = useParams<{ deviceId?: string }>();
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [latestDetections, setLatestDetections] = useState<any[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(deviceId ?? null);
  const [activeDeviceName, setActiveDeviceName] = useState('');
  const [deviceResolveMessage, setDeviceResolveMessage] = useState('');
  const [resolvingDevice, setResolvingDevice] = useState(false);

  // Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadDetections, setUploadDetections] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadResult, setShowUploadResult] = useState(false);
  const [isLiveDetecting, setIsLiveDetecting] = useState(false);
  const [liveDetectionPreview, setLiveDetectionPreview] = useState<string | null>(null);
  const [liveDetectionResults, setLiveDetectionResults] = useState<any[]>([]);
  const [liveDetectionError, setLiveDetectionError] = useState('');
  const [liveDetectionSaveMessage, setLiveDetectionSaveMessage] = useState('');
  const [detectionCards, setDetectionCards] = useState<any[]>([]);
  const [detectionLoading, setDetectionLoading] = useState(false);
  const [detectionError, setDetectionError] = useState('');
  const [detectionRefreshKey, setDetectionRefreshKey] = useState(0);
  const refreshDetectionHistory = () => setDetectionRefreshKey((prev) => prev + 1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreamActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreamActive(false);
    setLatestDetections([]);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Detect Frame
  const detectFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !isStreamActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Match overlay canvas size to video resolution
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Create an off-screen canvas for capturing the frame
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    const captureCtx = captureCanvas.getContext('2d');

    if (!captureCtx) return;

    // Draw video frame to the OFF-SCREEN canvas
    captureCtx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);

    // Convert off-screen canvas to blob
    captureCanvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('image', blob, 'frame.jpg');

      try {
        const token = sessionStorage.getItem("access_token") || localStorage.getItem("access_token");
        const response = await fetch('http://localhost:5000/api/detect_disease', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });

        const data = await response.json();

        // Clear the visible overlay canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (data.success && data.detections) {
          setLatestDetections(data.detections); // Update state

          data.detections.forEach((det: any) => {
            const [x1, y1, x2, y2] = det.bbox;
            const width = x2 - x1;
            const height = y2 - y1;

            // Draw box on visible canvas
            ctx.strokeStyle = '#EF4444'; // Red
            ctx.lineWidth = 3;
            ctx.strokeRect(x1, y1, width, height);

            // Draw label
            ctx.fillStyle = '#EF4444';
            ctx.fillRect(x1, y1 - 25, width, 25);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText(`${det.class} ${(det.confidence * 100).toFixed(0)}%`, x1 + 5, y1 - 7);
          });
        } else {
          setLatestDetections([]);
        }
      } catch (err) {
        console.error("Detection error:", err);
      }
    }, 'image/jpeg', 0.8);
  };

  const mapConfidenceToSeverity = (confidence: number) => {
    const percentage = (confidence || 0) * 100;
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  };

  const persistLiveDetectionCapture = async (blob: Blob, detection: any) => {
    if (!activeDeviceId) {
      setLiveDetectionSaveMessage('');
      setLiveDetectionError('Deteksi perlu perangkat yang terhubung.');
      return;
    }

    const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
    if (!token) {
      setLiveDetectionSaveMessage('');
      setLiveDetectionError('Sesi berakhir. Silakan login kembali.');
      return;
    }

    try {
      const formData = new FormData();
      const fileName = `live-detection-${Date.now()}.jpg`;
      formData.append('image', blob, fileName);
      const label = detection?.class || 'Unknown';
      const isHealthy = label.toLowerCase().includes('healthy');
      const statusMeta = isHealthy
        ? { label: 'Sehat', color: '#4AD991', bg: 'rgba(74, 217, 145, 0.1)', status: 'resolved' }
        : { label: 'Perhatian', color: '#FEC53D', bg: 'rgba(254, 197, 61, 0.1)', status: 'detected' };

      formData.append('disease_name', label);
      formData.append('confidence', ((detection?.confidence || 0) * 100).toFixed(2));
      formData.append('severity', mapConfidenceToSeverity(detection?.confidence || 0));
      formData.append('status', statusMeta.status);
      formData.append('fish_type', label);
      formData.append('location', 'Akuarium Utama');
      formData.append('status_label', statusMeta.label);
      formData.append('status_color', statusMeta.color);
      formData.append('status_bg', statusMeta.bg);
      formData.append('notes', 'Captured via livestream Temanikan.');

      const response = await fetch(`http://localhost:5000/api/devices/${activeDeviceId}/disease-detections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setLiveDetectionSaveMessage('Hasil tangkapan tersimpan ke riwayat deteksi.');
        refreshDetectionHistory();
      } else {
        setLiveDetectionSaveMessage('');
        setLiveDetectionError(result.message || 'Gagal menyimpan hasil deteksi.');
      }
    } catch (error) {
      console.error('Save detection error:', error);
      setLiveDetectionSaveMessage('');
      setLiveDetectionError('Terjadi kesalahan saat menyimpan hasil deteksi.');
    }
  };

  // Capture current frame from live stream and run detection once
  const handleLiveCaptureDetect = async () => {
    if (!isStreamActive) {
      setLiveDetectionError('Aktifkan live stream terlebih dahulu.');
      return;
    }

    if (!activeDeviceId) {
      setLiveDetectionError('Perangkat belum siap. Pilih atau hubungkan perangkat Anda.');
      return;
    }

    if (!videoRef.current) {
      setLiveDetectionError('Kamera belum siap.');
      return;
    }

    const video = videoRef.current;
    const width = video.videoWidth || video.clientWidth;
    const height = video.videoHeight || video.clientHeight;

    if (!width || !height) {
      setLiveDetectionError('Video belum menampilkan gambar. Coba lagi dalam beberapa detik.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setLiveDetectionError('Tidak dapat memproses gambar.');
      return;
    }

    ctx.drawImage(video, 0, 0, width, height);
    const previewDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setLiveDetectionPreview(previewDataUrl);
    setIsLiveDetecting(true);
    setLiveDetectionError('');
    setLiveDetectionSaveMessage('');

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.85)
      );

      if (!blob) {
        throw new Error('Gagal mengambil gambar');
      }

      const formData = new FormData();
      formData.append('image', blob, 'live-capture.jpg');

      const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/api/detect_disease', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      let primaryDetection: any = null;

      if (data.success && data.detections) {
        const sorted = [...data.detections].sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
        primaryDetection = sorted[0];
        setLiveDetectionResults(data.detections);
        setLiveDetectionError('');
      } else if (data.success) {
        setLiveDetectionResults([]);
        setLiveDetectionError('');
      } else {
        setLiveDetectionResults([]);
        setLiveDetectionError(data.message || 'Gagal mendeteksi gambar.');
      }

      if (data.success) {
        await persistLiveDetectionCapture(blob, primaryDetection || { class: 'Unknown', confidence: 0 });
      }
    } catch (err) {
      console.error('Live capture detection error:', err);
      setLiveDetectionResults([]);
      setLiveDetectionError('Terjadi kesalahan saat mendeteksi gambar. Coba lagi.');
    } finally {
      setIsLiveDetecting(false);
    }
  };

  // Handle File Selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setShowUploadResult(true);
      detectImage(file);
    }
  };

  // Detect Uploaded Image
  const detectImage = async (file: File) => {
    setIsUploading(true);
    setUploadDetections([]);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = sessionStorage.getItem("access_token") || localStorage.getItem("access_token");
      const response = await fetch('http://localhost:5000/api/detect_disease', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.detections) {
        setUploadDetections(data.detections);
      }
    } catch (err) {
      console.error("Upload detection error:", err);
      alert("Gagal mendeteksi gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const normalizeImageUrl = (url?: string | null) => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `http://localhost:5000${url}`;
  };

  const mapDetectionToCard = (item: any) => {
    const detectedAt = item?.detected_at ? new Date(item.detected_at) : null;
    const dateLabel = detectedAt
      ? detectedAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      : '-';
    const timeLabel = detectedAt
      ? detectedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      : '';

    const deviceName = item?.device?.name
      || item?.device_name
      || (item?.device_id ? `Perangkat #${item.device_id}` : '');

    const symptoms: string[] = Array.isArray(item?.symptoms_list)
      ? item.symptoms_list
      : item?.symptoms
        ? [item.symptoms]
        : [];

    return {
      id: item?.id,
      fishType: item?.fish_type || item?.disease_name || 'Ikan Hias',
      location: item?.location || 'Akuarium Utama',
      date: dateLabel,
      time: timeLabel,
      status: (item?.status || '').toLowerCase(),
      statusLabel: item?.status_label || 'Observasi',
      statusColor: item?.status_color || '#8280FF',
      statusBg: item?.status_bg || 'rgba(130, 128, 255, 0.1)',
      disease: item?.disease_name || '-',
      confidence: Math.round(item?.confidence_percent || item?.confidence || 0),
      recommendation: item?.recommended_treatment || '-',
      symptoms,
      imageUrl: normalizeImageUrl(item?.image_url),
      deviceName: deviceName || null
    };
  };

  // Draw results on uploaded image
  useEffect(() => {
    if (showUploadResult && uploadedImage && uploadCanvasRef.current) {
      const canvas = uploadCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = uploadedImage;

      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image
        ctx?.drawImage(img, 0, 0);

        // Draw detections
        if (uploadDetections.length > 0 && ctx) {
          uploadDetections.forEach((det: any) => {
            const [x1, y1, x2, y2] = det.bbox;
            const width = x2 - x1;
            const height = y2 - y1;

            // Draw box
            ctx.strokeStyle = '#EF4444'; // Red
            ctx.lineWidth = Math.max(2, img.width / 300); // Responsive line width, thinner
            ctx.strokeRect(x1, y1, width, height);

            // Draw label background
            ctx.fillStyle = '#EF4444';
            const fontSize = Math.max(14, img.width / 60); // Smaller responsive font size
            ctx.font = `bold ${fontSize}px sans-serif`;
            const text = `${det.class} ${(det.confidence * 100).toFixed(0)}%`;
            const textMetrics = ctx.measureText(text);
            const textHeight = fontSize * 1.2;
            const padding = fontSize * 0.4;

            ctx.fillRect(x1, y1 - textHeight - padding, textMetrics.width + (padding * 2), textHeight + padding);

            // Draw label text
            ctx.fillStyle = 'white';
            ctx.fillText(text, x1 + padding, y1 - (padding));
          });
        }
      };
    }
  }, [showUploadResult, uploadedImage, uploadDetections]);

  // Effect to handle stream toggle
  useEffect(() => {
    if (showLiveStream) {
      startCamera();
    } else {
      stopCamera();
      setLiveDetectionPreview(null);
      setLiveDetectionResults([]);
      setLiveDetectionError('');
      setIsLiveDetecting(false);
      setLiveDetectionSaveMessage('');
    }

    return () => {
      stopCamera();
    };
  }, [showLiveStream]);

  // Effect for detection loop
  useEffect(() => {
    if (isStreamActive && showLiveStream) {
      intervalRef.current = setInterval(detectFrame, 1000); // Run every 1 second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStreamActive, showLiveStream]);

  // Resolve active device id fallback
  useEffect(() => {
    let isMounted = true;

    const assignDevice = (id: string | null, name?: string | null) => {
      if (!isMounted) return;
      if (id) {
        setActiveDeviceId(id);
        sessionStorage.setItem('activeDeviceId', id);
        setDeviceResolveMessage('');
        if (name) {
          setActiveDeviceName(name);
          sessionStorage.setItem('activeDeviceName', name);
        } else {
          setActiveDeviceName('');
          sessionStorage.removeItem('activeDeviceName');
        }
      }
    };

    if (deviceId) {
      assignDevice(deviceId);
      return () => {
        isMounted = false;
      };
    }

    const stored = sessionStorage.getItem('activeDeviceId');
    if (stored) {
      const storedName = sessionStorage.getItem('activeDeviceName');
      assignDevice(stored, storedName);
      return () => {
        isMounted = false;
      };
    }

    const fetchFirstDevice = async () => {
      try {
        setResolvingDevice(true);
        const response = await deviceAPI.getDevices();
        const fallbackDevice = response?.devices?.[0];
        if (!fallbackDevice) {
          if (isMounted) {
            setDeviceResolveMessage('Anda belum memiliki perangkat terhubung. Tambahkan perangkat untuk menyimpan hasil deteksi.');
          }
          return;
        }
        assignDevice(String(fallbackDevice.id), fallbackDevice?.name);
      } catch (err) {
        console.error('Failed to resolve device for detection:', err);
        if (isMounted) {
          setDeviceResolveMessage('Gagal memuat perangkat. Pastikan Anda memiliki perangkat aktif.');
        }
      } finally {
        if (isMounted) {
          setResolvingDevice(false);
        }
      }
    };

    fetchFirstDevice();

    return () => {
      isMounted = false;
    };
  }, [deviceId]);

  useEffect(() => {
    if (!activeDeviceId) {
      setActiveDeviceName('');
      sessionStorage.removeItem('activeDeviceName');
      return;
    }

    if (activeDeviceName) {
      return;
    }

    let isSubscribed = true;
    const fetchActiveDeviceName = async () => {
      try {
        const response = await deviceAPI.getDevice(Number(activeDeviceId));
        if (!isSubscribed) return;
        const resolvedName = response?.device?.name;
        if (resolvedName) {
          setActiveDeviceName(resolvedName);
          sessionStorage.setItem('activeDeviceName', resolvedName);
        }
      } catch (error) {
        console.error('Failed to load active device detail:', error);
      }
    };

    fetchActiveDeviceName();

    return () => {
      isSubscribed = false;
    };
  }, [activeDeviceId, activeDeviceName]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchDetections = async () => {
      try {
        setDetectionLoading(true);
        setDetectionError('');
        const response = await diseaseAPI.getAllDetections(12);
        if (!isSubscribed) return;
        const list = response?.detections || [];
        setDetectionCards(list.map(mapDetectionToCard));
      } catch (error) {
        console.error('Failed to load disease detections:', error);
        if (!isSubscribed) return;
        setDetectionError('Gagal memuat riwayat deteksi.');
        setDetectionCards([]);
      } finally {
        if (isSubscribed) {
          setDetectionLoading(false);
        }
      }
    };

    fetchDetections();

    return () => {
      isSubscribed = false;
    };
  }, [detectionRefreshKey]);
  const stats = [
    {
      label: 'Total Deteksi Hari Ini',
      value: '12',
      icon: Eye,
      color: '#8280FF',
      bgColor: 'rgba(130, 128, 255, 0.1)',
      trend: '+3',
      trendUp: true
    },
    {
      label: 'Ikan Sehat',
      value: '8',
      icon: CheckCircle,
      color: '#4AD991',
      bgColor: 'rgba(74, 217, 145, 0.1)',
      trend: '+2',
      trendUp: true
    },
    {
      label: 'Perlu Perhatian',
      value: '4',
      icon: AlertTriangle,
      color: '#FEC53D',
      bgColor: 'rgba(254, 197, 61, 0.1)',
      trend: '+1',
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl mb-2" style={{ color: '#1F2937', fontWeight: 700 }}>
          Deteksi <span style={{ color: '#4880FF' }}>Penyakit Ikan</span>
        </h2>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Monitoring kesehatan ikan dengan teknologi AI
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all duration-300 cursor-pointer group"
            style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm" style={{ color: '#6B7280' }}>{stat.label}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp
                      className={`w-3 h-3 ${stat.trendUp ? '' : 'rotate-180'}`}
                      style={{ color: stat.trendUp ? '#4AD991' : '#CE3939' }}
                    />
                    <span className="text-xs" style={{ color: stat.trendUp ? '#4AD991' : '#CE3939' }}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <p className="text-3xl group-hover:scale-105 transition-transform" style={{ color: '#1F2937', fontWeight: 700 }}>
                  {stat.value}
                </p>
              </div>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: stat.bgColor }}
              >
                <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & Actions */}
      <Card className="p-6 rounded-xl shadow-md border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm mb-2" style={{ color: '#1F2937', fontWeight: 600 }}>
                Periode
              </label>
              <Select defaultValue="7d">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Jam Terakhir</SelectItem>
                  <SelectItem value="7d">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30d">30 Hari Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              className="text-white whitespace-nowrap hover:shadow-lg transition-all"
              style={{ backgroundColor: '#4880FF' }}
              onClick={() => setShowLiveStream(true)}
            >
              <Video className="w-4 h-4 mr-2" />
              Lihat Akuarium Realtime
            </Button>
            <Link to={activeDeviceId ? `/member/device/${activeDeviceId}/detection-history` : `/member/detection-history`}>
              <Button
                variant="outline"
                className="w-full sm:w-auto whitespace-nowrap hover:bg-gray-50 transition-all"
                style={{ color: '#4880FF', borderColor: '#4880FF' }}
              >
                Lihat Riwayat Deteksi
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Detection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {detectionLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              className="p-4 rounded-xl border shadow-sm animate-pulse"
              style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
            >
              <div className="w-full h-40 rounded-lg bg-gray-100 mb-4" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </Card>
          ))
        ) : detectionCards.length > 0 ? (
          detectionCards.map((detection) => {
            const displayDeviceName = activeDeviceName || detection.deviceName;
            const modalOverlayStyle = {
              backdropFilter: 'none',
              background: 'rgba(15, 23, 42, 0.55)'
            };

            return (
              <Dialog key={detection.id}>
                <DialogTrigger asChild>
                  <Card
                    className="p-0 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
                    style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
                  >
                    <div className="w-full h-48 overflow-hidden relative">
                      <ImageWithFallback
                        src={detection.imageUrl}
                        alt={detection.fishType}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs backdrop-blur-sm"
                        style={{
                          backgroundColor: `${detection.statusBg}dd`,
                          color: detection.statusColor,
                          fontWeight: 600,
                          border: `1px solid ${detection.statusColor}33`
                        }}
                      >
                        {detection.statusLabel}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>
                          {detection.fishType}
                        </h4>
                        <div
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: 'rgba(72, 128, 255, 0.1)',
                            color: '#4880FF',
                            fontWeight: 600
                          }}
                        >
                          {detection.confidence}%
                        </div>
                      </div>
                      {displayDeviceName && (
                        <div className="flex items-center gap-2 text-xs mb-2" style={{ color: '#6B7280' }}>
                          <Monitor className="w-4 h-4" />
                          <span>{displayDeviceName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs mb-3" style={{ color: '#6B7280' }}>
                        <Calendar className="w-4 h-4" />
                        <span>{detection.date} • {detection.time}</span>
                      </div>
                      <p className="text-sm" style={{ color: '#1F2937', fontWeight: 500 }}>
                        {detection.disease}
                      </p>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent
                  className="w-[92vw] sm:max-w-lg text-[12px] md:text-[13px] max-h-[85vh] overflow-y-auto"
                  style={{ backgroundColor: 'white', fontFamily: '"Nunito Sans", sans-serif', borderRadius: '12px' }}
                  overlayStyle={modalOverlayStyle}
                >
                  <DialogHeader>
                    <DialogTitle className="text-base font-semibold" style={{ color: '#1F2937', fontFamily: 'inherit' }}>
                      Detail Deteksi Penyakit
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="w-full h-48 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={detection.imageUrl}
                        alt={detection.fishType}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                        <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Jenis Ikan</p>
                        <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{detection.fishType}</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                        <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tingkat Kepercayaan</p>
                        <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{detection.confidence}%</p>
                      </div>
                      <div className="col-span-2 p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                        <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tanggal & Waktu</p>
                        <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{detection.date} - {detection.time}</p>
                      </div>
                    </div>

                    {displayDeviceName && (
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                        <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Perangkat Akuarium</p>
                        <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{displayDeviceName}</p>
                      </div>
                    )}

                    <div
                      className="p-3 rounded-lg border-l-4"
                      style={{
                        backgroundColor: detection.statusBg,
                        borderColor: detection.statusColor
                      }}
                    >
                      <h4 className="mb-2 text-sm" style={{ color: detection.statusColor, fontWeight: 600 }}>Diagnosis</h4>
                      <p className="text-sm" style={{ color: '#1F2937' }}>{detection.disease}</p>
                    </div>

                    {detection.symptoms.length > 0 && (
                      <div>
                        <h4 className="mb-3 text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>Gejala yang Terdeteksi</h4>
                        <div className="space-y-2">
                          {detection.symptoms.map((symptom, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 p-2.5 rounded-lg"
                              style={{ backgroundColor: '#F9FAFB' }}
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                style={{ backgroundColor: detection.statusColor }}
                              />
                              <p className="text-sm" style={{ color: '#1F2937' }}>{symptom}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      className="p-3 rounded-lg border"
                      style={{
                        backgroundColor: 'rgba(72, 128, 255, 0.05)',
                        borderColor: '#4880FF33'
                      }}
                    >
                      <h4 className="mb-2 flex items-center gap-2 text-sm" style={{ color: '#4880FF', fontWeight: 600 }}>
                        <AlertTriangle className="w-5 h-5" />
                        Rekomendasi Penanganan
                      </h4>
                      <p className="text-sm" style={{ color: '#1F2937' }}>{detection.recommendation}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })
        ) : (
          <Card
            className="p-6 rounded-xl border col-span-full"
            style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
          >
            <p className="text-center text-sm" style={{ color: '#6B7280' }}>
              {detectionError || 'Belum ada riwayat deteksi yang terekam.'}
            </p>
          </Card>
        )}
      </div>

      {/* Upload New Image */}
      <Card className="p-6 rounded-xl shadow-md border hover:shadow-xl transition-all" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <h3 className="mb-4 text-lg" style={{ color: '#1F2937', fontWeight: 600 }}>Upload Foto untuk Deteksi Manual</h3>
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-all"
          style={{ borderColor: '#4880FF' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(72, 128, 255, 0.1)' }}
          >
            <Camera className="w-8 h-8" style={{ color: '#4880FF' }} />
          </div>
          <p className="mb-2" style={{ color: '#1F2937', fontWeight: 600 }}>Klik atau seret foto ikan di sini</p>
          <p className="text-sm" style={{ color: '#6B7280' }}>Format: JPG, PNG (Maks. 10MB)</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
      </Card>

      {/* Upload Result Modal */}
      <Dialog open={showUploadResult} onOpenChange={setShowUploadResult}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl" style={{ color: '#1F2937', fontWeight: 700 }}>
              Hasil Deteksi Manual
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image Container */}
            <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 relative">
              {isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 backdrop-blur-sm">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mb-3"></div>
                  <p className="text-sm font-semibold text-gray-600">Menganalisis Gambar...</p>
                </div>
              )}
              <canvas
                ref={uploadCanvasRef}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Jumlah Objek</p>
                <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>
                  {uploadDetections.length} Terdeteksi
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Waktu Deteksi</p>
                <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>
                  {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Detections List */}
            {uploadDetections.length > 0 ? (
              <div>
                <h4 className="mb-3 text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>
                  Objek yang Ditemukan
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {uploadDetections.map((det, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border-l-4 flex justify-between items-center"
                      style={{
                        backgroundColor: 'rgba(254, 197, 61, 0.1)', // Warning/Info bg
                        borderColor: '#FEC53D' // Warning color
                      }}
                    >
                      <div>
                        <h4 className="text-sm mb-1" style={{ color: '#FEC53D', fontWeight: 600 }}>
                          {det.class}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Tingkat Kepercayaan: {(det.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/50">
                        <AlertTriangle className="w-5 h-5" style={{ color: '#FEC53D' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-dashed text-center" style={{ borderColor: '#E5E7EB' }}>
                <p className="text-sm text-gray-500">
                  {isUploading ? 'Sedang memproses...' : 'Tidak ada objek yang terdeteksi.'}
                </p>
              </div>
            )}

            {/* Recommendation Placeholder (Optional, to match style) */}
            {uploadDetections.length > 0 && (
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: 'rgba(72, 128, 255, 0.05)',
                  borderColor: '#4880FF33'
                }}
              >
                <h4 className="mb-2 flex items-center gap-2 text-sm" style={{ color: '#4880FF', fontWeight: 600 }}>
                  <CheckCircle className="w-5 h-5" />
                  Rekomendasi
                </h4>
                <p className="text-sm" style={{ color: '#1F2937' }}>
                  Pastikan kondisi air tetap terjaga dan pantau terus kesehatan ikan Anda.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              className="w-full"
              style={{ backgroundColor: '#4880FF', color: 'white' }}
              onClick={() => setShowUploadResult(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Stream Modal */}
      <Dialog open={showLiveStream} onOpenChange={setShowLiveStream}>
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl" style={{ color: '#1F2937', fontWeight: 700 }}>
              Live Stream - Akuarium Utama
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className="w-full aspect-video rounded-lg flex items-center justify-center relative overflow-hidden bg-gray-900"
            >
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-contain"
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              {!isStreamActive && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div
                      className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(72, 128, 255, 0.2)' }}
                    >
                      <Video className="w-10 h-10" style={{ color: '#4880FF' }} />
                    </div>
                    <p className="text-white text-lg mb-2" style={{ fontWeight: 600 }}>Kamera Tidak Aktif</p>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>
                      Silakan izinkan akses kamera untuk memulai deteksi.
                    </p>
                  </div>
                </div>
              )}

              {/* Live indicator */}
              {isStreamActive && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-2 py-1 rounded-full bg-red-600 z-20">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-xs text-white" style={{ fontWeight: 600 }}>LIVE</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Status Deteksi</p>
                {latestDetections.length > 0 ? (
                  <div className="space-y-2">
                    {latestDetections.map((det, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span style={{ color: '#1F2937', fontWeight: 600 }}>{det.class}</span>
                        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#EEF2FF', color: '#4880FF', fontWeight: 600 }}>
                          {(det.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#1F2937', fontWeight: 600 }}>
                    {isStreamActive ? 'Mencari objek...' : 'Menunggu Kamera'}
                  </p>
                )}
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Model</p>
                <p style={{ color: '#1F2937', fontWeight: 600 }}>YOLOv8 Fish Disease</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-dashed" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tangkap Frame Livestream</p>
                  <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>
                    Ambil gambar terbaru dan jalankan deteksi instan
                  </p>
                </div>
                <Button
                  className="w-full lg:w-auto flex items-center justify-center text-white"
                  style={{ backgroundColor: '#4880FF' }}
                  onClick={handleLiveCaptureDetect}
                  disabled={!isStreamActive || isLiveDetecting || !activeDeviceId || resolvingDevice}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isLiveDetecting
                    ? 'Mendeteksi...'
                    : resolvingDevice
                      ? 'Menyiapkan perangkat...'
                      : 'Ambil Gambar & Deteksi'}
                </Button>
              </div>

              {(!activeDeviceId || deviceResolveMessage) && (
                <p className="text-xs text-amber-600 mb-2">
                  {deviceResolveMessage || 'Perangkat belum siap. Pilih perangkat lebih dulu.'}
                </p>
              )}

              {liveDetectionError && (
                <p className="text-xs text-red-500 mb-3">{liveDetectionError}</p>
              )}

              {liveDetectionSaveMessage && !liveDetectionError && (
                <p className="text-xs text-emerald-600 mb-3">{liveDetectionSaveMessage}</p>
              )}

              {liveDetectionPreview && (
                <div className="w-full h-48 rounded-lg overflow-hidden border mb-3" style={{ borderColor: '#E5E7EB' }}>
                  <img
                    src={liveDetectionPreview}
                    alt="Hasil tangkapan livestream"
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              )}

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {isLiveDetecting ? (
                  <p className="text-sm" style={{ color: '#6B7280' }}>Sedang menganalisis gambar...</p>
                ) : liveDetectionResults.length > 0 ? (
                  liveDetectionResults.map((det, idx) => (
                    <div
                      key={`live-det-${idx}`}
                      className="p-3 rounded-lg flex items-center justify-between"
                      style={{ backgroundColor: 'rgba(72, 128, 255, 0.08)' }}
                    >
                      <div>
                        <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{det.class}</p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>BBox: {det.bbox?.join(', ')}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#EEF2FF', color: '#4880FF', fontWeight: 600 }}>
                        {(det.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))
                ) : liveDetectionPreview ? (
                  <p className="text-sm" style={{ color: '#6B7280' }}>Tidak ada objek terdeteksi pada tangkapan terakhir.</p>
                ) : (
                  <p className="text-sm" style={{ color: '#6B7280' }}>Belum ada gambar yang diambil dari livestream.</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setShowLiveStream(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}