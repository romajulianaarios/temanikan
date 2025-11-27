# Cara Manual Install Dependencies Gemini AI

Jika script otomatis tidak berhasil, ikuti langkah berikut:

## 1. Cari Lokasi Python Anda

Buka PowerShell dan jalankan:

```powershell
# Cek apakah Python ada di PATH
where.exe python
where.exe py

# Atau cek di lokasi umum
Get-ChildItem "C:\Python*" -ErrorAction SilentlyContinue
Get-ChildItem "$env:LOCALAPPDATA\Programs\Python" -ErrorAction SilentlyContinue
Get-ChildItem "$env:PROGRAMFILES\Python*" -ErrorAction SilentlyContinue
```

## 2. Install Dependencies

Setelah menemukan Python, gunakan path lengkap:

```powershell
# Contoh jika Python ada di C:\Python39
C:\Python39\python.exe -m pip install google-generativeai==0.3.2 Pillow==10.2.0

# Atau jika menggunakan py launcher
py -m pip install google-generativeai==0.3.2 Pillow==10.2.0
```

## 3. Jika Python Belum Terinstall

Download dan install Python dari:
- https://www.python.org/downloads/
- **PENTING**: Centang "Add Python to PATH" saat install!

Setelah install, restart PowerShell dan jalankan:
```powershell
pip install google-generativeai==0.3.2 Pillow==10.2.0
```

## 4. Verifikasi Install

Cek apakah sudah terinstall:
```powershell
pip list | Select-String -Pattern "google-generativeai|Pillow"
```

## Alternatif: Install via IDE

Jika Anda menggunakan IDE seperti PyCharm, VS Code, atau lainnya:
1. Buka terminal di IDE
2. Pastikan virtual environment aktif (jika ada)
3. Jalankan: `pip install google-generativeai==0.3.2 Pillow==10.2.0`



