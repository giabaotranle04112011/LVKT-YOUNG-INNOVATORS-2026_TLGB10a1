@echo off
chcp 65001 >nul
cd /d "%~dp0"
title KHOI DONG BAN WEB NANG CAO EDU-GUARD AI
echo ======================================================================
echo   DANG KHOI DONG BAN WEB NANG CAO - EDU-GUARD AI v1.0
echo   TAC GIA THIET KE: TRAN LE GIA BAO - LOP 10A1
echo   TRUONG THCS & THPT LIEN VIET KONTUM
echo ======================================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [+] Da tim thay Python tren he thong.
    echo [+] Dang khoi chay Local Web Server tai http://localhost:5500 ...
    python server.py
) else (
    echo [!] Khong tim thay Python tren PATH.
    echo [+] Dang mo truc tiep file web\login.html bang trinh duyet...
    start "" "%~dp0web\login.html"
)
