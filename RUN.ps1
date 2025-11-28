# TEMANIKAN - Simple Start Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEMANIKAN - START SERVER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $projectRoot

# Check Python
$pythonCmd = "python"
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    if (Get-Command py -ErrorAction SilentlyContinue) {
        $pythonCmd = "py"
    } else {
        Write-Host "❌ Python tidak ditemukan!" -ForegroundColor Red
        pause
        exit
    }
}

# Check Node
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js/npm tidak ditemukan!" -ForegroundColor Red
    pause
    exit
}

Write-Host "[1/2] Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\BackEnd'; Write-Host '🚀 BACKEND SERVER' -ForegroundColor Yellow; $pythonCmd app.py"

Start-Sleep -Seconds 3

Write-Host "[2/2] Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\FrontEnd'; Write-Host '⚛️  FRONTEND SERVER' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SERVER BERHASIL DIAKTIFKAN!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Membuka browser..." -ForegroundColor Yellow
Write-Host ""

Start-Process "http://localhost:3000"

Write-Host "✅ Selesai! Server berjalan di window terpisah." -ForegroundColor Green
Write-Host ""


