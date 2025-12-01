import json
from app import create_app
from models import User
from flask_jwt_extended import create_access_token

def check_disease_detections():
    app = create_app('development')
    client = app.test_client()
    
    with app.app_context():
        # Login to get token
        login_payload = {
            'email': 'admin@temanikan.com',
            'password': 'admin123'
        }
        login_response = client.post('/api/auth/login', json=login_payload)
        
        if login_response.status_code != 200:
            print(f"Login failed: {login_response.data.decode('utf-8')}")
            return
            
        token = login_response.get_json()['access_token']
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        url = "/api/disease-detections"
        print(f"Testing GET {url}...")
        
        response = client.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.get_json()
            print(f"Success: {data.get('success')}")
            print(f"Count: {data.get('count')}")
            detections = data.get('detections', [])
            if detections:
                print(f"First detection: {json.dumps(detections[0], indent=2)}")
            else:
                print("No detections found.")
        else:
            print(f"Error: {response.data.decode('utf-8')}")

if __name__ == '__main__':
    check_disease_detections()
