import sqlite3

db_path = r'c:\WEBSITE TEMANIKAN\BackEnd\instance\temanikan.db'

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(devices)")
    columns = cursor.fetchall()
    
    print("Columns in 'devices' table:")
    for col in columns:
        print(col)
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
