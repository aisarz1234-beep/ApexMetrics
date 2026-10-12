@echo off
title ApexMetrics Dev Server
set "PATH=C:\Users\user\.nodejs\node-v20.18.0-win-x64;%PATH%"
cd /d "%~dp0"

echo ===================================================
echo   ⚡ Starting ApexMetrics Dev Server (Client + Server)
echo ===================================================
echo.
npm run dev
pause
