@echo off
echo ========================================
echo   TEMANIKAN - STOP SERVER
echo ========================================
echo.

echo Menghentikan semua server...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1

echo.
echo ✅ Semua server dihentikan!
echo.
pause


