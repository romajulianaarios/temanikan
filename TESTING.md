# 🧪 Testing Guide - Temanikan

Panduan untuk testing aplikasi Temanikan setelah integrasi Frontend-Backend.

## ✅ Pre-Testing Checklist

Pastikan:
- [ ] Backend Flask berjalan di `http://localhost:5000`
- [ ] Frontend React berjalan di `http://localhost:5173`
- [ ] Database `temanikan.db` sudah terbuat di folder BackEnd
- [ ] Dependencies sudah terinstall (backend & frontend)

## 🔐 Test Authentication

### 1. Login dengan Admin Account
1. Buka browser: `http://localhost:5173`
2. Klik tombol **"Login"** di navbar
3. Masukkan kredensial:
   - Email: `admin@temanikan.com`
   - Password: `admin123`
4. Klik **"Login"**
5. ✅ **Expected:** Redirect ke `/admin` dashboard

### 2. Login dengan Member Account
1. Klik **"Logout"** jika masih login
2. Klik **"Login"** lagi
3. Masukkan kredensial:
   - Email: `member@temanikan.com`
   - Password: `12345678`
4. Klik **"Login"**
5. ✅ **Expected:** Redirect ke `/member` (devices page)

### 3. Register New Member
1. Klik **"Logout"**
2. Klik **"Daftar"** di navbar
3. Isi form registrasi:
   - Nama Lengkap: `Test User`
   - Email: `test@example.com`
   - Nomor HP: `081234567890`
   - Password: `password123`
   - Konfirmasi Password: `password123`
4. Klik **"Daftar Sekarang"**
5. ✅ **Expected:** Auto-login dan redirect ke member dashboard

## 📱 Test Member Features

Login sebagai member untuk testing fitur-fitur berikut:

### 4. Device Management (Garasi Robot)
1. Di halaman `/member` (devices page)
2. Klik **"Tambah Perangkat"**
3. Isi nama device: `Robot Akuarium 1`
4. Klik **"Simpan"**
5. ✅ **Expected:** Device baru muncul di list
6. Klik device untuk masuk ke detail
7. ✅ **Expected:** Redirect ke device dashboard

### 5. Water Monitoring
1. Pilih salah satu device
2. Klik menu **"Monitoring Air"**
3. ✅ **Expected:** Tampil grafik water parameters (kosong jika belum ada data)
4. Bisa test dengan menambah data via API:
   ```bash
   # Via Postman atau curl
   POST http://localhost:5000/api/devices/1/water-data
   Headers: Authorization: Bearer <your_token>
   Body: {
     "temperature": 26.5,
     "ph_level": 7.2,
     "turbidity": 3.5,
     "oxygen_level": 6.8,
     "ammonia_level": 0.02
   }
   ```

### 6. Robot Control
1. Klik menu **"Kontrol Robot"**
2. Klik **"Mulai Pembersihan"**
3. ✅ **Expected:** Status robot berubah jadi "cleaning"
4. Klik **"Hentikan Pembersihan"**
5. ✅ **Expected:** Status kembali "idle", data masuk cleaning history

### 7. Disease Detection
1. Klik menu **"Deteksi Penyakit"**
2. Upload/simulate deteksi penyakit
3. ✅ **Expected:** Data deteksi tersimpan
4. ✅ **Expected:** Notifikasi muncul

### 8. Fishpedia
1. Klik menu **"Fishpedia"** (global, tidak perlu pilih device)
2. ✅ **Expected:** Tampil list ikan (kosong jika belum ada data)
3. Search ikan
4. View detail ikan

### 9. Forum Komunitas
1. Klik menu **"Forum"**
2. Klik **"Buat Topik Baru"**
3. Isi judul dan konten
4. Submit
5. ✅ **Expected:** Topik baru muncul di list
6. Klik topik untuk view detail
7. Tambah reply/komentar
8. ✅ **Expected:** Reply tersimpan

### 10. Orders
1. Klik menu **"Pesanan Saya"**
2. ✅ **Expected:** Tampil list orders (kosong jika belum ada)

### 11. Notifications
1. Klik icon notifikasi di navbar
2. ✅ **Expected:** Tampil dropdown notifikasi
3. Klik "Lihat Semua"
4. ✅ **Expected:** Redirect ke halaman all notifications
5. Mark as read
6. ✅ **Expected:** Status berubah

### 12. Profile & Settings
1. Klik menu **"Profil"**
2. Edit data profil (nama, phone, address)
3. Klik **"Simpan"**
4. ✅ **Expected:** Data terupdate
5. Test ganti password

## 👨‍💼 Test Admin Features

Login sebagai admin untuk testing:

### 13. Admin Dashboard Overview
1. Login sebagai admin
2. ✅ **Expected:** Tampil statistics (total users, devices, etc.)
3. View charts dan analytics

### 14. User Management
1. Klik menu **"Manajemen Pengguna"**
2. ✅ **Expected:** Tampil list semua users
3. View user details
4. (Future) Edit/delete users

