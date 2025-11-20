import sqlite3
import os
from datetime import datetime

db_path = 'instance/temanikan.db'

# Check if file exists
if os.path.exists(db_path):
    print(f"✅ Database file exists: {db_path}")
    print(f"📦 File size: {os.path.getsize(db_path)} bytes")
    
    # Try to connect
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"\n📊 Tables found: {len(tables)}")
        for table in tables:
            table_name = table[0]
            print(f"\n  📋 Table: {table_name}")
            
            # Count rows
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            count = cursor.fetchone()[0]
            print(f"     Rows: {count}")
            
            # Show first 3 rows
            if count > 0:
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 3;")
                rows = cursor.fetchall()
                for i, row in enumerate(rows, 1):
                    print(f"     Row {i}: {row[:5]}...")  # Show first 5 columns
        
        conn.close()
        print("\n✅ Database is healthy and ready to use!")
        print("\n💡 You can now open it with:")
        print("   - VS Code SQLite Extension")
        print("   - DB Browser for SQLite")
        print("   - pgAdmin (if migrated to PostgreSQL)")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
else:
    print(f"❌ Database file not found: {db_path}")
    print("💡 Run 'python app.py' first to create database")
