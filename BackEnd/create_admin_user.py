"""
Script to create/update admin user for login
"""
import sys
import io

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from app import create_app
from models import db, User, bcrypt

def create_admin_user():
    app = create_app('development')
    
    with app.app_context():
        # Check if admin user exists
        admin = User.query.filter_by(email='admin@temanikan.com').first()
        
        if admin:
            print("=" * 70)
            print("✅ Admin user already exists!")
            print(f"   ID: {admin.id}")
            print(f"   Name: {admin.name}")
            print(f"   Email: {admin.email}")
            print(f"   Role: {admin.role}")
            print("=" * 70)
            
            # Update role to admin if not already
            if admin.role != 'admin':
                print(f"⚠️  User role is '{admin.role}', updating to 'admin'...")
                admin.role = 'admin'
                db.session.commit()
                print("✅ Role updated to 'admin'")
            
            # Update password to ensure it's correct
            admin.set_password('admin123')
            db.session.commit()
            print("✅ Password updated to: admin123")
            print("=" * 70)
        else:
            print("=" * 70)
            print("📝 Creating admin user...")
            
            # Create admin user
            admin = User(
                name='Super Admin',
                email='admin@temanikan.com',
                role='admin',
                phone='08000000000',
                address='Admin Office',
                age=30,
                primary_fish_type='All',
                is_active=True
            )
            admin.set_password('admin123')
            
            db.session.add(admin)
            db.session.commit()
            
            print("✅ Admin user created successfully!")
            print(f"   ID: {admin.id}")
            print(f"   Name: {admin.name}")
            print(f"   Email: {admin.email}")
            print(f"   Role: {admin.role}")
            print(f"   Password: admin123")
            print("=" * 70)
        
        # Verify password
        if admin.check_password('admin123'):
            print("✅ Password verification: SUCCESS")
        else:
            print("❌ Password verification: FAILED")
        
        print("=" * 70)
        print("🔐 LOGIN CREDENTIALS:")
        print("   Email    : admin@temanikan.com")
        print("   Password : admin123")
        print("=" * 70)

if __name__ == '__main__':
    try:
        create_admin_user()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()


