@echo off
title VEE 24x7 Auto-Sync Daemon
cd /d "c:\Users\Hp\Downloads\VEE_App"
echo ==================================================
echo   Vacancy Era Education (VEE) Auto-Sync Daemon
echo   Checking 18+ portals non-stop & pushing live data
echo ==================================================
powershell.exe -ExecutionPolicy Bypass -File "c:\Users\Hp\Downloads\VEE_App\sync_and_push.ps1"
echo Sync finished! Press any key to close.
pause
