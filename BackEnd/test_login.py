"""
Test login untuk member user
"""
import sys
import io

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import requests
import json

def test_login():
    url = 'http://localhost:5000/api/auth/login'
    data = {
        'email': 'member@temanikan.com',
        'password': '12345678'
    }
    
    print("=" * 70)
    print("🧪 Testing Login...")
    print(f"   URL: {url}")
    print(f"   Email: {data['email']}")
    print(f"   Password: {data['password']}")
    print("=" * 70)
    
    try:
        response = requests.post(url, json=data)
        
        print(f"\n📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ LOGIN SUCCESS!")
            print(f"   Message: {result.get('message')}")
            print(f"   Token (first 50 chars): {result.get('access_token', '')[:50]}...")
            print(f"   User ID: {result.get('user', {}).get('id')}")
            print(f"   User Name: {result.get('user', {}).get('name')}")
            print(f"   User Email: {result.get('user', {}).get('email')}")
            print(f"   User Role: {result.get('user', {}).get('role')}")
            print("\n✅ Login berhasil! Token sudah diterima.")
        else:
            print("❌ LOGIN FAILED!")
            print(f"   Error: {response.text}")
            result = response.json()
            if 'error' in result:
                print(f"   Error Message: {result['error']}")
        
        print("=" * 70)
        
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Cannot connect to backend server!")
        print("   Pastikan backend server berjalan di http://localhost:5000")
        print("   Jalankan: python app.py")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("=" * 70)

if __name__ == '__main__':
    test_login()

