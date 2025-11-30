# 🔑 Cara Mendapatkan Gemini API Key Baru

## 📋 Langkah-langkah

### 1. Kunjungi Google AI Studio

**Pilih salah satu link berikut:**
- https://makersuite.google.com/app/apikey
- https://aistudio.google.com/app/apikey

### 2. Login dengan Akun Google

- Gunakan akun Google Anda untuk login
- Jika belum punya akun, buat dulu di https://accounts.google.com

### 3. Buat API Key Baru

1. Setelah login, klik tombol **"Create API Key"** atau **"Get API Key"**
2. Pilih project Google Cloud (atau buat project baru)
3. API key akan otomatis dibuat dan ditampilkan
4. **COPY API KEY** yang diberikan (format: `AIzaSy...`)

### 4. Update API Key di Backend

**Opsi A: Menggunakan Script (Paling Mudah) ✅**

```bash
cd BackEnd
python update_api_key.py YOUR_NEW_API_KEY
```

**Opsi B: Manual Update**

1. Buat file `.env` di folder `BackEnd/` (jika belum ada)
2. Tambahkan baris berikut:
   ```
   GEMINI_API_KEY=YOUR_NEW_API_KEY_DISINI
   ```
3. Simpan file

**Opsi C: Update di config.py**

1. Buka file `BackEnd/config.py`
2. Cari baris:
   ```python
   GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'API_KEY_LAMA')
   ```
3. Ganti `API_KEY_LAMA` dengan API key baru Anda
4. Simpan file

### 5. Restart Backend Server

Setelah update API key, **restart backend server** agar perubahan diterapkan:

```bash
# Stop server (Ctrl+C)
# Lalu start lagi
python app.py
```

### 6. Test API Key

Test apakah API key berfungsi:

```bash
cd BackEnd
python test_api_key.py
```

Jika muncul "✅ SUCCESS! API Key VALID dan BERFUNGSI!", berarti API key sudah siap digunakan!

## ⚠️ Catatan Penting

1. **API Key Gratis:**
   - Google memberikan quota gratis untuk Gemini API
   - Free tier: ~15 requests per menit, ~1,500 requests per hari
   - Jika quota habis, sistem otomatis menggunakan fallback dari database

2. **Keamanan:**
   - Jangan share API key ke public
   - Jangan commit file `.env` ke Git (sudah ada di `.gitignore`)
   - Simpan API key di tempat aman

3. **Jika API Key Error:**
   - Sistem sudah punya fallback mechanism
   - AI chat tetap berfungsi menggunakan database
   - User tetap mendapat respons yang berguna

## 🆘 Troubleshooting

### Error: "API key not configured"
- Pastikan file `.env` ada di folder `BackEnd/`
- Pastikan format: `GEMINI_API_KEY=your-key-here` (tanpa spasi)
- Restart backend server

### Error: "403 Forbidden"
- API key tidak valid atau expired
- Buat API key baru
- Pastikan API key aktif di Google AI Studio

### Error: "429 Too Many Requests"
- Quota API key habis
- Tunggu beberapa saat (reset setiap 24 jam)
- Atau buat API key baru

### API Key Tidak Berfungsi
1. Test dengan script: `python test_api_key.py`
2. Cek log backend untuk error detail
3. Pastikan API key format benar (dimulai dengan `AIza`)
4. Pastikan backend server sudah restart

## ✅ Checklist

- [ ] Dapatkan API key dari Google AI Studio
- [ ] Update API key di `.env` atau `config.py`
- [ ] Restart backend server
- [ ] Test dengan `python test_api_key.py`
- [ ] Test AI chat di aplikasi

## 🎉 Selesai!

Setelah semua langkah selesai, AI chat akan menggunakan Gemini API untuk memberikan respons yang lebih baik!



