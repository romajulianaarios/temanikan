"""
Debug script untuk memastikan AI Chat menggunakan API keys dengan benar
"""
import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app import create_app
from models import db, User, ChatHistory
from flask_jwt_extended import create_access_token
from config import config
import requests
import json

def debug_ai_chat():
    """Debug AI Chat endpoint"""
    app = create_app()
    
    with app.app_context():
        print("=" * 70)
        print("🔍 DEBUG AI CHAT - API KEYS & ENDPOINT")
        print("=" * 70)
        
        # 1. Check API keys from config
        print("\n1️⃣ CHECKING API KEYS FROM CONFIG...")
        dev_config = config['development']
        api_keys = dev_config.get_gemini_api_keys()
        print(f"   ✅ API Keys loaded: {len(api_keys) if api_keys else 0}")
        if api_keys:
            for i, key in enumerate(api_keys[:3], 1):
                print(f"      Key #{i}: {key[:30]}...")
        else:
            print("   ❌ TIDAK ADA API KEYS!")
        
        # 2. Check from environment
        print("\n2️⃣ CHECKING FROM ENVIRONMENT...")
        keys_env = os.getenv('GEMINI_API_KEYS')
        key_env = os.getenv('GEMINI_API_KEY')
        print(f"   GEMINI_API_KEYS: {'✅ Ada' if keys_env else '❌ Tidak ada'}")
        print(f"   GEMINI_API_KEY: {'✅ Ada' if key_env else '❌ Tidak ada'}")
        if key_env:
            keys_list = [k.strip() for k in key_env.split(',') if k.strip()]
            print(f"   Total keys di GEMINI_API_KEY: {len(keys_list)}")
        
        # 3. Create test user and token
        print("\n3️⃣ CREATING TEST USER & TOKEN...")
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
            print(f"   ✅ Test user created: {test_user.email}")
        else:
            print(f"   ✅ Test user exists: {test_user.email}")
        
        access_token = create_access_token(identity=test_user.id)
        print(f"   ✅ JWT Token created")
        
        # 4. Test endpoint (if server is running)
        print("\n4️⃣ TESTING ENDPOINT (if server running)...")
        url = 'http://localhost:5000/api/ai/chat'
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        payload = {
            'message': 'Apa itu ikan koi? Jawab singkat.'
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                response_text = result.get('response', '')
                print(f"   ✅ Response received ({len(response_text)} chars)")
                print(f"   Preview: {response_text[:150]}...")
                
                # Check if it's fallback
                if "Halo! Saya siap membantu Anda" in response_text or "Beberapa jenis ikan yang tersedia" in response_text:
                    print("\n   ⚠️ PERINGATAN: Response adalah FALLBACK dari database!")
                    print("   API keys TIDAK digunakan!")
                else:
                    print("\n   ✅ Response dari Gemini API (bukan fallback)")
            else:
                print(f"   ❌ Error: {response.text[:200]}")
        except requests.exceptions.ConnectionError:
            print("   ⚠️ Backend server tidak berjalan")
            print("   Jalankan: python app.py")
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
        
        # 5. Check recent chat history
        print("\n5️⃣ CHECKING RECENT CHAT HISTORY...")
        recent_chats = ChatHistory.query.filter_by(user_id=test_user.id)\
            .order_by(ChatHistory.created_at.desc())\
            .limit(3).all()
        print(f"   Total recent chats: {len(recent_chats)}")
        for chat in recent_chats:
            is_fallback = "Halo! Saya siap membantu Anda" in chat.response or "Beberapa jenis ikan yang tersedia" in chat.response
            print(f"   - {chat.created_at.strftime('%Y-%m-%d %H:%M')}: {'⚠️ FALLBACK' if is_fallback else '✅ API'}")
            print(f"     Message: {chat.message[:50]}...")
            print(f"     Response: {chat.response[:80]}...")
        
        print("\n" + "=" * 70)
        print("✅ DEBUG SELESAI")
        print("=" * 70)
        print("\n📋 KESIMPULAN:")
        if not api_keys:
            print("   ❌ API KEYS TIDAK TER-LOAD!")
            print("   💡 Solusi: Pastikan file .env berisi GEMINI_API_KEY atau GEMINI_API_KEYS")
        elif len(api_keys) < 5:
            print(f"   ⚠️ Hanya {len(api_keys)} API keys ter-load (diharapkan lebih banyak)")
        else:
            print(f"   ✅ {len(api_keys)} API keys ter-load")
        
        print("\n🚀 LANGKAH SELANJUTNYA:")
        print("   1. Pastikan backend server BERHASIL di-restart")
        print("   2. Cek log backend saat mengirim pesan ke AI Chat")
        print("   3. Pastikan log menampilkan: '🔑 API Keys loaded: X'")
        print("   4. Jika masih fallback, kirim log backend untuk debugging")

if __name__ == '__main__':
    debug_ai_chat()



