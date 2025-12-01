# 🔑 Sistem Multiple API Keys - High Availability

Sistem ini mendukung **multiple API keys** untuk memastikan AI Chat selalu tersedia, meskipun salah satu API key error atau quota habis.

## ✨ Fitur

- ✅ **Auto-retry dengan backup keys** - Jika primary key gagal, otomatis mencoba backup keys
- ✅ **High Availability** - AI Chat tetap berfungsi meskipun beberapa keys error
- ✅ **Quota Management** - Otomatis switch ke key lain jika quota habis
- ✅ **Fallback ke Database** - Jika semua keys gagal, tetap menggunakan database fallback

## 📝 Cara Setup Multiple API Keys

### 1. Dapatkan Multiple API Keys

Buat beberapa API keys di:
- https://makersuite.google.com/app/apikey
- atau https://aistudio.google.com/app/apikey

**Tips:** Buat 2-3 API keys sebagai backup untuk memastikan selalu tersedia.

### 2. Setup di File .env

Tambahkan semua API keys di file `.env` (pisahkan dengan koma):

```env
GEMINI_API_KEY=API_KEY_1,API_KEY_2,API_KEY_3
```

**Contoh:**
```env
GEMINI_API_KEY=AIzaSyA_nyNIO60t4OUKkJLKgPnXw4EwoUcOfB8,AIzaSyB_backup_key_here,AIzaSyC_another_backup
```

### 3. Atau Update di config.py

Jika tidak menggunakan `.env`, update langsung di `config.py`:

```python
_GEMINI_API_KEYS_STR = os.getenv('GEMINI_API_KEY', 'API_KEY_1,API_KEY_2,API_KEY_3')
```

## 🔄 Cara Kerja

1. **Primary Key** - Sistem mencoba API key pertama terlebih dahulu
2. **Auto-retry** - Jika primary key gagal (403, 429, dll), otomatis mencoba key berikutnya
3. **Backup Keys** - Mencoba semua backup keys secara berurutan
4. **Database Fallback** - Jika semua keys gagal, menggunakan response dari database

## 📊 Status Logging

Sistem akan menampilkan log di console:
- ✅ `API Key #1 berhasil digunakan` - Key pertama berhasil
- ❌ `API Key #1 gagal (403): ...` - Key pertama gagal, mencoba berikutnya
- ⚠️ `API Key #2 quota habis (429)` - Key kedua quota habis, mencoba berikutnya
- 📦 `Menggunakan fallback response dari database` - Semua keys gagal

## 🎯 Keuntungan

1. **Tidak Ada Downtime** - Jika satu key error, otomatis switch ke backup
2. **Quota Management** - Bisa menggunakan multiple keys untuk meningkatkan quota
3. **Reliability** - Sistem lebih reliable dengan multiple backup
4. **Easy Management** - Cukup update di satu tempat (.env atau config.py)

## ⚙️ Update API Keys

### Cara 1: Update .env file
```bash
# Edit file BackEnd/.env
GEMINI_API_KEY=NEW_KEY_1,NEW_KEY_2,NEW_KEY_3
```

### Cara 2: Update config.py
```python
_GEMINI_API_KEYS_STR = os.getenv('GEMINI_API_KEY', 'NEW_KEY_1,NEW_KEY_2,NEW_KEY_3')
```

### Cara 3: Menggunakan script update
```bash
python update_api_key.py "NEW_KEY_1,NEW_KEY_2,NEW_KEY_3"
```

## 🔍 Test Multiple Keys

Test apakah semua keys berfungsi:

```bash
python test_api_key.py
```

Script akan mencoba semua keys dan menampilkan status masing-masing.

## 📝 Catatan Penting

- **Format:** Pisahkan keys dengan koma (`,`) tanpa spasi
- **Urutan:** Key pertama adalah primary, sisanya adalah backup
- **Minimum:** Minimal 1 key (bisa single key seperti sebelumnya)
- **Maksimum:** Tidak ada batas, tapi disarankan 2-5 keys
- **Security:** Jangan commit API keys ke public repository

## ✅ Contoh Konfigurasi

### Single Key (Backward Compatible)
```env
GEMINI_API_KEY=AIzaSyA_nyNIO60t4OUKkJLKgPnXw4EwoUcOfB8
```

### Multiple Keys (Recommended)
```env
GEMINI_API_KEY=AIzaSyA_primary_key,AIzaSyB_backup1,AIzaSyC_backup2
```

## 🚀 Setelah Setup

1. Restart backend server
2. Test AI Chat di aplikasi
3. Monitor logs untuk melihat key mana yang digunakan

---

**Sistem ini memastikan AI Chat selalu tersedia untuk pengguna!** 🎉



