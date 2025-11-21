@echo off
echo Starting Temanikan Backend and Frontend...
echo.

echo Starting Backend (Flask)...
start cmd /k "cd BackEnd && python app.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend (React + Vite)...
start cmd /k "cd FrontEnd && npm run dev"

echo.
echo Both servers are starting...
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Default Accounts:
echo   Admin:  admin@temanikan.com / admin123
echo   Member: member@temanikan.com / 12345678
echo.
pause
