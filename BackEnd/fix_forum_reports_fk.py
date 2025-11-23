"""
Fix forum_reports foreign key constraint
Allow topic_id to be NULL when topic is deleted
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db
from sqlalchemy import text

def fix_forum_reports_fk():
    """Recreate forum_reports with nullable topic_id"""
    
    app = create_app('development')
    
    with app.app_context():
        print("🔧 Fixing forum_reports foreign key...")
        
        try:
            with db.engine.connect() as conn:
                
                # 1. Backup existing data
                print("\n1️⃣ Backing up existing reports...")
                result = conn.execute(text("SELECT * FROM forum_reports"))
                existing_data = result.fetchall()
                print(f"   Found {len(existing_data)} reports to backup")
                
                # 2. Drop old table
                print("\n2️⃣ Dropping old table...")
                conn.execute(text("DROP TABLE IF EXISTS forum_reports"))
                conn.commit()
                print("✅ Old table dropped")
                
                # 3. Create new table with NULLABLE topic_id
                print("\n3️⃣ Creating new table...")
                conn.execute(text("""
                    CREATE TABLE forum_reports (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        topic_id INTEGER,
                        reporter_id INTEGER,
                        reason VARCHAR(255) NOT NULL,
                        description TEXT,
                        status VARCHAR(20) DEFAULT 'pending',
                        reviewed_by INTEGER,
                        reviewed_at TIMESTAMP,
                        admin_notes TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE SET NULL,
                        FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
                        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
                    )
                """))
                conn.commit()
                print("✅ New table created (topic_id is now NULLABLE)")
                
                # 4. Restore data
                if existing_data:
                    print(f"\n4️⃣ Restoring {len(existing_data)} reports...")
                    for row in existing_data:
                        conn.execute(text("""
                            INSERT INTO forum_reports 
                            (id, topic_id, reporter_id, reason, description, status, 
                             reviewed_by, reviewed_at, admin_notes, created_at)
                            VALUES (:id, :topic_id, :reporter_id, :reason, :description, :status,
                                    :reviewed_by, :reviewed_at, :admin_notes, :created_at)
                        """), {
                            'id': row[0],
                            'topic_id': row[1],
                            'reporter_id': row[2],
                            'reason': row[3],
                            'description': row[4],
                            'status': row[5],
                            'reviewed_by': row[6],
                            'reviewed_at': row[7],
                            'admin_notes': row[8],
                            'created_at': row[9]
                        })
                    conn.commit()
                    print(f"✅ {len(existing_data)} reports restored")
                
                # 5. Create indexes
                print("\n5️⃣ Creating indexes...")
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
                
                # 6. Verify
                print("\n6️⃣ Verifying table structure...")
                result = conn.execute(text("PRAGMA table_info(forum_reports)"))
                columns = {row[1]: {'notnull': row[3]} for row in result}
                
                if 'topic_id' in columns:
                    if columns['topic_id']['notnull'] == 0:
                        print("✅ topic_id is NULLABLE")
                    else:
                        print("❌ topic_id is still NOT NULL")
                        return False
                
                print("\n✅ Foreign key constraint fixed!")
                return True
                
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == '__main__':
    success = fix_forum_reports_fk()
    if success:
        print("\n🎉 SUCCESS! Restart backend dan test approve/reject lagi.")
    else:
        print("\n❌ FAILED! Check errors above.")
    sys.exit(0 if success else 1)
