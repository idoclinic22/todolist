@echo off
title Vercel Deploy
cd /d "%~dp0"

rem === hardcoded absolute paths (verified to exist) ===
set "NODE=C:\Program Files\nodejs\node.exe"
set "VC=C:\Users\nonst\AppData\Roaming\npm\node_modules\vercel\dist\vc.js"

echo.
echo  ============================================
echo    VERCEL DEPLOY
echo  ============================================
echo.

"%NODE%" -v
if errorlevel 1 (
  echo.
  echo  [ERROR] Node did not run. Restart the PC, then try again.
  echo.
  pause
  exit /b 1
)

echo.
echo  STEP 1 / LOGIN
echo    - pick "Continue with GitHub" then press Enter
echo    - approve in the browser, wait for "Congratulations"
echo.
pause
"%NODE%" "%VC%" login

echo.
echo  STEP 2 / DEPLOY   (press Enter for every question)
echo.
pause
"%NODE%" "%VC%" deploy --prod --yes

echo.
echo  ============================================
echo    DONE.  Copy the  https://....vercel.app  URL shown above.
echo  ============================================
echo.
pause
