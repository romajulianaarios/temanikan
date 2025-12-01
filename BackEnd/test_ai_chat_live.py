"""
Test AI Chat endpoint secara langsung dengan API keys yang ada
"""
import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from config import config
import requests
import json

def test_ai_chat_direct():
    """Test AI Chat langsung dengan API keys"""
    dev_config = config['development']
    api_keys = dev_config.get_gemini_api_keys()
    
    if not api_keys:
        print("❌ Tidak ada API keys ditemukan!")
        return
    
    print("=" * 70)
    print("🧪 TESTING AI CHAT DENGAN API KEYS")
    print("=" * 70)
    print(f"\n✅ Total API Keys: {len(api_keys)}")
    
    # Test message
    message = "Apa itu ikan koi? Jawab singkat dalam 2-3 kalimat."
    
    # Build system prompt (sama seperti di routes.py)
    system_prompt = f"""Anda adalah asisten AI ahli untuk perawatan ikan hias dan diagnosis penyakit ikan. 
Anda membantu pengguna dengan informasi lengkap tentang:
- Jenis-jenis ikan hias dan cara perawatannya
- Penyakit ikan dan cara mengobatinya
- Kualitas air akuarium
- Tips dan trik perawatan ikan

PENTING - Format Jawaban (WAJIB DIIKUTI):
1. JANGAN gunakan tanda asterisk (*), markdown, atau simbol formatting apapun
2. JANGAN gunakan simbol bullet point (•, -, *, dll)
3. Gunakan paragraf yang jelas dan terstruktur dengan spasi antar paragraf
4. Jika perlu penekanan, gunakan kata-kata yang jelas tanpa formatting khusus
5. Susun jawaban dalam paragraf yang mudah dibaca, setiap paragraf fokus pada satu topik
6. Jika perlu list, gunakan nomor (1, 2, 3) atau langsung dalam bentuk paragraf
7. Gunakan bahasa Indonesia yang ramah, profesional, dan mudah dipahami
8. Pisahkan setiap topik dengan baris kosong untuk readability

Setiap paragraf harus jelas, informatif, dan mudah dipahami. Jangan gunakan formatting markdown apapun."""
    
    full_prompt = f"{system_prompt}\n\nPertanyaan pengguna: {message}"
    
    # Prepare request
    model_name = "gemini-2.0-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
    
    payload = {
        "contents": [{
            "parts": [{
                "text": full_prompt
            }]
        }]
    }
    
    print(f"\n📤 Request:")
    print(f"   Model: {model_name}")
    print(f"   Message: {message}")
    print(f"   URL: {url}")
    
    # Try each API key
    for idx, api_key in enumerate(api_keys, 1):
        print(f"\n🔄 Testing Key #{idx}...")
        print(f"   Key: {api_key[:30]}...")
        
        headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': api_key.strip()
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                
                # Extract text
                if 'candidates' in result and len(result['candidates']) > 0:
                    if 'content' in result['candidates'][0]:
                        if 'parts' in result['candidates'][0]['content']:
                            ai_response = result['candidates'][0]['content']['parts'][0].get('text', '')
                        else:
                            ai_response = result['candidates'][0]['content'].get('text', '')
                    else:
                        ai_response = result['candidates'][0].get('text', '')
                else:
                    ai_response = str(result)
                
                if ai_response:
                    print(f"\n✅ SUCCESS dengan Key #{idx}!")
                    print(f"\n📝 AI Response ({len(ai_response)} karakter):")
                    print("-" * 70)
                    print(ai_response[:500])
                    if len(ai_response) > 500:
                        print("...")
                    print("-" * 70)
                    
                    # Check if it's fallback response
                    if "Halo! Saya siap membantu Anda" in ai_response or "Beberapa jenis ikan yang tersedia" in ai_response:
                        print("\n⚠️ PERINGATAN: Response terlihat seperti fallback dari database!")
                        print("   Ini seharusnya tidak terjadi jika API keys berfungsi.")
                    else:
                        print("\n✅ Response terlihat dari Gemini API (bukan fallback)")
                    
                    return True
                else:
                    print("   ⚠️ Response kosong")
            elif response.status_code == 403:
                error_detail = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                error_msg = error_detail.get('error', {}).get('message', '') if isinstance(error_detail, dict) else str(error_detail)
                print(f"   ❌ 403 Forbidden: {error_msg[:100]}")
            elif response.status_code == 429:
                print(f"   ⚠️ 429 Quota habis")
            else:
                print(f"   ❌ Error {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            print(f"   ❌ Exception: {str(e)[:100]}")
            continue
    
    print("\n❌ Semua API keys gagal!")
    return False

if __name__ == '__main__':
    test_ai_chat_direct()



