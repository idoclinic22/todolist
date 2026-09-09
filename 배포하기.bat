@echo off
chcp 65001 >nul
title Vercel 배포
cd /d "%~dp0"
set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%PATH%"

echo.
echo  ===================================================
echo   Vercel 배포 - 이 창을 닫지 말고 순서대로 진행하세요
echo  ===================================================
echo.
echo  [1단계] 로그인
echo    - 화살표(down) 로 "Continue with GitHub" 선택 후 Enter
echo    - 브라우저가 열리면 Authorize / 로그인 클릭
echo    - 터미널에 "Congratulations" 가 나오면 성공
echo.
pause
call vercel login

echo.
echo  [2단계] 배포 시작 (질문이 나오면 전부 그냥 Enter)
echo.
pause
call vercel --prod --yes

echo.
echo  ===================================================
echo   위에 보이는  https://...vercel.app  이 배포 주소!
echo   그 주소를 복사해서 과제에 제출하세요.
echo  ===================================================
echo.
pause
