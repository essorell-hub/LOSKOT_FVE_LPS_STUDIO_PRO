# Návod pro Windows Build Preview v28

Tento návod vás provede spuštěním preview sestavení aplikace LOSKOT FVE & LPS STUDIO PRO v28 na vašem Windows počítači. Zaměřuje se na spuštění HTML fallback verze a kontrolu prostředí pro budoucí React a Tauri sestavení.

## Předpoklady

Než začnete, ujistěte se, že máte nainstalované následující nástroje:
*   **Node.js a npm**: Stáhněte a nainstalujte z [oficiálních stránek Node.js](https://nodejs.org/). Během instalace se ujistěte, že je zaškrtnuta možnost "Add to PATH".
*   **Rust**: Stáhněte a nainstalujte z [oficiálních stránek Rust](https://www.rust-lang.org/tools/install). Během instalace zvolte "Proceed with installation (default)".
*   **Tauri CLI**: Po instalaci Rustu otevřete příkazový řádek a spusťte:
    ```bash
    cargo install tauri
    ```

## Kroky spuštění

### 1. Kontrola prostředí

Nejprve zkontrolujte, zda máte správně nainstalované potřebné nástroje. Otevřete příkazový řádek (cmd.exe) ve složce vašeho projektu a spusťte:

```bash
scripts\check-environment-v28.bat
```

Skript vás informuje o stavu instalace Node.js, npm, Rust a Tauri. V případě problémů postupujte podle pokynů skriptu a znovu si zkontrolujte instalaci.

### 2. Spuštění HTML Fallback Preview

Tato verze je nejjednodušší na spuštění a funguje jako základní náhled.

Spusťte následující skript z příkazového řádku:

```bash
scripts\open-v28-html-preview.bat
```

Tento skript automaticky otevře HTML soubor s preview v internetovém prohlížeči.

### 3. Spuštění React Preview (pokud je k dispozici)

Tato sekce je připravena pro budoucí spuštění React preview. V současné verzi skript pouze informuje o stavu.

Spusťte následující skript z příkazového řádku:

```bash
scripts\run-react-preview-v28.bat
```

*Poznámka: V současné době tento skript nic nespustí, slouží jako placeholder.*

### 4. Spuštění Tauri Preview (pokud je k dispozici)

Tato sekce je připravena pro budoucí spuštění Tauri preview. V současné verzi skript pouze informuje o stavu.

Spusťte následující skript z příkazového řádku:

```bash
scripts\run-tauri-preview-v28.bat
```

*Poznámka: V současné době tento skript nic nespustí, slouží jako placeholder.*

## Řešení problémů

*   **Příkaz není rozpoznán:** Ujistěte se, že jste Node.js, npm a Rust správně přidali do systémové proměnné PATH.
*   **Chyby při instalaci Rustu/Tauri:** Postupujte podle oficiálních instalačních pokynů nebo vyhledejte konkrétní chybové hlášky online.
*   **HTML preview se neotevře:** Zkuste HTML soubor otevřít ručně dvojklikem nebo zkopírujte cestu k němu a otevřete ji v prohlížeči.

---
Tento návod je určen pro verzi v28 a zaměřuje se na snadné spuštění pro netechnické uživatele.
