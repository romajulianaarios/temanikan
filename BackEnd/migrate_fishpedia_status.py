"""
Migration script untuk menambahkan kolom status dan views ke tabel fish_species
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from sqlalchemy import text

app = create_app()

def migrate():
    """Menambahkan kolom status dan views ke fish_species"""
    with app.app_context():
        print("\n=== Migration: Add status and views columns to fish_species ===\n")
        
        try:
            # Check if columns already exist
            result = db.session.execute(text("PRAGMA table_info(fish_species)"))
            columns = [row[1] for row in result]
            
            # Add status column if not exists
            if 'status' not in columns:
                print("Adding 'status' column...")
                db.session.execute(text(
                    "ALTER TABLE fish_species ADD COLUMN status VARCHAR(20) DEFAULT 'published'"
                ))
                print("✓ Added 'status' column")
            else:
                print("⚠ Column 'status' already exists")
            
            # Add views column if not exists
            if 'views' not in columns:
                print("Adding 'views' column...")
                db.session.execute(text(
                    "ALTER TABLE fish_species ADD COLUMN views INTEGER DEFAULT 0"
                ))
                print("✓ Added 'views' column")
            else:
                print("⚠ Column 'views' already exists")
            
            # Update existing data to have published status
            db.session.execute(text(
                "UPDATE fish_species SET status = 'published' WHERE status IS NULL"
            ))
            db.session.execute(text(
                "UPDATE fish_species SET views = 0 WHERE views IS NULL"
            ))
            
            db.session.commit()
            print("\n✅ Migration completed successfully\n")
            
        except Exception as e:
            print(f"\n❌ Migration failed: {e}\n")
            db.session.rollback()

if __name__ == '__main__':
    migrate()
