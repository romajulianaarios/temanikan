"""
Test script untuk melihat format data fishpedia yang dikembalikan API
"""
import os
import sys
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from models import FishSpecies

app = create_app()

def test_fishpedia_format():
    """Test format data fishpedia untuk frontend"""
    with app.app_context():
        print("\n=== Testing Fishpedia API Response Format ===\n")
        
        fishes = FishSpecies.query.limit(2).all()
        
        if not fishes:
            print("❌ No fish data found")
            return
        
        # Test single fish format
        fish = fishes[0]
        fish_dict = fish.to_dict()
        
        print("Sample Fish Data (formatted for frontend):")
        print(json.dumps(fish_dict, indent=2, ensure_ascii=False))
        
        print("\n" + "="*80)
        print("\nChecking required frontend fields:")
        required_fields = [
            'id', 'name', 'scientificName', 'category', 'difficulty', 
            'status', 'views', 'lastUpdated', 'description', 'image',
            'phMin', 'phMax', 'tempMin', 'tempMax'
        ]
        
        for field in required_fields:
            value = fish_dict.get(field)
            status = "✓" if value is not None else "✗"
            print(f"{status} {field}: {value}")
        
        print("\n" + "="*80)
        print(f"\n✅ Total {len(fishes)} fish tested\n")

if __name__ == '__main__':
    test_fishpedia_format()
