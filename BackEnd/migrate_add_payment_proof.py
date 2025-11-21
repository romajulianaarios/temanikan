# migrate_add_payment_proof.py
# Migration Script - Add payment_proof column to orders table

import sqlite3
import os

def migrate_database():
    """Add payment_proof column to orders table"""
    
    # Database path - di folder instance
    db_path = 'instance/temanikan.db'
    
    if not os.path.exists(db_path):
        print(f"❌ Database file not found: {db_path}")
        print(f"Current directory: {os.getcwd()}")
        print("\nChecking alternative locations...")
        
        # Check if instance folder exists
        if os.path.exists('instance'):
            print("✓ instance/ folder found")
            files = os.listdir('instance')
            print(f"Files in instance/: {files}")
        
        # Check if temanikan.db is in current directory
        if os.path.exists('temanikan.db'):
            print("✓ Found temanikan.db in current directory")
            db_path = 'temanikan.db'
        else:
            print("\nPlease make sure temanikan.db exists in instance/ folder")
            return
    
    print(f"📂 Found database: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(orders)")
        columns = [column[1] for column in cursor.fetchall()]
        
        print(f"\n📋 Current columns in orders table:")
        for col in columns:
            print(f"  - {col}")
        
        if 'payment_proof' not in columns:
            print("\n🔧 Adding payment_proof column to orders table...")
            cursor.execute("""
                ALTER TABLE orders 
                ADD COLUMN payment_proof TEXT
            """)
            conn.commit()
            print("✅ Migration successful! payment_proof column added.")
        else:
            print("\n⚠️  payment_proof column already exists. Skipping migration.")
        
        # Verify the change
        cursor.execute("PRAGMA table_info(orders)")
        print("\n📋 Updated orders table schema:")
        for column in cursor.fetchall():
            col_id, col_name, col_type, not_null, default, pk = column
            nullable = "NOT NULL" if not_null else "NULL"
            print(f"  - {col_name}: {col_type} ({nullable})")
        
        print("\n🎉 Migration completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    print("=" * 60)
    print("DATABASE MIGRATION")
    print("Adding payment_proof column to orders table")
    print("=" * 60)
    print()
    migrate_database()
