# 🔧 Troubleshooting AI Chat - Masalah Jawaban Default

Jika AI Chat masih menampilkan jawaban default (fallback) dari database, ikuti langkah-langkah berikut:

## ✅ Langkah 1: Pastikan Backend Server Sudah Di-Restart

**PENTING:** Setelah update API keys, **WAJIB restart backend server** agar perubahan diterapkan.

```powershell
# Hentikan backend server (Ctrl+C)
# Lalu jalankan lagi:
cd BackEnd
python app.py
```

## ✅ Langkah 2: Cek Log Backend

Saat mengirim pesan ke AI Chat, cek log backend untuk melihat:

1. **Apakah API keys ter-load?**
   ```
   🔑 API Keys loaded: 5
      Primary key: AIzaSyBcjOrACTXOLt3TRbaTUudgCX...
   ```

2. **Apakah API keys berhasil digunakan?**
   ```
   ✅ API Key #1 berhasil digunakan
   ✅ AI Response berhasil (panjang: 500 karakter)
   ```

3. **Atau apakah semua keys gagal?**
   ```
   ❌ Semua API key gagal: ...
   📦 Menggunakan fallback response dari database...
   ```

## ✅ Langkah 3: Test API Keys Manual

Jalankan script test untuk memastikan API keys valid:

```powershell
cd BackEnd
python test_all_api_keys.py
```

Output yang diharapkan:
```
✅ Valid keys: 5
   Key #1: AIzaSyBcjOrACTXOLt3TRbaTUudgCX...
   Key #2: AIzaSyC1B8t7SxBe9msVmA4vYgYps6...
   ...
```

## ✅ Langkah 4: Cek File .env

Pastikan file `.env` di folder `BackEnd/` berisi:

```env
GEMINI_API_KEY=AIzaSyBcjOrACTXOLt3TRbaTUudgCX8Idk2SoNs,AIzaSyC1B8t7SxBe9msVmA4vYgYps6dHcHOHTHE,AIzaSyALWwQmvtb2mLFvME4jtaPPnk9ci4y4Uq0,AIzaSyC6JcCO8Ovc2vDdjkV8mGA7Cp83QeaAuog,AIzaSyCi_kmc6ESqxiqFqV0C1hJccV2AzKjxQeM
```

**Catatan:** Bisa menggunakan `GEMINI_API_KEY` (singular) atau `GEMINI_API_KEYS` (plural). Sistem akan membaca keduanya.

## ✅ Langkah 5: Update API Keys (Jika Perlu)

Jika API keys expired atau bermasalah, update dengan:

```powershell
cd BackEnd
python update_api_key.py "KEY1,KEY2,KEY3,KEY4,KEY5"
```

## 🔍 Masalah Umum

### Masalah 1: "API key not configured"
**Solusi:** Pastikan file `.env` ada dan berisi `GEMINI_API_KEY` atau `GEMINI_API_KEYS`.

### Masalah 2: "Semua API key gagal"
**Solusi:** 
- Test API keys dengan `python test_all_api_keys.py`
- Pastikan API keys valid dan tidak expired
- Cek quota API keys di Google AI Studio

### Masalah 3: "Response kosong"
**Solusi:**
- Cek log backend untuk error detail
- Pastikan model `gemini-2.0-flash` tersedia
- Coba restart backend server

## 📝 Log yang Benar

Saat AI Chat berfungsi dengan baik, log backend akan menampilkan:

```
🔑 API Keys loaded: 5
   Primary key: AIzaSyBcjOrACTXOLt3TRbaTUudgCX...
🔄 Mencoba 5 API key(s)...
📝 User message: Halo, apa itu ikan koi?...
✅ API Key #1 berhasil digunakan
✅ AI Response berhasil (panjang: 500 karakter)
📄 Preview: Ikan koi adalah jenis ikan hias yang populer...
```

Jika masih menggunakan fallback, log akan menampilkan:

```
⚠️ API key not configured - Using database fallback
```

atau

```
❌ Semua API key gagal: ...
📦 Menggunakan fallback response dari database...
```

## 🚀 Setelah Perbaikan

1. **Restart backend server**
2. **Test AI Chat di browser**
3. **Cek log backend** untuk memastikan API keys digunakan
4. **Jika masih bermasalah**, kirim log backend untuk debugging lebih lanjut



