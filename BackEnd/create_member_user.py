import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from app import create_app
from models import db, User

def create_member_user():
    app = create_app('development')
    with app.app_context():
        member = User.query.filter_by(email='member@temanikan.com').first()
        
        if member:
            print("✅ Member user already exists!")
            member.set_password('member123')
            db.session.commit()
            print("✅ Password updated to: member123")
        else:
            print("📝 Creating member user...")
            member = User(
                name='Test Member',
                email='member@temanikan.com',
                role='member',
                phone='081234567890',
                address='Test Address',
                age=25,
                primary_fish_type='Goldfish',
                is_active=True
            )
            member.set_password('member123')
            db.session.add(member)
            db.session.commit()
            print("✅ Member user created successfully!")
        
        if member.check_password('member123'):
            print("✅ Password verification: SUCCESS")
        else:
            print("❌ Password verification: FAILED")
        
        print("=" * 70)
        print("🔐 MEMBER LOGIN CREDENTIALS:")
        print("   Email    : member@temanikan.com")
        print("   Password : member123")
        print("=" * 70)

if __name__ == '__main__':
    try:
        create_member_user()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
