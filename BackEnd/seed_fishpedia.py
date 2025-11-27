"""
Seed script untuk memasukkan data fishpedia ke database
Data diambil dari MemberFishpedia.tsx
"""
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from models import FishSpecies

# Create Flask app instance
app = create_app()

# Data ikan dari MemberFishpedia.tsx
FISH_DATA = [
    {
        'name': 'Ikan Koi',
        'scientific_name': 'Cyprinus carpio',
        'category': 'Air Tawar',
        'description': 'Ikan hias populer dari Jepang dengan berbagai pola warna yang indah. Koi merupakan simbol keberuntungan, kemakmuran, dan umur panjang dalam budaya Jepang. Mereka memiliki kepribadian yang unik dan dapat mengenali pemiliknya. Koi dapat hidup hingga puluhan tahun dengan perawatan yang tepat dan dapat tumbuh sangat besar di kolam yang sesuai.',
        'care_level': 'Menengah',
        'temperament': 'Damai',
        'max_size': '60-90 cm',
        'min_tank_size': 'Kolam minimal 1000 liter',
        'water_temp': '15-25°C',
        'ph_range': '6.8-7.2',
        'diet': 'Omnivora - pelet ikan, sayuran, buah-buahan, dan serangga',
        'image_url': 'https://images.unsplash.com/photo-1701738504736-8f8e53148b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb2klMjBmaXNoJTIwcG9uZHxlbnwxfHx8fDE3NjIyNTI1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        'name': 'Ikan Cupang',
        'scientific_name': 'Betta splendens',
        'category': 'Air Tawar',
        'description': 'Ikan cantik dengan sirip mengembang yang spektakuler, cocok untuk pemula. Berasal dari Thailand dan dikenal sebagai "Ikan Petarung Siam". Cupang jantan sangat teritorial dan akan bertarung dengan jantan lain. Mereka memiliki organ labirin yang memungkinkan mereka mengambil oksigen langsung dari udara, sehingga dapat hidup di perairan dengan oksigen rendah.',
        'care_level': 'Mudah',
        'temperament': 'Agresif',
        'max_size': '5-7 cm',
        'min_tank_size': '10 liter',
        'water_temp': '24-28°C',
        'ph_range': '6.5-7.5',
        'diet': 'Karnivora - larva nyamuk, bloodworm, artemia, pelet protein tinggi',
        'image_url': 'https://images.unsplash.com/photo-1553986187-9cb16fa33483?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXR0YSUyMGZpc2glMjBzaWFtZXNlfGVufDF8fHx8MTc2MjI1MjU4NXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        'name': 'Ikan Mas Koki',
        'scientific_name': 'Carassius auratus',
        'category': 'Air Tawar',
        'description': 'Ikan hias klasik dengan bentuk tubuh unik dan warna cerah yang beragam. Mas Koki memiliki banyak varietas seperti Oranda, Ranchu, Lionhead, dan Ryukin. Mereka adalah ikan sosial yang suka berkelompok dan sangat mudah beradaptasi. Memerlukan akuarium yang cukup besar karena menghasilkan banyak limbah dan membutuhkan filtrasi yang baik.',
        'care_level': 'Mudah',
        'temperament': 'Damai',
        'max_size': '15-20 cm',
        'min_tank_size': '80 liter',
        'water_temp': '18-22°C',
        'ph_range': '7.0-7.5',
        'diet': 'Omnivora - pelet khusus goldfish, sayuran rebus, bloodworm',
        'image_url': 'https://images.unsplash.com/photo-1646116917668-7e3210fad343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZmlzaCUyMGFxdWFyaXVtfGVufDF8fHx8MTc2MjE2MTAzMHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        'name': 'Ikan Discus',
        'scientific_name': 'Symphysodon spp.',
        'category': 'Air Tawar',
        'description': 'Raja akuarium air tawar dengan bentuk bulat pipih dan warna yang spektakuler. Berasal dari Sungai Amazon, Discus memerlukan perawatan intensif dengan kualitas air yang sangat baik. Mereka adalah ikan yang sensitif terhadap perubahan parameter air dan memerlukan suhu yang lebih hangat dibanding kebanyakan ikan tropis. Discus adalah ikan berkelompok yang harus dipelihara minimal 5-6 ekor.',
        'care_level': 'Sulit',
        'temperament': 'Damai',
        'max_size': '15-20 cm',
        'min_tank_size': '200 liter',
        'water_temp': '26-30°C',
        'ph_range': '6.0-7.0',
        'diet': 'Karnivora - bloodworm, artemia, pelet protein tinggi khusus discus',
        'image_url': 'https://images.unsplash.com/photo-1564989769610-40bbae0aa5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjdXMlMjBmaXNoJTIwYXF1YXJpdW18ZW58MXx8fHwxNzYyMjUyNTg1fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        'name': 'Ikan Arwana',
        'scientific_name': 'Scleropages formosus',
        'category': 'Air Tawar',
        'description': 'Ikan legendaris yang dipercaya membawa keberuntungan dalam budaya Asia. Arwana adalah ikan predator besar yang memerlukan akuarium sangat besar (minimal 500 liter). Mereka dikenal karena kemampuan melompat yang luar biasa dan memerlukan tutup akuarium yang kuat. Arwana adalah perenang aktif dan memerlukan ruang berenang yang luas.',
        'care_level': 'Sulit',
        'temperament': 'Agresif',
        'max_size': '60-90 cm',
        'min_tank_size': '500 liter',
        'water_temp': '24-30°C',
        'ph_range': '6.0-7.0',
        'diet': 'Karnivora - ikan kecil, udang, serangga, jangkrik',
        'image_url': 'https://images.unsplash.com/photo-1522720833778-7738150eb537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcm93YW5hJTIwZmlzaHxlbnwxfHx8fDE3NjIyNTI1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        'name': 'Ikan Guppy',
        'scientific_name': 'Poecilia reticulata',
        'category': 'Air Tawar',
        'description': 'Ikan kecil yang sangat populer di kalangan aquarist pemula. Guppy jantan memiliki warna yang lebih cerah dan ekor yang lebih panjang dibanding betina. Mereka adalah livebearer (beranak) yang sangat produktif dan dapat bereproduksi dengan cepat. Guppy sangat mudah beradaptasi dan toleran terhadap berbagai kondisi air.',
        'care_level': 'Mudah',
        'temperament': 'Damai',
        'max_size': '3-6 cm',
        'min_tank_size': '40 liter',
        'water_temp': '22-28°C',
        'ph_range': '7.0-8.0',
        'diet': 'Omnivora - pelet kecil, kutu air, spirulina, sayuran rebus',
        'image_url': 'https://images.unsplash.com/photo-1591582768075-bc8a9bf94b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndXBweSUyMGZpc2h8ZW58MXx8fHwxNzYyMjUyNTg2fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        'name': 'Ikan Molly',
        'scientific_name': 'Poecilia sphenops',
        'category': 'Air Tawar',
        'description': 'Molly adalah ikan yang sangat populer untuk akuarium komunitas karena sifatnya yang damai. Tersedia dalam berbagai varietas seperti Black Molly, Silver Molly, dan Balloon Molly. Mereka adalah livebearer yang mudah berkembang biak dan membutuhkan air dengan pH sedikit basa. Molly juga dapat hidup di air payau.',
        'care_level': 'Mudah',
        'temperament': 'Damai',
        'max_size': '8-12 cm',
        'min_tank_size': '60 liter',
        'water_temp': '25-28°C',
        'ph_range': '7.5-8.5',
        'diet': 'Omnivora dengan preferensi herbivora - spirulina, sayuran, alga, pelet',
        'image_url': 'https://images.unsplash.com/photo-1520990981767-a4c6988f5ee7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2xseSUyMGZpc2h8ZW58MXx8fHwxNzYyMjUyNTg2fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        'name': 'Ikan Neon Tetra',
        'scientific_name': 'Paracheirodon innesi',
        'category': 'Air Tawar',
        'description': 'Ikan kecil yang sangat populer dengan garis neon biru cerah yang membentang dari mata ke ekor. Neon Tetra adalah ikan schooling yang harus dipelihara dalam kelompok minimal 6 ekor. Mereka berasal dari perairan hitam Amazon dan lebih menyukai air yang sedikit asam. Sangat damai dan cocok untuk akuarium komunitas.',
        'care_level': 'Mudah',
        'temperament': 'Damai',
        'max_size': '3-4 cm',
        'min_tank_size': '40 liter',
        'water_temp': '20-26°C',
        'ph_range': '6.0-7.0',
        'diet': 'Omnivora - pelet mikro, cacing darah kecil, kutu air',
        'image_url': 'https://images.unsplash.com/photo-1584642875245-786dc34761b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwdGV0cmElMjBmaXNofGVufDF8fHx8MTc2MjI1MjU4Nnww&ixlib=rb-4.1.0&q=80&w=1080'
    }
]

