import requests
import json

BASE_URL = "http://localhost:5000/api"

def debug_access():
    # 1. Login (Bypassed)
    with open('token.txt', 'r') as f:
        token = f.read().strip()
    print("Using generated token from file.")
        
    try:
        # 2. Access Device 1
        print("Accessing Device 1...")
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/devices/1", headers=headers)
        
        print(f"Device Access Status: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_access()
