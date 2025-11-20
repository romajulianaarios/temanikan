# Database Manual Access Guide

## ✅ Database Location
```
c:\WEBSITE TEMANIKAN\BackEnd\instance\temanikan.db
```

## 📊 Database Status
- **Type:** SQLite
- **Size:** ~57 KB
- **Tables:** 10 tables created
- **Initial Data:** 2 users (admin & member)

## 🔐 Default Accounts
```
Admin:  admin@temanikan.com / admin123
Member: member@temanikan.com / 12345678
```

## 📋 Available Tables
1. `users` - User accounts (2 rows)
2. `devices` - IoT devices (empty)
3. `water_monitoring` - Water quality data (empty)
4. `cleaning_history` - Robot cleaning records (empty)
5. `disease_detections` - Disease detection data (empty)
6. `fish_species` - Fish encyclopedia (empty)
7. `forum_topics` - Forum topics (empty)
8. `forum_replies` - Forum replies (empty)
9. `orders` - Product orders (empty)
10. `notifications` - User notifications (empty)

## 🛠️ How to Access Database

### Option 1: VS Code SQLite Extension
1. Open VS Code Explorer
2. Navigate to: `BackEnd\instance\temanikan.db`
3. Right-click → "Open Database"
4. View tables in SQLite Explorer panel

### Option 2: DB Browser for SQLite (Recommended)
1. Download: https://sqlitebrowser.org/
2. Install and open
3. File → Open Database
4. Select: `c:\WEBSITE TEMANIKAN\BackEnd\instance\temanikan.db`
5. Browse Data tab → Select table → Edit directly

### Option 3: Python Scripts
```powershell
cd BackEnd

# Test database
python test_db.py

# View users
python view_users.py
```

### Option 4: SQL Command Line
```powershell
cd BackEnd\instance
sqlite3 temanikan.db
```
```sql
.tables                          -- List all tables
SELECT * FROM users;             -- View users
SELECT * FROM devices;           -- View devices
.quit                            -- Exit
```

## ✏️ Manual Editing Examples

### Add a Device
```sql
INSERT INTO devices (name, device_code, user_id, status, robot_status, created_at)
VALUES ('Robot Test', 'ROB001', 2, 'active', 'idle', datetime('now'));
```

### Add Water Monitoring Data
```sql
INSERT INTO water_monitoring 
(device_id, temperature, ph_level, turbidity, oxygen_level, ammonia_level, timestamp)
VALUES (1, 27.5, 7.2, 3.5, 8.5, 0.02, datetime('now'));
```

### Update User
```sql
UPDATE users 
SET name = 'New Name', phone = '081234567890'
WHERE email = 'member@temanikan.com';
```

### View All Data with JOIN
```sql
SELECT 
    u.name as user_name,
    d.name as device_name,
    d.status,
    d.robot_status
FROM users u
LEFT JOIN devices d ON u.id = d.user_id;
```

## 🔄 Backup & Restore

### Backup
```powershell
# Simple copy
copy instance\temanikan.db instance\temanikan_backup.db

# With timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
copy instance\temanikan.db "instance\temanikan_backup_$timestamp.db"
```

### Restore
```powershell
copy instance\temanikan_backup.db instance\temanikan.db
```

## 🚨 Important Notes

1. **Always backup before manual editing**
2. **Stop Flask server before major edits**
3. **Use DB Browser for visual editing**
4. **Use Python scripts for programmatic changes**
5. **Test changes in development first**

## 📞 Troubleshooting

### "Database is locked"
- Stop Flask server: `Ctrl + C`
- Close other database connections
- Wait a few seconds and try again

### "Corrupted database"
- Restore from backup
- Or delete and re-run: `python app.py`

### "Cannot find database"
- Make sure backend server has run at least once
- Check path: `BackEnd\instance\temanikan.db`

## 🎯 Next Steps

1. ✅ Database created and accessible
2. ⏳ Add sample data for testing
3. ⏳ Connect frontend to backend APIs
4. ⏳ Test CRUD operations
5. ⏳ Consider PostgreSQL for production
