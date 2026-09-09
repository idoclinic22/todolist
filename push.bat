@echo off
title Git Push to GitHub
cd /d "%~dp0"

set "GIT=C:\Program Files\Git\cmd\git.exe"

echo.
echo  ============================================
echo    PUSH TO GITHUB
echo  ============================================
echo.
echo  A browser window may open to sign in to GitHub.
echo  Click "Authorize" / sign in, then come back here.
echo.
pause

"%GIT%" push -u origin main

echo.
echo  ============================================
echo    If you see "branch 'main' set up to track" above = SUCCESS
echo  ============================================
echo.
pause
