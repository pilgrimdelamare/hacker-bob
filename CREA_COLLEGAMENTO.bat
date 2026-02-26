@echo off
title Installazione Hacker Bob
color 0A

echo Creazione del collegamento sul Desktop in corso...

:: Ottiene il percorso esatto della cartella in cui si trova questo file .bat
set "PROJECT_DIR=%~dp0"

:: Definisce i percorsi dei file e del Desktop
set "TARGET_FILE=%PROJECT_DIR%index.html"
set "ICON_FILE=%PROJECT_DIR%icona.ico"
set "SHORTCUT_PATH=%USERPROFILE%\Desktop\Hacker Bob.lnk"

:: Crea un file VBScript temporaneo per generare il collegamento
set "VBS_SCRIPT=%temp%\CreaCollegamentoBob.vbs"

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%VBS_SCRIPT%"
echo sLinkFile = "%SHORTCUT_PATH%" >> "%VBS_SCRIPT%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%VBS_SCRIPT%"
echo oLink.TargetPath = "%TARGET_FILE%" >> "%VBS_SCRIPT%"
echo oLink.IconLocation = "%ICON_FILE%" >> "%VBS_SCRIPT%"
echo oLink.WorkingDirectory = "%PROJECT_DIR%" >> "%VBS_SCRIPT%"
echo oLink.Save >> "%VBS_SCRIPT%"

:: Esegue lo script VBScript in modo silenzioso
cscript /nologo "%VBS_SCRIPT%"

:: Elimina lo script temporaneo per fare pulizia
del "%VBS_SCRIPT%"

echo.
echo ===================================================
echo [OK] Collegamento "Hacker Bob" creato sul Desktop!
echo ===================================================
echo.
pause