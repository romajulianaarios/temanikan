@echo off
echo ========================================
echo   TEMANIKAN - START SERVER
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd BackEnd && python app.py"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "cd FrontEnd && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   SERVER BERHASIL DIAKTIFKAN!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Browser akan terbuka otomatis...
echo.

timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo Tekan tombol apapun untuk menutup window ini...
pause >nul





