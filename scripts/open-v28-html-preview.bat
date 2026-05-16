@echo off
REM Skript pro otevreni HTML Fallback Preview pro v28

echo Spoustim HTML Fallback Preview pro v28...

REM Zde upravte cestu k vasemu hlavnimu HTML souboru, pokud se liší.
REM Predpokladame, ze HTML soubor je ve slozce 'preview' nebo 'public'.
REM Pokud vase struktura je jina, upravte cestu nize.

SET HTML_FILE=preview\index.html

REM Zkontrolujeme, zda soubor existuje
IF NOT EXIST "%HTML_FILE%" (
    echo [CHYBA] Soubor HTML preview nebyl nalezen: %HTML_FILE%
    echo           Zkontrolujte, zda je soubor na spravnem miste nebo upravte cestu v tomto skriptu.
    goto :eof
)

echo Oteviram %HTML_FILE% v internetovem prohlizeci...
start "" "%HTML_FILE%"

echo.
echo HTML Preview byl otevren. Pokud se neotevrel automaticky, zkuste jej otevrit rucne.
echo ==============================================
