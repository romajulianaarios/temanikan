import requests
import json
import os

# Configuration
BASE_URL = 'http://127.0.0.1:5000/api'
LOGIN_EMAIL = 'caesar1@hey.pink'
LOGIN_PASSWORD = 'Caesar1234'
DEVICE_ID = 1  # Assuming device ID 1 exists and belongs to this user

def login():
    """Login and return the access token"""
    print(f"Logging in as {LOGIN_EMAIL}...")
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": LOGIN_EMAIL,
        "password": LOGIN_PASSWORD
    })
    
    if response.status_code == 200:
        token = response.json().get('access_token')
        print("✅ Login successful")
        return token
    else:
        print(f"❌ Login failed: {response.status_code} - {response.text}")
        return None

def test_save_detection(token):
    """Test saving a disease detection with image"""
    print(f"\nTesting save detection for device {DEVICE_ID}...")
    
    # Create a dummy image file
    dummy_image_path = 'test_capture.jpg'
    with open(dummy_image_path, 'wb') as f:
        f.write(os.urandom(1024))  # 1KB of random data
        
    try:
        headers = {'Authorization': f'Bearer {token}'}
        
        # Data to send
        data = {
            'disease_name': 'Test Disease',
            'confidence': 0.95,
            'severity': 'medium',
            'symptoms': json.dumps(['Symptom 1', 'Symptom 2']),
            'recommended_treatment': 'Test Treatment',
            'status': 'detected',
            'notes': 'Test capture from script'
        }
        
        # Files to send
        files = {
            'image': ('test_capture.jpg', open(dummy_image_path, 'rb'), 'image/jpeg')
        }
        
        response = requests.post(
            f"{BASE_URL}/devices/{DEVICE_ID}/disease-detections",
            headers=headers,
            data=data,
            files=files
        )
        
        if response.status_code == 201:
            print("✅ Detection saved successfully")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"❌ Failed to save detection: {response.status_code} - {response.text}")
            
    finally:
        # Cleanup
        if os.path.exists(dummy_image_path):
            os.remove(dummy_image_path)

if __name__ == "__main__":
    token = login()
    if token:
        test_save_detection(token)
