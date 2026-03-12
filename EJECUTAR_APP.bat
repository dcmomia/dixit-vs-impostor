@echo off
setlocal
title Dixit vs Impostor - Ejecutando Servidor

:: Navegar al directorio de la aplicación
cd /d "%~dp0"

:: Obtener la IP local automática (Ethernet/WiFi)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr "192.168.1."') do set IP=%%a
set IP=%IP: =%

echo --------------------------------------------------
echo      DIXIT VS IMPOSTOR - LANZADOR MAGICO
echo --------------------------------------------------
echo.
echo [INFO] Servidor disponible en tu red local:
echo.
echo     PC:    http://localhost:3000
echo     MOVIL: http://%IP%:3000
echo.
echo --------------------------------------------------
echo.

:: Abrir el navegador automáticamente en el PC
echo [1/2] Abriendo el portal onírico (navegador)...
start http://localhost:3000

:: Iniciar el servidor de Node.js
echo [2/2] Invocando al Game Master (servidor)...
node start-server.js

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] No se pudo encontrar Node.js. Asegurate de que este instalado.
    pause
)

endlocal
