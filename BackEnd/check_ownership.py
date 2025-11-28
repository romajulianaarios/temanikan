import sqlite3

db_path = r'c:\WEBSITE TEMANIKAN\BackEnd\instance\temanikan.db'

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("--- Users ---")
    cursor.execute("SELECT id, name, email, role FROM users")
    for row in cursor.fetchall():
        print(row)
        
    print("\n--- Devices ---")
    cursor.execute("SELECT id, name, user_id FROM devices")
    for row in cursor.fetchall():
        print(row)
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
