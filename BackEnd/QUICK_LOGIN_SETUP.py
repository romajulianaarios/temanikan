"""
Script cepat untuk setup admin user dan test login
Jalankan: python QUICK_LOGIN_SETUP.py
"""
import sys
import io

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from app import create_app
from models import db, User, bcrypt

def quick_setup():
    app = create_app('development')
    
    with app.app_context():
        print("=" * 70)
        print("🚀 QUICK LOGIN SETUP")
        print("=" * 70)
        
        # Check or create admin user
        admin = User.query.filter_by(email='admin@temanikan.com').first()
        
        if admin:
            print("✅ Admin user found!")
            # Reset password to ensure it's correct
            admin.set_password('admin123')
            admin.role = 'admin'
            admin.is_active = True
            db.session.commit()
            print("✅ Password reset to: admin123")
        else:
            print("📝 Creating admin user...")
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
            print("✅ Admin user created!")
        
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
        print("✅ Setup complete! You can now login.")
        print("=" * 70)

if __name__ == '__main__':
    try:
        quick_setup()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()






