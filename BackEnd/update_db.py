import sqlite3

db_path = r'c:\WEBSITE TEMANIKAN\BackEnd\instance\temanikan.db'

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Add battery_level column
    cursor.execute("ALTER TABLE devices ADD COLUMN battery_level INTEGER DEFAULT 100")
    print("Added battery_level column.")
    
    conn.commit()
    conn.close()
    print("Database updated successfully.")
except Exception as e:
    print(f"Error: {e}")
