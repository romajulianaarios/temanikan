import json
from datetime import datetime, timedelta

from app import create_app
from models import db, Device, DiseaseDetection


def seed():
    app = create_app('development')

    with app.app_context():
        device = Device.query.first()
        if not device:
            print('❌ Tidak ada perangkat yang ditemukan. Tambahkan perangkat terlebih dahulu.')
            return

        existing_count = DiseaseDetection.query.filter_by(device_id=device.id).count()
        if existing_count > 0:
            print(f'ℹ️ Sudah ada {existing_count} data deteksi untuk perangkat ini. Tidak menambahkan data baru.')
            return

        now = datetime.utcnow()
        samples = [
            {
                'fish_type': 'Ikan Koi',
                'location': 'Akuarium Utama',
                'disease_name': 'Parasitic Diseases',
                'confidence': 85,
                'severity': 'high',
                'status': 'detected',
                'status_meta': {
                    'label': 'Perhatian',
                    'color': '#FEC53D',
                    'bg': 'rgba(254, 197, 61, 0.1)'
                },
                'image_url': 'https://images.unsplash.com/photo-1669241942890-2e066facbd9c?auto=format&fit=crop&w=800&q=80',
                'symptoms': [
                    'Bintik putih pada tubuh',
                    'Ikan menggosok-gosokkan tubuh',
                    'Nafsu makan menurun'
                ],
                'recommended_treatment': 'Segera isolasi ikan yang terinfeksi. Naikkan suhu air secara bertahap hingga 28-30°C. Berikan obat anti-parasit sesuai dosis.',
                'detected_at': now - timedelta(days=1, hours=2)
            },
            {
                'fish_type': 'Ikan Mas',
                'location': 'Akuarium Utama',
                'disease_name': 'Healthy Fish',
                'confidence': 95,
                'severity': 'low',
                'status': 'resolved',
                'status_meta': {
                    'label': 'Sehat',
                    'color': '#4AD991',
                    'bg': 'rgba(74, 217, 145, 0.1)'
                },
                'image_url': 'https://images.unsplash.com/photo-1720001586147-0bfee9e5dba2?auto=format&fit=crop&w=800&q=80',
                'symptoms': [],
                'recommended_treatment': 'Ikan dalam kondisi sehat. Lanjutkan perawatan rutin.',
                'detected_at': now - timedelta(days=2, hours=6)
            },
            {
                'fish_type': 'Ikan Cupang',
                'location': 'Akuarium Karantina',
                'disease_name': 'Bacterial Diseases',
                'confidence': 72,
                'severity': 'medium',
                'status': 'detected',
                'status_meta': {
                    'label': 'Observasi',
                    'color': '#8280FF',
                    'bg': 'rgba(130, 128, 255, 0.1)'
                },
                'image_url': 'https://images.unsplash.com/photo-1573472420143-0c68f179bdc7?auto=format&fit=crop&w=800&q=80',
                'symptoms': [
                    'Sirip robek atau compang-camping',
                    'Perubahan warna pada sirip'
                ],
                'recommended_treatment': 'Periksa kualitas air. Ganti 25% air secara berkala. Berikan garam ikan dan antibiotik jika diperlukan.',
                'detected_at': now - timedelta(days=2, hours=12)
            }
        ]

        records = []
        for sample in samples:
            metadata = {
                'fish_type': sample['fish_type'],
                'location': sample['location'],
                'status_label': sample['status_meta']['label'],
                'status_color': sample['status_meta']['color'],
                'status_bg': sample['status_meta']['bg'],
                'notes': f"Riwayat deteksi otomatis untuk {sample['fish_type']}"
            }

            record = DiseaseDetection(
                device_id=device.id,
                disease_name=sample['disease_name'],
                confidence=sample['confidence'],
                severity=sample['severity'],
                image_url=sample['image_url'],
                symptoms=json.dumps(sample['symptoms']),
                recommended_treatment=sample['recommended_treatment'],
                detected_at=sample['detected_at'],
                status=sample['status'],
                notes=json.dumps(metadata)
            )
            records.append(record)

        db.session.add_all(records)
        db.session.commit()
        print(f'✅ Menambahkan {len(records)} data deteksi penyakit untuk perangkat "{device.name}" (ID {device.id}).')

if __name__ == '__main__':
     seed()
