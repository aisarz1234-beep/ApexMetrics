@echo off
title ApexMetrics Server
set "PATH=C:\Users\user\.nodejs\node-v20.18.0-win-x64;%PATH%"
cd /d "%~dp0"

echo ===================================================
echo   ⚡ Starting ApexMetrics Unified Platform
echo ===================================================
echo.
echo Application will be available at: http://localhost:5000
echo.
node server/src/server.js
pause
