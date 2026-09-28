@echo off
chcp 65001 >nul
cd /d "%~dp0"
title KHOI DONG EDU-GUARD AI v1.0
echo ======================================================================
echo   DANG KHOI DONG HE THONG EDU-GUARD AI v1.0
echo   DU AN THAM GIA CUOC THI LVKT YOUNG INNOVATORS 2026
echo   (Phát hiện sớm nguy cơ sa sút học tập - XAI & Can thiệp cá nhân hóa)
echo ======================================================================
echo.
echo Dang khoi dong Giao dien Dashboard Learning Analytics...
python "%~dp0src\dashboard.py"
pause
