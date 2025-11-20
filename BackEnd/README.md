# Temanikan Backend API

Backend API untuk Temanikan - Platform monitoring dan kontrol robot pembersih akuarium dengan deteksi penyakit ikan.

## Teknologi

- **Framework**: Flask 3.0.0
- **Database**: SQLite (development), dapat di-upgrade ke PostgreSQL untuk production
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: SQLAlchemy

## Instalasi

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Setup environment variables (copy dari .env.example):
```bash
cp .env.example .env
```

3. Jalankan aplikasi:
```bash
python app.py
```

Server akan berjalan di `http://localhost:5000`

## Default Accounts

### Admin Account
- Email: `admin@temanikan.com`
- Password: `admin123`

### Member Account (Demo)
- Email: `member@temanikan.com`
- Password: `12345678`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (requires JWT)

### Devices
- `GET /api/devices` - Get all user devices
- `GET /api/devices/<id>` - Get device detail
- `POST /api/devices` - Add new device
- `PUT /api/devices/<id>` - Update device
- `DELETE /api/devices/<id>` - Delete device

### Water Monitoring
- `GET /api/devices/<id>/water-data` - Get water monitoring data
- `POST /api/devices/<id>/water-data` - Add water data

### Robot Control
- `GET /api/devices/<id>/cleaning-history` - Get cleaning history
- `POST /api/devices/<id>/start-cleaning` - Start cleaning
- `POST /api/devices/<id>/stop-cleaning` - Stop cleaning

### Disease Detection
- `GET /api/devices/<id>/disease-detections` - Get detection history
- `POST /api/devices/<id>/disease-detections` - Add detection
- `PUT /api/disease-detections/<id>` - Update detection status

### Fishpedia
- `GET /api/fishpedia` - Get all fish species
- `GET /api/fishpedia/<id>` - Get species detail
- `POST /api/fishpedia` - Add species (admin only)
- `PUT /api/fishpedia/<id>` - Update species (admin only)
- `DELETE /api/fishpedia/<id>` - Delete species (admin only)

### Forum
- `GET /api/forum/topics` - Get all topics
- `GET /api/forum/topics/<id>` - Get topic detail with replies
- `POST /api/forum/topics` - Create new topic
- `PUT /api/forum/topics/<id>` - Update topic
- `DELETE /api/forum/topics/<id>` - Delete topic
- `POST /api/forum/topics/<id>/replies` - Add reply
- `PUT /api/forum/replies/<id>` - Update reply
- `DELETE /api/forum/replies/<id>` - Delete reply

### Orders
- `GET /api/orders` - Get user orders (or all for admin)
- `POST /api/orders` - Create new order
- `PUT /api/orders/<id>` - Update order

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/<id>/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/disease-trends` - Get disease trends

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

## Database Schema

### Users
- User accounts (member & admin)
- Profile information

### Devices
- IoT devices (robot pembersih)
- Device status & ownership

### WaterMonitoring
- Temperature, pH, turbidity, oxygen, ammonia levels
- Time-series data

### CleaningHistory
- Robot cleaning sessions
- Duration, status, area cleaned

### DiseaseDetection
- Disease detection records
- Confidence, severity, treatment recommendations

### FishSpecies (Fishpedia)
- Fish encyclopedia
- Care requirements, characteristics

### Forum (Topics & Replies)
- Community forum
- Moderation features

### Orders
- Product orders
- Order tracking

### Notifications
- User notifications
- Device alerts

## Development

Untuk development, set `FLASK_ENV=development` di `.env` file.

Database akan otomatis dibuat saat pertama kali menjalankan aplikasi.

## Security

- Passwords di-hash menggunakan bcrypt
- JWT tokens untuk authentication
- Role-based access control (member/admin)
- Device ownership validation
