@echo off
title VEE 24x7 Auto-Sync Daemon
cd /d "%~dp0"
echo ==================================================
echo   Vacancy Era Education (VEE) Auto-Sync Daemon
echo   Checking 13+ portals every 90 seconds non-stop
echo ==================================================
node scraper/auto_sync_daemon.js
pause