### 15. Robot Status Global
1. Klik menu **"Status Robot"**
2. ✅ **Expected:** Tampil status semua robot dari semua users
3. View real-time status

### 16. Disease Trends
1. Klik menu **"Tren Penyakit"**
2. ✅ **Expected:** Tampil analytics penyakit
3. Filter by time period
4. View charts

### 17. Fishpedia Management
1. Klik menu **"Kelola Fishpedia"**
2. Klik **"Tambah Ikan Baru"**
3. Isi data ikan lengkap
4. Submit
5. ✅ **Expected:** Ikan baru muncul
6. Edit ikan existing
7. Delete ikan

### 18. Forum Moderation
1. Klik menu **"Moderasi Forum"**
2. View all topics
3. Pin/unpin topic
4. Lock/unlock topic
5. Delete inappropriate content

### 19. Orders Management
1. Klik menu **"Kelola Pesanan"**
2. ✅ **Expected:** Tampil semua orders dari semua users
3. Update order status
4. Update payment status

## 🔍 Test API Endpoints Directly

### Using Browser DevTools Console:

```javascript
// Test login
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'member@temanikan.com',
    password: '12345678'
  })
})
.then(r => r.json())
.then(console.log)

// Save token
const token = 'your-token-here';

// Test get devices
fetch('http://localhost:5000/api/devices', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log)

// Test add water data
fetch('http://localhost:5000/api/devices/1/water-data', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    temperature: 26.5,
    ph_level: 7.2,
    turbidity: 3.5,
    oxygen_level: 6.8,
    ammonia_level: 0.02
  })
})
.then(r => r.json())
.then(console.log)
```

### Using Postman:

Import collection dengan endpoints:
- POST `/api/auth/login`
- POST `/api/auth/register`
- GET `/api/devices`
- POST `/api/devices`
- GET `/api/devices/:id/water-data`
- POST `/api/devices/:id/water-data`
- POST `/api/devices/:id/start-cleaning`
- POST `/api/devices/:id/stop-cleaning`
- GET `/api/devices/:id/disease-detections`
- POST `/api/devices/:id/disease-detections`
- GET `/api/fishpedia`
- POST `/api/fishpedia` (admin only)
- GET `/api/forum/topics`
- POST `/api/forum/topics`
- GET `/api/notifications`

## ❌ Common Issues & Solutions

### Issue 1: Cannot connect to backend
**Symptoms:** Network error, CORS error
**Solution:**
```powershell
# Check if backend is running
curl http://localhost:5000

# Restart backend
cd BackEnd
python app.py
```

### Issue 2: Login not working
**Symptoms:** 401 Unauthorized, "Invalid email or password"
**Solution:**
- Check credentials are correct
- Check database exists: `BackEnd/temanikan.db`
- Recreate database: Delete `temanikan.db` and restart backend

### Issue 3: Token expired
**Symptoms:** 401 error after some time
**Solution:**
- Logout and login again
- Check JWT token expiration in backend config (default: 24 hours)

### Issue 4: Data not persisting
**Symptoms:** Data hilang setelah refresh
**Solution:**
- Check database file exists
- Check API calls successful (no errors in console)
- Check backend logs for errors

### Issue 5: Frontend shows old data
**Symptoms:** Changes not reflected immediately
**Solution:**
- Hard refresh: `Ctrl + Shift + R`
- Clear localStorage: `localStorage.clear()`
- Check network tab for API responses

## 📊 Backend Health Check

```powershell
# Test backend is running
curl http://localhost:5000

# Expected response:
{
  "message": "Temanikan API Server",
  "version": "1.0.0",
  "status": "running"
}
```

## 🎯 Success Criteria

Integration berhasil jika:
- ✅ User bisa register dan login
- ✅ Token JWT tersimpan dan digunakan untuk API calls
- ✅ CRUD operations berfungsi (devices, fishpedia, forum, etc.)
- ✅ Role-based access control berfungsi (member vs admin)
- ✅ Data persists di database
- ✅ Real-time updates bekerja
- ✅ Error handling proper (tidak ada white screen)
- ✅ CORS configured correctly
- ✅ Navigation dan routing lancar

## 📝 Testing Checklist

- [ ] Authentication (login, register, logout)
- [ ] Device CRUD operations
- [ ] Water monitoring data
- [ ] Robot control
- [ ] Disease detection
- [ ] Fishpedia (view & search)
- [ ] Forum (create, view, reply)
- [ ] Orders view
- [ ] Notifications
- [ ] Profile update
- [ ] Admin: User management view
- [ ] Admin: Disease trends
- [ ] Admin: Fishpedia CRUD
- [ ] Admin: Forum moderation
- [ ] Admin: Orders management
- [ ] Error handling
- [ ] Loading states
- [ ] Responsive design

## 🚀 Next Steps

Setelah testing berhasil:
1. Implementasi file upload untuk images
2. Integrasi Machine Learning untuk disease detection
3. Real-time notifications dengan WebSocket
4. Deploy ke production
5. Setup CI/CD pipeline

---

**Happy Testing! 🧪**
