import sys
import os
sys.path.append(os.getcwd())

from app import create_app
from models import db, User, Order, Notification
from flask_jwt_extended import create_access_token

def test_notification_flow():
    app = create_app('development')
    
    with app.app_context():
        # 1. Find Admin User
        admin = User.query.filter_by(role='admin').first()
        if not admin:
            print("❌ No admin user found!")
            return

        print(f"✅ Found Admin: {admin.email} (ID: {admin.id})")
        
        # 2. Find a Target Order (preferably not owned by admin, but any works for test)
        order = Order.query.first()
        if not order:
            print("❌ No orders found!")
            return
            
        print(f"✅ Found Order: {order.order_number} (ID: {order.id}, Status: {order.status})")
        print(f"   Owner ID: {order.user_id}")

        # 3. Generate Admin Token
        access_token = create_access_token(identity=str(admin.id))
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        # 4. Simulate Status Update via API
        client = app.test_client()
        
        # Toggle status to trigger change
        new_status = 'processing' if order.status == 'pending' else 'pending'
        print(f"🔄 Attempting to change status from '{order.status}' to '{new_status}'...")
        
        response = client.put(
            f'/api/orders/{order.id}',
            headers=headers,
            json={'status': new_status}
        )
        
        if response.status_code != 200:
            print(f"❌ API Request Failed: {response.status_code}")
            print(response.json)
            return
            
        print("✅ API Request Successful")

        # 5. Verify Notification Created
        # Check for latest notification for this user
        notification = Notification.query.filter_by(
            user_id=order.user_id
        ).order_by(Notification.created_at.desc()).first()
        
        if notification:
            print(f"✅ Notification Found!")
            print(f"   ID: {notification.id}")
            print(f"   Title: {notification.title}")
            print(f"   Message: {notification.message}")
            print(f"   Created At: {notification.created_at}")
            
            if "Status pesanan" in notification.message and order.order_number in notification.message:
                print("✅ Notification content matches expected format!")
            else:
                print("⚠️ Notification content might be incorrect.")
        else:
            print("❌ No notification found for user!")

if __name__ == "__main__":
    test_notification_flow()
