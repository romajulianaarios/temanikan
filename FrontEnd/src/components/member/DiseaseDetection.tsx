import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from '../Router';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Camera, Video, Eye, AlertTriangle, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function DiseaseDetection() {
  const { deviceId } = useParams<{ deviceId?: string }>();
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [latestDetections, setLatestDetections] = useState<any[]>([]);

  // Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadDetections, setUploadDetections] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadResult, setShowUploadResult] = useState(false);

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

  const detections = [
    {
      id: 1,
      fishType: 'Ikan Koi',
      location: 'Akuarium Utama',
      date: '4 Nov 2025',
      time: '14:30',
      status: 'warning',
      statusLabel: 'Perhatian',
      statusColor: '#FEC53D',
      statusBg: 'rgba(254, 197, 61, 0.1)',
      disease: 'Parasitic Diseases',
      confidence: 85,
      recommendation: 'Segera isolasi ikan yang terinfeksi. Naikkan suhu air secara bertahap hingga 28-30°C. Berikan obat anti-parasit sesuai dosis.',
      symptoms: ['Bintik putih pada tubuh', 'Ikan menggosok-gosokkan tubuh', 'Nafsu makan menurun'],
      imageUrl: 'https://images.unsplash.com/photo-1669241942890-2e066facbd9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb2klMjBmaXNofGNsb3NlJTIwdXBhbHxlbnwxfHx8fDE3NjIyNjUwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      fishType: 'Ikan Mas',
      location: 'Akuarium Utama',
      date: '3 Nov 2025',
      time: '16:45',
      status: 'healthy',
      statusLabel: 'Sehat',
      statusColor: '#4AD991',
      statusBg: 'rgba(74, 217, 145, 0.1)',
      disease: 'Healthy Fish',
      confidence: 95,
      recommendation: 'Ikan dalam kondisi sehat. Lanjutkan perawatan rutin.',
      symptoms: [],
      imageUrl: 'https://images.unsplash.com/photo-1720001586147-0bfee9e5dba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZmlzaCUyMGNsb3NlJTIwdW5kZXJ3YXRlcnxlbnwxfHx8fDE3NjIyNjUwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      fishType: 'Ikan Cupang',
      location: 'Akuarium Karantina',
      date: '3 Nov 2025',
      time: '09:15',
      status: 'info',
      statusLabel: 'Observasi',
      statusColor: '#8280FF',
      statusBg: 'rgba(130, 128, 255, 0.1)',
      disease: 'Bacterial Diseases',
      confidence: 72,
      recommendation: 'Periksa kualitas air. Ganti 25% air secara berkala. Berikan garam ikan dan antibiotik jika diperlukan.',
      symptoms: ['Sirip robek atau compang-camping', 'Perubahan warna pada sirip'],
      imageUrl: 'https://images.unsplash.com/photo-1573472420143-0c68f179bdc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiZXR0YSUyMGZpc2hsaXNoJTIwdW5kZXJ3YXRlcnxlbnwxfHx8fDE3NjIyNjUwNjB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
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
            <Link to={deviceId ? `/member/device/${deviceId}/detection-history` : `/member/detection-history`}>
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
        {detections.map((detection) => (
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
            <DialogContent className="max-w-2xl" style={{ backgroundColor: 'white' }}>
              <DialogHeader>
                <DialogTitle className="text-xl" style={{ color: '#1F2937', fontWeight: 700 }}>
                  Detail Deteksi Penyakit
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={detection.imageUrl}
                    alt={detection.fishType}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Jenis Ikan</p>
                    <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{detection.fishType}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tingkat Kepercayaan</p>
                    <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{detection.confidence}%</p>
                  </div>
                  <div className="col-span-2 p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tanggal & Waktu</p>
                    <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{detection.date} - {detection.time}</p>
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg border-l-4"
                  style={{
                    backgroundColor: `${detection.statusBg}`,
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
                          className="flex items-start gap-2 p-3 rounded-lg"
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
                  className="p-4 rounded-lg border"
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
        ))}
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
        <DialogContent className="max-w-2xl" style={{ backgroundColor: 'white' }}>
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
        <DialogContent className="max-w-4xl" style={{ backgroundColor: 'white' }}>
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