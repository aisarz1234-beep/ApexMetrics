@echo off
title ApexMetrics Test Suite
set "PATH=C:\Users\user\.nodejs\node-v20.18.0-win-x64;%PATH%"
cd /d "%~dp0"

echo ===================================================
echo   🧪 Running ApexMetrics Test Suite
echo ===================================================
echo.
npm test
pause
