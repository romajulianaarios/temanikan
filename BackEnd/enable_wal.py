import sqlite3
import os

DB_FILE = 'instance/temanikan_v2.db'

def enable_wal():
    if not os.path.exists(DB_FILE):
        print(f"Database file {DB_FILE} not found!")
        return

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL;")
        result = cursor.fetchone()
        conn.commit()
        conn.close()
        print(f"WAL mode enabled. Result: {result}")
    except Exception as e:
        print(f"Error enabling WAL mode: {e}")

if __name__ == '__main__':
    enable_wal()
