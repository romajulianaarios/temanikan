"""
Migration script untuk menambahkan tabel forum likes dan reports
Jalankan dengan: python migrate_forum.py
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import create_app function dan database
from app import create_app
from models import db
from sqlalchemy import text

def migrate_database():
    """Create new tables for forum likes and reports"""
    
    # Create Flask app using factory pattern
    app = create_app('development')
    
    with app.app_context():
        print("🔄 Starting migration...")
        print(f"📍 Database: {app.config.get('SQLALCHEMY_DATABASE_URI', 'default')}")
        
        try:
            # Use connection object with text() for SQLAlchemy 2.0+ compatibility
            with db.engine.connect() as conn:
                
                # Create forum_topic_likes table
                print("\n📦 Creating forum_topic_likes table...")
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS forum_topic_likes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        topic_id INTEGER NOT NULL,
                        user_id INTEGER NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                        UNIQUE(topic_id, user_id)
                    )
                """))
                conn.commit()
                print("✅ forum_topic_likes table created")
                
                # Create forum_reply_likes table
                print("\n📦 Creating forum_reply_likes table...")
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS forum_reply_likes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        reply_id INTEGER NOT NULL,
                        user_id INTEGER NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (reply_id) REFERENCES forum_replies(id) ON DELETE CASCADE,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                        UNIQUE(reply_id, user_id)
                    )
                """))
                conn.commit()
                print("✅ forum_reply_likes table created")
                
                # Create forum_reports table
                print("\n📦 Creating forum_reports table...")
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS forum_reports (
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
                print("✅ forum_reports table created")
                
                print("\n✅ Migration completed successfully!")
                print("\n📋 Summary:")
                print("   - forum_topic_likes: untuk menyimpan like pada topik")
                print("   - forum_reply_likes: untuk menyimpan like pada balasan")
                print("   - forum_reports: untuk menyimpan laporan topik")
                
                # Verify tables were created
                print("\n🔍 Verifying tables...")
                result = conn.execute(text("""
                    SELECT name FROM sqlite_master 
                    WHERE type='table' AND name LIKE 'forum_%'
                    ORDER BY name
                """))
                tables = [row[0] for row in result]
                print(f"   Found {len(tables)} forum tables:")
                for table in tables:
                    print(f"   ✓ {table}")
            
        except Exception as e:
            print(f"❌ Migration failed: {e}")
            import traceback
            traceback.print_exc()
            return False
        
        return True

if __name__ == '__main__':
    success = migrate_database()
    sys.exit(0 if success else 1)
