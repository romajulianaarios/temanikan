"""
Script untuk melihat data fishpedia di database
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from models import FishSpecies

app = create_app()

def view_fishpedia():
    """Menampilkan semua data fishpedia dari database"""
    with app.app_context():
        print("\n=== Data Fishpedia di Database ===\n")
        
        fishes = FishSpecies.query.all()
        
        if not fishes:
            print("❌ Tidak ada data ikan di database")
            return
        
        print(f"Total: {len(fishes)} spesies ikan\n")
        print("=" * 80)
        
        for fish in fishes:
            print(f"\nID: {fish.id}")
            print(f"Nama: {fish.name}")
            print(f"Nama Ilmiah: {fish.scientific_name}")
            print(f"Kategori: {fish.category}")
            print(f"Tingkat Perawatan: {fish.care_level}")
            print(f"Temperamen: {fish.temperament}")
            print(f"Ukuran Maksimal: {fish.max_size}")
            print(f"Ukuran Tank Minimal: {fish.min_tank_size}")
            print(f"Suhu Air: {fish.water_temp}")
            print(f"Rentang pH: {fish.ph_range}")
            print(f"Deskripsi: {fish.description[:100]}...")
            print(f"Gambar URL: {fish.image_url[:80]}...")
            print("-" * 80)
        
        print(f"\n✅ Total {len(fishes)} data ikan berhasil dimuat dari database\n")

if __name__ == '__main__':
    view_fishpedia()
