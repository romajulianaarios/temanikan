"""
Script untuk membuat semua tabel database
Jalankan script ini jika database belum ada atau tabel belum dibuat
"""
from app import create_app
from models import db
import os

def init_database():
    """Membuat semua tabel database"""
    app = create_app('development')
    
    with app.app_context():
        print("=" * 70)
        print("INITIALIZING DATABASE...")
        print("=" * 70)
        
        # Cek apakah database file sudah ada
        db_path = app.config.get('SQLALCHEMY_DATABASE_URI', '').replace('sqlite:///', '')
        if 'instance' not in db_path:
            db_path = os.path.join('instance', db_path)
        
        print(f"Database path: {db_path}")
        
        # Buat folder instance jika belum ada
        instance_dir = os.path.dirname(db_path) if os.path.dirname(db_path) else 'instance'
        if not os.path.exists(instance_dir):
            os.makedirs(instance_dir)
            print(f"✓ Created directory: {instance_dir}")
        
        # Buat semua tabel
        try:
            db.create_all()
            print("✓ All database tables created successfully!")
            print("\nTables created:")
            for table in db.metadata.tables.keys():
                print(f"  - {table}")
        except Exception as e:
            print(f"❌ Error creating tables: {e}")
            import traceback
            traceback.print_exc()
            return False
        
        print("\n" + "=" * 70)
        print("✅ DATABASE INITIALIZATION COMPLETE!")
        print("=" * 70)
        print("\nNext steps:")
        print("1. Run 'python seed_all.py' to add initial data")
        print("2. Or run 'python create_admin_user.py' to create admin user")
        print("3. Or run 'python create_member_user.py' to create member user")
        print()
        
        return True

if __name__ == '__main__':
    try:
        init_database()
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        input("\nPress Enter to exit...")



