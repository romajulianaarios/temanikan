# Cara Start Backend Server dengan Gemini AI

## Langkah-langkah

### 1. Pastikan Python sudah di PATH

Setelah install Python, restart PowerShell atau jalankan:
```powershell
refreshenv
```

Atau gunakan path lengkap Python:
```powershell
C:\Users\Lenovo\AppData\Local\Programs\Python\Python314\python.exe
```

### 2. Masuk ke folder BackEnd

```powershell
cd D:\ikan\temanikan\BackEnd
```

### 3. Start Backend Server

**Opsi A: Menggunakan Python di PATH (jika sudah di-set)**
```powershell
python app.py
```

**Opsi B: Menggunakan path lengkap Python**
```powershell
C:\Users\Lenovo\AppData\Local\Programs\Python\Python314\python.exe app.py
```

**Opsi C: Menggunakan script start-servers**
```powershell
cd D:\ikan\temanikan
.\start-servers.ps1
```

### 4. Verifikasi Server Berjalan

Server akan berjalan di: **http://localhost:5000**

Anda akan melihat output seperti:
```
✅ Database tables created/verified
🚀 Starting Flask server...
📍 Server running on: http://localhost:5000
```

### 5. Verifikasi Tabel chat_history Dibuat

Server akan otomatis membuat tabel `chat_history` saat pertama kali start.

Untuk verifikasi manual, cek file database:
- Lokasi: `BackEnd/instance/temanikan.db`
- Gunakan SQLite browser atau query tool

### 6. Test AI Chat Endpoint

Setelah login, test endpoint AI chat:
- URL: `POST http://localhost:5000/api/ai/chat`
- Header: `Authorization: Bearer <your_token>`
- Body: `{ "message": "Apa itu ikan koi?" }`

## Troubleshooting

### Error: "Module not found"
Pastikan dependencies sudah terinstall:
```powershell
C:\Users\Lenovo\AppData\Local\Programs\Python\Python314\python.exe -m pip install -r requirements.txt
```

### Error: "Port 5000 already in use"
Tutup aplikasi lain yang menggunakan port 5000, atau ubah port di `app.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)
```

### Error: "GEMINI_API_KEY not found"
Pastikan file `.env` ada di folder `BackEnd/` dengan isi:
```
GEMINI_API_KEY=AIzaSyDpZroIMeNcEk236QZLNaBXyJnNA1bIeJU
```

## Next Steps

Setelah server berjalan:
1. ✅ Backend siap menerima request AI Chat
2. ✅ Frontend bisa mengakses endpoint `/api/ai/chat`
3. ✅ Test AI Chat di browser setelah login






