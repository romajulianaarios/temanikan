"""
Script untuk memperbaiki tabel forum_reports
Menambahkan kolom description yang hilang
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db
from sqlalchemy import text

def fix_forum_reports_table():
    """Drop dan recreate tabel forum_reports dengan struktur yang benar"""
    
    app = create_app('development')
    
    with app.app_context():
        print("🔧 Memperbaiki tabel forum_reports...")
        
        try:
            with db.engine.connect() as conn:
                
                # 1. Backup existing data (if any)
                print("\n1️⃣ Checking for existing data...")
                result = conn.execute(text("SELECT * FROM forum_reports"))
                existing_data = result.fetchall()
                print(f"   Found {len(existing_data)} existing reports")
                
                # 2. Drop old table
                print("\n2️⃣ Dropping old forum_reports table...")
                conn.execute(text("DROP TABLE IF EXISTS forum_reports"))
                conn.commit()
                print("✅ Old table dropped")
                
                # 3. Create new table with correct structure
                print("\n3️⃣ Creating new forum_reports table...")
                conn.execute(text("""
                    CREATE TABLE forum_reports (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        topic_id INTEGER NOT NULL,
                        reporter_id INTEGER,
                        reason VARCHAR(255) NOT NULL,
                        description TEXT,
                        status VARCHAR(20) DEFAULT 'pending',
                        reviewed_by INTEGER,
                        reviewed_at TIMESTAMP,
                        admin_notes TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
                        FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
                        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
                    )
                """))
                conn.commit()
                print("✅ New table created with description column")
                
                # 4. Create indexes
                print("\n4️⃣ Creating indexes...")
                conn.execute(text("""
                    CREATE INDEX IF NOT EXISTS idx_forum_reports_status 
                    ON forum_reports(status)
                """))
                conn.execute(text("""
                    CREATE INDEX IF NOT EXISTS idx_forum_reports_topic 
                    ON forum_reports(topic_id)
                """))
                conn.commit()
                print("✅ Indexes created")
                
                # 5. Verify table structure
                print("\n5️⃣ Verifying table structure...")
                result = conn.execute(text("PRAGMA table_info(forum_reports)"))
                columns = [row[1] for row in result]
                print(f"   Columns: {columns}")
                
                if 'description' in columns:
                    print("✅ description column exists!")
                else:
                    print("❌ description column NOT FOUND!")
                    return False
                
                print("\n✅ Tabel forum_reports berhasil diperbaiki!")
                print("⚠️  Note: Existing reports were cleared. Users can create new reports.")
                return True
                
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == '__main__':
    success = fix_forum_reports_table()
    if success:
        print("\n🎉 SUCCESS! Restart backend dan test lagi.")
    else:
        print("\n❌ FAILED! Check errors above.")
    sys.exit(0 if success else 1)
