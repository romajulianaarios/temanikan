import requests
import json

BASE_URL = 'http://localhost:5000/api'
LOGIN_URL = f'{BASE_URL}/auth/login'
TOPIC_ID = 9
REPLY_URL = f'{BASE_URL}/forum/topics/{TOPIC_ID}/replies'

def login():
    payload = {
        'email': 'admin@temanikan.com',
        'password': 'admin123'
    }
    try:
        response = requests.post(LOGIN_URL, json=payload)
        response.raise_for_status()
        return response.json()['access_token']
    except Exception as e:
        print(f"Login failed: {e}")
        if response:
            print(f"Response: {response.text}")
        return None

def create_reply(token):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'content': 'Test reply from reproduction script'
    }
    try:
        response = requests.post(REPLY_URL, json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response JSON: {response.json()}")
    except Exception as e:
        print(f"Request failed: {e}")
        if response:
            print(f"Response Text: {response.text}")

if __name__ == '__main__':
    token = login()
    if token:
        print("Login successful, creating reply...")
        create_reply(token)
