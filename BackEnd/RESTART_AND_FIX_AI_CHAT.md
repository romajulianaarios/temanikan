# 🚀 Cara Memperbaiki AI Chat - Langkah Demi Langkah

## ⚠️ MASALAH
AI Chat masih menampilkan jawaban default (fallback) dari database, padahal API keys sudah valid.

## ✅ SOLUSI

### Langkah 1: Pastikan Backend Server BERHASIL Di-Restart

**PENTING:** Setelah update API keys atau perubahan kode, **WAJIB restart backend server**!

#### Cara Restart:

1. **Hentikan Backend Server:**
   - Buka terminal/window tempat backend server berjalan
   - Tekan `Ctrl + C` untuk menghentikan server
   - Pastikan server benar-benar berhenti (tidak ada proses Python yang berjalan)

2. **Jalankan Backend Server Lagi:**
   ```powershell
   cd BackEnd
   python app.py
   ```

3. **Verifikasi Server Berjalan:**
   - Pastikan tidak ada error di terminal
   - Server harus menampilkan: `📍 Server running on: http://localhost:5000`
   - **JANGAN tutup terminal ini!**

### Langkah 2: Test API Keys

Jalankan script test untuk memastikan API keys valid:

```powershell
cd BackEnd
python fix_ai_chat.py
```

Output yang diharapkan:
```
✅ 5 API key(s) siap digunakan!
```

### Langkah 3: Test AI Chat di Browser

1. **Login ke aplikasi** (http://localhost:3000)
2. **Buka AI Chat** (klik button di pojok kanan bawah)
3. **Kirim pesan:** "Apa itu ikan koi?"
4. **Cek log backend** di terminal

### Langkah 4: Cek Log Backend

Saat mengirim pesan ke AI Chat, **PASTIKAN** log backend menampilkan:

```
🔑 API Keys loaded: 5
   Primary key: AIzaSyBcjOrACTXOLt3TRbaTUudgCX...
🔄 Mencoba 5 API key(s)...
📝 User message: Apa itu ikan koi?...
✅ API Key #1 berhasil digunakan
✅ AI Response berhasil (panjang: 500 karakter)
📄 Preview: Ikan koi adalah jenis ikan hias...
```

**Jika log menampilkan:**
```
⚠️ API key not configured - Using database fallback
```
atau
```
❌ Semua API key gagal: ...
📦 Menggunakan fallback response dari database...
```

**Maka ada masalah!** Kirim log lengkap untuk debugging.

## 🔍 Troubleshooting

### Masalah 1: Backend Server Tidak Berjalan
**Gejala:** AI Chat tidak merespons atau error
**Solusi:** 
- Pastikan backend server berjalan di terminal
- Cek apakah port 5000 sudah digunakan
- Restart backend server

### Masalah 2: API Keys Tidak Ter-Load
**Gejala:** Log menampilkan "API key not configured"
**Solusi:**
```powershell
cd BackEnd
python update_api_key.py "KEY1,KEY2,KEY3,KEY4,KEY5"
python app.py  # Restart server
```

### Masalah 3: Masih Menggunakan Fallback
**Gejala:** AI Chat masih menampilkan jawaban default
**Solusi:**
1. Pastikan backend server **SUDAH DI-RESTART** setelah update
2. Cek log backend untuk melihat error
3. Pastikan API keys valid dengan: `python fix_ai_chat.py`

### Masalah 4: Port 5000 Sudah Digunakan
**Gejala:** Error "Address already in use"
**Solusi:**
```powershell
# Cari proses yang menggunakan port 5000
netstat -ano | findstr :5000

# Kill proses (ganti PID dengan nomor yang ditemukan)
taskkill /PID <PID> /F

# Atau restart komputer
```

## ✅ Checklist

Sebelum melaporkan masalah, pastikan:

- [ ] Backend server **SUDAH DI-RESTART** setelah update API keys
- [ ] Backend server **SEDANG BERJALAN** (cek terminal)
- [ ] API keys **VALID** (test dengan `python fix_ai_chat.py`)
- [ ] Log backend menampilkan "🔑 API Keys loaded: X"
- [ ] Tidak ada error di log backend
- [ ] Frontend terhubung ke backend (http://localhost:5000)

## 📞 Jika Masih Bermasalah

Kirim informasi berikut:

1. **Log backend lengkap** saat mengirim pesan ke AI Chat
2. **Output dari:** `python fix_ai_chat.py`
3. **Output dari:** `python debug_ai_chat.py`
4. **Screenshot** error (jika ada)

## 🎯 Status Saat Ini

- ✅ 5 API keys valid dan siap digunakan
- ✅ Kode sudah diperbaiki
- ⚠️ **PERLU RESTART BACKEND SERVER**



