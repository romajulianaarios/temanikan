from app import create_app
from flask_jwt_extended import create_access_token
from models import User, Order, Notification, db

app = create_app()

with app.app_context():
    # 1. Get Admin and Member
    admin = User.query.filter_by(email='admin@temanikan.com').first()
    member = User.query.filter_by(email='caesar1@hey.pink').first()
    
    print(f"Admin ID: {admin.id}")
    print(f"Member ID: {member.id}")
    
    # 2. Get Member's Order
    order = Order.query.filter_by(user_id=member.id).first()
    print(f"Order ID: {order.id}, Current Status: {order.status}")
    
    # 3. Simulate Admin Updating Order
    # We'll use the test client to hit the endpoint to ensure routes.py logic is executed
    client = app.test_client()
    
    # Generate Admin Token
    admin_token = create_access_token(identity=str(admin.id))
    headers = {'Authorization': f'Bearer {admin_token}'}
    
    # Update Status
    new_status = 'processing' if order.status == 'pending' else 'shipped'
    print(f"Updating status to: {new_status}")
    
    response = client.put(f'/api/orders/{order.id}', 
                         json={'status': new_status},
                         headers=headers)
    
    print(f"Update Response: {response.status_code}, {response.get_json()}")
    
    # 4. Check Notification for Member
    # Generate Member Token
    member_token = create_access_token(identity=str(member.id))
    member_headers = {'Authorization': f'Bearer {member_token}'}
    
    notif_response = client.get('/api/notifications', headers=member_headers)
    notifications = notif_response.get_json().get('notifications', [])
    
    print(f"\nChecking Notifications for {member.email}...")
    found = False
    for n in notifications:
        print(f"- {n['title']}: {n['message']}")
        if "Status Pesanan Diperbarui" in n['title']:
            found = True
            
    if found:
        print("\nSUCCESS: Notification found!")
    else:
        print("\nFAILURE: Notification NOT found.")
