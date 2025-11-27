import requests
import json
import time
from app import create_app, db
from models import User, Notification, Order

BASE_URL = 'http://localhost:5000/api'

def get_admin_token():
    response = requests.post(f'{BASE_URL}/auth/login', json={
        'email': 'admin@temanikan.com',
        'password': 'admin123'
    })
    if response.status_code == 200:
        return response.json()['access_token']
    return None

def get_member_token(email, password):
    response = requests.post(f'{BASE_URL}/auth/login', json={
        'email': email,
        'password': password
    })
    if response.status_code == 200:
        return response.json()['access_token']
    return None

def check_notification(user_id, title_contains):
    app = create_app()
    with app.app_context():
        notification = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).first()
        if notification and title_contains in notification.title:
            print(f"✅ FOUND: [{notification.title}] for User {user_id}")
            return True
        else:
            print(f"❌ MISSING: Expected '{title_contains}' for User {user_id}, found '{notification.title if notification else 'None'}'")
            return False

def run_verification():
    print("🚀 STARTING FULL NOTIFICATION VERIFICATION")
    
    # 1. New Account Notification
    print("\n--- 1. Testing New Account Notification ---")
    new_email = f"testuser{int(time.time())}@example.com"
    response = requests.post(f'{BASE_URL}/auth/register', json={
        'name': 'Test User Notif',
        'email': new_email,
        'password': 'password123'
    })
    if response.status_code == 201:
        print("User registered.")
        check_notification(1, "Pengguna Baru Terdaftar") # Admin ID 1
    else:
        print("Registration failed.")

    # Login as new user
    member_token = get_member_token(new_email, 'password123')
    admin_token = get_admin_token()
    
    if not member_token or not admin_token:
        print("Failed to get tokens. Aborting.")
        return

    # 2. New Order Notification
    print("\n--- 2. Testing New Order Notification ---")
    headers = {'Authorization': f'Bearer {member_token}'}
    order_data = {
        'product_name': 'Test Product',
        'total_price': 50000,
        'quantity': 1
    }
    response = requests.post(f'{BASE_URL}/orders', json=order_data, headers=headers)
    if response.status_code == 201:
        order_id = response.json()['data']['id']
        print(f"Order {order_id} created.")
        check_notification(1, "Pesanan Baru Masuk") # Admin
    else:
        print("Order creation failed.")
        return

    # 3. Payment Upload Notification
    print("\n--- 3. Testing Payment Upload Notification ---")
    # Create a dummy file
    with open('test_proof.jpg', 'wb') as f:
        f.write(b'test image content')
    
    files = {'payment_proof': ('test_proof.jpg', open('test_proof.jpg', 'rb'), 'image/jpeg')}
    response = requests.post(f'{BASE_URL}/orders/{order_id}/upload-payment-proof', headers=headers, files=files)
    
    # Get user ID
    app = create_app()
    with app.app_context():
        user = User.query.filter_by(email=new_email).first()
        user_id = user.id

    if response.status_code == 200:
        print("Payment uploaded.")
        check_notification(user_id, "Pembayaran Berhasil Diupload") # Member
        check_notification(1, "Bukti Pembayaran Diterima") # Admin
    else:
        print(f"Payment upload failed: {response.text}")

    # 4. Order Status Update
    print("\n--- 4. Testing Order Status Update Notification ---")
    admin_headers = {'Authorization': f'Bearer {admin_token}'}
    response = requests.put(f'{BASE_URL}/admin/orders/{order_id}/status', json={'status': 'confirmed'}, headers=admin_headers)
    if response.status_code == 200:
        print("Order status updated.")
        check_notification(user_id, "Status Pesanan Diperbarui") # Member
    else:
        print(f"Order update failed: {response.status_code} - {response.text}")

    # 5. Account Info Update
    print("\n--- 5. Testing Account Info Update Notification ---")
    response = requests.put(f'{BASE_URL}/admin/users/{user_id}', json={'phone': '08123456789'}, headers=admin_headers)
    if response.status_code == 200:
        print("User info updated.")
        check_notification(user_id, "Profil Diperbarui") # Member
    else:
        print(f"User update failed: {response.status_code} - {response.text}")

if __name__ == '__main__':
    run_verification()
