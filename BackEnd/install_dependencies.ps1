Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Gemini AI Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$success = $false

# Common Python locations
$pythonPaths = @(
    "python",
    "py",
    "python3",
    "$env:LOCALAPPDATA\Programs\Python\Python*\python.exe",
    "$env:PROGRAMFILES\Python*\python.exe",
    "C:\Python*\python.exe",
    "C:\laragon\bin\python\python-*\python.exe",
    "C:\Program Files\Python*\python.exe"
)

# Try different Python commands
$commands = @("python", "py", "python3")

foreach ($cmd in $commands) {
    Write-Host "Trying $cmd..." -ForegroundColor Yellow
    try {
        $result = & $cmd -m pip install google-generativeai==0.3.2 Pillow==10.2.0 2>&1
        if ($LASTEXITCODE -eq 0) {
            $success = $true
            break
        }
    } catch {
        Write-Host "$cmd not found, trying next..." -ForegroundColor Gray
    }
}

# Try to find Python in common locations
if (-not $success) {
    Write-Host "Searching for Python installation..." -ForegroundColor Yellow
    foreach ($pattern in $pythonPaths) {
        $found = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            Write-Host "Found Python at: $($found.FullName)" -ForegroundColor Green
            try {
                & $found.FullName -m pip install google-generativeai==0.3.2 Pillow==10.2.0
                if ($LASTEXITCODE -eq 0) {
                    $success = $true
                    break
                }
            } catch {
                Write-Host "Failed to install with this Python" -ForegroundColor Gray
            }
        }
    }
}

# Try pip directly
if (-not $success) {
    Write-Host "Trying pip directly..." -ForegroundColor Yellow
    try {
        pip install google-generativeai==0.3.2 Pillow==10.2.0
        if ($LASTEXITCODE -eq 0) {
            $success = $true
        }
    } catch {
        Write-Host "pip not found" -ForegroundColor Gray
    }
}

if ($success) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Dependencies installed." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR: Python/Pip not found!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Python first, or add Python to your PATH." -ForegroundColor Yellow
    Write-Host "Download Python from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
}

