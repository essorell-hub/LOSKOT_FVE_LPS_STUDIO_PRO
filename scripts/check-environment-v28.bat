@echo off
REM Skript pro kontrolu prostředí pro Windows Build Preview v28

echo ==============================================
echo Kontrola prostředí pro Windows Build Preview v28
echo ==============================================
echo.

REM Kontrola Node.js a npm
node -v > nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [CHYBA] Node.js neni nainstalovan nebo neni v PATH. \
    echo         Stahnete z https://nodejs.org/ a nainstalujte.
) ELSE (
    echo [OK] Node.js version:
    node -v
)

npm -v > nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [CHYBA] npm neni nainstalovan nebo neni v PATH. \
    echo         Obvykle se instaluje s Node.js. Zkuste znovu nainstalovat Node.js.
) ELSE (
    echo [OK] npm version:
    npm -v
)
echo.

REM Kontrola Rust
rustc -v > nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [CHYBA] Rust neni nainstalovan nebo neni v PATH. \
    echo         Stahnete z https://www.rust-lang.org/tools/install a nainstalujte.
) ELSE (
    echo [OK] Rust version:
    rustc -v
)
echo.

REM Kontrola Tauri
tauri -v > nul 2>&1
IF %ERRORLEVEL NEQ 0 (
    echo [CHYBA] Tauri CLI neni nainstalovan nebo neni v PATH. \
    echo         Po instalaci Rustu spustte v prikazovem radku: cargo install tauri
) ELSE (
    echo [OK] Tauri CLI version:
    tauri -v
)
echo.

echo ==============================================
echo Kontrola dokoncena.
echo Pro dalsi kroky se ridte navodem v docs/handoff/v28_WINDOWS_BUILD_PREVIEW_GUIDE.md
echo ==============================================
