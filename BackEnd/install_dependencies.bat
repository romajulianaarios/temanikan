@echo off
echo ========================================
echo Installing Gemini AI Dependencies
echo ========================================
echo.

REM Try different Python commands
echo Trying python...
python -m pip install google-generativeai==0.3.2 Pillow==10.2.0
if %errorlevel% == 0 goto success

echo Trying py...
py -m pip install google-generativeai==0.3.2 Pillow==10.2.0
if %errorlevel% == 0 goto success

echo Trying python3...
python3 -m pip install google-generativeai==0.3.2 Pillow==10.2.0
if %errorlevel% == 0 goto success

echo Trying pip directly...
pip install google-generativeai==0.3.2 Pillow==10.2.0
if %errorlevel% == 0 goto success

echo.
echo ========================================
echo ERROR: Python/Pip not found!
echo ========================================
echo.
echo Please install Python first, or add Python to your PATH.
echo Download Python from: https://www.python.org/downloads/
echo.
pause
exit /b 1

:success
echo.
echo ========================================
echo SUCCESS! Dependencies installed.
echo ========================================
echo.
pause






