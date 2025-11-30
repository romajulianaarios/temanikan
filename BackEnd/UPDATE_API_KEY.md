# 🔑 Panduan Update API Key Gemini

## 📋 Cara Update API Key

### Opsi 1: Menggunakan File .env (RECOMMENDED ✅)

1. **Buat file `.env` di folder `BackEnd/`** (jika belum ada)
   ```bash
   cd BackEnd
   copy .env.example .env
   ```

2. **Edit file `.env`** dan tambahkan API key Anda:
   ```
   GEMINI_API_KEY=API_KEY_BARU_ANDA_DISINI
   ```

3. **Restart backend server** agar perubahan diterapkan

### Opsi 2: Update Langsung di config.py

1. **Buka file `BackEnd/config.py`**
2. **Cari baris ini:**
   ```python
   GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyA_nyNIO60t4OUKkJLKgPnXw4EwoUcOfB8')
   ```
3. **Ganti nilai default (yang di dalam kurung) dengan API key baru Anda:**
   ```python
   GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'API_KEY_BARU_ANDA_DISINI')
   ```
4. **Restart backend server**

## 🔍 Cara Mendapatkan API Key Baru

1. **Kunjungi Google AI Studio:**
   - https://makersuite.google.com/app/apikey
   - Atau https://aistudio.google.com/app/apikey

2. **Login dengan akun Google Anda**

3. **Klik "Create API Key"** atau gunakan API key yang sudah ada

4. **Copy API key** yang diberikan

5. **Update di file `.env` atau `config.py`** sesuai opsi di atas

## ⚠️ Masalah Umum dan Solusinya

### Masalah: "API key not configured" atau "403 Forbidden"

**Solusi:**
1. Pastikan API key valid di Google AI Studio
2. Cek quota API key (mungkin sudah habis)
3. Buat API key baru jika perlu
4. Update API key di `.env` atau `config.py`
5. Restart backend server

### Masalah: Quota Habis

**Solusi:**
1. **Cek quota di Google AI Studio:**
   - Free tier: 15 RPM (requests per minute) dan 1,500 RPD (requests per day)
   - Jika habis, tunggu sampai reset (biasanya 24 jam)

2. **Gunakan Multiple API Keys:**
   - Buat beberapa API key
   - Sistem akan otomatis menggunakan fallback jika satu key habis

3. **Upgrade ke Paid Tier** (jika perlu lebih banyak quota)

### Masalah: API Key Expired

**Solusi:**
1. Buat API key baru di Google AI Studio
2. Update API key di `.env` atau `config.py`
3. Restart backend server

## 🛡️ Tips Agar API Key Tetap Tersedia

1. **Gunakan File .env** (Jangan hardcode di config.py)
   - Lebih aman dan mudah diupdate
   - Tidak perlu edit kode

2. **Monitor Quota Secara Berkala**
   - Cek di Google AI Studio setiap minggu
   - Pastikan quota masih tersedia

3. **Gunakan Multiple API Keys** (Opsional)
   - Buat 2-3 API key sebagai backup
   - Sistem akan otomatis rotasi jika satu key habis

4. **Jangan Share API Key**
   - Jangan commit `.env` ke Git
   - Jangan share API key di public

5. **Backup API Key**
   - Simpan API key di tempat aman
   - Catat tanggal pembuatan dan expiry (jika ada)

## ✅ Checklist Update API Key

- [ ] Dapatkan API key baru dari Google AI Studio
- [ ] Update di file `.env` (atau `config.py`)
- [ ] Restart backend server
- [ ] Test AI chat untuk memastikan berfungsi
- [ ] Cek log backend untuk memastikan tidak ada error

## 🔄 Sistem Fallback

**PENTING:** Sistem sudah dirancang dengan fallback mechanism. Jika API key error/habis:
- ✅ AI chat tetap berfungsi
- ✅ Menggunakan informasi dari database
- ✅ User tetap mendapat respons yang berguna
- ✅ Tidak ada error yang mengganggu

Jadi meskipun API key habis, aplikasi tetap berjalan normal!



