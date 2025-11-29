from app import create_app
from flask_jwt_extended import create_access_token
from models import User, Notification, db

app = create_app()

with app.app_context():
    # 1. Get Admin and Member
    admin = User.query.filter_by(email='admin@temanikan.com').first()
    member = User.query.filter_by(email='caesar1@hey.pink').first()
    
    print(f"Admin ID: {admin.id}")
    print(f"Member ID: {member.id}")
    
    client = app.test_client()
    admin_token = create_access_token(identity=str(admin.id))
    headers = {'Authorization': f'Bearer {admin_token}'}
    
    # 2. Test Update User Profile
    print("\n--- Testing Update User Profile ---")
    response = client.put(f'/api/admin/users/{member.id}', 
                         json={'name': 'Caesar Updated'},
                         headers=headers)
    print(f"Update Response: {response.status_code}, {response.get_json()}")
    
    # Check Notification
    notif = Notification.query.filter_by(user_id=member.id, title='Profil Diperbarui').order_by(Notification.created_at.desc()).first()
    if notif:
        print(f"SUCCESS: Notification found: {notif.title} - {notif.message}")
    else:
        print("FAILURE: Profile update notification NOT found.")

    # 3. Test Toggle User Status
    print("\n--- Testing Toggle User Status ---")
    response = client.put(f'/api/admin/users/{member.id}/toggle-status', headers=headers)
    print(f"Toggle Response: {response.status_code}, {response.get_json()}")
    
    # Check Notification
    notif = Notification.query.filter_by(user_id=member.id, title='Status Akun Diubah').order_by(Notification.created_at.desc()).first()
    if notif:
        print(f"SUCCESS: Notification found: {notif.title} - {notif.message}")
    else:
        print("FAILURE: Status toggle notification NOT found.")
        
    # Revert changes
    member.name = 'Caesar'
    db.session.commit()
