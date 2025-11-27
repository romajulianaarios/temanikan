"""
Migration script to add 'status' and 'views' columns to fish_species table
"""
import sqlite3
from datetime import datetime

def migrate():
    conn = sqlite3.connect('instance/temanikan.db')
    cursor = conn.cursor()
    
    print("=" * 70)
    print("MIGRATION: Add status and views columns to fish_species table")
    print("=" * 70)
    
    try:
        # Check existing columns
        cursor.execute("PRAGMA table_info(fish_species)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add status column if not exists
        if 'status' not in columns:
            print("📝 Adding 'status' column...")
            cursor.execute("ALTER TABLE fish_species ADD COLUMN status VARCHAR(20) DEFAULT 'published'")
            cursor.execute("UPDATE fish_species SET status = 'published' WHERE status IS NULL")
            print("✅ Successfully added 'status' column")
        else:
            print("✓ Column 'status' already exists")
        
        # Add views column if not exists
        if 'views' not in columns:
            print("📝 Adding 'views' column...")
            cursor.execute("ALTER TABLE fish_species ADD COLUMN views INTEGER DEFAULT 0")
            cursor.execute("UPDATE fish_species SET views = 0 WHERE views IS NULL")
            print("✅ Successfully added 'views' column")
        else:
            print("✓ Column 'views' already exists")
        
        conn.commit()
        
        # Verify
        cursor.execute("PRAGMA table_info(fish_species)")
        columns = [column[1] for column in cursor.fetchall()]
        required = ['status', 'views', 'family', 'habitat']
        missing = [c for c in required if c not in columns]
        
        print("\n📊 Verification:")
        print(f"   Required columns: {required}")
        print(f"   Missing columns: {missing if missing else 'None ✓'}")
        
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error during migration: {e}")
        raise
    finally:
        conn.close()
        print("=" * 70)

if __name__ == '__main__':
    migrate()


