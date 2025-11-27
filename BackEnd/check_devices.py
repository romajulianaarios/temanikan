import sqlite3

conn = sqlite3.connect('instance/temanikan.db')
cursor = conn.cursor()

# Get caesar1 user
cursor.execute("SELECT id, name, email, role FROM users WHERE email = 'caesar1@hey.pink'")
user = cursor.fetchone()
if user:
    print(f"Caesar1 User - ID: {user[0]}, Name: {user[1]}, Email: {user[2]}, Role: {user[3]}")
    user_id = user[0]
    
    # Get devices owned by caesar1
    cursor.execute("SELECT id, name, device_code, user_id FROM devices WHERE user_id = ?", (user_id,))
    devices = cursor.fetchall()
    print(f"\nDevices owned by caesar1 (user_id={user_id}):")
    if devices:
        for dev in devices:
            print(f"  - ID: {dev[0]}, Name: {dev[1]}, Code: {dev[2]}")
    else:
        print("  - No devices found!")
else:
    print("User caesar1@hey.pink not found")

# Get all devices to see current state
cursor.execute("SELECT id, name, device_code, user_id FROM devices")
all_devices = cursor.fetchall()
print(f"\nAll devices in database:")
for dev in all_devices:
    print(f"  - ID: {dev[0]}, Name: {dev[1]}, Code: {dev[2]}, UserID: {dev[3]}")

conn.close()
