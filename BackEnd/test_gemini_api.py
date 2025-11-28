"""
Test Gemini API dengan HTTP requests langsung
"""
import sys
import io

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import requests
import json

def test_gemini_api():
    api_key = 'AIzaSyDSNzO6U0zgApDk3hD3aGpczdHev7RCIbg'
    
    # Test dengan gemini-2.5-flash (available model)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    payload = {
        "contents": [{
            "parts": [{
                "text": "Halo, apa kabar?"
            }]
        }]
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    print("=" * 70)
    print("🧪 Testing Gemini API...")
    print(f"   URL: {url}")
    print(f"   Model: gemini-2.5-flash")
    print("=" * 70)
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        print(f"\n📊 Response Status: {response.status_code}")
        print(f"   Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS!")
            if 'candidates' in result:
                if len(result['candidates']) > 0:
                    text = result['candidates'][0]['content']['parts'][0].get('text', '')
                    print(f"   Response: {text[:100]}...")
                else:
                    print("   ⚠️ No candidates in response")
            else:
                print(f"   Response: {json.dumps(result, indent=2)[:200]}...")
        else:
            print("❌ FAILED!")
            print(f"   Error: {response.text}")
            
            # Try alternative endpoints
            print("\n🔄 Trying alternative endpoints...")
            
            # Try fallback to gemini-pro-latest
            url_fallback = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key={api_key}"
            print(f"   Trying: {url_fallback}")
            response_fallback = requests.post(url_fallback, headers=headers, json=payload, timeout=30)
            print(f"   Status: {response_fallback.status_code}")
            if response_fallback.status_code == 200:
                print("   ✅ Fallback model works!")
                result = response_fallback.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    text = result['candidates'][0]['content']['parts'][0].get('text', '')
                    print(f"   Response: {text[:100]}...")
            else:
                print(f"   ❌ Fallback failed: {response_fallback.text[:200]}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        print(traceback.format_exc())
    
    print("=" * 70)

if __name__ == '__main__':
    test_gemini_api()

