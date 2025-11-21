import sqlite3

# Connect to database
conn = sqlite3.connect('instance/temanikan.db')
cursor = conn.cursor()

# Update caesar1@hey.pink dengan data lengkap
cursor.execute("""
    UPDATE users 
    SET 
        address = 'Perum BCE Blok D11 No. 17 RT 001/012, Sukahati, Kec. Cibinong, Kab. Bogor, Jawa Barat',
        age = 20,
        primary_fish_type = 'Ikan Koi'
    WHERE email = 'caesar1@hey.pink'
""")

conn.commit()

# Verify update
cursor.execute("SELECT * FROM users WHERE email = 'caesar1@hey.pink'")
user = cursor.fetchone()

print("✅ User caesar1@hey.pink updated successfully!")
print("\nData sekarang:")
cursor.execute("PRAGMA table_info(users)")
columns = [col[1] for col in cursor.fetchall()]

cursor.execute("SELECT * FROM users WHERE email = 'caesar1@hey.pink'")
user = cursor.fetchone()

for i, col in enumerate(columns):
    print(f"{col}: {user[i]}")

conn.close()
