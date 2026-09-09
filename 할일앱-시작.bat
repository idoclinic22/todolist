@echo off
chcp 65001 >nul
title AK 할일앱 서버 (이 창을 닫으면 앱이 꺼집니다)
cd /d "%~dp0"
set "PATH=%ProgramFiles%\nodejs;%PATH%"

echo.
echo  ===============================================
echo   AK 강의 할 일 - 서버를 시작합니다
echo  ===============================================
echo.
echo   잠시 후 브라우저가 자동으로 열립니다.
echo   (안 열리면 직접 http://localhost:3000 접속)
echo.
echo   * 앱을 다 쓰면 이 검은 창을 닫으세요.
echo.

start "" /min cmd /c "timeout /t 12 >nul & start http://localhost:3000"

call npm run dev

echo.
echo  서버가 종료되었습니다. 아무 키나 누르면 창이 닫힙니다.
pause >nul