def get_image_url(url, filename):
    """Kembalikan URL gambar (langsung simpan URL, tidak download)"""
    # Untuk saat ini, kita gunakan URL langsung dari Unsplash
    # Admin bisa upload gambar manual nanti jika perlu
    return url

def seed_fishpedia():
    """Seed data fishpedia ke database"""
    with app.app_context():
        print("\n=== Seeding Fishpedia Data ===\n")
        
        # Hapus data lama jika ada
        existing_count = FishSpecies.query.count()
        if existing_count > 0:
            print(f"⚠ Found {existing_count} existing fish species")
            confirm = input("Delete existing data? (y/n): ")
            if confirm.lower() == 'y':
                FishSpecies.query.delete()
                db.session.commit()
                print("✓ Deleted existing data\n")
            else:
                print("✗ Cancelled\n")
                return
        
        # Insert data baru
        success_count = 0
        for idx, fish_data in enumerate(FISH_DATA, 1):
            try:
                # Gunakan URL langsung
                filename = f"{fish_data['name'].lower().replace(' ', '_')}.jpg"
                local_image_path = get_image_url(fish_data['image_url'], filename)
                
                # Buat instance FishSpecies
                fish = FishSpecies(
                    name=fish_data['name'],
                    scientific_name=fish_data['scientific_name'],
                    category=fish_data['category'],
                    description=fish_data['description'],
                    care_level=fish_data['care_level'],
                    temperament=fish_data['temperament'],
                    max_size=fish_data['max_size'],
                    min_tank_size=fish_data['min_tank_size'],
                    water_temp=fish_data['water_temp'],
                    ph_range=fish_data['ph_range'],
                    diet=fish_data['diet'],
                    image_url=local_image_path
                )
                
                db.session.add(fish)
                db.session.commit()
                
                print(f"✓ [{idx}/8] Added: {fish_data['name']}")
                success_count += 1
                
            except Exception as e:
                print(f"✗ [{idx}/8] Error adding {fish_data['name']}: {e}")
                db.session.rollback()
        
        print(f"\n=== Seeding Complete ===")
        print(f"Successfully added {success_count}/8 fish species to database\n")

if __name__ == '__main__':
    seed_fishpedia()
