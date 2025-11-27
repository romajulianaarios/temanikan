"""
List available Gemini models
"""
import sys
import io

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import requests
import json

def list_gemini_models():
    api_key = 'AIzaSyDSNzO6U0zgApDk3hD3aGpczdHev7RCIbg'
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    
    print("=" * 70)
    print("📋 Listing available Gemini models...")
    print(f"   URL: {url}")
    print("=" * 70)
    
    try:
        response = requests.get(url, timeout=30)
        print(f"\n📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS!")
            print("\nAvailable models:")
            if 'models' in result:
                for model in result['models']:
                    name = model.get('name', 'N/A')
                    display_name = model.get('displayName', 'N/A')
                    supported_methods = model.get('supportedGenerationMethods', [])
                    print(f"\n  - Name: {name}")
                    print(f"    Display: {display_name}")
                    print(f"    Methods: {', '.join(supported_methods)}")
                    if 'generateContent' in supported_methods:
                        print(f"    ✅ Supports generateContent")
            else:
                print(f"   Response: {json.dumps(result, indent=2)}")
        else:
            print("❌ FAILED!")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        print(traceback.format_exc())
    
    print("=" * 70)

if __name__ == '__main__':
    list_gemini_models()



