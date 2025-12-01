"""
Test AI Chat endpoint sekarang untuk memastikan API keys digunakan
"""
import sys
import os
from pathlib import Path
import requests
import json

sys.path.insert(0, str(Path(__file__).parent))

from app import create_app
from models import db, User
from flask_jwt_extended import create_access_token

def test_now():
    """Test AI Chat endpoint sekarang"""
    app = create_app()
    
    with app.app_context():
        # Get test user
        test_user = User.query.filter_by(email='test@test.com').first()
        if not test_user:
            print("❌ Test user tidak ditemukan")
            return
        
        # Create token
        access_token = create_access_token(identity=test_user.id)
        
        # Test endpoint
        url = 'http://localhost:5000/api/ai/chat'
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        payload = {
            'message': 'Apa itu ikan koi? Jawab singkat 2 kalimat saja.'
        }
        
        print("=" * 70)
        print("🧪 TESTING AI CHAT ENDPOINT SEKARANG")
        print("=" * 70)
        print(f"\n📤 Request:")
        print(f"   URL: {url}")
        print(f"   Message: {payload['message']}")
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            print(f"\n📊 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get('response', '')
                print(f"\n✅ SUCCESS!")
                print(f"   Response length: {len(response_text)} karakter")
                print(f"\n📝 AI Response:")
                print("-" * 70)
                print(response_text[:300])
                if len(response_text) > 300:
                    print("...")
                print("-" * 70)
                
                # Check if it's fallback
                if "Halo! Saya siap membantu Anda" in response_text or "Beberapa jenis ikan yang tersedia" in response_text:
                    print("\n⚠️ PERINGATAN: Response adalah FALLBACK dari database!")
                    print("   API keys TIDAK digunakan!")
                    print("\n💡 Solusi:")
                    print("   1. Cek log backend server (window baru yang terbuka)")
                    print("   2. Pastikan log menampilkan: '🔑 API Keys loaded: 5'")
                    print("   3. Jika tidak, restart backend server lagi")
                else:
                    print("\n✅ Response dari Gemini API (bukan fallback)")
                    print("   ✅ AI Chat berfungsi dengan baik!")
            else:
                print(f"\n❌ ERROR: {response.text[:200]}")
        except Exception as e:
            print(f"\n❌ EXCEPTION: {str(e)}")
        
        print("\n" + "=" * 70)

if __name__ == '__main__':
    test_now()



