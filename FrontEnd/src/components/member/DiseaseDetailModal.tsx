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
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent
                className="text-[12px] md:text-[13px]"
                style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid rgba(72, 128, 255, 0.2)',
                    borderRadius: '32px',
                    boxShadow: '0 15px 60px rgba(72, 128, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                    fontFamily: 'Nunito Sans, sans-serif',
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    margin: 0,
                    width: '92vw',
                    maxWidth: '32rem',
                    maxHeight: '75vh',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.25rem'
                }}
                overlayStyle={{
                    backdropFilter: 'blur(8px)',
                    background: 'rgba(0, 0, 0, 0.5)'
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold" style={{ color: '#1F2937', fontFamily: 'inherit' }}>
                        Detail Deteksi Penyakit
                    </DialogTitle>
                </DialogHeader>
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-xl" style={{ color: '#1F2937', fontWeight: 700 }}>Detail Deteksi Penyakit</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 flex-1 overflow-y-auto">
                    <div className="w-full h-40 rounded-2xl overflow-hidden" style={{ border: '2px solid rgba(72, 128, 255, 0.2)', boxShadow: '0 8px 24px rgba(72, 128, 255, 0.1)' }}>
                        <ImageWithFallback
                            src={disease.imageUrl}
                            alt={disease.fishType}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div 
                            className="p-3 rounded-2xl"
                            style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(72, 128, 255, 0.2)',
                                boxShadow: '0 4px 12px rgba(72, 128, 255, 0.1)'
                            }}
                        >
                            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Jenis Ikan</p>
                            <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{disease.fishType}</p>
                        </div>
                        <div 
                            className="p-3 rounded-2xl"
                            style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(72, 128, 255, 0.2)',
                                boxShadow: '0 4px 12px rgba(72, 128, 255, 0.1)'
                            }}
                        >
                            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tingkat Kepercayaan</p>
                            <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{disease.confidence}%</p>
                        </div>
                        <div 
                            className="col-span-2 p-3 rounded-2xl"
                            style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(72, 128, 255, 0.2)',
                                boxShadow: '0 4px 12px rgba(72, 128, 255, 0.1)'
                            }}
                        >
                            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Tanggal & Waktu</p>
                            <p className="text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>{disease.date} - {disease.time}</p>
                        </div>
                    </div>

                    <div
                        className="p-4 rounded-2xl"
                        style={{
                            backgroundColor: disease.statusBg,
                            backdropFilter: 'blur(10px)',
                            border: `2px solid ${disease.statusColor}80`,
                            boxShadow: `0 8px 24px ${disease.statusColor}30`
                        }}
                    >
                        <h4 className="mb-2 text-sm" style={{ color: disease.statusColor, fontWeight: 600 }}>Diagnosis</h4>
                        <p className="text-sm" style={{ color: '#1F2937', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{disease.disease}</p>
                    </div>

                    {disease.symptoms.length > 0 && (
                        <div>
                            <h4 className="mb-3 text-sm" style={{ color: '#1F2937', fontWeight: 600 }}>Gejala yang Terdeteksi</h4>
                            <div className="space-y-2">
                                {disease.symptoms.map((symptom, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 p-3 rounded-2xl"
                                        style={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)',
                                            border: '2px solid rgba(72, 128, 255, 0.2)',
                                            boxShadow: '0 4px 12px rgba(72, 128, 255, 0.1)'
                                        }}
                                    >
                                        <div
                                            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                            style={{ backgroundColor: disease.statusColor }}
                                        />
                                        <p className="text-sm" style={{ color: '#1F2937', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{symptom}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div
                        className="p-4 rounded-2xl"
                        style={{
                            backgroundColor: 'rgba(72, 128, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(72, 128, 255, 0.3)',
                            boxShadow: '0 8px 24px rgba(72, 128, 255, 0.15)'
                        }}
                    >
                        <h4 className="mb-2 flex items-center gap-2 text-sm" style={{ color: '#4880FF', fontWeight: 600 }}>
                            <AlertTriangle className="w-5 h-5" />
                            Rekomendasi Penanganan
                        </h4>
                        <p className="text-sm" style={{ color: '#1F2937', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{disease.recommendation}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
