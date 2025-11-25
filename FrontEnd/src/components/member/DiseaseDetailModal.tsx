import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertTriangle } from '../icons';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface DiseaseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    disease: {
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
    } | null;
}

export default function DiseaseDetailModal({ isOpen, onClose, disease }: DiseaseDetailModalProps) {
    if (!disease) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl" style={{ backgroundColor: 'white' }}>
                <DialogHeader>
                    <DialogTitle className="text-xl" style={{ color: '#1F2937', fontWeight: 700 }}>
                        Detail Deteksi Penyakit
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="w-full h-64 rounded-lg overflow-hidden">
                        <ImageWithFallback
                            src={disease.imageUrl}
                            alt={disease.fishType}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Jenis Ikan</p>
                            <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{disease.fishType}</p>
                        </div>
                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tingkat Kepercayaan</p>
                            <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{disease.confidence}%</p>
                        </div>
                        <div className="col-span-2 p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tanggal & Waktu</p>
                            <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{disease.date} - {disease.time}</p>
                        </div>
                    </div>

                    <div
                        className="p-4 rounded-lg border-l-4"
                        style={{
                            backgroundColor: disease.statusBg,
                            borderColor: disease.statusColor
                        }}
                    >
                        <h4 className="mb-2 text-sm" style={{ color: disease.statusColor, fontWeight: 600 }}>Diagnosis</h4>
                        <p className="text-sm" style={{ color: '#1F2937' }}>{disease.disease}</p>
                    </div>

                    {disease.symptoms.length > 0 && (
                        <div>
                            <h4 className="mb-3 text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>Gejala yang Terdeteksi</h4>
                            <div className="space-y-2">
                                {disease.symptoms.map((symptom, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 p-3 rounded-lg"
                                        style={{ backgroundColor: '#F9FAFB' }}
                                    >
                                        <div
                                            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                            style={{ backgroundColor: disease.statusColor }}
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
                        <p className="text-sm" style={{ color: '#1F2937' }}>{disease.recommendation}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
