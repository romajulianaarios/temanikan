"""
Script to migrate database - add age and primary_fish_type columns to users table
"""
import sqlite3
import os

def migrate_database():
    # Get database path
    db_path = 'instance/temanikan.db'
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns exist
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add age column if not exists
        if 'age' not in columns:
            print("Adding 'age' column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN age INTEGER")
            print("✓ 'age' column added successfully")
        else:
            print("✓ 'age' column already exists")
        
        # Add primary_fish_type column if not exists
        if 'primary_fish_type' not in columns:
            print("Adding 'primary_fish_type' column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN primary_fish_type VARCHAR(100)")
            print("✓ 'primary_fish_type' column added successfully")
        else:
            print("✓ 'primary_fish_type' column already exists")
        
        conn.commit()
        conn.close()
        
        print("\n✅ Database migration completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error during migration: {e}")
        raise

if __name__ == '__main__':
    migrate_database()
