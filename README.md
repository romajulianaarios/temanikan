# Temanikan - Setup & Installation Guide

Panduan lengkap untuk menjalankan aplikasi Temanikan (Frontend React + Backend Flask).

## Prerequisites

Pastikan Anda sudah menginstall:
- **Python 3.8+** (untuk backend)
- **Node.js 16+** dan npm (untuk frontend)
- **Git** (optional, untuk version control)

## Struktur Folder

```
WEBSITE TEMANIKAN/
├── BackEnd/          # Flask API Server
├── FrontEnd/         # React.js Application
└── MachineLearning/  # ML Models (future)
```

---

## 🚀 Quick Start

### 1. Setup Backend (Flask)

#### a. Masuk ke folder BackEnd
```powershell
cd "c:\WEBSITE TEMANIKAN\BackEnd"
```

#### b. Buat virtual environment (recommended)
```powershell
python -m venv venv
```

#### c. Aktifkan virtual environment
```powershell
.\venv\Scripts\Activate.ps1
```

Jika ada error "running scripts is disabled", jalankan:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### d. Install dependencies
```powershell
pip install -r requirements.txt
```

#### e. Setup environment variables
File `.env` sudah ada dengan konfigurasi default. Jika perlu custom, edit file `.env`:
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=sqlite:///temanikan.db
```

#### f. Jalankan server
```powershell
python app.py
```

Backend akan berjalan di: **http://localhost:5000**

**Default Accounts:**
- Admin: `admin@temanikan.com` / `admin123`
- Member: `member@temanikan.com` / `12345678`

---

### 2. Setup Frontend (React)

#### a. Buka terminal baru, masuk ke folder FrontEnd
```powershell
cd "c:\WEBSITE TEMANIKAN\FrontEnd"
```

#### b. Install dependencies
```powershell
npm install
```

#### c. Setup environment variables
File `.env` sudah ada. Pastikan isinya:
```
VITE_API_URL=http://localhost:5000/api
```

#### d. Jalankan development server
```powershell
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

---

## 📱 Cara Menggunakan

1. **Buka browser** dan akses `http://localhost:5173`
2. **Klik tombol "Login"** atau "Daftar" di navbar
3. **Login** dengan salah satu akun:
   - Admin: `admin@temanikan.com` / `admin123`
   - Member: `member@temanikan.com` / `12345678`
4. Atau **daftar akun baru** sebagai member

### Member Dashboard Features:
- ✅ Device Management (Garasi Robot)
- ✅ Water Monitoring
- ✅ Robot Control & Cleaning History
- ✅ Disease Detection
- ✅ Fishpedia
- ✅ Forum Komunitas
- ✅ Orders
- ✅ Notifications
- ✅ Profile & Settings

### Admin Dashboard Features:
- ✅ User Management
- ✅ Robot Status Monitoring
- ✅ Disease Trends Analytics
- ✅ Fishpedia Management
- ✅ Forum Moderation
- ✅ Orders Management
- ✅ System Statistics

---

## 🔧 Troubleshooting

### Backend Issues

**Error: ModuleNotFoundError**
```powershell
# Pastikan virtual environment aktif
.\venv\Scripts\Activate.ps1

# Install ulang dependencies
pip install -r requirements.txt
```

**Error: Address already in use (port 5000)**
```powershell
# Cari proses yang menggunakan port 5000
netstat -ano | findstr :5000

# Stop proses atau gunakan port lain dengan edit app.py:
# app.run(host='0.0.0.0', port=5001, debug=True)
```

**Database tidak terbuat**
```powershell
# Hapus database lama jika ada
rm temanikan.db

# Jalankan ulang server, database akan otomatis dibuat
python app.py
```

### Frontend Issues

**Error: Cannot find module**
```powershell
# Hapus node_modules dan install ulang
rm -r node_modules
rm package-lock.json
npm install
```

**Error: CORS / Network Error**
- Pastikan backend sudah berjalan di `http://localhost:5000`
- Periksa file `.env` di FrontEnd, pastikan `VITE_API_URL` benar
- Restart kedua server (backend & frontend)

**Error: Axios is not defined**
```powershell
# Install axios
npm install axios
```

---

## 📝 Development Tips

### Backend Development

**Menambah API endpoint baru:**
1. Buka `BackEnd/routes.py`
2. Tambahkan route function
3. Register di `register_routes()`

**Menambah model database baru:**
1. Buka `BackEnd/models.py`
2. Tambahkan class model baru
3. Hapus database dan restart server untuk recreate

**Melihat database:**
```powershell
# Install DB Browser for SQLite
# Atau gunakan python shell:
python
>>> from app import app, db
>>> from models import User
>>> with app.app_context():
...     users = User.query.all()
...     for u in users:
...         print(u.email, u.role)
```

### Frontend Development

**Menggunakan API di komponen:**
```typescript
import { deviceAPI } from '../services/api';

// Dalam komponen:
const fetchDevices = async () => {
  const response = await deviceAPI.getDevices();
  console.log(response.devices);
};
```

**Format response API:**
Semua API mengembalikan JSON dengan struktur:
```json
{
  "message": "Success message",
  "data": { ... },
  "error": "Error message (jika ada)"
}
```

---

## 🚢 Production Deployment

### Backend (Flask)

1. **Gunakan production server** (Gunicorn/uWSGI):
```powershell
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. **Upgrade database** ke PostgreSQL
3. **Set environment variables** dengan nilai production
4. **Enable HTTPS**

### Frontend (React)

1. **Build production:**
```powershell
npm run build
```

2. **Deploy** folder `dist/` ke hosting (Vercel, Netlify, dll)
3. **Update** `VITE_API_URL` ke production backend URL

---

## 📚 API Documentation

Dokumentasi lengkap API tersedia di `BackEnd/README.md`

**Base URL:** `http://localhost:5000/api`

**Authentication:** JWT Bearer Token
```
Authorization: Bearer <your_token>
```

**Main Endpoints:**
- `/auth/*` - Authentication
- `/devices/*` - Device management
- `/fishpedia` - Fish encyclopedia
- `/forum/*` - Community forum
- `/orders` - Orders
- `/notifications` - User notifications
- `/admin/*` - Admin endpoints

---

## 🤝 Contributing

Untuk berkontribusi:
1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Support

Jika ada pertanyaan atau masalah, silakan:
- Buka issue di GitHub
- Hubungi tim development

---

## 📄 License

Copyright © 2025 Temanikan. All rights reserved.
