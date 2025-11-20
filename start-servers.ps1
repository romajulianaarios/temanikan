# Start Backend and Frontend servers

Write-Host "🚀 Starting Temanikan Backend & Frontend..." -ForegroundColor Cyan
Write-Host ""

# Start Backend in background
Write-Host "📦 Starting Backend (Flask)..." -ForegroundColor Yellow
$backendPath = "c:\WEBSITE TEMANIKAN\BackEnd"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python app.py"

Start-Sleep -Seconds 3

# Start Frontend in background
Write-Host "⚛️  Starting Frontend (React + Vite)..." -ForegroundColor Green
$frontendPath = "c:\WEBSITE TEMANIKAN\FrontEnd"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ Both servers are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Accounts:" -ForegroundColor Yellow
Write-Host "  Admin:  admin@temanikan.com / admin123" -ForegroundColor White
Write-Host "  Member: member@temanikan.com / 12345678" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
