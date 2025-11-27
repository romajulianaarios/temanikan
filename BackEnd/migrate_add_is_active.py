"""
Migration: Add is_active field to users table
This script adds the is_active boolean field to the User model.
"""

import sqlite3
from datetime import datetime

def migrate():
    conn = sqlite3.connect('instance/temanikan.db')
    cursor = conn.cursor()
    
    print("=" * 70)
    print("MIGRATION: Add is_active field to users table")
    print("=" * 70)
    
    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'is_active' in columns:
            print("✅ Column 'is_active' already exists. Skipping migration.")
        else:
            # Add is_active column with default value True
            print("📝 Adding 'is_active' column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1")
            
            # Set all existing users to active
            cursor.execute("UPDATE users SET is_active = 1 WHERE is_active IS NULL")
            
            conn.commit()
            print("✅ Successfully added 'is_active' column")
        
        # Verify the change
        cursor.execute("SELECT id, name, email, role, is_active FROM users LIMIT 5")
        users = cursor.fetchall()
        
        print("\n📊 Sample users (first 5):")
        print("-" * 70)
        for user in users:
            status = "Active" if user[4] else "Inactive"
            print(f"ID: {user[0]}, Name: {user[1]}, Email: {user[2]}, Role: {user[3]}, Status: {status}")
        
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
