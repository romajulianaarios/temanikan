"""
Test semua API keys untuk melihat mana yang valid
"""
import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from config import config
import requests
import json

def test_single_key(api_key, index):
    """Test satu API key"""
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    
    payload = {
        "contents": [{
            "parts": [{
                "text": "Halo, tes koneksi. Jawab singkat: 'OK'"
            }]
        }]
    }
    
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': api_key.strip()
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                ai_response = result['candidates'][0]['content']['parts'][0]['text']
                return (True, "✅ VALID", ai_response[:50])
            else:
                return (False, "⚠️ Response tidak valid", None)
        elif response.status_code == 403:
            error_detail = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
            error_msg = error_detail.get('error', {}).get('message', '') if isinstance(error_detail, dict) else str(error_detail)
            return (False, "❌ 403 Forbidden", error_msg[:100])
        elif response.status_code == 429:
            return (False, "⚠️ 429 Quota habis", None)
        else:
            return (False, f"❌ Error {response.status_code}", response.text[:100])
    except Exception as e:
        return (False, f"❌ Exception: {str(e)[:50]}", None)

def main():
    dev_config = config['development']
    api_keys = dev_config.get_gemini_api_keys()
    
    if not api_keys:
        print("❌ Tidak ada API keys ditemukan!")
        return
    
    print("=" * 70)
    print("🧪 TESTING SEMUA API KEYS")
    print("=" * 70)
    print(f"\nTotal keys: {len(api_keys)}\n")
    
    valid_keys = []
    invalid_keys = []
    
    for idx, api_key in enumerate(api_keys, 1):
        print(f"Testing Key #{idx}...")
        print(f"  Key: {api_key[:30]}...")
        
        success, status, detail = test_single_key(api_key, idx)
        
        if success:
            print(f"  {status}")
            if detail:
                print(f"  Response: {detail}")
            valid_keys.append((idx, api_key))
        else:
            print(f"  {status}")
            if detail:
                print(f"  Detail: {detail}")
            invalid_keys.append((idx, api_key))
        
        print()
    
    print("=" * 70)
    print("📊 RINGKASAN")
    print("=" * 70)
    print(f"\n✅ Valid keys: {len(valid_keys)}")
    for idx, key in valid_keys:
        print(f"   Key #{idx}: {key[:30]}...")
    
    print(f"\n❌ Invalid keys: {len(invalid_keys)}")
    for idx, key in invalid_keys:
        print(f"   Key #{idx}: {key[:30]}...")
    
    if valid_keys:
        print(f"\n✅ SISTEM SIAP! Ada {len(valid_keys)} key(s) yang valid.")
        print("   Sistem akan menggunakan keys yang valid secara otomatis.")
    else:
        print(f"\n⚠️ PERINGATAN: Tidak ada key yang valid!")
        print("   Sistem akan menggunakan fallback dari database.")
    
    print("\n" + "=" * 70)

if __name__ == '__main__':
    main()



