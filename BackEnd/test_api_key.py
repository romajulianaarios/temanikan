"""
Test Gemini API Key - Cek apakah API key valid dan berfungsi
"""

import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from config import config
import requests
import json

def test_api_key(api_key=None):
    """Test apakah API key valid"""
    if not api_key:
        api_key = config['development'].GEMINI_API_KEY or os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("[ERROR] API Key tidak ditemukan!")
        print("\nSolusi:")
        print("1. Buat file .env di folder BackEnd/")
        print("2. Tambahkan: GEMINI_API_KEY=your-api-key-here")
        print("3. Atau update di config.py")
        return False
    
    print("=" * 70)
    print("Testing Gemini API Key...")
    print("=" * 70)
    print(f"\nAPI Key: {api_key[:20]}...{api_key[-10:]}")
    print(f"Model: gemini-2.0-flash")
    print("\nMengirim request ke Gemini API...")
    
    # Test dengan request sederhana
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    
    payload = {
        "contents": [{
            "parts": [{
                "text": "Halo, tes koneksi. Jawab dengan singkat: 'API berfungsi'"
            }]
        }]
    }
    
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': api_key
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        print(f"\nResponse Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                ai_response = result['candidates'][0]['content']['parts'][0]['text']
                print(f"\n[SUCCESS] API Key VALID dan BERFUNGSI!")
                print(f"\nResponse dari AI:")
                print(f"   {ai_response}")
                print("\n" + "=" * 70)
                print("[OK] API Key siap digunakan!")
                print("=" * 70)
                return True
            else:
                print("\n[WARNING] Response tidak mengandung data yang diharapkan")
                print(f"Response: {json.dumps(result, indent=2)}")
                return False
                
        elif response.status_code == 403:
            print("\n[ERROR] 403 Forbidden")
            print("   API Key tidak valid atau tidak memiliki akses")
            print("\nSolusi:")
            print("1. Cek API key di: https://makersuite.google.com/app/apikey")
            print("2. Pastikan API key aktif dan tidak expired")
            print("3. Buat API key baru jika perlu")
            print(f"\nResponse: {response.text[:200]}")
            return False
            
        elif response.status_code == 429:
            print("\n[WARNING] 429 Too Many Requests")
            print("   Quota API key sudah habis")
            print("\nSolusi:")
            print("1. Tunggu beberapa saat (quota reset setiap 24 jam)")
            print("2. Buat API key baru")
            print("3. Sistem akan otomatis menggunakan fallback dari database")
            return False
            
        else:
            print(f"\n[ERROR] Status code {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"\n[ERROR] Gagal menghubungi API")
        print(f"   {str(e)}")
        print("\nSolusi:")
        print("1. Cek koneksi internet")
        print("2. Cek apakah API key valid")
        print("3. Coba lagi nanti")
        return False

if __name__ == '__main__':
    # Test dengan API key dari config
    success = test_api_key()
    
    if not success:
        print("\n" + "=" * 70)
        print("📋 LANGKAH SELANJUTNYA:")
        print("=" * 70)
        print("\n1. Dapatkan API Key baru:")
        print("   https://makersuite.google.com/app/apikey")
        print("   atau")
        print("   https://aistudio.google.com/app/apikey")
        print("\n2. Update API Key:")
        print("   python update_api_key.py YOUR_NEW_API_KEY")
        print("\n3. Test lagi:")
        print("   python test_api_key.py")
        print("\nCatatan:")
        print("   Meskipun API key error, aplikasi tetap berfungsi")
        print("   dengan fallback dari database!")
        sys.exit(1)
    else:
        print("\n[OK] API Key siap digunakan! Restart backend server untuk menerapkan.")
        sys.exit(0)

