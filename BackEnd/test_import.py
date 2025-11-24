"""Test import untuk debugging"""
import sys
import traceback

print("Testing imports...")

try:
    print("\n1. Testing config...")
    from config import config
    print("✓ config imported")
except Exception as e:
    print(f"✗ Error importing config: {e}")
    traceback.print_exc()

try:
    print("\n2. Testing models...")
    from models import db, bcrypt, FishSpecies
    print("✓ models imported")
except Exception as e:
    print(f"✗ Error importing models: {e}")
    traceback.print_exc()

try:
    print("\n3. Testing routes...")
    from routes import register_routes
    print("✓ routes imported")
except Exception as e:
    print(f"✗ Error importing routes: {e}")
    traceback.print_exc()

try:
    print("\n4. Creating test app...")
    from flask import Flask
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/temanikan.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'test'
    app.config['JWT_SECRET_KEY'] = 'test'
    
    db.init_app(app)
    print("✓ db initialized")
    
    with app.app_context():
        # Test creating FishSpecies object
        fish = FishSpecies(
            name="Test Fish",
            scientific_name="Testus fishus",
            category="Air Tawar",
            description="Test",
            care_level="Mudah",
            ph_range="6.8-7.2",
            water_temp="25-28°C"
        )
        print("\n5. Testing FishSpecies.to_dict()...")
        data = fish.to_dict()
        print(f"✓ to_dict() returned {len(data)} fields")
        print(f"  Fields: {', '.join(data.keys())}")
        
except Exception as e:
    print(f"\n✗ Error during test: {e}")
    traceback.print_exc()

print("\n✅ All tests complete")
