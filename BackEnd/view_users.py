import sqlite3

conn = sqlite3.connect('instance/temanikan.db')
cursor = conn.cursor()

print("=" * 70)
print("👥 USERS DATA")
print("=" * 70)

cursor.execute("SELECT id, name, email, role, phone, created_at FROM users")
users = cursor.fetchall()

for user in users:
    print(f"\nID: {user[0]}")
    print(f"Name: {user[1]}")
    print(f"Email: {user[2]}")
    print(f"Role: {user[3]}")
    print(f"Phone: {user[4]}")
    print(f"Created: {user[5]}")
    print("-" * 70)

conn.close()

print("\n✅ Default Login Credentials:")
print("   Admin:  admin@temanikan.com / admin123")
print("   Member: member@temanikan.com / 12345678")
