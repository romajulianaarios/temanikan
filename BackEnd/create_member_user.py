"""
Script to create/update member user for login
"""
import sys
import io

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from app import create_app
from models import db, User, bcrypt

def create_member_user():
    app = create_app('development')
    
    with app.app_context():
        # Check if member user exists
        member = User.query.filter_by(email='member@temanikan.com').first()
        
        if member:
            print("=" * 70)
            print("✅ Member user already exists!")
            print(f"   ID: {member.id}")
            print(f"   Name: {member.name}")
            print(f"   Email: {member.email}")
            print(f"   Role: {member.role}")
            print("=" * 70)
            
            # Update password to ensure it's correct
            member.set_password('12345678')
            db.session.commit()
            print("✅ Password updated to: 12345678")
            print("=" * 70)
        else:
            print("=" * 70)
            print("📝 Creating member user...")
            
            # Create member user
            member = User(
                name='Ahmad Wijaya',
                email='member@temanikan.com',
                role='member',
                phone='081234567890',
                address='Jakarta',
                age=25,
                primary_fish_type='Koi'
            )
            member.set_password('12345678')
            
            db.session.add(member)
            db.session.commit()
            
            print("✅ Member user created successfully!")
            print(f"   ID: {member.id}")
            print(f"   Name: {member.name}")
            print(f"   Email: {member.email}")
            print(f"   Password: 12345678")
            print("=" * 70)
        
        # Verify password
        if member.check_password('12345678'):
            print("✅ Password verification: SUCCESS")
        else:
            print("❌ Password verification: FAILED")
        
        # Ensure changes are committed
        try:
            db.session.commit()
            print("✅ All changes committed to database")
        except Exception as e:
            print(f"⚠️ Commit warning: {e}")
            db.session.rollback()
        
        print("\n🔐 Login Credentials:")
        print("   Email: member@temanikan.com")
        print("   Password: 12345678")
        print("=" * 70)

if __name__ == '__main__':
    create_member_user()

