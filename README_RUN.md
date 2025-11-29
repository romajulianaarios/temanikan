# 🚀 Cara Menjalankan Website Temanikan

## Cara Paling Mudah:

### Windows:
1. **Double-click** file `RUN.bat` 
2. Tunggu beberapa detik
3. Browser akan terbuka otomatis di `http://localhost:3000`

### Atau menggunakan PowerShell:
1. Klik kanan pada `RUN.ps1`
2. Pilih "Run with PowerShell"
3. Browser akan terbuka otomatis

## 🛑 Menghentikan Server:

Double-click file `STOP.bat` untuk menghentikan semua server.

## 📋 Yang Akan Terjadi:

1. Backend server (Flask) akan berjalan di port **5000**
2. Frontend server (React) akan berjalan di port **3000**
3. Browser akan terbuka otomatis
4. 2 window PowerShell/CMD akan terbuka (untuk melihat log server)

## ⚠️ Troubleshooting:

- **Port sudah digunakan?** Jalankan `STOP.bat` dulu, lalu jalankan `RUN.bat` lagi
- **Python tidak ditemukan?** Install Python dari python.org
- **npm tidak ditemukan?** Install Node.js dari nodejs.org
- **Halaman kosong?** Tekan F12 di browser, cek tab Console untuk error

## 🔗 URL:

- **Website:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

**Catatan:** Script ini akan bekerja di server manapun selama Python dan Node.js sudah terinstall!





