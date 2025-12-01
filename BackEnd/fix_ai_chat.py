"""
Script untuk memperbaiki AI Chat - memastikan API keys digunakan dengan benar
"""
import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from config import config
import requests

def test_and_fix():
    """Test API keys dan pastikan semuanya berfungsi"""
    print("=" * 70)
    print("🔧 FIX AI CHAT - Memastikan API Keys Berfungsi")
    print("=" * 70)
    
    # 1. Check API keys
    dev_config = config['development']
    api_keys = dev_config.get_gemini_api_keys()
    
    print(f"\n1️⃣ API Keys Status:")
    print(f"   Total keys ter-load: {len(api_keys) if api_keys else 0}")
    
    if not api_keys:
        print("\n❌ TIDAK ADA API KEYS!")
        print("   💡 Jalankan: python update_api_key.py \"KEY1,KEY2,KEY3,...\"")
        return False
    
    # 2. Test each key
    print(f"\n2️⃣ Testing {len(api_keys)} API Keys...")
    valid_keys = []
    
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    payload = {
        "contents": [{
            "parts": [{
                "text": "Halo, tes koneksi. Jawab singkat: 'OK'"
            }]
        }]
    }
    
    for idx, api_key in enumerate(api_keys, 1):
        print(f"\n   Testing Key #{idx}...")
        headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': api_key.strip()
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    print(f"      ✅ VALID")
                    valid_keys.append(api_key)
                else:
                    print(f"      ⚠️ Response tidak valid")
            elif response.status_code == 403:
                print(f"      ❌ 403 Forbidden (expired/invalid)")
            elif response.status_code == 429:
                print(f"      ⚠️ 429 Quota habis")
            else:
                print(f"      ❌ Error {response.status_code}")
        except Exception as e:
            print(f"      ❌ Exception: {str(e)[:50]}")
    
    print(f"\n3️⃣ Summary:")
    print(f"   ✅ Valid keys: {len(valid_keys)}/{len(api_keys)}")
    
    if len(valid_keys) == 0:
        print("\n❌ TIDAK ADA API KEY YANG VALID!")
        print("   💡 Update API keys dengan: python update_api_key.py \"KEY1,KEY2,...\"")
        return False
    
    print(f"\n✅ {len(valid_keys)} API key(s) siap digunakan!")
    print("\n📋 LANGKAH SELANJUTNYA:")
    print("   1. ✅ API keys sudah ter-load dan valid")
    print("   2. ⚠️ PASTIKAN BACKEND SERVER SUDAH DI-RESTART!")
    print("   3. ⚠️ Cek log backend saat mengirim pesan ke AI Chat")
    print("   4. ⚠️ Log harus menampilkan: '🔑 API Keys loaded: X'")
    print("   5. ⚠️ Jika masih fallback, pastikan backend server BERHASIL restart")
    
    return True

if __name__ == '__main__':
    test_and_fix()



