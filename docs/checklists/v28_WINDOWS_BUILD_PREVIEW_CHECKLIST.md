# Checklist pro Windows Build Preview v28

Tento checklist vám pomůže ověřit, že všechny kroky pro spuštění preview sestavení aplikace LOSKOT FVE & LPS STUDIO PRO v28 na Windows jsou dokončeny.

## Předpoklady

- [ ] **Node.js a npm nainstalovány a přidány do PATH.**
    - Ověřeno spuštěním `node -v` a `npm -v` v příkazovém řádku.
- [ ] **Rust nainstalován a přidán do PATH.**
    - Ověřeno spuštěním `rustc -v` v příkazovém řádku.
- [ ] **Tauri CLI nainstalováno.**
    - Ověřeno spuštěním `tauri --version` v příkazovém řádku.

## Kroky spuštění preview

### 1. Kontrola prostředí

- [ ] **Spuštěn skript `scripts\check-environment-v28.bat`.**
- [ ] **Výstup skriptu potvrzuje správnou instalaci všech nástrojů (Node.js, npm, Rust, Tauri).**
    - V případě chyb byly problémy vyřešeny a kontrola prostředí byla úspěšně zopakována.

### 2. Spuštění HTML Fallback Preview

- [ ] **Spuštěn skript `scripts\open-v28-html-preview.bat`.**
- [ ] **HTML preview se úspěšně otevřel v internetovém prohlížeči.**
    - Obsah preview odpovídá očekávanému stavu.

### 3. Spuštění React Preview (pokud je připraveno)

- [ ] **Spuštěn skript `scripts\run-react-preview-v28.bat`.**
- [ ] **React preview se úspěšně spustil a otevřel v prohlížeči.** (Tento krok je relevantní pouze pokud je React sestavení již k dispozici.)

### 4. Spuštění Tauri Preview (pokud je připraveno)

- [ ] **Spuštěn skript `scripts\run-tauri-preview-v28.bat`.**
- [ ] **Tauri preview se úspěšně spustil a otevřel.** (Tento krok je relevantní pouze pokud je Tauri sestavení již k dispozici.)

## Závěrečné ověření

- [ ] **Všechny relevantní kroky byly úspěšně dokončeny.**
- [ ] **Aplikace funguje bez zjevných vizuálních nebo funkčních chyb v rámci preview.**

---
Tento checklist slouží k zajištění hladkého průběhu testování preview sestavení v28.
