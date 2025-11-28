"""
Script untuk menambahkan device ke user tertentu
"""
from models import db, Device, User
from app import create_app
import random
import string

app = create_app('development')

def generate_device_code():
    """Generate unique device code"""
    return 'TMNKN-' + '-'.join([
        ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        for _ in range(2)
    ])

def add_device_to_user(user_email, device_name):
    """Add a new device to a user"""
    with app.app_context():
        # Find user
        user = User.query.filter_by(email=user_email).first()
        
        if not user:
            print(f"❌ User with email {user_email} not found")
            return
        
        # Generate unique device code
        device_code = generate_device_code()
        while Device.query.filter_by(device_code=device_code).first():
            device_code = generate_device_code()
        
        # Create new device
        new_device = Device(
            name=device_name,
            device_code=device_code,
            user_id=user.id,
            status='active',
            robot_status='idle'
        )
        
        db.session.add(new_device)
        db.session.commit()
        
        print(f"✅ Device added successfully!")
        print(f"   User: {user.name} ({user.email})")
        print(f"   Device Name: {device_name}")
        print(f"   Device Code: {device_code}")
        print(f"   Device ID: {new_device.id}")

def list_all_devices():
    """List all devices and their owners"""
    with app.app_context():
        devices = Device.query.all()
        users = {u.id: u for u in User.query.all()}
        
        print("\n=== ALL DEVICES ===")
        for device in devices:
            owner = users.get(device.user_id)
            print(f"ID: {device.id} | Name: {device.name} | Code: {device.code} | Owner: {owner.name if owner else 'N/A'} ({device.user_id})")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  List all devices: python add_device_to_user.py list")
        print("  Add device: python add_device_to_user.py add <user_email> <device_name>")
        print("\nExample:")
        print('  python add_device_to_user.py add member@gmail.com "Akuarium Ruang Tamu"')
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'list':
        list_all_devices()
    elif command == 'add' and len(sys.argv) >= 4:
        user_email = sys.argv[2]
        device_name = sys.argv[3]
        add_device_to_user(user_email, device_name)
    else:
        print("❌ Invalid command")
        print("Usage: python add_device_to_user.py [list|add] <user_email> <device_name>")
