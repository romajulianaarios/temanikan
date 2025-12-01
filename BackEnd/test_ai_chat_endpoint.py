"""
Test AI Chat endpoint untuk memastikan semua API keys berfungsi
"""
import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app import create_app
from models import db, User
from flask_jwt_extended import create_access_token
import requests
import json

def test_ai_chat():
    """Test AI Chat endpoint dengan multiple API keys"""
    app = create_app()
    
    with app.app_context():
        # Create test user if not exists
        test_user = User.query.filter_by(email='test@test.com').first()
        if not test_user:
            from werkzeug.security import generate_password_hash
            test_user = User(
                name='Test User',
                email='test@test.com',
                password_hash=generate_password_hash('test123'),
                role='member'
            )
            db.session.add(test_user)
            db.session.commit()
        
        # Create JWT token
        access_token = create_access_token(identity=test_user.id)
        
        # Test AI Chat endpoint
        url = 'http://localhost:5000/api/ai/chat'
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'message': 'Halo, apa itu ikan koi?'
        }
        
        print("=" * 70)
        print("🧪 TESTING AI CHAT ENDPOINT")
        print("=" * 70)
        print(f"\n📤 Request:")
        print(f"   URL: {url}")
        print(f"   Message: {payload['message']}")
        print(f"   User: {test_user.email}")
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            print(f"\n📊 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ SUCCESS!")
                print(f"\n📝 AI Response:")
                print(f"   {result.get('response', '')[:200]}...")
                print(f"\n💾 Chat ID: {result.get('chat_id')}")
                print(f"   Created At: {result.get('created_at')}")
            else:
                print("❌ FAILED!")
                print(f"   Error: {response.text[:200]}")
                
        except requests.exceptions.ConnectionError:
            print("\n❌ ERROR: Backend server tidak berjalan!")
            print("   Jalankan: python app.py")
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
        
        print("\n" + "=" * 70)
        print("✅ TEST SELESAI")
        print("=" * 70)

if __name__ == '__main__':
    test_ai_chat()



