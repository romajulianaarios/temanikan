import requests
import json

BASE_URL = 'http://localhost:5000/api'
LOGIN_URL = f'{BASE_URL}/auth/login'
NOTIF_URL = f'{BASE_URL}/notifications'

def login(email, password):
    payload = {
        'email': email,
        'password': password
    }
    try:
        response = requests.post(LOGIN_URL, json=payload)
        response.raise_for_status()
        return response.json()['access_token']
    except Exception as e:
        print(f"Login failed for {email}: {e}")
        if response:
            print(f"Response: {response.text}")
        return None

def check_notifications(token, role):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    try:
        response = requests.get(NOTIF_URL, headers=headers)
        print(f"[{role}] Status Code: {response.status_code}")
        print(f"[{role}] Response JSON: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"[{role}] Request failed: {e}")
        if response:
            print(f"[{role}] Response Text: {response.text}")

if __name__ == '__main__':
    # Test Admin
    print("Testing Admin Notifications...")
    admin_token = login('admin@temanikan.com', 'admin123')
    if admin_token:
        check_notifications(admin_token, 'Admin')

    # Test Member (assuming a member exists, or we can create one/use existing)
    # For now, let's just test admin to verify the endpoint works at all.
    # If admin works, the backend logic is likely fine for members too (same endpoint).
